import { CourseBuilder } from '@/features/courses/builder/CourseBuilder';
import { Route } from './edit';

export default function EditCoursePage() {
  const { courseId } = Route.useParams();
  return <CourseBuilder courseId={courseId} />;
}