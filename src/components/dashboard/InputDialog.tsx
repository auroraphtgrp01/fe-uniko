import React, { useState } from 'react'
import { Button } from '../ui/button'
import * as Dialog from '@radix-ui/react-dialog'
import { Input } from '../ui/input'
interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
}
export const DialogInput: React.FC<CustomDialogProps> = ({ isOpen, onClose }) => {
  const [transactionId, setTransactionId] = useState('')
  const [amount, setAmount] = useState('')
  const [direction, setDirection] = useState('')
  const [currency, setCurrency] = useState('')
  const [accountBank, setAccountBank] = useState('')
  const [trackerTransaction, setTrackerTransaction] = useState('')

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/30' />
        <Dialog.Content className='fixed left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 shadow-lg'>
          <Dialog.Title className='text-xl font-semibold'>Transaction Details</Dialog.Title>
          <Dialog.Description className='mt-2 text-gray-600'>Please fill in the details below.</Dialog.Description>
          <form className='mt-4 space-y-4'>
            <div>
              <label htmlFor='transaction-id' className='block text-sm font-medium text-gray-700'>
                TRANSACTION ID
              </label>
              <Input
                id='transaction-id'
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className='mt-1'
              />
            </div>
            <div>
              <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>
                AMOUNT
              </label>
              <Input id='amount' value={amount} onChange={(e) => setAmount(e.target.value)} className='mt-1' />
            </div>
            <div>
              <label htmlFor='direction' className='block text-sm font-medium text-gray-700'>
                DIRECTION
              </label>
              <Input id='direction' value={direction} onChange={(e) => setDirection(e.target.value)} className='mt-1' />
            </div>
            <div>
              <label htmlFor='currency' className='block text-sm font-medium text-gray-700'>
                CURRENCY
              </label>
              <Input id='currency' value={currency} onChange={(e) => setCurrency(e.target.value)} className='mt-1' />
            </div>
            <div>
              <label htmlFor='account-bank' className='block text-sm font-medium text-gray-700'>
                ACCOUNT BANK
              </label>
              <Input
                id='account-bank'
                value={accountBank}
                onChange={(e) => setAccountBank(e.target.value)}
                className='mt-1'
              />
            </div>
            <div>
              <label htmlFor='tracker-transaction' className='block text-sm font-medium text-gray-700'>
                TRACKER TRANSACTION
              </label>
              <Input
                id='tracker-transaction'
                value={trackerTransaction}
                onChange={(e) => setTrackerTransaction(e.target.value)}
                className='mt-1'
              />
            </div>
            <div className='mt-4 flex justify-end'>
              <Button onClick={onClose} variant='outline' className='mr-2'>
                Cancel
              </Button>
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
