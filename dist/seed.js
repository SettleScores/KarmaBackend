"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const PushToken_1 = require("./db/models/PushToken");
const Rank_1 = require("./db/models/Rank");
const Role_1 = require("./db/models/Role");
const Task_1 = require("./db/models/Task");
const usersPopulation_1 = __importDefault(require("./usersPopulation"));
function populateInitialRanksData() {
    Rank_1.Rank.create({
        id: 1,
        name: 'Baby boy',
        points: 0,
    });
    Rank_1.Rank.create({
        id: 2,
        name: 'Mama\'s boy',
        points: 100,
    });
    Rank_1.Rank.create({
        id: 3,
        name: 'Nasty toddler',
        points: 200,
    });
    Rank_1.Rank.create({
        id: 4,
        name: 'Emotional hurricane 🌀',
        points: 300,
    });
    Rank_1.Rank.create({
        id: 5,
        name: 'Almost human',
        points: 400,
    });
    Rank_1.Rank.create({
        id: 6,
        name: 'Balanced and smart ♎',
        points: 500,
    });
    Rank_1.Rank.create({
        id: 7,
        name: 'Lonely Jedi',
        points: 600,
    });
    Rank_1.Rank.create({
        id: 8,
        name: 'Needy narcissist',
        points: 700,
    });
    Rank_1.Rank.create({
        id: 9,
        name: 'Godlike',
        points: 800,
    });
    Rank_1.Rank.create({
        id: 10,
        name: 'Nirvana level',
        points: 900,
    });
    Rank_1.Rank.create({
        id: 11,
        name: 'Diamond member',
        points: 1000,
    });
}
function populateInitialRolesData() {
    Role_1.Role.create({
        id: 1,
        name: 'user',
    });
    Role_1.Role.create({
        id: 2,
        name: 'moderator',
    });
    Role_1.Role.create({
        id: 3,
        name: 'admin',
    });
}
function populateInitialTasksData() {
    Task_1.Task.create({
        description: 'Go to the contact list and text "How are you?" someone you didn\'t talk for a while',
    });
    Task_1.Task.create({
        description: 'Contact your cousins or far away relatives you didn\'t talk to forever',
    });
    Task_1.Task.create({
        description: 'Come over to any homeless person and ask if they need any help. Try to help them',
    });
    Task_1.Task.create({
        description: 'Collect plastic bottles for 1 week and try to recycle them',
    });
    Task_1.Task.create({
        description: 'Try to go vegan for 1 day',
    });
    Task_1.Task.create({
        description: 'Take care about your health. Make appointment and visit a dentist for a checkup',
    });
    Task_1.Task.create({
        description: 'Fix something in the house, that need a fix',
    });
    Task_1.Task.create({
        description: 'Clean inside your car',
    });
    Task_1.Task.create({
        description: 'To the laundry of the things that are not get washed frequently: blankets, pillow cases, etc',
    });
    Task_1.Task.create({
        description: 'Visit a concert',
    });
    Task_1.Task.create({
        description: 'Buy natural flowers to decorate your house',
    });
    Task_1.Task.create({
        description: 'Go to the gym and do a good workout',
    });
}
function populateInitialPushTokensData() {
    PushToken_1.PushToken.create({
        userId: -1,
        token: '_',
    });
}
function seed() {
    populateInitialRolesData();
    populateInitialRanksData();
    (0, usersPopulation_1.default)();
    populateInitialTasksData();
    populateInitialPushTokensData();
}
exports.seed = seed;
