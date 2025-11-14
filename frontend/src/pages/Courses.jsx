import { useEffect, useState } from 'react';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { courseService } from '../services/courseService';
import CourseCard from '../components/courses/CourseCard';
import CourseModal from '../components/courses/CourseModal';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAndSortCourses();
  }, [courses, searchQuery, filterCategory, sortBy]);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCourses = () => {
    let result = [...courses];

    // Search filter
    if (searchQuery) {
      result = result.filter((course) =>
        `${course.name} ${course.instructor} ${course.category}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      result = result.filter((course) => course.category === filterCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'instructor') {
        return a.instructor.localeCompare(b.instructor);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    setFilteredCourses(result);
  };

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
      return;
    }

    try {
      await courseService.deleteCourse(course.id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCourse) {
        await courseService.updateCourse(selectedCourse.id, data);
        toast.success('Course updated successfully');
      } else {
        await courseService.createCourse(data);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error(selectedCourse ? 'Failed to update course' : 'Failed to create course');
    }
  };

  const handleViewStudents = (course) => {
    toast(`Viewing students for ${course.name} - Feature coming soon!`, {
      icon: 'ℹ️',
      duration: 3000,
    });
  };

  // Get unique categories for filter
  const categories = [...new Set(courses.map((c) => c.category))];

  if (loading) {
    return <LoadingSpinner text="Loading courses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            placeholder="Search courses..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="name">Sort by Name</option>
              <option value="instructor">Sort by Instructor</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewStudents={handleViewStudents}
            />
          ))
        ) : (
          <div className="col-span-2 card text-center py-12">
            <p className="text-gray-500">No courses found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSubmit={handleSubmit}
      />
    </div>
  );
}