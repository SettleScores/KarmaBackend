"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./db/models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const TaskStatus_1 = require("@src/db/models/TaskStatus");
function populateInitialMaintenanceData() {
    User_1.User.create({
        fullName: "Michael Kapustey",
        email: "michaelkapustey@gmail.com",
        gender: "male",
        username: "Naoru",
        password: "111",
        rankId: 1,
    }).then((user) => user.setRoles([3]));
    User_1.User.create({
        fullName: "Vlad Hanych",
        email: "vvh.uzh@gmail.com",
        gender: "male",
        username: "SettleScores",
        password: "222",
        rankId: 1,
    }).then((user) => user.setRoles([3]));
    User_1.User.create({
        fullName: "Daria Titova",
        email: "daria@gmail.com",
        gender: "female",
        username: "Damato",
        password: "333",
        rankId: 1,
    }).then((user) => user.setRoles([3]));
    User_1.User.create({
        fullName: "Moderator Moderatorovych",
        email: "moderator@gmail.com",
        gender: "male",
        username: "Moder",
        password: "444",
        rankId: 1,
    }).then((user) => user.setRoles([2]));
    User_1.User.create({
        fullName: "User Testovych",
        email: "user@gmail.com",
        gender: "male",
        username: "User",
        password: "555",
        rankId: 1,
    }).then((user) => user.setRoles([1]));
    User_1.User.create({
        fullName: "Admin Adminovych",
        email: "admin@gmail.com",
        gender: "male",
        username: "Admin",
        password: bcrypt_1.default.hashSync("1111", 8),
        rankId: 1,
    }).then((user) => user.setRoles([3]));
    populateDummyArseholes();
}
function populateDummyArseholes() {
    User_1.User.create({
        fullName: "User Additionalych1",
        email: "useradd1@gmail.com",
        gender: "male",
        username: "Useradd1",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole1",
            taskId: 3,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "texting-2.jpg",
            taskId: 7,
            status: "Pending",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych2",
        email: "useradd2@gmail.com",
        gender: "male",
        username: "Useradd2",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole2",
            taskId: 2,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "texting-3.jpg",
            taskId: 5,
            status: "Pending",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole2__",
            taskId: 9,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych3",
        email: "useradd3@gmail.com",
        gender: "male",
        username: "Useradd3",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "playing-partying.mp4",
            taskId: 6,
            status: "Pending",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole3",
            taskId: 10,
            status: "Done",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole3_",
            taskId: 11,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole3__",
            taskId: 12,
            status: "Unknown",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych4",
        email: "useradd4@gmail.com",
        gender: "male",
        username: "Useradd4",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole4",
            taskId: 5,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole4_",
            taskId: 6,
            status: "Working",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych5",
        email: "useradd5@gmail.com",
        gender: "male",
        username: "Useradd5",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole5",
            taskId: 7,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole5_",
            taskId: 8,
            status: "Working",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych6",
        email: "useradd6@gmail.com",
        gender: "male",
        username: "Useradd6",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole6",
            taskId: 7,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole6_",
            taskId: 8,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole6__",
            taskId: 10,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych7",
        email: "useradd7@gmail.com",
        gender: "male",
        username: "Useradd7",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole7",
            taskId: 6,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole7__",
            taskId: 5,
            status: "Working",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych8",
        email: "useradd8@gmail.com",
        gender: "male",
        username: "Useradd8",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole8__",
            taskId: 2,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole8__",
            taskId: 1,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych9",
        email: "useradd9@gmail.com",
        gender: "male",
        username: "Useradd9",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole9__",
            taskId: 2,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole9__",
            taskId: 1,
            status: "Done",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole9__",
            taskId: 2,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole9__",
            taskId: 1,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych10",
        email: "useradd10@gmail.com",
        gender: "male",
        username: "Useradd10",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole10",
            taskId: 11,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole10_",
            taskId: 12,
            status: "Done",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole10___",
            taskId: 1,
            status: "Unknown",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych11",
        email: "useradd11@gmail.com",
        gender: "male",
        username: "Useradd11",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole11",
            taskId: 2,
            status: "Done",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole11_",
            taskId: 5,
            status: "Working",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych12",
        email: "useradd12@gmail.com",
        gender: "male",
        username: "Useradd12",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole12",
            taskId: 4,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole12_",
            taskId: 8,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych13",
        email: "useradd13@gmail.com",
        gender: "male",
        username: "Useradd13",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole13",
            taskId: 4,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole13_",
            taskId: 8,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole13_",
            taskId: 10,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych14",
        email: "useradd14@gmail.com",
        gender: "male",
        username: "Useradd14",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole14_",
            taskId: 8,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole14_",
            taskId: 10,
            status: "Working",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych15",
        email: "useradd15@gmail.com",
        gender: "male",
        username: "Useradd15",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole15",
            taskId: 11,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole15_",
            taskId: 12,
            status: "Unknown",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych16",
        email: "useradd16@gmail.com",
        gender: "male",
        username: "Useradd16",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole16",
            taskId: 11,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole16_",
            taskId: 12,
            status: "Unknown",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole16__",
            taskId: 10,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole16___",
            taskId: 9,
            status: "Unknown",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych17",
        email: "useradd17@gmail.com",
        gender: "male",
        username: "Useradd17",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole17",
            taskId: 6,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole17_",
            taskId: 5,
            status: "Working",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych18",
        email: "useradd18@gmail.com",
        gender: "male",
        username: "Useradd18",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole18",
            taskId: 4,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole18_",
            taskId: 9,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole18_",
            taskId: 8,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych19",
        email: "useradd19@gmail.com",
        gender: "male",
        username: "Useradd19",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole19",
            taskId: 8,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole19_",
            taskId: 9,
            status: "Done",
        });
    });
    User_1.User.create({
        fullName: "User Additionalych20",
        email: "useradd20@gmail.com",
        gender: "male",
        username: "Useradd20",
        password: "555",
        rankId: 1,
    }).then((user) => {
        user.setRoles([1]);
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole20",
            taskId: 2,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole20_",
            taskId: 5,
            status: "Working",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "texting-1.png",
            taskId: 9,
            status: "Pending",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole20___",
            taskId: 11,
            status: "Done",
        });
        TaskStatus_1.TaskStatus.create({
            userId: user.id,
            fileName: "arsehole20____",
            taskId: 12,
            status: "Unknown",
        });
    });
}
exports.default = populateInitialMaintenanceData;
