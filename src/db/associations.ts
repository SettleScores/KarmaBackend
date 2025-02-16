import { User } from './models/User';
import { Role } from './models/Role';
import { TaskStatus } from './models/TaskStatus';

/// Many-to-Many i.e. User can have many Roles and Role can be associated with many Users
User.belongsToMany(Role, { through: 'user_role', foreignKey: 'userId' });
Role.belongsToMany(User, { through: 'user_role', foreignKey: 'roleId' });

User.hasMany(TaskStatus, { foreignKey: 'userId', as: 'tasks' });
TaskStatus.belongsTo(User, { foreignKey: 'userId', as: 'user' });