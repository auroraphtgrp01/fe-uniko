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
import { Fragment, useState } from 'react'
import { initEmptyUser } from '@/app/dashboard/profile/constants'
import CustomDialog from '../../Dialog'

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
    className: 'max-w-[90%] ',
    footer: <Button onClick={() => setIsOpenUserProfileDialog(false)}>Đóng</Button>
  }

  return (
    <TooltipProvider>
      {isOwner && (
        <div className='grid w-full grid-cols-1 items-end justify-center gap-2 sm:grid-cols-4 md:grid-cols-6'>
          <div className='col-span-1 sm:col-span-3 md:col-span-5'>
            <InviteParticipantForm formInviteRef={inviteTabProps.formRef} handleInvite={inviteTabProps.handleInvite} />
          </div>
          <div className='col-span-1'>
            <Button
              onClick={() => inviteTabProps.formRef.current?.requestSubmit()}
              disabled={false}
              className='flex h-full w-full items-center justify-center gap-2'
            >
              <UserPlus className='inline-block h-4 w-4' />
              <span>Invite</span>
            </Button>
          </div>
        </div>
      )}

      <div className={`w-full flex-1 overflow-x-hidden ${!isOwner ? 'mt-2' : ''}`}>
        <ScrollArea className={`${isOwner ? 'h-[17rem]' : 'h-[20.5rem]'} overflow-y-auto rounded-md border`}>
          <div className='space-y-4 p-4'>
            {detailData.participants.map((participant) => (
              <div
                key={participant.id}
                className='max-w-[450px]:flex-col flex rounded-lg border bg-background p-2 sm:flex-row sm:items-center sm:justify-between sm:p-4'
              >
                {/* User Information */}
                <div className='flex w-full flex-1 items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={`/avatars/${participant.user?.avatarId}.png`} />
                    <AvatarFallback>{participant.user?.fullName?.charAt(0) ?? 'N/A'}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <p className='truncate text-sm font-medium'>{participant.user?.fullName ?? 'N/A'}</p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {participant.user?.email ?? participant?.subEmail}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-4'>
                  {/* Status */}
                  <Tooltip>
                    <TooltipTrigger>
                      {participant.status === 'ACCEPTED' ? (
                        <CheckIcon className='order-2 h-4 w-4 text-green-500 sm:order-none' />
                      ) : (
                        <Clock className='order-2 h-4 w-4 text-yellow-500 sm:order-none' />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant.status === 'ACCEPTED' ? 'Accepted' : 'Pending'}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Role Badge */}
                  <div className='order-1 sm:order-none'>{getRoleBadge(participant.role)}</div>

                  {/* More Options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={participant.role === 'OWNER' || !isOwner}
                        variant='ghost'
                        className='order-3 h-8 w-8 p-0 sm:order-none'
                      >
                        <MoreHorizontalIcon className='h-4 w-4 text-gray-400' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {participant.role !== 'OWNER' && (
                        <DropdownMenuItem
                          className='cursor-pointer text-red-400'
                          onClick={() => participantProps.handleDelete(participant.id)}
                        >
                          <Trash2Icon className='mr-2 h-4 w-4' />
                          Remove
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => {
                          setUserProfileData(participant.user)
                          setIsOpenUserProfileDialog(true)
                        }}
                      >
                        <UserCheck2Icon className='mr-2 h-4 w-4' />
                        Profile
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
