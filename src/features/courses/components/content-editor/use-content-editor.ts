import { useContext } from 'react'
import { ContentEditorContext } from './content-editor-context'

// Hook to use the context
export function useContentEditor() {
  const context = useContext(ContentEditorContext)
  if (context === undefined) {
    throw new Error(
      'useContentEditor must be used within a ContentEditorProvider'
    )
  }
  return context
}
