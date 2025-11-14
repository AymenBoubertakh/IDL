import { useEffect, useState } from 'react';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { studentService } from '../services/studentService';
import UniversityCard from '../components/universities/UniversityCard';
import UniversityModal from '../components/universities/UniversityModal';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortUniversities();
  }, [universities, searchQuery, filterLocation, sortBy]);

  const fetchData = async () => {
    try {
      const [universitiesData, studentsData] = await Promise.all([
        studentService.getAllUniversities(),
        studentService.getAllStudents(),
      ]);
      setUniversities(universitiesData);
      setStudents(studentsData);
    } catch (error) {
      toast.error('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUniversities = () => {
    let result = [...universities];

    // Search filter
    if (searchQuery) {
      result = result.filter((university) =>
        `${university.name} ${university.location}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (filterLocation) {
      result = result.filter(
        (university) => university.location.toLowerCase() === filterLocation.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'location') {
        return a.location.localeCompare(b.location);
      } else if (sortBy === 'students') {
        const aCount = getStudentCount(a.id);
        const bCount = getStudentCount(b.id);
        return bCount - aCount;
      }
      return 0;
    });

    setFilteredUniversities(result);
  };

  const getStudentCount = (universityId) => {
    return students.filter((s) => s.university?.id === universityId).length;
  };

  const handleCreate = () => {
    setSelectedUniversity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (university) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const handleDelete = async (university) => {
    const studentCount = getStudentCount(university.id);
    
    if (studentCount > 0) {
      toast.error(`Cannot delete ${university.name}. It has ${studentCount} enrolled student(s).`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${university.name}?`)) {
      return;
    }

    try {
      await studentService.deleteUniversity(university.id);
      toast.success('University deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete university');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedUniversity) {
        await studentService.updateUniversity(selectedUniversity.id, data);
        toast.success('University updated successfully');
      } else {
        await studentService.createUniversity(data);
        toast.success('University created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(selectedUniversity ? 'Failed to update university' : 'Failed to create university');
    }
  };

  const handleViewStudents = (university) => {
    // Navigate to students page with filter
    window.location.href = `/students?university=${university.id}`;
  };

  // Get unique locations for filter
  const locations = [...new Set(universities.map((u) => u.location))];

  if (loading) {
    return <LoadingSpinner text="Loading universities..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Universities Management</h1>
          <p className="text-gray-600 mt-1">{universities.length} universities</p>
        </div>
        <Button
          onClick={handleCreate}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add University
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </div>

        <div className="flex gap-3">
          {/* Location Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="location">Sort by Location</option>
              <option value="students">Sort by Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      {filteredUniversities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {searchQuery || filterLocation
              ? 'No universities found matching your criteria'
              : 'No universities yet. Create your first university!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              studentCount={getStudentCount(university.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewStudents={handleViewStudents}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <UniversityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        university={selectedUniversity}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
