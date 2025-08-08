import { api } from '@/lib/api'

export interface Course {
  id: number
  title: string
  description?: string
  short_description?: string
  slug?: string
  category_id?: number
  categoryName?: string
  instructor_id?: number
  instructorName?: string
  price?: number
  currency?: string
  level?: string
  duration_hours?: number
  status: 'draft' | 'published' | 'archived'
  is_active: boolean
  thumbnail_url?: string
  preview_video_url?: string
  requirements?: string
  what_you_will_learn?: string
  meta_description?: string
  tags?: string
  average_rating?: number
  enrollmentCount: number
  completionRate: number
  content_count: number
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  position: number
  duration_hours?: number
  chapters_count: number
  chapters: Chapter[]
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  module_id: string
  title: string
  description?: string
  position: number
  duration_minutes?: number
  video_url?: string
  content?: string
  learning_objectives: string[]
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface CourseStructure {
  course_id: string
  title: string
  description?: string
  status: 'draft' | 'published' | 'archived'
  is_active: boolean
  modules: Module[]
  total_duration: number
  total_chapters: number
  created_at: string
  updated_at: string
}

export interface CoursePricing {
  course_id: string
  access_model: 'one_time' | 'monthly_subscription' | 'full_curriculum'
  base_price: number
  base_currency: string
  discount_percentage: number
  discounted_price?: number
  subscription_price?: number
  trial_period_days?: number
  is_active: boolean
  enabled_access_models: string[]
  created_at: string
  updated_at: string
}

export interface CourseStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalActiveStudents: number
  averageCompletionRate: number
  topPerformingCourses: Course[]
}

