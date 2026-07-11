// ============================
// Application Constants
// ============================

export const USER_ROLES = {
  ADMIN: 'admin',
  LEARNER: 'learner',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const QUESTION_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type QuestionDifficulty =
  (typeof QUESTION_DIFFICULTY)[keyof typeof QUESTION_DIFFICULTY];

export const QUESTION_TYPE = {
  REACT: 'react',
  FULLSTACK: 'fullstack',
} as const;

export type QuestionType =
  (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];

export const SUBMISSION_STATUS = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  ERROR: 'error',
  TIMEOUT: 'timeout',
} as const;

export type SubmissionStatus =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const QUESTION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type QuestionStatus =
  (typeof QUESTION_STATUS)[keyof typeof QUESTION_STATUS];

// ============================
// Response Messages
// ============================

export const RESPONSE_MESSAGES = {
  SUCCESS: 'Request completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
} as const;

// ============================
// Metadata Keys
// ============================

export const ROLES_KEY = 'roles';
