# Tree-Based Course Builder

This implementation uses a tree structure for courses, modules, and chapters, allowing for more flexible content organization without strict module/chapter dependencies.

## Components

### TreeCourseBuilder
The main component that orchestrates the course building process. It includes tabs for:
- Course Details
- Course Structure
- Course Pricing
- Publishing

### CourseBuilderContext
A context provider that manages the state and API interactions for the course builder.

## Key Features

### Flexible Tree Structure
- Courses, modules, and chapters are all stored in the same database table
- Parent-child relationships create the hierarchy
- Content can be easily reordered through drag and drop

### Improved Content Management
- Add, edit, and delete modules and chapters
- Reorder content with drag and drop
- Set learning objectives for chapters
- Add video URLs and content for chapters

### Enhanced Pricing Options
- One-time purchase
- Monthly subscription
- Full curriculum access
- Discount management
- International pricing with currency conversion

### Publishing Workflow
- Clear requirements checklist
- Course summary
- Publishing guidelines

## API Endpoints

The component interacts with these API endpoints:

- `GET/POST/PUT /api/v1/courses` - Course CRUD operations
- `GET/PUT /api/v1/courses/{id}/structure` - Get/update course structure
- `GET/PUT /api/v1/courses/{id}/pricing` - Get/update pricing
- `POST /api/v1/courses/{id}/modules` - Create module
- `PUT/DELETE /api/v1/modules/{id}` - Update/delete module
- `POST /api/v1/courses/{id}/modules/{moduleId}/chapters` - Create chapter
- `PUT/DELETE /api/v1/chapters/{id}` - Update/delete chapter
- `POST /api/v1/courses/{id}/reorder` - Reorder content
- `POST /api/v1/courses/{id}/publish` - Publish course

## Usage

```tsx
// In a route or page component
import { TreeCourseBuilder } from '@/features/course-builder-new';

export default function CourseBuilderPage() {
  // For creating a new course
  return <TreeCourseBuilder />;
  
  // For editing an existing course
  // return <TreeCourseBuilder courseId="123" />;
}
```

## Data Types

### Course Content
```ts
interface CourseContent {
  id: string;
  title: string;
  description?: string;
  position: number;
  content_type: 'course' | 'module' | 'chapter' | 'lesson';
  parent_id?: string;
  content?: string;
  video_url?: string;
  learning_objectives?: string[];
  duration_minutes?: number;
  duration_hours?: number;
  children?: CourseContent[];
}
```

### Course Structure
```ts
interface CourseStructure {
  course_id: string;
  title: string;
  description: string;
  status: string;
  is_active: boolean;
  modules: CourseContent[];
  total_duration: number;
  total_chapters: number;
  created_at: string;
  updated_at: string;
}
```

### Pricing Info
```ts
interface PricingInfo {
  course_id: string;
  access_model: string;
  base_price: number;
  base_currency: string;
  discount_percentage: number;
  discounted_price: number | null;
  subscription_price: number | null;
  trial_period_days: number | null;
  is_active: boolean;
  enabled_access_models: string[];
}
```
