import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonTableRowProps {
  columns: number
  className?: string
}

export function SkeletonTableRow({ columns, className }: SkeletonTableRowProps) {
  return (
    <TableRow className={className}>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )
}

interface SkeletonTableRowsProps {
  columns: number
  rows?: number
  className?: string
}

export function SkeletonTableRows({ columns, rows = 5, className }: SkeletonTableRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonTableRow 
          key={`skeleton-${index}`} 
          columns={columns} 
          className={className}
        />
      ))}
    </>
  )
}
