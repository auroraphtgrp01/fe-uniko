import { Avatar } from '@/components/ui/avatar'
import Image, { StaticImageData } from 'next/image'

interface GradientBorderAvatarProps {
  src: StaticImageData
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  srcGit: string
}

const GradientBorderAvatar: React.FC<GradientBorderAvatarProps> = ({ src, alt = '', size = 'lg', srcGit }) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  }

  const avatarSize = sizeClasses[size] || sizeClasses['lg']

  return (
    <div className={`relative ${avatarSize} rounded-full`}>
      <a href={srcGit}>
        <div className='animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-r opacity-75 blur-sm' />
        <div className='absolute inset-0.5 rounded-full bg-black' />
        <Avatar className={`relative ${avatarSize}`}>
          <Image priority src={src} alt={alt} />
        </Avatar>
      </a>
    </div>
  )
}

export default GradientBorderAvatar
