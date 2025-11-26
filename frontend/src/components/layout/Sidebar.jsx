import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Bot, 
  Network,
  Building2,
  School 
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Students', to: ROUTES.STUDENTS, icon: Users },
  { name: 'Courses', to: ROUTES.COURSES, icon: BookOpen },
  { name: 'Universities', to: ROUTES.UNIVERSITIES, icon: School },
  { name: 'Relations', to: ROUTES.RELATIONS, icon: Network, adminOnly: true },
  { name: 'AI Chatbot', to: ROUTES.CHATBOT, icon: Bot },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
        <Building2 className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-lg font-bold text-gray-900">Campus</h1>
          <p className="text-xs text-gray-500">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation
          .filter(item => !item.adminOnly || isAdmin())
          .map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Campus Management v1.0</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}