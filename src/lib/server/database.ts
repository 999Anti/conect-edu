import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Application, Payment, School, SchoolApplication, User } from '@app-types/index';

export interface StoredUser extends User {
  passwordHash: string;
  schoolId?: string;
}

export interface Database {
  users: StoredUser[];
  schools: School[];
  applications: Application[];
  payments: Payment[];
  schoolApplications: SchoolApplication[];
}

const databasePath = path.join(process.cwd(), '.data', 'conect-edu.json');

const school = (
  id: string,
  name: string,
  state: string,
  city: string,
  curriculum: School['curriculum'],
  boardingOption: School['boardingOption'],
  gender: School['gender'],
  description: string,
  facilities: string[]
): School => {
  const now = new Date().toISOString();
  return {
    id,
    name,
    email: `admissions@${id}.edu.ng`,
    phone: '+234 800 000 0000',
    address: `${city}, ${state}, Nigeria`,
    state,
    city,
    schoolType: 'private',
    curriculum,
    boardingOption,
    gender,
    description,
    facilities,
    rating: 4.5,
    applicationCount: 0,
    verified: true,
    verificationStatus: 'verified',
    createdAt: now,
    updatedAt: now,
  };
};

const initialDatabase = (): Database => ({
  users: [],
  applications: [],
  payments: [],
  schoolApplications: [],
  schools: [
    school('greenfield-college', 'Greenfield College', 'Lagos', 'Lekki', 'mixed', 'mixed', 'mixed', 'A co-educational secondary school focused on strong academics, character, and practical learning.', ['Science laboratories', 'Library', 'Sports centre', 'School bus']),
    school('cedar-girls', 'Cedar Girls Academy', 'Oyo', 'Ibadan', 'nigerian', 'boarding', 'female', 'A welcoming boarding school that equips young women for academic excellence and leadership.', ['Boarding house', 'ICT lab', 'Music studio', 'Clinic']),
    school('summit-boys', 'Summit Boys College', 'Federal Capital Territory', 'Abuja', 'igcse', 'boarding', 'male', 'A values-led boys school offering a balanced British and Nigerian curriculum.', ['Boarding house', 'Football pitch', 'STEM lab', 'Dining hall']),
    school('riverside-school', 'Riverside International School', 'Rivers', 'Port Harcourt', 'ib', 'day', 'mixed', 'An international day school for curious learners and globally minded families.', ['Art studio', 'Swimming pool', 'Library', 'Robotics club']),
    school('heritage-college', 'Heritage College', 'Ogun', 'Abeokuta', 'nigerian', 'day', 'mixed', 'A community-centred school providing a rigorous and affordable secondary education.', ['Library', 'Science laboratories', 'Basketball court']),
    school('northstar-academy', 'Northstar Academy', 'Kaduna', 'Kaduna', 'mixed', 'mixed', 'mixed', 'A modern school blending Nigerian and international pathways for future-ready learners.', ['Makerspace', 'Debate club', 'Boarding house', 'Computer lab']),
  ],
});

export async function readDatabase(): Promise<Database> {
  try {
    const database = JSON.parse(await readFile(databasePath, 'utf8')) as Database;
    database.schoolApplications ||= [];
    await ensurePlatformAdmin(database);
    return database;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const database = initialDatabase();
    await writeDatabase(database);
    return database;
  }
}

async function ensurePlatformAdmin(database: Database): Promise<void> {
  const email = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.PLATFORM_ADMIN_PASSWORD;
  if (!email || !password || database.users.some((user) => user.role === 'conect_admin')) return;
  const now = new Date().toISOString();
  database.users.push({
    id: `platform-admin-${Date.now()}`,
    firstName: process.env.PLATFORM_ADMIN_FIRST_NAME?.trim() || 'Platform',
    lastName: process.env.PLATFORM_ADMIN_LAST_NAME?.trim() || 'Admin',
    email,
    phone: '',
    role: 'conect_admin',
    isVerified: true,
    createdAt: now,
    updatedAt: now,
    passwordHash: (await import('./auth')).hashPassword(password),
  });
  await writeDatabase(database);
}

export async function writeDatabase(database: Database): Promise<void> {
  await mkdir(path.dirname(databasePath), { recursive: true });
  await writeFile(databasePath, JSON.stringify(database, null, 2), 'utf8');
}
