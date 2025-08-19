import React from 'react'
import { ContentDetailPanel } from './content-detail-panel'
import { ContentEditor } from './content-editor'
import { ContentEditorProvider } from './content-editor-context'

interface ContentEditorLayoutProps {
  courseId: string
}

export function ContentEditorLayout({ courseId }: ContentEditorLayoutProps) {
  return (
    <ContentEditorProvider>
      <div className='flex h-[calc(100vh-200px)] gap-6'>
        {/* Left Panel - Content Tree */}
        <div className='min-w-0 flex-1'>
          <ContentEditor courseId={courseId} />
        </div>

        {/* Right Panel - Content Detail */}
        <div className='w-96 flex-shrink-0'>
          <ContentDetailPanel courseId={courseId} />
        </div>
      </div>
    </ContentEditorProvider>
  )
}

export { ContentEditor, ContentDetailPanel, ContentEditorProvider }
