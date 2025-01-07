import { IPropsHandleCancelEdit, IpropsHandleConfirm, IPropsHandleSend, IPropsStartEdit } from "@/app/chatbox/constants"
import { ICreateTrackerTransactionBody } from "@/core/transaction/models"
import { getAccessTokenFromLocalStorage } from "@/libraries/helpers"
import { Dispatch, SetStateAction } from "react"
import { v4 as uuidv4 } from 'uuid'

export const handleStartEdit = ({ transaction, setEditingId, setEditForms }: IPropsStartEdit) => {
  setEditingId(transaction.id)
  setEditForms((prev) => ({
    ...prev,
    [transaction.id]: {
      description: transaction.description,
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      accountSourceId: transaction.accountSourceId,
      categoryName: transaction.categoryName,
      accountSourceName: transaction.accountSourceName
    }
  }))
}

export const handleSend = async ({
  input,
  setError,
  typingInterval,
  setMessages,
  setInput,
  scrollToBottom,
  fundId,
  setIsTyping,
  setCurrentResponse,
  setApiData
}: IPropsHandleSend) => {
  if (!input.trim()) {
    setError('Bạn phải nhập tin nhắn trước khi gửi.')
    return;
  }

  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }

  const newUserMessageId = Date.now()
  const newBotMessageId = Date.now() + 1

  setMessages((prev) => [
    ...prev.filter((msg) => msg.text !== ''),
    { id: newUserMessageId, text: input, sender: 'user' },
    { id: newBotMessageId, text: '', sender: 'bot' }
  ])

  setInput('')
  setError('')
  setTimeout(scrollToBottom, 100)

  try {
    const response = await fetch('https://bot.uniko.id.vn/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
      },
      body: JSON.stringify({
        message: input,
        fundId
      })
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Response reader not available')

    let fullResponse = ''
    setIsTyping(true)

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        setIsTyping(false)
        setTimeout(scrollToBottom, 100)
        break;
      }

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split('data: ').filter((line) => line.trim())

      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          const updatedTransactions = data?.data?.transactions?.map((transaction: any) => ({
            ...transaction,
            idMessage: newBotMessageId,
            id: uuidv4()
          })) || []

          const processedRecent = data.recent
            ? data.recent.replace(/\\n/g, '<br />').replace(/\\"/g, '"').replace(/\\'/g, "'")
            : '';

          fullResponse = `${data.message}\n\n${'_'.repeat(50)}\n\n${processedRecent}`;
          setCurrentResponse(fullResponse)

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newBotMessageId
                ? { ...msg, text: fullResponse }
                : msg
            )
          );

          setApiData((prev = []) => [
            ...prev,
            {
              message: { id: newBotMessageId, text: fullResponse, sender: 'bot' },
              transactions: updatedTransactions
            }
          ]);

          setTimeout(scrollToBottom, 100);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          console.log('Problematic line:', line);
        }
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'bot'
      }
    ]);

    setIsTyping(false);
    setTimeout(scrollToBottom, 100);
  }
};

export const handleCancelEdit = (setEditingId: Dispatch<SetStateAction<string | null>>) => {
  setEditingId(null)
}

export const handleSaveEdit = async ({
  transactionId,
  editForms,
  selectedTransactions,
  setSelectedTransactions,
  setEditedTransactions,
  setEditingId
}: IPropsHandleCancelEdit) => {
  try {
    const currentForm = editForms[transactionId]
    if (!currentForm) return

    if (!currentForm.description || !currentForm.amount) {
      console.error('Missing required fields')
      return
    }

    const existingTransaction = selectedTransactions.find((t) => t.id === transactionId)
    if (!existingTransaction) {
      console.error('No transaction found in selectedTransactions for transactionId:', transactionId)
      return
    }

    setSelectedTransactions((prev) => {
      const updated = prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            description: currentForm.description,
            amount: currentForm.amount,
            categoryId: existingTransaction?.category?.id ?? currentForm.categoryId,
            categoryName: existingTransaction?.category?.name ?? currentForm.categoryName,
            accountSourceId: existingTransaction?.wallet?.id ?? currentForm.accountSourceId,
            accountSourceName: existingTransaction?.wallet?.id ?? currentForm.accountSourceName
          }
        }
        return t
      })
      setEditedTransactions(updated)
      return updated
    })
    const updatedTransaction = {
      ...currentForm,
      id: transactionId,
      categoryName: existingTransaction?.category?.name ?? '',
      categoryId: existingTransaction?.category?.id ?? '',
      accountSourceId: existingTransaction?.wallet?.id ?? '',
      accountSourceName: existingTransaction?.wallet?.name ?? '',
      description: existingTransaction.description ?? '',
      amount: existingTransaction.amount || 0
    }

    setEditedTransactions((prev) => {
      const exists = prev.find((et) => et.id === transactionId)

      if (!exists) {
        const newEditedTransactions = [...prev, updatedTransaction]
        return newEditedTransactions
      }

      const updatedEditedTransactions = prev.map((et) => (et.id === transactionId ? updatedTransaction : et))

      return updatedEditedTransactions
    })

    handleCancelEdit(setEditingId)
  } catch (error) {
    console.error('Failed to update transaction:', error)
  }
}

export const handleConfirm = async ({
  editedTransactions,
  fundId,
  postTrackerTransactions,
  setIsDialogOpen,
  setEditedTransactions,
  setIsDisabled
}: IpropsHandleConfirm) => {
  const payload = editedTransactions.map((item) => {
    return {
      trackerTypeId: item.categoryId,
      accountSourceId: item.accountSourceId,
      reasonName: item.description,
      direction: item.type,
      amount: item.amount,
      fundId
    }
  })
  await postTrackerTransactions(payload)
  setIsDialogOpen(false)
  setEditedTransactions([])
  setIsDisabled(true)
}
