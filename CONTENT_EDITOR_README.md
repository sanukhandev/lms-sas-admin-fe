# Course Content Editor - Frontend Implementation

## Overview

The Course Content Editor is a comprehensive content management system for courses that allows instructors to create, organize, and manage various types of educational content including modules, chapters, lessons, videos, documents, quizzes, assignments, text content, and live sessions.

## Architecture

The frontend implementation follows a modular architecture with:

- **React Context Pattern**: Centralized state management for content editor operations
- **TypeScript**: Full type safety with comprehensive interfaces and types
- **Service Layer**: Clean separation between UI and API communication
- **Component-based Design**: Reusable and maintainable components

## File Structure

```
src/features/courses/components/content-editor/
├── index.tsx                    # Main layout component and exports
├── content-editor.tsx           # Content tree view and management
├── content-detail-panel.tsx     # Content editing interface
├── content-editor-context.tsx   # React context for state management
├── use-content-editor.ts        # React hook for consuming context
├── services/
│   └── content-editor.ts        # API service layer
└── types/
    └── content-editor.ts        # TypeScript type definitions
```

## Components

### ContentEditorLayout

The main layout component that provides the overall structure:
- Left panel: Content tree with search and filtering
- Right panel: Content detail editor

```tsx
<ContentEditorLayout courseId="123" />
```

### ContentEditor

The content tree management interface featuring:
- Hierarchical content tree display
- Search and filter functionality
- Drag-and-drop support (planned)
- Content statistics dashboard
- Quick content creation dialog

### ContentDetailPanel

The content editing interface providing:
- Form-based content editing
- File upload support
- Publishing workflow controls
- Content metadata display
- Save, duplicate, and delete operations

## State Management

The content editor uses React Context with useReducer for state management:

```typescript
interface ContentEditorState {
  contents: CourseContent[]
  selectedContent?: CourseContent
  isLoading: boolean
  error?: string
  filters: ContentEditorFilters
  expandedNodes: Set<number>
  draggedItem?: DragItem
  statistics?: ContentStatistics
}
```

## API Integration

The service layer provides methods for all content operations:

- `getContent(courseId, filters)` - Fetch course content
- `createContent(courseId, data)` - Create new content
- `updateContent(courseId, contentId, data)` - Update existing content
- `deleteContent(courseId, contentId)` - Delete content
- `duplicateContent(courseId, contentId)` - Duplicate content
- `reorderContent(courseId, items)` - Reorder content items
- `publishContent(courseId, contentId, status)` - Change publish status
- `uploadFile(courseId, file)` - Upload files
- `getStatistics(courseId)` - Get content statistics

## Content Types

The system supports 9 different content types:

1. **Module** - High-level course sections
2. **Chapter** - Content groupings within modules
3. **Lesson** - Individual learning units
4. **Video** - Video-based content
5. **Document** - File attachments and downloads
6. **Quiz** - Assessment content
7. **Assignment** - Project-based learning
8. **Text** - Rich text content
9. **Live Session** - Scheduled live events

## Features

### Content Tree
- Hierarchical display of all course content
- Expandable/collapsible nodes
- Visual indicators for content type and status
- Search functionality across titles and descriptions
- Filter by content type
- Drag handles for reordering (UI ready)

### Content Management
- Create new content with type selection
- Edit content details in-place
- Rich content editor for text content
- Video URL management
- File upload and attachment
- Publishing workflow (draft → published → archived)
- Content duplication
- Bulk operations support

### Statistics Dashboard
- Total content count
- Published vs draft content
- Content duration tracking
- Content type distribution

### Content Editor Form
- Basic information (title, description, type)
- Content body with rich text support
- Video URL for video content
- File attachment management
- Publishing settings
- Access controls (required/free content)
- Duration estimation

## Usage Examples

### Basic Usage

```tsx
import { ContentEditorLayout } from '@/features/courses/components/content-editor'

function CoursePage({ courseId }: { courseId: string }) {
  return (
    <div className="h-screen">
      <ContentEditorLayout courseId={courseId} />
    </div>
  )
}
```

