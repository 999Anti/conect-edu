// User & Auth Types
export type UserRole = 'student' | 'parent' | 'school_admin' | 'conect_admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContext {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// School Types
export interface School {
  id: string;
  name: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  area?: string;
  schoolType: 'private' | 'public';
  curriculum: 'nigerian' | 'igcse' | 'ib' | 'mixed';
  boardingOption: 'day' | 'boarding' | 'mixed';
  gender: 'male' | 'female' | 'mixed';
  facilities?: string[];
  programmes?: string[];
  admissionRequirements?: string[];
  admissionInstructions?: string;
  website?: string;
  gallery?: string[];
  rating?: number;
  applicationCount?: number;
  verified: boolean;
  verificationStatus: 'pending' | 'under_review' | 'verified' | 'suspended' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface SchoolApplication {
  id: string;
  schoolName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  state: string;
  city: string;
  website?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

export interface SchoolAdmin extends User {
  schoolId: string;
  role: 'school_admin';
}

// Application Types
export type ApplicationStatus = 
  | 'draft' 
  | 'payment_required' 
  | 'submitted' 
  | 'under_review' 
  | 'shortlisted' 
  | 'interview_scheduled' 
  | 'assessment_scheduled' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface Application {
  id: string;
  applicationId: string; // Reference number like CE-2026-000123
  userId: string;
  schoolId: string;
  status: ApplicationStatus;
  desiredClass: string;
  studentFirstName: string;
  studentLastName: string;
  studentDOB: string;
  studentGender: 'male' | 'female';
  studentNationality: string;
  currentSchool: string;
  currentClass: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentAddress: string;
  documents?: Document[];
  customAnswers?: CustomAnswer[];
  paymentStatus: 'pending' | 'successful' | 'failed' | 'refunded';
  applicationFee: number;
  processingFee: number;
  totalAmount: number;
  transactionId?: string;
  submittedAt?: string;
  assessmentDate?: string;
  decisionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  type: 'birth_certificate' | 'passport_photo' | 'school_report' | 'transfer_document' | 'other';
  url: string;
  name: string;
  uploadedAt: string;
}

export interface CustomAnswer {
  questionId: string;
  question: string;
  answer: string;
}

// Tour Types
export interface Tour {
  id: string;
  schoolId: string;
  type: 'virtual' | 'physical';
  status: 'pending' | 'confirmed' | 'cancelled';
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  scheduledDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  transactionId: string;
  userId: string;
  schoolId: string;
  applicationId: string;
  amount: number;
  processingFee: number;
  status: PaymentStatus;
  paymentMethod: 'card' | 'bank_transfer';
  reference: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Response
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
