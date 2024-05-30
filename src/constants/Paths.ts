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
  },
  Task: {
    Base: '/tasks',
    Create: '/create',
    GetAll: '/get_all',
    Hello: '/hello',
  },
} as const;
