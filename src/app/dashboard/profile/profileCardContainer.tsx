import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateTimeVN } from '@/libraries/utils'
import { IUser } from '@/types/user.i'
import { BriefcaseBusiness, Cake, MapPin, Phone, User } from 'lucide-react'

export default function ProfileCardContainer({ data }: { data: IUser }) {
  return (
    <form>
      <div className='grid w-full items-center gap-4'>
        <div className='mt-6 flex flex-1 flex-col items-center justify-center gap-8 md:flex-row'>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className='mx-5 h-44 w-44 rounded-full hover:cursor-pointer md:h-44 md:w-44'>
                <AvatarImage
                  className='h-full w-full object-cover'
                  src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}${data?.avatar}`}
                />
                <AvatarFallback>
                  <img
                    src='https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-cute-dong-vat-1725201830.jpg'
                    className='h-full w-full object-cover'
                  />
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className='w-64'>
              <Input id='picture' type='file' />
            </PopoverContent>
          </Popover>
          <div className='flex-1'>
            <h1 className='flex items-center justify-center text-xl font-bold md:justify-start md:text-2xl'>
              {data?.fullName ?? ''}
            </h1>
            <h1 className='mb-1 flex items-center justify-center text-gray-500 md:justify-start'>
              {data?.email ?? ''}
            </h1>
            <h1 className='mb-2 flex items-center justify-center text-lg md:justify-start'>
              <Cake className='mb-1 mr-2' /> {data?.dateOfBirth ? formatDateTimeVN(data?.dateOfBirth, false) : ''}
            </h1>
            <h1 className='mb-2 flex items-center justify-center text-lg md:justify-start'>
              <User className='mb-1 mr-2' /> {data?.gender ?? ''}
            </h1>
            <h1 className='mb-2 flex items-center justify-center text-lg md:justify-start'>
              <BriefcaseBusiness className='mb-1 mr-2' /> {data?.workplace ?? ''}
            </h1>
            <h1 className='mb-2 flex items-center justify-center text-lg md:justify-start'>
              <Phone className='mb-1 mr-2' /> {data?.phone_number ?? ''}
            </h1>
            <h1 className='mb-2 flex items-center justify-center text-lg md:justify-start'>
              <MapPin className='mb-1 mr-2' /> {data?.address ?? ''}
            </h1>
          </div>
        </div>
      </div>
    </form>
  )
}
