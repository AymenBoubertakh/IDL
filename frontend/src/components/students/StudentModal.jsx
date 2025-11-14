import Modal from '../common/Modal';
import StudentForm from './StudentForm';

export default function StudentModal({ 
  isOpen, 
  onClose, 
  student, 
  universities, 
  onSubmit 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <StudentForm
        student={student}
        universities={universities}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}