### Using Individual Components

```tsx
import { 
  ContentEditorProvider, 
  ContentEditor, 
  ContentDetailPanel 
} from '@/features/courses/components/content-editor'

function CustomLayout({ courseId }: { courseId: string }) {
  return (
    <ContentEditorProvider>
      <div className="grid grid-cols-2 gap-4">
        <ContentEditor courseId={courseId} />
        <ContentDetailPanel courseId={courseId} />
      </div>
    </ContentEditorProvider>
  )
}
```

## Integration with Backend

The frontend expects the following backend API structure:

### API Endpoints
- `GET /api/courses/{id}/contents` - List content
- `POST /api/courses/{id}/contents` - Create content
- `PUT /api/courses/{id}/contents/{contentId}` - Update content
- `DELETE /api/courses/{id}/contents/{contentId}` - Delete content
- `POST /api/courses/{id}/contents/{contentId}/duplicate` - Duplicate content
- `PUT /api/courses/{id}/contents/reorder` - Reorder content
- `PUT /api/courses/{id}/contents/{contentId}/publish` - Publish content
- `POST /api/courses/{id}/contents/upload` - Upload files
- `GET /api/courses/{id}/contents/statistics` - Get statistics

### Data Models

The frontend expects content objects with this structure:

```typescript
interface CourseContent {
  id: number
  course_id: number
  parent_id?: number
  type: ContentEditorType
  title: string
  description?: string
  content?: string
  content_data?: Record<string, any>
  video_url?: string
  file_path?: string
  file_url?: string
  file_type?: string
  file_size?: number
  learning_objectives?: string[]
  status: 'draft' | 'published' | 'archived'
  is_required: boolean
  is_free: boolean
  position: number
  duration_mins?: number
  estimated_duration?: number
  published_at?: string
  created_at: string
  updated_at: string
  children?: CourseContent[]
}
```

## Future Enhancements

### Planned Features
1. **Drag and Drop Reordering** - Visual drag-and-drop for content organization
2. **Rich Text Editor** - WYSIWYG editor for text content
3. **File Manager** - Advanced file management with preview
4. **Content Templates** - Pre-built content templates
5. **Bulk Operations** - Multi-select and bulk actions
6. **Content Versioning** - Track content changes over time
7. **Content Analytics** - Usage and engagement metrics
8. **Content Import/Export** - Bulk content management
9. **Advanced Search** - Full-text search across content
10. **Content Tagging** - Organizational tags and labels

### Technical Improvements
- Performance optimization for large content trees
- Virtual scrolling for better performance
- Offline support with local storage
- Real-time collaboration features
- Enhanced accessibility support
- Mobile-responsive design improvements

## Dependencies

### Required UI Components
- Card, CardContent, CardHeader, CardTitle
- Button, Input, Textarea, Label
- Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- Badge, Switch, Separator
- Dialog, DropdownMenu, AlertDialog
- Toast notifications (via sonner)

### Required Icons
- Lucide React icons for content types and actions

### Third-party Libraries
- React 18+
- TypeScript 4.5+
- sonner (for toast notifications)

## Error Handling

The system includes comprehensive error handling:
- Network error recovery
- Form validation
- User-friendly error messages
- Toast notifications for operations
- Context-level error state management

## Performance Considerations

- Lazy loading of content trees
- Debounced search functionality
- Optimistic UI updates
- Efficient re-rendering with React.memo
- Context state optimization

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management
- Color contrast compliance
- Semantic HTML structure

## Testing Strategy

### Unit Tests
- Component rendering tests
- Context state management tests
- Service layer API tests
- Type validation tests

### Integration Tests
- User workflow tests
- API integration tests
- Error handling tests
- Performance tests

### E2E Tests
- Complete content creation workflows
- Content management operations
- Publishing workflows
- File upload functionality

This comprehensive content editor provides a solid foundation for course content management and can be extended to meet specific educational platform requirements.