export interface CoursesResponse {
  data: Course[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CreateModuleRequest {
  title: string
  description?: string
  duration_hours?: number
  position?: number
}

export interface UpdateModuleRequest {
  title?: string
  description?: string
  duration_hours?: number
  position?: number
}

export interface CreateChapterRequest {
  title: string
  description?: string
  duration_minutes?: number
  position?: number
}

export interface UpdateChapterRequest {
  title?: string
  description?: string
  duration_minutes?: number
  position?: number
}

export interface UpdatePricingRequest {
  access_model: 'one_time' | 'monthly_subscription' | 'full_curriculum'
  base_price?: number
  discount_percentage?: number
  subscription_price?: number
  trial_period_days?: number
  is_active: boolean
}

export interface ReorderItem {
  id: string
  position: number
  parent_id?: string
}

// Class Scheduling & Session Management Types
export interface ClassSession {
  id: string
  courseId: string
  contentId?: string
  tutorId: string
  tutorName?: string
  contentTitle?: string
  scheduledAt: string
  durationMins: number
  meetingUrl?: string
  isRecorded: boolean
  recordingUrl?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  studentsCount: number
  createdAt: string
  updatedAt: string
}

export interface TeachingPlan {
  id: string
  courseId: string
  contentId?: string
  instructorId: string
  instructorName?: string
  contentTitle?: string
  classType: string
  plannedDate: string
  durationMins: number
  learningObjectives?: string
  prerequisites?: string
  materialsNeeded?: string
  notes?: string
  priority: number
  isFlexible: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export interface SessionDetails {
  id: string
  courseId: string
  contentId?: string
  tutorId: string
  tutorName?: string
  contentTitle?: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  durationMins: number
  meetingUrl?: string
  isRecorded: boolean
  recordingUrl?: string
  status: string
  summary?: string
  homeworkAssigned?: string
  feedbackRating?: number
  feedbackComments?: string
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendances: AttendanceRecord[]
  createdAt: string
  updatedAt: string
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  studentId: string
  studentName?: string
  status: 'present' | 'absent' | 'late' | 'pending'
  joinedAt?: string
  leftAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ScheduleClassRequest {
  courseId: string
  contentId?: string
  tutorId: string
  scheduledAt: string
  durationMins: number
  meetingUrl?: string
  isRecorded?: boolean
  status?: string
  recurring?: boolean
  recurringType?: 'daily' | 'weekly' | 'monthly'
  recurringEndDate?: string
  sendNotifications?: boolean
}

export interface CreateTeachingPlanRequest {
  courseId: string
  contentId?: string
  instructorId: string
  classType: string
  plannedDate: string
  durationMins: number
  learningObjectives?: string
  prerequisites?: string
  materialsNeeded?: string
  notes?: string
  priority?: number
  isFlexible?: boolean
}

export interface StartSessionRequest {
  // No additional fields needed, session ID is in URL
}

export interface EndSessionRequest {
  summary?: string
  recordingUrl?: string
  homeworkAssigned?: string
}

export interface MarkAttendanceRequest {
  studentId: string
  status: 'present' | 'absent' | 'late'
  joinedAt?: string
  leftAt?: string
  notes?: string
}

export interface BulkAttendanceRequest {
  attendance: MarkAttendanceRequest[]
}

export interface BulkScheduleRequest {
  courseId: string
  tutorAssignments: {
    planId: string
    tutorId: string
    scheduledAt: string
    meetingUrl?: string
  }[]
  sendNotifications?: boolean
}

export const coursesService = {
  /**
   * Get courses with pagination and filtering
   */
  async getCourses(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    status?: string,
    category?: string,
    instructor?: string,
    contentType: string = 'course'
  ): Promise<CoursesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      content_type: contentType,
    })

    if (search) params.append('search', search)
    if (status) params.append('status', status)
    if (category) params.append('category', category)
    if (instructor) params.append('instructor', instructor)

    const response = await api.get<CoursesResponse>(
      `/v1/courses?${params.toString()}`
    )
    return response.data
  },

  /**
   * Get single course
   */
  async getCourse(id: number): Promise<{ data: Course }> {
    const response = await api.get<{ data: Course }>(`/v1/courses/${id}`)
    return response.data
  },

  /**
   * Create a new course
   */
  async createCourse(data: Partial<Course>): Promise<{ data: Course }> {
    const response = await api.post<{ data: Course }>('/v1/courses', data)
    return response.data
  },

  /**
   * Update a course
   */
  async updateCourse(
    id: number,
    data: Partial<Course>
  ): Promise<{ data: Course }> {
    const response = await api.put<{ data: Course }>(`/v1/courses/${id}`, data)
    return response.data
  },

  /**
   * Get course statistics
   */
  async getCourseStats(): Promise<{ data: CourseStats }> {
    const response = await api.get<{ data: CourseStats }>(
      '/v1/courses/statistics'
    )
    return response.data
  },

  /**
   * Get course structure for builder
   */
  async getCourseStructure(
    courseId: string
  ): Promise<{ data: CourseStructure }> {
    const response = await api.get<{ data: CourseStructure }>(
      `/v1/course-builder/${courseId}/structure`
    )
    return response.data
  },

  /**
   * Create module
   */
  async createModule(
    courseId: string,
    data: CreateModuleRequest
  ): Promise<{ data: Module }> {
    const response = await api.post<{ data: Module }>(
      `/v1/course-builder/${courseId}/modules`,
      data
    )
    return response.data
  },

  /**
   * Update module
   */
  async updateModule(
    courseId: string,
    moduleId: string,
    data: UpdateModuleRequest
  ): Promise<{ data: Module }> {
    const response = await api.put<{ data: Module }>(
      `/v1/course-builder/${courseId}/modules/${moduleId}`,
      data
    )
    return response.data
  },

  /**
   * Delete module
   */
  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    await api.delete(`/v1/course-builder/${courseId}/modules/${moduleId}`)
  },

  /**
   * Create chapter
   */
  async createChapter(
    courseId: string,
    moduleId: string,
    data: CreateChapterRequest
  ): Promise<{ data: Chapter }> {
    const response = await api.post<{ data: Chapter }>(
      `/v1/course-builder/${courseId}/modules/${moduleId}/chapters`,
      data
    )
    return response.data
  },

  /**
   * Update chapter
   */
  async updateChapter(
    courseId: string,
    moduleId: string,
    chapterId: string,
    data: UpdateChapterRequest
  ): Promise<{ data: Chapter }> {
    const response = await api.put<{ data: Chapter }>(
      `/v1/course-builder/${courseId}/modules/${moduleId}/chapters/${chapterId}`,
      data
    )
    return response.data
  },

  /**
   * Delete chapter
   */
  async deleteChapter(
    courseId: string,
    moduleId: string,
    chapterId: string
  ): Promise<void> {
    await api.delete(
      `/v1/course-builder/${courseId}/modules/${moduleId}/chapters/${chapterId}`
    )
  },

