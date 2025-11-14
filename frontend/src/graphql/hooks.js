import { useQuery } from '@apollo/client';
import {
  GET_ALL_STUDENTS,
  GET_STUDENT_WITH_COURSES,
  GET_ALL_COURSES,
  GET_COURSE_WITH_STUDENTS,
  GET_ALL_UNIVERSITIES,
  GET_STUDENTS_WITH_COURSES,
  SEARCH_STUDENTS,
  SEARCH_COURSES,
} from './queries';

// Student Hooks
export const useStudents = () => {
  return useQuery(GET_ALL_STUDENTS);
};

export const useStudentWithCourses = (id) => {
  return useQuery(GET_STUDENT_WITH_COURSES, {
    variables: { id },
    skip: !id,
  });
};

export const useSearchStudents = (keyword) => {
  return useQuery(SEARCH_STUDENTS, {
    variables: { keyword },
    skip: !keyword,
  });
};

// Course Hooks
export const useCourses = () => {
  return useQuery(GET_ALL_COURSES);
};

export const useCourseWithStudents = (id) => {
  return useQuery(GET_COURSE_WITH_STUDENTS, {
    variables: { id },
    skip: !id,
  });
};

export const useSearchCourses = (keyword) => {
  return useQuery(SEARCH_COURSES, {
    variables: { keyword },
    skip: !keyword,
  });
};

// University Hooks
export const useUniversities = () => {
  return useQuery(GET_ALL_UNIVERSITIES);
};

// Relations Hook
export const useStudentsWithCourses = () => {
  return useQuery(GET_STUDENTS_WITH_COURSES);
};