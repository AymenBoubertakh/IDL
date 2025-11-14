import Modal from '../common/Modal';
import UniversityForm from './UniversityForm';

export default function UniversityModal({ isOpen, onClose, university, onSubmit }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={university ? 'Edit University' : 'Create New University'}
      size="md"
    >
      <UniversityForm
        university={university}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
