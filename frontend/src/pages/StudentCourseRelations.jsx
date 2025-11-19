import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { BookOpen, Users, Building2, Filter } from 'lucide-react';
import { GET_STUDENTS_WITH_COURSES } from '../graphql/queries';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getInitials } from '../utils/helpers';

export default function StudentCourseRelations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [viewMode, setViewMode] = useState('students'); // 'students' or 'courses'

  const { data, loading, error } = useQuery(GET_STUDENTS_WITH_COURSES);

  if (loading) {
    return <LoadingSpinner text="Loading relations..." />;
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-600">Error loading data: {error.message}</p>
      </div>
    );
  }

  const students = data?.students || [];

  // Get unique universities
  const universities = [
    ...new Set(students.map((s) => s.university?.name).filter(Boolean)),
  ];

  // Get unique courses from all students
  const allCourses = students.flatMap((s) => s.courses || []);
  const uniqueCourses = Array.from(
    new Map(allCourses.map((course) => [course.id, course])).values()
  );

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.firstName} ${student.lastName} ${student.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCourse =
      !filterCourse || student.courses?.some((c) => String(c.id) === String(filterCourse));
    const matchesUniversity =
      !filterUniversity || student.university?.name === filterUniversity;
    return matchesSearch && matchesCourse && matchesUniversity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Student-Course Relations
        </h1>
        <p className="text-gray-600 mt-1">
          View comprehensive relationships between students and their courses using GraphQL
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.reduce((acc, s) => acc + (s.courses?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Universities</p>
              <p className="text-2xl font-bold text-gray-900">{universities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            placeholder="Search students..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="input-field"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterUniversity}
              onChange={(e) => setFilterUniversity(e.target.value)}
              className="input-field"
            >
              <option value="">All Universities</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students with Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="card hover:shadow-md transition-shadow">
              {/* Student Header */}
              <div className="flex items-start gap-4 mb-4 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {getInitials(student.firstName, student.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{student.email}</p>
                  {student.university && (
                    <div className="flex items-center gap-1 mt-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {student.university.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Courses */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">
                    Enrolled Courses ({student.courses?.length || 0})
                  </h4>
                </div>

                {student.courses && student.courses.length > 0 ? (
                  <div className="space-y-2">
                    {student.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {course.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">{course.instructor}</p>
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-600 rounded text-xs font-medium">
                            {course.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                    Not enrolled in any courses
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 card text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>

      {/* GraphQL Info */}
      <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            <svg className="w-6 h-6 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Powered by GraphQL 🚀
            </h3>
            <p className="text-sm text-gray-600">
              This page uses GraphQL to fetch student and course data in a single optimized query, 
              demonstrating the power of querying multiple related resources efficiently. 
              All data is retrieved from the GraphQL service on port 8002.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}