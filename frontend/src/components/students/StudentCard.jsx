import { Mail, MapPin, BookOpen, Edit, Trash2, GraduationCap } from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import Button from '../common/Button';

export default function StudentCard({ student, enrollmentCount = 0, onEdit, onDelete, onViewCourses }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl font-bold">
            {getInitials(student.firstName, student.lastName)}
          </div>
          
          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              {student.email}
            </div>
            {student.university && (
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                {student.university.name}
              </div>
            )}
            {/* Enrollment Count Badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <GraduationCap className="w-3 h-3" />
                {enrollmentCount} {enrollmentCount === 1 ? 'Course' : 'Courses'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewCourses(student)}
            className="flex items-center gap-1"
          >
            <BookOpen className="w-4 h-4" />
            Courses
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(student)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(student)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}