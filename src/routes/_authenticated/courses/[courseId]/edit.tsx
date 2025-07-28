import { CourseBuilder } from '@/features/courses/builder/CourseBuilder';
import { useParams } from 'react-router-dom';

export default function EditCoursePage() {
  const { courseId } = useParams();
  return <CourseBuilder courseId={courseId} />;
}