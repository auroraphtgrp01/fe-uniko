'use client'

import { InviteParticipantForm } from '../invite-participant'
import { Button } from '@/components/ui/button'
import { CheckIcon, Clock, Loader2Icon, MoreHorizontalIcon, Trash2Icon, UserCheck2Icon, UserPlus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AvatarDefault from '@/images/avatar.jpg'
import { Badge } from '@/components/ui/badge'
import {
  IExpenditureFundParticipant,
  IParticipantTabsContentProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { IDialogConfig } from '@/types/common.i'
import UserProfile from '../../profile/UserProfile'
import { IUser } from '@/types/user.i'
import { useState } from 'react'
import { initEmptyUser } from '@/app/dashboard/profile/constants'
import CustomDialog from '../../Dialog'
import { translate } from '@/libraries/utils'

export default function ParticipantTabsContent({
  detailData,
  inviteTabProps,
  participantProps
}: IParticipantTabsContentProps) {
  const { user } = useStoreLocal()
  const [isOpenUserProfileDialog, setIsOpenUserProfileDialog] = useState(false)
  const isOwner = detailData.owner.id === user?.id
  const [userProfileData, setUserProfileData] = useState<IUser>(initEmptyUser)
  const getRoleBadge = (role: IExpenditureFundParticipant['role']) => {
    switch (role) {
      case 'OWNER':
        return (
          <Badge
            style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
            className='bg-yellow-500 text-yellow-900'
          >
            Owner
          </Badge>
        )
      case 'ADMIN':
        return (
          <Badge
            style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
            className='bg-blue-500 text-blue-900'
          >
            Admin
          </Badge>
        )
      case 'MEMBER':
        return (
          <Badge
            style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
            className='bg-gray-500 text-gray-900'
          >
            Member
          </Badge>
        )
    }
  }

  const userProfileDialogConfig: IDialogConfig = {
    isOpen: isOpenUserProfileDialog,
    onClose: () => {
      setIsOpenUserProfileDialog(false)
    },
    title: 'Thông tin người tham gia',
    content: <UserProfile user={userProfileData} />,
    className: 'sm:max-w-[325px] md:max-w-[650px]',
    footer: <Button onClick={() => setIsOpenUserProfileDialog(false)}>Đóng</Button>
  }
  const t = translate(['common'])
  return (
    <TooltipProvider>
      {isOwner && (
        <div className='grid w-full grid-cols-6 items-end gap-2'>
          <div className='col-span-5 h-full w-full'>
            <InviteParticipantForm formInviteRef={inviteTabProps.formRef} handleInvite={inviteTabProps.handleInvite} />
          </div>
          <div className='col-span-1 w-full'>
            <Button
              onClick={() => inviteTabProps.formRef.current?.requestSubmit()}
              disabled={false}
              className='flex h-full w-full items-center justify-center'
            >
              {false ? <Loader2Icon className='h-4 w-4 animate-spin' /> : <UserPlus className='mr-2 h-4 w-4' />}
              {t('common:button.Invite')}
            </Button>
          </div>
        </div>
      )}
      <div className={`flex-1 overflow-hidden ${!isOwner ? 'mt-2' : ''}`}>
        <ScrollArea className={`${isOwner ? 'h-[17rem]' : 'h-[20.5rem]'} overflow-y-auto rounded-md border`}>
          <div className='space-y-2 p-2'>
            {detailData.participants.map((participant) => (
              <div key={participant.id} className='flex items-center justify-between rounded-lg p-2'>
                <div className='flex items-center space-x-3'>
                  <Avatar>
                    <AvatarImage src={`/avatars/${participant.user?.avatarId}.png`} />
                    <AvatarFallback>{participant.user?.fullName.charAt(0) ?? 'N/A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-medium'>{participant.user?.fullName ?? 'N/A'}</p>
                    <p className='text-xs'>{participant.user?.email ?? participant?.subEmail}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  {participant.status === 'ACCEPTED' ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckIcon className='h-4 w-4 text-green-500' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Accepted</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <Clock className='h-4 w-4 text-yellow-500' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pending</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {getRoleBadge(participant.role)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={participant.role === 'OWNER' || isOwner === false}
                        variant='ghost'
                        className='h-8 w-8 p-0'
                      >
                        <MoreHorizontalIcon className='h-4 w-4 text-gray-400' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {participant.role !== 'OWNER' && (
                        <DropdownMenuItem
                          style={{ cursor: 'pointer' }}
                          className='text-red-400'
                          onClick={() => {
                            participantProps.handleDelete(participant.id)
                          }}
                        >
                          <Trash2Icon className='mr-2 h-4 w-4' />
                          <span>Remove</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        disabled={!participant.user}
                        style={{ cursor: 'pointer' }}
                        className='text-muted-foreground'
                        onClick={() => {
                          setUserProfileData(participant.user)
                          setIsOpenUserProfileDialog(true)
                        }}
                      >
                        <UserCheck2Icon className='ml-[2px] mr-2 h-4 w-4' />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <CustomDialog config={userProfileDialogConfig} />
    </TooltipProvider>
  )
}
