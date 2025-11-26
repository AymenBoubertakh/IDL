import { useEffect, useState } from 'react';
import { Users, BookOpen, Building2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import Button from '../components/common/Button';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const [students, courses, universities, enrollments] = await Promise.all([
        studentService.getAllStudents(),
        courseService.getAllCourses(),
        studentService.getAllUniversities(),
        courseService.getAllEnrollments(),
      ]);

      console.log('RAW Students response:', JSON.stringify(students));
      console.log('RAW Courses response:', JSON.stringify(courses));
      console.log('RAW Universities response:', JSON.stringify(universities));
      console.log('RAW Enrollments response:', JSON.stringify(enrollments));

      setStats({
        totalStudents: Array.isArray(students) ? students.length : 0,
        totalCourses: Array.isArray(courses) ? courses.length : 0,
        totalUniversities: Array.isArray(universities) ? universities.length : 0,
        totalEnrollments: Array.isArray(enrollments) ? enrollments.length : 0,
      });

      // Generate recent activities from enrollments
      const activities = Array.isArray(enrollments) 
        ? enrollments.slice(0, 5).map((enrollment) => ({
            type: 'enrollment',
            title: 'New Enrollment',
            description: `Student enrolled in a course`,
            timestamp: enrollment.enrolled_at || new Date().toISOString(),
          }))
        : [];

      setRecentActivities(activities);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
      setStats({
        totalStudents: 0,
        totalCourses: 0,
        totalUniversities: 0,
        totalEnrollments: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your campus management system</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="blue"
          trend="Active students"
        />
        <StatsCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          color="green"
          trend="Available courses"
        />
        <StatsCard
          title="Universities"
          value={stats?.totalUniversities || 0}
          icon={Building2}
          color="purple"
          trend="Partner institutions"
        />
        <StatsCard
          title="Enrollments"
          value={stats?.totalEnrollments || 0}
          icon={TrendingUp}
          color="orange"
          trend="Total enrollments"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate(ROUTES.STUDENTS)}
            className="flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Manage Students
          </Button>
          <Button
            onClick={() => navigate(ROUTES.COURSES)}
            className="flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Manage Courses
          </Button>
          <Button
            onClick={() => navigate(ROUTES.RELATIONS)}
            className="flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            View Relations
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  );
}