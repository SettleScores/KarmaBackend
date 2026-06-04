/**
 * Express router paths go here.
 */

export default {
  Base: "/api",
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
  Karma: {
    Base: "/karma",
    Hello: "/hello",
    Roles: "/roles",
    Users: "/users",
    Register: "/register",
    Login: "/login",
    Logout: "/logout",
    Tasks: "/tasks",
    AllTasks: "/alltasks",
    UploadFile: "/uploadfile",
    CreepInTask: "/creepintask",
    ValidateTaskStatus: "/taskstatus/:id/validate",
    User: "/user",
    Push: "/pushpush",
    PushToken: "/pushtoken",
    PushForAll: "/pushpushall",
    File: "/files/:filename",
    Video: "/video/:filename",
    Stream: "/stream/:id",
  },
} as const;
