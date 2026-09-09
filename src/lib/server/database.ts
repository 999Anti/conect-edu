import { mkdir, readFile, writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import path from 'path';
import { Application, AuditLog, Notification, Payment, School, SchoolApplication, User } from '@app-types/index';

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
  notifications: Notification[];
  auditLogs: AuditLog[];
}

const databasePath = path.join(process.cwd(), '.data', 'conect-edu.json');
export const uploadPath = path.join(process.cwd(), 'public', 'uploads');

const school = (
  id: string,
  name: string,
  state: string,
  city: string,
  curriculum: School['curriculum'],
  boardingOption: School['boardingOption'],
  gender: School['gender'],
  description: string,
  facilities: string[],
  annualTuitionFee?: number
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
    annualTuitionFee,
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
  notifications: [],
  auditLogs: [],
  schools: [
    school('greenfield-college', 'Greenfield College', 'Lagos', 'Lekki', 'mixed', 'mixed', 'mixed', 'A co-educational secondary school focused on strong academics, character, and practical learning.', ['Science laboratories', 'Library', 'Sports centre', 'School bus'], 850000),
    school('cedar-girls', 'Cedar Girls Academy', 'Oyo', 'Ibadan', 'nigerian', 'boarding', 'female', 'A welcoming boarding school that equips young women for academic excellence and leadership.', ['Boarding house', 'ICT lab', 'Music studio', 'Clinic'], 1200000),
    school('summit-boys', 'Summit Boys College', 'Federal Capital Territory', 'Abuja', 'igcse', 'boarding', 'male', 'A values-led boys school offering a balanced British and Nigerian curriculum.', ['Boarding house', 'Football pitch', 'STEM lab', 'Dining hall'], 1750000),
    school('riverside-school', 'Riverside International School', 'Rivers', 'Port Harcourt', 'ib', 'day', 'mixed', 'An international day school for curious learners and globally minded families.', ['Art studio', 'Swimming pool', 'Library', 'Robotics club'], 2100000),
    school('heritage-college', 'Heritage College', 'Ogun', 'Abeokuta', 'nigerian', 'day', 'mixed', 'A community-centred school providing a rigorous and affordable secondary education.', ['Library', 'Science laboratories', 'Basketball court'], 350000),
    school('northstar-academy', 'Northstar Academy', 'Kaduna', 'Kaduna', 'mixed', 'mixed', 'mixed', 'A modern school blending Nigerian and international pathways for future-ready learners.', ['Makerspace', 'Debate club', 'Boarding house', 'Computer lab'], 650000),
  ],
});

export async function readDatabase(): Promise<Database> {
  try {
    const database = JSON.parse(await readFile(databasePath, 'utf8')) as Database;
    database.schoolApplications ||= [];
    database.notifications ||= [];
    database.auditLogs ||= [];
    const missingPasswordChangeFlags = database.users.filter((user) => user.role === 'school_admin' && user.mustChangePassword === undefined);
    if (missingPasswordChangeFlags.length) {
      missingPasswordChangeFlags.forEach((user) => { user.mustChangePassword = true; });
      await writeDatabase(database);
    }
    await ensurePlatformAdmin(database);
    return database;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const database = initialDatabase();
    await writeDatabase(database);
    return database;
  }
}

export function addAuditLog(database: Database, entry: Omit<AuditLog, 'id' | 'createdAt'>) {
  database.auditLogs.unshift({ id: randomUUID(), createdAt: new Date().toISOString(), ...entry });
}

export function addNotification(database: Database, entry: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
  database.notifications.unshift({ id: randomUUID(), read: false, createdAt: new Date().toISOString(), ...entry });
}

async function ensurePlatformAdmin(database: Database): Promise<void> {
  const email = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.PLATFORM_ADMIN_PASSWORD;
  if (!email || !password) return;
  const configuredAdmin = database.users.find((user) => user.email === email && user.role === 'conect_admin');
  if (configuredAdmin) {
    const { hashPassword, verifyPassword } = await import('./auth');
    let changed = false;
    if (!verifyPassword(password, configuredAdmin.passwordHash)) {
      configuredAdmin.passwordHash = hashPassword(password);
      configuredAdmin.updatedAt = new Date().toISOString();
      changed = true;
    }
    if (!configuredAdmin.canManageAdmins) {
      configuredAdmin.canManageAdmins = true;
      configuredAdmin.updatedAt = new Date().toISOString();
      changed = true;
    }
    if (changed) await writeDatabase(database);
    return;
  }
  if (database.users.some((user) => user.email === email)) return;
  if (database.users.some((user) => user.role === 'conect_admin')) return;
  const now = new Date().toISOString();
  database.users.push({
    id: `platform-admin-${Date.now()}`,
    firstName: process.env.PLATFORM_ADMIN_FIRST_NAME?.trim() || 'Platform',
    lastName: process.env.PLATFORM_ADMIN_LAST_NAME?.trim() || 'Admin',
    email,
    phone: '',
    role: 'conect_admin',
    canManageAdmins: true,
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
