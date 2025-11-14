import { Clock, UserPlus, BookPlus, Users } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

export default function RecentActivity({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'student_added':
        return UserPlus;
      case 'course_added':
        return BookPlus;
      case 'enrollment':
        return Users;
      default:
        return Clock;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'student_added':
        return 'text-blue-600 bg-blue-50';
      case 'course_added':
        return 'text-green-600 bg-green-50';
      case 'enrollment':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}