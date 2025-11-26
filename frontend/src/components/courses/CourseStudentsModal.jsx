import { useState, useEffect } from 'react';
import { Users, Check, X } from 'lucide-react';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/helpers';

export default function CourseStudentsModal({ isOpen, onClose, course, onEnrollmentChange }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingStudentId, setProcessingStudentId] = useState(null);

  useEffect(() => {
    if (isOpen && course) {
      fetchData();
    }
  }, [isOpen, course]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsData, enrollmentsData] = await Promise.all([
        studentService.getAllStudents(),
        courseService.getAllEnrollments(),
      ]);
      // Filter students: USER role can only see themselves
      const filteredStudents = user?.role === 'USER'
        ? studentsData.filter(s => s.user_id === user.id)
        : studentsData;
      setStudents(filteredStudents);
      setEnrollments(enrollmentsData);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (studentId) => {
    return enrollments.some(
      (e) => e.course === course.id && e.student_id === studentId
    );
  };

  const handleToggleEnrollment = async (student) => {
    // Check if USER is trying to manage enrollments for someone else
    if (user?.role === 'USER' && student.user_id !== user.id) {
      toast.error('You can only manage your own enrollments');
      return;
    }
    
    setProcessingStudentId(student.id);
    try {
      if (isEnrolled(student.id)) {
        await courseService.unenrollStudent(course.id, student.id);
        toast.success(`${student.firstName} ${student.lastName} unenrolled`);
        setEnrollments(enrollments.filter(
          (e) => !(e.course === course.id && e.student_id === student.id)
        ));
      } else {
        await courseService.enrollStudent(course.id, student.id);
        toast.success(`${student.firstName} ${student.lastName} enrolled`);
        setEnrollments([
          ...enrollments,
          { course: course.id, student_id: student.id },
        ]);
      }
      if (onEnrollmentChange) {
        onEnrollmentChange();
      }
    } catch (error) {
      toast.error('Failed to update enrollment');
    } finally {
      setProcessingStudentId(null);
    }
  };

  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Students for ${course.name}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Course Info */}
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
          <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
            {course.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{course.name}</p>
            <p className="text-sm text-gray-600">
              {course.instructor} • {course.category}
            </p>
          </div>
        </div>

        {/* Students List */}
        {loading ? (
          <LoadingSpinner text="Loading students..." />
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No students available
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {students.map((student) => {
              const enrolled = isEnrolled(student.id);
              const processing = processingStudentId === student.id;

              return (
                <div
                  key={student.id}
                  className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                    enrolled
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  } ${processing ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={() => !processing && handleToggleEnrollment(student)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          enrolled
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {getInitials(student.firstName, student.lastName)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {student.firstName} {student.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {student.email}
                          {student.university && ` • ${student.university.name}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {processing ? (
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                      ) : (
                        <button
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            enrolled
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEnrollment(student);
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
        {!loading && students.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-green-600">
                {enrollments.filter((e) => e.course === course.id).length}
              </span>{' '}
              of <span className="font-semibold">{students.length}</span> students enrolled
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
