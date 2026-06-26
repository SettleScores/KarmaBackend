"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Paths_1 = __importDefault(require("@src/constants/Paths"));
const route = (...segments) => segments.join('').replace(/:([A-Za-z0-9_]+)/g, '{$1}');
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema) => ({ 'application/json': { schema } });
const bearer = [{ bearerAuth: [] }];
const unauthorized = { description: 'Missing or invalid bearer token' };
const B = Paths_1.default.Base;
const U = Paths_1.default.Users;
const K = Paths_1.default.Karma;
const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Karma App API',
        version: '1.0.0',
        description: 'REST API for the Karma app: authentication, tasks, file uploads, video ' +
            'streaming and push notifications.\n\n' +
            'Protected endpoints expect a Bearer JWT in the `Authorization` header. ' +
            'Obtain one from `POST /api/karma/login`, then click **Authorize** above ' +
            'and paste the `accessToken`.',
    },
    servers: [{ url: '/', description: 'Same origin as this server' }],
    tags: [
        { name: 'Health', description: 'Service health checks' },
        { name: 'Auth', description: 'Registration, login and logout' },
        { name: 'Users', description: 'User listing and profile' },
        { name: 'Roles', description: 'Role reference data' },
        { name: 'Tasks', description: 'Task assignment, submission and review' },
        { name: 'Files', description: 'File download and video streaming' },
        { name: 'Push', description: 'Firebase push notifications' },
        { name: 'User Management', description: 'Example CRUD user routes' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            Error: {
                type: 'object',
                properties: { error: { type: 'string' } },
            },
            Message: {
                type: 'object',
                properties: { message: { type: 'string' } },
            },
            Role: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'admin' },
                },
            },
            Task: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    description: { type: 'string', example: 'Do 20 push-ups' },
                },
            },
            TaskStatus: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 10 },
                    userId: { type: 'integer', example: 3 },
                    taskId: { type: 'integer', example: 1 },
                    fileName: { type: 'string', example: 'a1b2c3.mp4' },
                    status: {
                        type: 'string',
                        enum: ['Unknown', 'Working', 'Pending', 'Done', 'Rejected'],
                        example: 'Pending',
                    },
                    rejectReason: { type: 'string', nullable: true },
                },
            },
            User: {
                type: 'object',
                description: 'A Karma user (password is never returned).',
                properties: {
                    id: { type: 'integer', example: 3 },
                    fullName: { type: 'string', nullable: true, example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    gender: { type: 'string', example: 'female' },
                    username: { type: 'string', example: 'jane' },
                    rankId: { type: 'integer', example: 1 },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            UserProfile: {
                type: 'object',
                properties: {
                    username: { type: 'string', example: 'jane' },
                    rankName: { type: 'string', example: 'Novice' },
                    working: { type: 'integer', example: 2 },
                    pending: { type: 'integer', example: 1 },
                    completed: { type: 'integer', example: 5 },
                    rejected: { type: 'integer', example: 0 },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['fullName', 'email', 'gender', 'username', 'password'],
                properties: {
                    fullName: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    gender: { type: 'string', example: 'female' },
                    username: { type: 'string', example: 'jane' },
                    password: { type: 'string', format: 'password', example: 's3cret' },
                    roles: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['user'],
                    },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['usernameOrEmail', 'password'],
                properties: {
                    usernameOrEmail: { type: 'string', example: 'jane' },
                    password: { type: 'string', format: 'password', example: 's3cret' },
                },
            },
            LogoutRequest: {
                type: 'object',
                required: ['accessToken'],
                properties: { accessToken: { type: 'string' } },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    roles: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['ROLE_USER'],
                    },
                    accessToken: { type: 'string' },
                },
            },
            ManagedUser: {
                type: 'object',
                required: ['id', 'name', 'email', 'created'],
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    created: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
    paths: {
        [route(B, K.Base, K.Hello)]: {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                description: 'Simple liveness probe.',
                responses: {
                    200: {
                        description: 'Service is up',
                        content: json(ref('Message')),
                    },
                },
            },
        },
        [route(B, K.Base, K.Register)]: {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                description: 'Creates a user, assigns the default role and returns a JWT.',
                requestBody: { required: true, content: json(ref('RegisterRequest')) },
                responses: {
                    200: {
                        description: 'User registered and logged in',
                        content: json({
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                                accessToken: { type: 'string' },
                            },
                        }),
                    },
                    400: {
                        description: 'Username/email already in use, or role does not exist',
                        content: json(ref('Message')),
                    },
                    500: { description: 'Server error', content: json(ref('Message')) },
                },
            },
        },
        [route(B, K.Base, K.Login)]: {
            post: {
                tags: ['Auth'],
                summary: 'Log in',
                description: 'Authenticates by username or email and returns a JWT.',
                requestBody: { required: true, content: json(ref('LoginRequest')) },
                responses: {
                    200: { description: 'Logged in', content: json(ref('AuthResponse')) },
                    401: { description: 'Invalid password', content: json(ref('Message')) },
                    404: { description: 'User not found', content: json(ref('Message')) },
                    500: { description: 'Server error', content: json(ref('Message')) },
                },
            },
        },
        [route(B, K.Base, K.Logout)]: {
            post: {
                tags: ['Auth'],
                summary: 'Log out',
                description: 'Returns an invalidated (logout) token for the given token.',
                requestBody: { required: true, content: json(ref('LogoutRequest')) },
                responses: {
                    200: {
                        description: 'Logged out',
                        content: json({
                            type: 'object',
                            properties: {
                                message: { type: 'string' },
                                accessToken: { type: 'string' },
                            },
                        }),
                    },
                },
            },
        },
        [route(B, K.Base, K.Roles)]: {
            get: {
                tags: ['Roles'],
                summary: 'List all roles',
                responses: {
                    200: {
                        description: 'Array of roles',
                        content: json({ type: 'array', items: ref('Role') }),
                    },
                },
            },
        },
        [route(B, K.Base, K.Users)]: {
            get: {
                tags: ['Users'],
                summary: 'List all users with their task statuses',
                responses: {
                    200: {
                        description: 'Users and the total count',
                        content: json({
                            type: 'object',
                            properties: {
                                data: { type: 'array', items: ref('User') },
                                count: { type: 'integer', description: 'Number of users returned' },
                            },
                        }),
                    },
                },
            },
        },
        [route(B, K.Base, K.User)]: {
            get: {
                tags: ['Users'],
                summary: "Get the authenticated user's profile and task counts",
                security: bearer,
                responses: {
                    200: { description: 'User profile', content: json(ref('UserProfile')) },
                    401: unauthorized,
                    404: { description: 'User not found', content: json(ref('Message')) },
                },
            },
        },
        [route(B, K.Base, K.Tasks)]: {
            get: {
                tags: ['Tasks'],
                summary: 'List tasks not yet taken by the authenticated user',
                security: bearer,
                responses: {
                    200: {
                        description: 'Available tasks',
                        content: json({
                            type: 'object',
                            properties: { tasks: { type: 'array', items: ref('Task') } },
                        }),
                    },
                    401: unauthorized,
                },
            },
        },
        [route(B, K.Base, K.AllTasks)]: {
            get: {
                tags: ['Tasks'],
                summary: 'List every task',
                security: bearer,
                responses: {
                    200: {
                        description: 'All tasks',
                        content: json({
                            type: 'object',
                            properties: { tasks: { type: 'array', items: ref('Task') } },
                        }),
                    },
                    401: unauthorized,
                },
            },
        },
        [route(B, K.Base, K.UploadFile)]: {
            post: {
                tags: ['Tasks'],
                summary: 'Upload a submission file for a task',
                description: 'Stores the uploaded file and marks the task status as `Pending`.',
                security: bearer,
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['file', 'taskId'],
                                properties: {
                                    file: { type: 'string', format: 'binary' },
                                    taskId: { type: 'integer', example: 1 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Upload successful',
                        content: json({
                            type: 'object',
                            properties: { success: { type: 'string' } },
                        }),
                    },
                    401: unauthorized,
                    500: { description: 'Server error', content: json(ref('Error')) },
                },
            },
        },
        [route(B, K.Base, K.CreepInTask)]: {
            post: {
                tags: ['Tasks'],
                summary: "Mark a task as 'Working' for the authenticated user",
                security: bearer,
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        required: ['taskId'],
                        properties: { taskId: { type: 'integer', example: 1 } },
                    }),
                },
                responses: {
                    201: {
                        description: 'Task moved to Working',
                        content: json({
                            type: 'object',
                            properties: {
                                success: { type: 'string' },
                                taskId: { type: 'integer' },
                            },
                        }),
                    },
                    401: unauthorized,
                },
            },
        },
        [route(B, K.Base, K.ValidateTaskStatus)]: {
            post: {
                tags: ['Tasks'],
                summary: 'Approve or reject a submitted task status',
                description: 'Reviews a submission. On success a push notification is sent to the ' +
                    'task owner.',
                security: bearer,
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'TaskStatus id to review',
                    },
                ],
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        required: ['approve', 'userId'],
                        properties: {
                            approve: { type: 'boolean', example: true },
                            rejectReason: { type: 'string', nullable: true },
                            userId: {
                                type: 'string',
                                description: 'Owner user id (used for the push notification)',
                            },
                        },
                    }),
                },
                responses: {
                    200: {
                        description: 'Updated task status',
                        content: json(ref('TaskStatus')),
                    },
                    401: { description: 'Invalid id, or missing/invalid token' },
                    500: { description: 'Server error' },
                },
            },
        },
        [route(B, K.Base, K.Push)]: {
            post: {
                tags: ['Push'],
                summary: "Send a push notification to the authenticated user's device",
                security: bearer,
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        properties: {
                            title: { type: 'string', example: 'Nice work!' },
                            body: { type: 'string', example: 'Your task was approved.' },
                        },
                    }),
                },
                responses: {
                    200: { description: 'Notification dispatched' },
                    401: unauthorized,
                },
            },
        },
        [route(B, K.Base, K.PushToken)]: {
            post: {
                tags: ['Push'],
                summary: "Store the device's push token for the authenticated user",
                security: bearer,
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        required: ['token'],
                        properties: { token: { type: 'string' } },
                    }),
                },
                responses: {
                    200: {
                        description: 'Token stored',
                        content: json({
                            type: 'object',
                            properties: { success: { type: 'string' } },
                        }),
                    },
                    401: unauthorized,
                    500: { description: 'Server error', content: json(ref('Error')) },
                },
            },
        },
        [route(B, K.Base, K.PushForAll)]: {
            post: {
                tags: ['Push'],
                summary: 'Broadcast a push notification to all stored device tokens',
                security: bearer,
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            body: { type: 'string' },
                        },
                    }),
                },
                responses: {
                    200: { description: 'Broadcast dispatched' },
                    401: unauthorized,
                },
            },
        },
        [route(B, K.Base, K.File)]: {
            get: {
                tags: ['Files'],
                summary: 'Download an uploaded file (admin only)',
                security: bearer,
                parameters: [
                    {
                        name: 'filename',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'File contents',
                        content: {
                            'application/octet-stream': {
                                schema: { type: 'string', format: 'binary' },
                            },
                        },
                    },
                    400: { description: 'Filename is required' },
                    401: { description: 'Unauthorized (not an admin / no token)' },
                    403: { description: 'Access denied' },
                    404: { description: 'File not found' },
                },
            },
        },
        [route(B, K.Base, K.Video)]: {
            get: {
                tags: ['Files'],
                summary: 'Create a temporary streaming URL for a video (admin only)',
                security: bearer,
                parameters: [
                    {
                        name: 'filename',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Temporary video id and expiry',
                        content: json({
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    description: 'Temporary id to pass to the stream endpoint',
                                },
                                expireInMiliseconds: { type: 'integer' },
                            },
                        }),
                    },
                    400: { description: 'Filename is required' },
                    401: { description: 'Unauthorized (not an admin / no token)' },
                    403: { description: 'Access denied' },
                    404: { description: 'File not found' },
                },
            },
        },
        [route(B, K.Base, K.Stream)]: {
            get: {
                tags: ['Files'],
                summary: 'Stream a video by its temporary id',
                description: 'Uses the temporary id returned by the video URL endpoint. No auth ' +
                    'header is required — the short-lived id is itself the credential.',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Video stream',
                        content: {
                            'video/mp4': { schema: { type: 'string', format: 'binary' } },
                        },
                    },
                    404: { description: 'Not found' },
                },
            },
        },
        [route(B, U.Base, U.Get)]: {
            get: {
                tags: ['User Management'],
                summary: 'List managed users',
                responses: {
                    200: {
                        description: 'Users',
                        content: json({
                            type: 'object',
                            properties: {
                                users: { type: 'array', items: ref('ManagedUser') },
                            },
                        }),
                    },
                },
            },
        },
        [route(B, U.Base, U.Add)]: {
            post: {
                tags: ['User Management'],
                summary: 'Add a managed user',
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        required: ['user'],
                        properties: { user: ref('ManagedUser') },
                    }),
                },
                responses: {
                    201: { description: 'Created' },
                    400: { description: 'Validation failed', content: json(ref('Error')) },
                },
            },
        },
        [route(B, U.Base, U.Update)]: {
            put: {
                tags: ['User Management'],
                summary: 'Update a managed user',
                requestBody: {
                    required: true,
                    content: json({
                        type: 'object',
                        required: ['user'],
                        properties: { user: ref('ManagedUser') },
                    }),
                },
                responses: {
                    200: { description: 'Updated' },
                    400: { description: 'Validation failed', content: json(ref('Error')) },
                },
            },
        },
        [route(B, U.Base, U.Delete)]: {
            delete: {
                tags: ['User Management'],
                summary: 'Delete a managed user',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    200: { description: 'Deleted' },
                    400: { description: 'Invalid id', content: json(ref('Error')) },
                },
            },
        },
    },
};
exports.default = swaggerSpec;
