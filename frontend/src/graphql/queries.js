import { gql } from '@apollo/client';

// Student Queries
export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    students {
      id
      firstName
      lastName
      email
      university {
        id
        name
        location
      }
    }
  }
`;

export const GET_STUDENT_WITH_COURSES = gql`
  query GetStudentWithCourses($id: ID!) {
    student(id: $id) {
      id
      firstName
      lastName
      email
      university {
        id
        name
        location
      }
      courses {
        id
        name
        instructor
        category
        schedule
      }
    }
  }
`;

export const SEARCH_STUDENTS = gql`
  query SearchStudents($keyword: String!) {
    searchStudents(keyword: $keyword) {
      id
      firstName
      lastName
      email
      university {
        id
        name
        location
      }
    }
  }
`;

// Course Queries
export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      id
      name
      instructor
      category
      schedule
      createdAt
      updatedAt
    }
  }
`;

export const GET_COURSE_WITH_STUDENTS = gql`
  query GetCourseWithStudents($id: ID!) {
    course(id: $id) {
      id
      name
      instructor
      category
      schedule
      students {
        id
        firstName
        lastName
        email
        university {
          name
        }
      }
    }
  }
`;

export const SEARCH_COURSES = gql`
  query SearchCourses($keyword: String!) {
    searchCourses(keyword: $keyword) {
      id
      name
      instructor
      category
      schedule
    }
  }
`;

// University Queries
export const GET_ALL_UNIVERSITIES = gql`
  query GetAllUniversities {
    universities {
      id
      name
      location
    }
  }
`;

// Combined Queries for Relations Page
export const GET_STUDENTS_WITH_COURSES = gql`
  query GetStudentsWithCourses {
    students {
      id
      firstName
      lastName
      email
      university {
        id
        name
        location
      }
      courses {
        id
        name
        instructor
        category
      }
    }
  }
`;

export const GET_COURSES_WITH_STUDENTS = gql`
  query GetCoursesWithStudents {
    courses {
      id
      name
      instructor
      category
      students {
        id
        firstName
        lastName
        email
      }
    }
  }
`;