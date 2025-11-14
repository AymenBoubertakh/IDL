import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function UniversityForm({ university, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: university || {
      name: '',
      location: '',
    },
  });

  useEffect(() => {
    if (university) {
      reset(university);
    }
  }, [university, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="University Name"
        {...register('name', { 
          required: 'University name is required',
          minLength: {
            value: 3,
            message: 'University name must be at least 3 characters',
          },
        })}
        error={errors.name?.message}
        placeholder="Enter university name"
      />

      <Input
        label="Location"
        {...register('location', { 
          required: 'Location is required',
          minLength: {
            value: 2,
            message: 'Location must be at least 2 characters',
          },
        })}
        error={errors.location?.message}
        placeholder="Enter location (e.g., Constantine, Algiers)"
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {university ? 'Update University' : 'Create University'}
        </Button>
      </div>
    </form>
  );
}
