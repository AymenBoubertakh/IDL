import { User, Tag, Calendar, Users, Edit, Trash2, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';

export default function CourseCard({ course, enrollmentCount = 0, onEdit, onDelete, onViewStudents }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {course.name}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              <span className="px-2 py-1 bg-primary-50 text-primary-600 rounded text-xs font-medium">
                {course.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{course.schedule}</span>
            </div>
            {/* Enrollment Count Badge */}
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit">
              <UserCheck className="w-3 h-3" />
              {enrollmentCount} {enrollmentCount === 1 ? 'Student' : 'Students'} Enrolled
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewStudents(course)}
            className="flex items-center gap-1"
          >
            <Users className="w-4 h-4" />
            Students
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(course)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(course)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {course.createdAt && (
        <p className="text-xs text-gray-400 mt-3 pt-3 border-t">
          Created on {formatDate(course.createdAt)}
        </p>
      )}
    </div>
  );
}