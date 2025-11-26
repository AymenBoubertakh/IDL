import { MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import AdminOnly from '../common/AdminOnly';

export default function UniversityCard({ university, studentCount, onEdit, onDelete, onViewStudents }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* University Icon/Avatar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {university.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {university.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin size={14} />
              <span>{university.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Count */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <Users size={18} />
            <span className="font-medium">Enrolled Students</span>
          </div>
          <span className="text-2xl font-bold text-blue-700">{studentCount}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewStudents(university)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Users size={16} />
          View Students
        </button>
        <AdminOnly>
          <button
            onClick={() => onEdit(university)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Edit University"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(university)}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title="Delete University"
          >
            <Trash2 size={16} />
          </button>
        </AdminOnly>
      </div>
    </div>
  );
}
