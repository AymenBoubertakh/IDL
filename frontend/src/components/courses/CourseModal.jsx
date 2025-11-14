import Modal from '../common/Modal';
import CourseForm from './CourseForm';

export default function CourseModal({ isOpen, onClose, course, onSubmit }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? 'Edit Course' : 'Add New Course'}
      size="lg"
    >
      <CourseForm
        course={course}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}