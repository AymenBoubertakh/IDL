import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function CourseForm({ course, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: course || {
      name: '',
      instructor: '',
      category: '',
      schedule: '',
    },
  });

  useEffect(() => {
    if (course) {
      reset(course);
    }
  }, [course, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Course Name"
        {...register('name', { required: 'Course name is required' })}
        error={errors.name?.message}
        placeholder="e.g., Data Structures"
      />

      <Input
        label="Instructor"
        {...register('instructor', { required: 'Instructor name is required' })}
        error={errors.instructor?.message}
        placeholder="e.g., Dr. Smith"
      />

      <Input
        label="Category"
        {...register('category', { required: 'Category is required' })}
        error={errors.category?.message}
        placeholder="e.g., Computer Science"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Schedule
        </label>
        <textarea
          {...register('schedule', { required: 'Schedule is required' })}
          className="input-field resize-none"
          rows={3}
          placeholder="e.g., Monday & Wednesday, 10:00 AM - 12:00 PM"
        />
        {errors.schedule && (
          <p className="mt-1 text-sm text-red-600">{errors.schedule.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {course ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}