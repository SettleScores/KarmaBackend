import { User } from './models/User';
import { Role } from './models/Role';

/// Many-to-Many i.e. User can have many Roles and Role can be associated with many Users
User.belongsToMany(Role, { through: 'user_role' });
Role.belongsToMany(User, { through: 'user_role' });