  /**
   * Create class
   */
  async createClass(
    courseId: string,
    moduleId: string,
    chapterId: string,
    data: {
      title: string
      description: string
      content_type: string
      duration_minutes: number
      is_preview: boolean
      is_required: boolean
      content_url?: string
    }
  ): Promise<{ data: any }> {
    const response = await api.post(
      `/v1/course-builder/${courseId}/modules/${moduleId}/chapters/${chapterId}/classes`,
      data
    )
    return response.data
  },

  /**
   * Update course structure
   */
  async updateCourseStructure(
    courseId: string,
    structure: any
  ): Promise<{ data: any }> {
    const response = await api.put(
      `/v1/course-builder/${courseId}/structure`,
      structure
    )
    return response.data
  },

  /**
   * Reorder content
   */
  async reorderContent(courseId: string, items: ReorderItem[]): Promise<void> {
    await api.post(`/v1/course-builder/${courseId}/reorder`, { items })
  },

  /**
   * Get course pricing
   */
  async getCoursePricing(courseId: string): Promise<{ data: CoursePricing }> {
    const response = await api.get<{ data: CoursePricing }>(
      `/v1/course-builder/${courseId}/pricing`
    )
    return response.data
  },

  /**
   * Update course pricing
   */
  async updateCoursePricing(
    courseId: string,
    data: UpdatePricingRequest
  ): Promise<{ data: CoursePricing }> {
    const response = await api.put<{ data: CoursePricing }>(
      `/v1/course-builder/${courseId}/pricing`,
      data
    )
    return response.data
  },

  /**
   * Get supported access models
   */
  async getSupportedAccessModels(): Promise<{ data: string[] }> {
    const response = await api.get<{ data: string[] }>(
      '/v1/course-builder/access-models'
    )
    return response.data
  },

  /**
   * Publish course
   */
  async publishCourse(courseId: string): Promise<{ data: Course }> {
    const response = await api.post<{ data: Course }>(
      `/v1/course-builder/${courseId}/publish`
    )
    return response.data
  },

  /**
   * Unpublish course
   */
  async unpublishCourse(courseId: string): Promise<{ data: Course }> {
    const response = await api.post<{ data: Course }>(
      `/v1/course-builder/${courseId}/unpublish`
    )
    return response.data
  },

  // ===============================
  // CLASS SCHEDULING & SESSION MANAGEMENT
  // ===============================

  /**
   * Get all classes for a course
   */
  async getCourseClasses(courseId: string): Promise<{ data: ClassSession[] }> {
    const response = await api.get<{ data: ClassSession[] }>(
      `/v1/courses/${courseId}/classes`
    )
    return response.data
  },

  /**
   * Get classes for specific content
   */
  async getContentClasses(
    courseId: string,
    contentId: string
  ): Promise<{ data: ClassSession[] }> {
    const response = await api.get<{ data: ClassSession[] }>(
      `/v1/courses/${courseId}/content/${contentId}/classes`
    )
    return response.data
  },

  /**
   * Schedule a new class
   */
  async scheduleClass(
    courseId: string,
    data: ScheduleClassRequest,
    contentId?: string
  ): Promise<{ data: ClassSession }> {
    const url = contentId
      ? `/v1/courses/${courseId}/content/${contentId}/classes`
      : `/v1/courses/${courseId}/classes`
    const response = await api.post<{ data: ClassSession }>(url, data)
    return response.data
  },

  /**
   * Update scheduled class
   */
  async updateSchedule(
    courseId: string,
    sessionId: string,
    data: Partial<ScheduleClassRequest>,
    contentId?: string
  ): Promise<{ data: ClassSession }> {
    const url = contentId
      ? `/v1/courses/${courseId}/content/${contentId}/classes/${sessionId}`
      : `/v1/courses/${courseId}/classes/${sessionId}`
    const response = await api.put<{ data: ClassSession }>(url, data)
    return response.data
  },

  /**
   * Cancel a scheduled class
   */
  async cancelClass(
    courseId: string,
    sessionId: string,
    contentId?: string
  ): Promise<void> {
    const url = contentId
      ? `/v1/courses/${courseId}/content/${contentId}/classes/${sessionId}`
      : `/v1/courses/${courseId}/classes/${sessionId}`
    await api.delete(url)
  },

