/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Karma: {
    Base: '/karma',
    Hello: '/hello',
    Roles: '/roles',
    Users: '/users',
    Register: '/register',
    Login: '/login',
    Logout: '/logout',
    Tasks: '/tasks',
    UploadFile: '/uploadfile',
    CreepInTask: '/creepintask',
    User: '/user',
  },
} as const;
