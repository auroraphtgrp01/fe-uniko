import { cn } from '@/libraries/utils'
import Image from 'next/image'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: React.ReactNode
  vertical?: boolean
  repeat?: number
  [key: string]: any
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
              'animate-marquee flex-row': !vertical,
              'animate-marquee-vertical flex-col': vertical,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
              '[animation-direction:reverse]': reverse
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

const reviews = [
  {
    name: 'Minh Anh',
    username: '@minhanh',
    body: 'Từ khi sử dụng ứng dụng, tôi đã tiết kiệm được 30% thu nhập mỗi tháng và đạt được mục tiêu mua nhà sau 2 năm',
    img: 'https://avatar.vercel.sh/minhanh'
  },
  {
    name: 'Thanh Hà',
    username: '@thanhha',
    body: 'Giao diện đơn giản, dễ sử dụng nhưng đầy đủ tính năng. Giúp tôi kiểm soát chi tiêu hiệu quả hơn rất nhiều',
    img: 'https://avatar.vercel.sh/thanhha'
  },
  {
    name: 'Hoàng Nam',
    username: '@hoangnam',
    body: 'Tính năng phân chia hũ tài chính giúp tôi quản lý tiền một cách khoa học. Đã tiết kiệm được một khoản kha khá cho đầu tư',
    img: 'https://avatar.vercel.sh/hoangnam'
  },
  {
    name: 'Thu Trang',
    username: '@thutrang',
    body: 'Báo cáo chi tiết và trực quan giúp tôi dễ dàng theo dõi các khoản chi tiêu. Rất hữu ích cho việc lập kế hoạch tài chính',
    img: 'https://avatar.vercel.sh/thutrang'
  },
  {
    name: 'Đức Anh',
    username: '@ducanh',
    body: 'Tính năng nhắc nhở thanh toán định kỳ giúp tôi không bao giờ quên đóng các hóa đơn hàng tháng. Rất tiện lợi!',
    img: 'https://avatar.vercel.sh/ducanh'
  },
  {
    name: 'Mai Linh',
    username: '@mailinh',
    body: 'Ứng dụng giúp tôi xây dựng thói quen tiết kiệm tốt hơn. Giờ đây tôi đã có quỹ dự phòng và cảm thấy an tâm hơn về tài chính',
    img: 'https://avatar.vercel.sh/mailinh'
  }
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({ img, name, username, body }: { img: string; name: string; username: string; body: string }) => {
  return (
    <figure
      className={cn(
        'relative w-96 cursor-pointer overflow-hidden rounded-xl border p-4',
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <Image className='rounded-full' width={32} height={32} alt='' src={img} />
        <div className='flex flex-col'>
          <figcaption className='text-sm font-medium dark:text-white'>{name}</figcaption>
          <p className='text-xs font-medium dark:text-white/40'>{username}</p>
        </div>
      </div>
      <blockquote className='mt-2 text-sm'>{body}</blockquote>
    </figure>
  )
}

export function MarqueeReview() {
  return (
    <div className='relative mt-12 flex w-full select-none justify-center'>
      <div className='absolute inset-x-0 h-full w-full bg-gradient-to-r from-white via-transparent to-white opacity-20 dark:from-black dark:to-black' />
      <div className='relative mx-auto mt-32 flex w-full flex-col items-center overflow-hidden rounded-lg border md:shadow-xl'>
        <div className='absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent dark:from-black' />
        <div className='absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent dark:from-black' />
        <Marquee pauseOnHover className='[--duration:20s]'>
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className='[--duration:20s]'>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>
    </div>
  )
}
