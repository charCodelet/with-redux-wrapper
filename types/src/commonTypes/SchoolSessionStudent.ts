import { SQSettings } from './SharedEnums';
//TODO : check if any of the properties below are not used in CurrentGen.
//TODO: the Sstudent may not be required in NextGen. Both Student & School interfaces are replaced by sessionId. Delete these? tbd
export interface Student {
  studentId: number;
  loginId: string;
  sqSettings: SQSettings;
  bookletNumber: string;
  bookletCompleted: boolean;
  dateAssessed?: Date;
  grade: string;
  subjectId: number;
  subjectName: string;
  teacherNumberRequired: boolean;
  teacherNumber: string;
  secondaryTeacherNumber: string;
  teacherIsAdded: boolean;
  bilingualState: 'Bilingual' | 'Directions-Only' | '';
  hasExtendedTimeAccommodation: boolean;
  hasSlowLearningAccommodation: boolean;
  isNIES: boolean;
  allowedToSyncToConnectedAdmin: boolean;
}
//TODO: the SchoolSession may not be required in NextGen. Both Student & School interfaces are replaced by sessionId. Delete these? tbd
export interface SchoolSession {
  schoolId: number;
  sessionId: number;
  //TODO: the folowing data is not used anywhere in CurrentGen. Delete these? tbd
  schoolCode: string;
  schoolName: string;
  sessionNumber: string;
}
export interface SchoolSessionStudentState {
  schoolSession: SchoolSession;
  student: Student;
}
