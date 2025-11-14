import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function StudentForm({ student, universities, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: student || {
      firstName: '',
      lastName: '',
      email: '',
      university: { id: '' },
    },
  });

  useEffect(() => {
    if (student) {
      reset(student);
    }
  }, [student, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      university: {
        id: parseInt(data.university.id),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register('firstName', { required: 'First name is required' })}
          error={errors.firstName?.message}
          placeholder="Enter first name"
        />
        <Input
          label="Last Name"
          {...register('lastName', { required: 'Last name is required' })}
          error={errors.lastName?.message}
          placeholder="Enter last name"
        />
      </div>

      <Input
        label="Email"
        type="email"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.email?.message}
        placeholder="student@university.edu"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          University
        </label>
        <select
          {...register('university.id', { required: 'University is required' })}
          className="input-field"
        >
          <option value="">Select a university</option>
          {universities?.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.name} - {uni.location}
            </option>
          ))}
        </select>
        {errors.university?.id && (
          <p className="mt-1 text-sm text-red-600">{errors.university.id.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {student ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
}