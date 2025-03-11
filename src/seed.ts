import { PushToken } from './db/models/PushToken';
import { Rank } from './db/models/Rank';
import { Role } from './db/models/Role';
import { Task } from './db/models/Task';
import populateInitialMaintenanceData from './usersPopulation';

function populateInitialRanksData() {
  Rank.create({
    id: 1,
    name: 'Baby boy',
    points: 0,
  });

  Rank.create({
    id: 2,
    name: 'Mama\'s boy',
    points: 100,
  });

  Rank.create({
    id: 3,
    name: 'Nasty toddler',
    points: 200,
  });

  Rank.create({
    id: 4,
    name: 'Emotional hurricane 🌀',
    points: 300,
  });

  Rank.create({
    id: 5,
    name: 'Almost human',
    points: 400,
  });

  Rank.create({
    id: 6,
    name: 'Balanced and smart ♎',
    points: 500,
  });

  Rank.create({
    id: 7,
    name: 'Lonely Jedi',
    points: 600,
  });

  Rank.create({
    id: 8,
    name: 'Needy narcissist',
    points: 700,
  });

  Rank.create({
    id: 9,
    name: 'Godlike',
    points: 800,
  });

  Rank.create({
    id: 10,
    name: 'Nirvana level',
    points: 900,
  });

  Rank.create({
    id: 11,
    name: 'Diamond member',
    points: 1000,
  });
}

function populateInitialRolesData() {
  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'moderator',
  });

  Role.create({
    id: 3,
    name: 'admin',
  });
}

function populateInitialTasksData() {
  Task.create({
    description:
            'Go to the contact list and text "How are you?" someone you didn\'t talk for a while',
  });

  Task.create({
    description:
            'Contact your cousins or far away relatives you didn\'t talk to forever',
  });

  Task.create({
    description:
            'Come over to any homeless person and ask if they need any help. Try to help them',
  });

  Task.create({
    description: 'Collect plastic bottles for 1 week and try to recycle them',
  });

  Task.create({
    description: 'Try to go vegan for 1 day',
  });

  Task.create({
    description:
            'Take care about your health. Make appointment and visit a dentist for a checkup',
  });

  Task.create({
    description: 'Fix something in the house, that need a fix',
  });

  Task.create({
    description: 'Clean inside your car',
  });

  Task.create({
    description:
            'To the laundry of the things that are not get washed frequently: blankets, pillow cases, etc',
  });

  Task.create({
    description: 'Visit a concert',
  });

  Task.create({
    description: 'Buy natural flowers to decorate your house',
  });

  Task.create({
    description: 'Go to the gym and do a good workout',
  });
}



function populateInitialPushTokensData() {
  PushToken.create({
    userId: -1,
    token: '_',
  });
}

export function seed() {
  populateInitialRolesData();

  populateInitialRanksData();

  populateInitialMaintenanceData();

  populateInitialTasksData();

  populateInitialPushTokensData();
}