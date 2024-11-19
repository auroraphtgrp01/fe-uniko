import { Separator } from '@/components/ui/separator'
import AvatarSelector from './AvatarSelector'
import InfoItem from './InfoItems'
import { formatDateToInput } from '@/libraries/utils'
import { IUser } from '@/types/user.i'
import { Briefcase, Calendar, Mail, MapPin, Phone, User2 } from 'lucide-react'
import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'

interface IUserProfileProps {
  handleUpdateUser?: (formData: {
    fullName?: string
    dateOfBirth?: Date
    gender?: string
    workplace?: string
    phone_number?: string
    address?: string
    avatarId?: string
  }) => void
  user: IUser
}

export default function UserProfile({ handleUpdateUser, user }: IUserProfileProps) {
  return (
    <>
      <div className='flex flex-col items-center space-y-4'>
        {handleUpdateUser ? (
          <AvatarSelector onSelect={handleUpdateUser} value={user.avatarId} />
        ) : (
          <Avatar className='h-32 w-32 border-4 bg-gradient-to-r from-primary to-primary/60'>
            <Image
              priority
              src={`/avatars/${user.avatarId}.png`}
              alt='Selected avatar'
              width={128}
              height={128}
              quality={90}
            />
          </Avatar>
        )}
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>{user.fullName ?? 'Unknown'}</h2>
          <p className='text-sm text-muted-foreground'>{user.email ?? 'Unknown'}</p>
        </div>
      </div>
      <Separator />
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-4'>
          <InfoItem icon={Mail} label='Email' value={user.email} />
          <InfoItem icon={Phone} label='Phone' value={user.phone_number} />
          <InfoItem icon={MapPin} label='Location' value={user.address} />
        </div>
        <div className='space-y-4'>
          <InfoItem icon={Calendar} label='Date of Birth' value={formatDateToInput(user.dateOfBirth)} />
          <InfoItem icon={User2} label='Gender' value={user.gender} />
          <InfoItem icon={Briefcase} label='Workplace' value={user.workplace} />
        </div>
      </div>
    </>
  )
}