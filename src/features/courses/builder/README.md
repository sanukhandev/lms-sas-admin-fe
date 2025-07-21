# CourseBuilder

A multi-step, tabbed interface for creating and editing courses in the admin panel. Guides instructors/admins through all required steps to publish a course.

## Workflow & Tabs
1. **Basic Details:**
   - Enter course title, description, thumbnail, and category.
   - Save as draft (creates course in backend).
2. **Structure:**
   - Add, remove, and reorder modules and chapters (drag & drop).
   - Save structure to backend.
3. **Scheduling:**
   - Assign planned release dates to modules/chapters.
   - Dates are validated (no overlaps, no past dates).
   - Save schedule to backend.
4. **Pricing:**
   - Select pricing model (one-time, subscription, full-term).
   - Enter price (base currency, with conversion preview).
   - Save pricing to backend.
5. **Publish:**
   - Auto-checks for required fields, structure, pricing, and schedule.
   - Publish course (status updated in backend).

## Backend Integration
- **APIs Used:**
  - `POST /api/v1/courses` — Create draft
  - `PUT /api/v1/courses/{id}` — Update details/pricing
  - `GET/PUT /api/v1/courses/{id}/structure` — Manage modules/chapters
  - `GET/PUT /api/v1/courses/{id}/schedule` — Manage scheduling
  - `POST /api/v1/courses/{id}/publish` — Publish course

## Extensibility
- Add new tabs for additional metadata (e.g., prerequisites, outcomes).
- Integrate with analytics or reporting modules.
- Customize validation and UI per tenant.

## Usage
- Used in `/courses/:id/edit` and "Create Course" flows.
- See `CourseBuilder.tsx` for implementation details. 