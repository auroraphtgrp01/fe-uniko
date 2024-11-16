export default function InfoItem({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType
  label: string | undefined
  value: string | undefined
}) {
  return (
    <div className='flex items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-accent'>
      <Icon className='h-5 w-5 text-muted-foreground' />
      <div className='space-y-1'>
        <p className='text-sm font-medium leading-none'>{label}</p>
        <p className='text-xs text-muted-foreground'>{value || 'Unknown'}</p>
      </div>
    </div>
  )
}
