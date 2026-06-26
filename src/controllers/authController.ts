import { User } from "@src/db/models/User";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { IReq } from "@src/routes/types/types";
import { SignUpRequest } from "@src/middleware/verifySignUp";
import { IRes } from "@src/routes/types/express/misc";
import { LogInRequest } from "@src/middleware/verifyLogIn";
import { generateTokenFromUserId } from "@src/util/generateToken";
import { LogOutRequest } from "@src/middleware/verifyLogOut";
import { generateLogoutTokenFromToken } from "@src/util/generateToken";
import { ForgotPasswordRequest } from "@src/middleware/verifyForgotPassword";
import { ResetPasswordRequest } from "@src/middleware/verifyResetPassword";
import { PasswordReset } from "@src/db/models/PasswordReset";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { sendResetCode } from "@src/util/sendCodeEmail";

export const createUser = (request: IReq<SignUpRequest>, response: IRes) => {
  const generatedPassword = bcrypt.hashSync(request.body.password, 8);

  return User.create({
    fullName: request.body.fullName,
    email: request.body.email,
    gender: request.body.gender,
    username: request.body.username,
    password: generatedPassword,
    rankId: 1,
  })
    .then((user) => {
      user.setRoles([1]).then(() => {
        response.send({
          message: "User was registered and logged in successfully!",
          accessToken: generateTokenFromUserId(user.id),
        });
      });
    })
    .catch((err: Error) => {
      response.status(500).json({ message: err.message });
    });
};

export const logInUser = (request: IReq<LogInRequest>, response: IRes) => {
  User.findOne({
    where: {
      [Op.or]: [
        { username: request.body.usernameOrEmail },
        { email: request.body.usernameOrEmail },
      ],
    },
  })
    .then((user) => {
      if (!user) {
        return response.status(404).send({ message: "User Not found." });
      }

      if (user.password == null) return;

      const passwordIsValid = bcrypt.compareSync(
        request.body.password,
        user.password,
      );

      if (!passwordIsValid) {
        return response.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      user.getRoles().then((roles) => {
        const authorities = roles.map((r) => `ROLE_${r.name.toUpperCase()}`);

        response.status(200).send({
          message: "User was logged in successfully!",
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: generateTokenFromUserId(user.id),
        });
      });
    })
    .catch((err) => {
      response.status(500).send({ message: err.message });
    });
};

export const logOutUser = (request: IReq<LogOutRequest>, response: IRes) => {
  response.status(200).send({
    message: "User was logged out successfully!",
    accessToken: generateLogoutTokenFromToken(request.body.accessToken),
  });
};

export const forgotPassword = async (
  request: IReq<ForgotPasswordRequest>,
  response: IRes,
) => {
  try {
    const { usernameOrEmail } = request.body;

    // 1. Шукаємо користувача
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      }, /// Or.or круто!
    });

    if (!user) {
      return response
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ message: "User Not found." });
    }

    // 2. Генеруємо код (наприклад, 6 знаків)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 хвилин

    // Хешуємо код перед збереженням, оскільки у вашій структурі вказано codeHash
    const salt = bcrypt.genSaltSync(8);
    const codeHash = bcrypt.hashSync(code, salt);

    // 3. Створюємо запис у новій таблиці коду відновлення
    await PasswordReset.create({
      userId: user.id,
      codeHash: codeHash,
      expiresAt: expiresAt,
    });

    // Вивід у консоль для тестування на Railway
    /// Зоглушка
    console.log(
      `qqqq authController На пошту ${user.email} відправлено код: ${code}`,
    );

    await sendResetCode(user.email, code);

    return response
      .status(HttpStatusCodes.OK)
      .json({ info: "Reset code sent successfully." });
  } catch (error: any) {
    return response
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/// TODO Review and Refactor
export const resetPassword = async (
  request: IReq<ResetPasswordRequest>,
  response: IRes,
) => {
  try {
    const { usernameOrEmail, code, newPassword } = request.body;

    // Шукаємо користувача
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return response
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ message: "User Not found." });
    }

    // Шукаємо ВСІ активні (невикористані та нетерміновані) коди для цього юзера
    const activeResets = await PasswordReset.findAll({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { [Op.gt]: new Date() }, // expiresAt > теперішній час
      },
    });

    // Шукаємо серед них той, який збігається по bcrypt-хешу
    let validResetRecord = null;

    for (const record of activeResets) {
      // Порівнюємо чистий код від юзера з хешем із бази даних
      const isMatch = bcrypt.compareSync(code, record.codeHash);
      if (isMatch) {
        validResetRecord = record;
        break; // Код знайшли, зупиняємо цикл
      }
    }

    // Якщо нічого не знайшли — код або невірний, або застарів, або вже використаний
    if (!validResetRecord) {
      return response
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ info: "Invalid or expired verification code." });
    }

    // КОД ВІРНИЙ! Маркуємо його як використаний, щоб ніхто не заюзав його вдруге
    validResetRecord.usedAt = new Date();
    await validResetRecord.save();

    // Далі ваш код оновлення пароля у моделі User...

    // Хешуємо новий пароль у вашому стилі (солт 8)
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Оновлюємо пароль користувача і "гасимо" код відновлення
    await user.update({ password: hashedPassword });
    await validResetRecord.update({ usedAt: new Date() });

    return response
      .status(HttpStatusCodes.OK)
      .json({ message: "Password reset successfully!" });
  } catch (err: any) {
    return response
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
