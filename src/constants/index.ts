// Application Statuses
export const APPLICATION_STATUSES = {
  DRAFT: 'draft',
  PAYMENT_REQUIRED: 'payment_required',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  ASSESSMENT_SCHEDULED: 'assessment_scheduled',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  payment_required: 'Payment Required',
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  assessment_scheduled: 'Assessment Scheduled',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  payment_required: 'bg-yellow-100 text-yellow-800',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-purple-100 text-purple-800',
  shortlisted: 'bg-green-100 text-green-800',
  interview_scheduled: 'bg-indigo-100 text-indigo-800',
  assessment_scheduled: 'bg-cyan-100 text-cyan-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

// School Types
export const SCHOOL_TYPES = ['private', 'public'] as const;
export const CURRICULA = ['nigerian', 'igcse', 'ib', 'mixed'] as const;
export const BOARDING_OPTIONS = ['day', 'boarding', 'mixed'] as const;
export const GENDERS = ['male', 'female', 'mixed'] as const;

// Nigerian States
export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Born',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory',
];

// Classes/Year Groups
export const YEAR_GROUPS = [
  'JSS1',
  'JSS2',
  'JSS3',
  'SS1',
  'SS2',
  'SS3',
] as const;

// Document Types
export const DOCUMENT_TYPES = [
  'birth_certificate',
  'passport_photo',
  'school_report',
  'transfer_document',
  'identification',
  'other',
] as const;

// User Roles
export const USER_ROLES = ['student', 'parent', 'school_admin', 'conect_admin'] as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ME: '/api/auth/me',
  },
  SCHOOLS: {
    LIST: '/api/schools',
    DETAIL: '/api/schools/:id',
    SEARCH: '/api/schools/search',
    BY_STATE: '/api/schools/state/:state',
  },
  APPLICATIONS: {
    LIST: '/api/applications',
    CREATE: '/api/applications',
    DETAIL: '/api/applications/:id',
    UPDATE: '/api/applications/:id',
    SUBMIT: '/api/applications/:id/submit',
  },
  PAYMENTS: {
    INITIALIZE: '/api/payments/initialize',
    VERIFY: '/api/payments/verify',
    HISTORY: '/api/payments/history',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'conect_auth_token',
  USER: 'conect_user',
  SELECTED_SCHOOLS: 'conect_selected_schools',
  DRAFT_APPLICATION: 'conect_draft_application',
};

// Pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

// Messages
export const MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to access this',
  NOT_FOUND: 'Resource not found',
};
