import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';
import StudentCard from '../components/students/StudentCard';
import StudentModal from '../components/students/StudentModal';
import StudentCoursesModal from '../components/students/StudentCoursesModal';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminOnly from '../components/common/AdminOnly';
import toast from 'react-hot-toast';

export default function Students() {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [coursesModalStudent, setCoursesModalStudent] = useState(null);

  useEffect(() => {
    fetchData();
    // Check if there's a university filter in URL params
    const universityId = searchParams.get('university');
    if (universityId) {
      setFilterUniversity(universityId);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, searchQuery, filterUniversity, sortBy]);

  const fetchData = async () => {
    try {
      const [studentsData, universitiesData, enrollmentsData] = await Promise.all([
        studentService.getAllStudents(),
        studentService.getAllUniversities(),
        courseService.getAllEnrollments(),
      ]);
      setStudents(studentsData);
      setUniversities(universitiesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let result = [...students];

    // Search filter
    if (searchQuery) {
      result = result.filter((student) =>
        `${student.firstName} ${student.lastName} ${student.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // University filter
    if (filterUniversity) {
      result = result.filter(
        (student) => student.university?.id === parseInt(filterUniversity)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      } else if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      }
      return 0;
    });

    setFilteredStudents(result);
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      return;
    }

    try {
      await studentService.deleteStudent(student.id);
      toast.success('Student deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, data);
        toast.success('Student updated successfully');
      } else {
        await studentService.createStudent(data);
        toast.success('Student created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(selectedStudent ? 'Failed to update student' : 'Failed to create student');
    }
  };

  const handleViewCourses = (student) => {
    setCoursesModalStudent(student);
    setIsCoursesModalOpen(true);
  };

  const getEnrollmentCount = (studentId) => {
    return enrollments.filter((e) => e.student_id === studentId).length;
  };

  if (loading) {
    return <LoadingSpinner text="Loading students..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
          </p>
        </div>
        <AdminOnly>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Student
          </Button>
        </AdminOnly>
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
              value={filterUniversity}
              onChange={(e) => setFilterUniversity(e.target.value)}
              className="input-field"
            >
              <option value="">All Universities</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
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
              <option value="email">Sort by Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              enrollmentCount={getEnrollmentCount(student.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewCourses={handleViewCourses}
            />
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        universities={universities}
        onSubmit={handleSubmit}
      />

      {/* Courses Modal */}
      <StudentCoursesModal
        isOpen={isCoursesModalOpen}
        onClose={() => setIsCoursesModalOpen(false)}
        student={coursesModalStudent}
        onEnrollmentChange={fetchData}
      />
    </div>
  );
}