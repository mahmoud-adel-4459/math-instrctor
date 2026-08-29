import type { User } from '../types';

export function isStudentAccount(user: User | null | undefined): boolean {
  if (!user) return false;
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles.includes('student');
  }
  return user.role === 'student';
}