  /**
   * Get class planner (teaching plans)
   */
  async getClassPlanner(courseId: string): Promise<{ data: TeachingPlan[] }> {
    const response = await api.get<{ data: TeachingPlan[] }>(
      `/v1/courses/${courseId}/classes/planner`
    )
    return response.data
  },

  /**
   * Create teaching plan
   */
  async createTeachingPlan(
    courseId: string,
    data: CreateTeachingPlanRequest
  ): Promise<{ data: TeachingPlan }> {
    const response = await api.post<{ data: TeachingPlan }>(
      `/v1/courses/${courseId}/classes/planner`,
      data
    )
    return response.data
  },

  /**
   * Update teaching plan
   */
  async updateTeachingPlan(
    courseId: string,
    planId: string,
    data: Partial<CreateTeachingPlanRequest>
  ): Promise<{ data: TeachingPlan }> {
    const response = await api.put<{ data: TeachingPlan }>(
      `/v1/courses/${courseId}/classes/planner/${planId}`,
      data
    )
    return response.data
  },

  /**
   * Delete teaching plan
   */
  async deleteTeachingPlan(courseId: string, planId: string): Promise<void> {
    await api.delete(`/v1/courses/${courseId}/classes/planner/${planId}`)
  },

  /**
   * Bulk schedule classes from teaching plans
   */
  async bulkScheduleClasses(
    courseId: string,
    data: BulkScheduleRequest
  ): Promise<{ data: ClassSession[] }> {
    const response = await api.post<{ data: ClassSession[] }>(
      `/v1/courses/${courseId}/classes/bulk-schedule`,
      data
    )
    return response.data
  },

  // ===============================
  // SESSION MANAGEMENT
  // ===============================

  /**
   * Get session details
   */
  async getSession(
    courseId: string,
    sessionId: string
  ): Promise<{ data: SessionDetails }> {
    const response = await api.get<{ data: SessionDetails }>(
      `/v1/courses/${courseId}/sessions/${sessionId}`
    )
    return response.data
  },

  /**
   * Start a session
   */
  async startSession(
    courseId: string,
    sessionId: string
  ): Promise<{ data: SessionDetails }> {
    const response = await api.post<{ data: SessionDetails }>(
      `/v1/courses/${courseId}/sessions/${sessionId}/start`
    )
    return response.data
  },

  /**
   * End a session
   */
  async endSession(
    courseId: string,
    sessionId: string,
    data: EndSessionRequest
  ): Promise<{ data: SessionDetails }> {
    const response = await api.post<{ data: SessionDetails }>(
      `/v1/courses/${courseId}/sessions/${sessionId}/end`,
      data
    )
    return response.data
  },

  /**
   * Update session
   */
  async updateSession(
    courseId: string,
    sessionId: string,
    data: Partial<SessionDetails>
  ): Promise<{ data: SessionDetails }> {
    const response = await api.put<{ data: SessionDetails }>(
      `/v1/courses/${courseId}/sessions/${sessionId}`,
      data
    )
    return response.data
  },

  /**
   * Mark attendance
   */
  async markAttendance(
    courseId: string,
    sessionId: string,
    data: MarkAttendanceRequest
  ): Promise<{ data: AttendanceRecord }> {
    const response = await api.post<{ data: AttendanceRecord }>(
      `/v1/courses/${courseId}/sessions/${sessionId}/attendance`,
      data
    )
    return response.data
  },

  /**
   * Bulk mark attendance
   */
  async bulkMarkAttendance(
    courseId: string,
    sessionId: string,
    data: BulkAttendanceRequest
  ): Promise<{ data: AttendanceRecord[] }> {
    const response = await api.post<{ data: AttendanceRecord[] }>(
      `/v1/courses/${courseId}/sessions/${sessionId}/bulk-attendance`,
      data
    )
    return response.data
  },

  /**
   * Get session attendance
   */
  async getSessionAttendance(
    courseId: string,
    sessionId: string
  ): Promise<{ data: AttendanceRecord[] }> {
    const response = await api.get<{ data: AttendanceRecord[] }>(
      `/v1/courses/${courseId}/sessions/${sessionId}/attendance`
    )
    return response.data
  },
}
