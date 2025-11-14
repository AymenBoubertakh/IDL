import { useState, useEffect } from 'react';
import { BookOpen, Check, X } from 'lucide-react';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { courseService } from '../../services/courseService';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/helpers';

export default function StudentCoursesModal({ isOpen, onClose, student, onEnrollmentChange }) {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingCourseId, setProcessingCourseId] = useState(null);

  useEffect(() => {
    if (isOpen && student) {
      fetchData();
    }
  }, [isOpen, student]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getAllEnrollments(),
      ]);
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some(
      (e) => e.student_id === student.id && e.course === courseId
    );
  };

  const handleToggleEnrollment = async (course) => {
    setProcessingCourseId(course.id);
    try {
      if (isEnrolled(course.id)) {
        await courseService.unenrollStudent(course.id, student.id);
        toast.success(`Unenrolled from ${course.name}`);
        setEnrollments(enrollments.filter(
          (e) => !(e.student_id === student.id && e.course === course.id)
        ));
      } else {
        await courseService.enrollStudent(course.id, student.id);
        toast.success(`Enrolled in ${course.name}`);
        setEnrollments([
          ...enrollments,
          { student_id: student.id, course: course.id },
        ]);
      }
      if (onEnrollmentChange) {
        onEnrollmentChange();
      }
    } catch (error) {
      toast.error('Failed to update enrollment');
    } finally {
      setProcessingCourseId(null);
    }
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Courses for ${student.firstName} ${student.lastName}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Student Info */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
            {getInitials(student.firstName, student.lastName)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm text-gray-600">{student.email}</p>
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <LoadingSpinner text="Loading courses..." />
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No courses available
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const processing = processingCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                    enrolled
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${processing ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={() => !processing && handleToggleEnrollment(course)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          enrolled
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {course.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {course.instructor} • {course.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {processing ? (
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                      ) : (
                        <button
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            enrolled
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEnrollment(course);
                          }}
                        >
                          {enrolled ? <Check size={20} /> : <X size={20} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {!loading && courses.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Enrolled in{' '}
              <span className="font-semibold text-green-600">
                {enrollments.filter((e) => e.student_id === student.id).length}
              </span>{' '}
              of <span className="font-semibold">{courses.length}</span> courses
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
