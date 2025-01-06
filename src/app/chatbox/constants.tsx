import { ETypeOfTrackerTransactionType } from "@/core/tracker-transaction-type/models/tracker-transaction-type.enum"
import { ICreateTrackerTransactionBody } from "@/core/transaction/models"
import { Dispatch, SetStateAction } from "react"
import { ChevronRight, LineChart, MessageCircle, NotebookPen, TrendingUp } from 'lucide-react'
export const typeCallBack: any = [
  'getAllTrackerTransactionType',
  'getTransactions',
  'getTodayTransactions',
  'getUnclassifiedTransactions',
  'getAllAccountSource',
  'getStatistic',
  'getTrackerTransaction',
  'getStatisticExpenditureFund',
  'getExpenditureFund'
]

export interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export interface ChatResponse {
  messages: string
  recent: string
  transactions: any[]
  statistics: {
    total_expense: number
    total_income: number
    transaction_count: number
    categories: any
  }
}

export interface Category {
  id: string
  name: string
  type: ETypeOfTrackerTransactionType
}

export interface Transaction {
  id: string;
  amount: number;
  type: ETypeOfTrackerTransactionType;
  description: string;
  walletName: string;
  categoryId: string;
  categoryName: string;
  accountSourceId: string;
  accountSourceName: string;
  fundId: string;
  userId: string;
  wallet?: {
    id: string;
    name: string;
    currentAmount: number;
  };
  category?: {
    id: string;
    name: string;
  };
}
export interface IEditForm {
  [key: string]: {
    description: string
    amount: number
    categoryId: string
    categoryName: string
    accountSourceId: string
    accountSourceName: string
  }
}

export interface ITrackerTransactionBody {
  trackerTypeId: string;
  reasonName: string;
  direction: string;
  amount: string | number;
  accountSourceId: string;
  fundId: string;
}

export interface IPropsStartEdit {
  transaction: Transaction
  setEditingId: Dispatch<SetStateAction<string | null>>
  setEditForms: Dispatch<SetStateAction<IEditForm>>
}

export interface IPropsHandleSend {
  input: string
  setError: Dispatch<SetStateAction<string>>
  typingInterval: NodeJS.Timeout | null
  setMessages: Dispatch<SetStateAction<Message[]>>
  setInput: Dispatch<SetStateAction<string>>
  scrollToBottom: () => void
  fundId: string
  setIsTyping: Dispatch<SetStateAction<boolean>>
  setCurrentResponse: Dispatch<SetStateAction<string>>
  setApiData: Dispatch<SetStateAction<{
    message: Message;
    transactions: Transaction[];
  }[]>>
}

export interface IPropsHandleCancelEdit {
  transactionId: string,
  editForms: IEditForm,
  selectedTransactions: Transaction[],
  setSelectedTransactions: Dispatch<SetStateAction<Transaction[]>>,
  setEditedTransactions: Dispatch<SetStateAction<any[]>>,
  setEditingId: Dispatch<SetStateAction<string | null>>
}

export interface IpropsHandleConfirm {
  editedTransactions: any[],
  fundId: string,
  postTrackerTransactions: any,
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
  setEditedTransactions: Dispatch<SetStateAction<any[]>>
}

export const messageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -10 }
}

export const textVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const inputVariants = {
  focus: { scale: 1.01 },
  tap: { scale: 0.99 }
}

export interface ActionItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  iconBgColor: string
  iconColor: string
  href: string
}

export const quickActions: ActionItem[] = [
  {
    id: 'expense-entry',
    title: 'Ghi chép các khoản chi tiêu một cách nhanh chóng',
    description: 'Ăn sáng 200k, xe 100k, điện thoại 100k',
    icon: NotebookPen,
    iconBgColor: 'bg-emerald-600/20',
    iconColor: 'text-emerald-500',
    href: '#expense-entry'
  },
  {
    id: 'financial-stats',
    title: 'Thống kê tài chính của tôi tháng này',
    description: 'Xem báo cáo chi tiết về thu chi trong tháng',
    icon: LineChart,
    iconBgColor: 'bg-blue-600/20',
    iconColor: 'text-blue-500',
    href: '#financial-stats'
  },
  {
    id: 'savings-advice',
    title: 'Tư vấn tiết kiệm',
    description: 'Nhận lời khuyên về cách tiết kiệm hiệu quả',
    icon: MessageCircle,
    iconBgColor: 'bg-purple-600/20',
    iconColor: 'text-purple-500',
    href: '#savings-advice'
  },
  {
    id: 'spending-analysis',
    title: 'Phân tích xu hướng chi tiêu',
    description: 'Xem xu hướng chi tiêu và đề xuất cải thiện',
    icon: TrendingUp,
    iconBgColor: 'bg-orange-600/20',
    iconColor: 'text-orange-500',
    href: '#spending-analysis'
  }
]