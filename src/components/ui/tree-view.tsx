import React from 'react'
import { cn } from '@/lib/utils'

interface TreeViewProps {
  children: React.ReactNode
  className?: string
}

export function TreeView({ children, className }: TreeViewProps) {
  return <div className={cn('space-y-1', className)}>{children}</div>
}

interface TreeViewItemProps {
  children: React.ReactNode
  className?: string
}

export function TreeViewItem({ children, className }: TreeViewItemProps) {
  return <div className={cn('', className)}>{children}</div>
}
