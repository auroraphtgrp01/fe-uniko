'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Screen1 from '@/images/screens/screen1.jpg'
import Screen2 from '@/images/screens/screen2.jpg'
import Screen3 from '@/images/screens/screen3.jpg'
import Screen4 from '@/images/screens/screen4.jpg'
import Iphone15Pro from './IphoneScreen'

export const IPhoneDemo = () => {
    const [activeScreen, setActiveScreen] = useState(0)
    const [autoplay, setAutoplay] = useState(true)

    const screens = [
        Screen1,
        Screen2,
        Screen3,
        Screen4,
    ]

    // Autoplay functionality
    useEffect(() => {
        if (!autoplay) return

        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % screens.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [autoplay, screens.length])

    // Pause autoplay when user interacts
    const handleScreenChange = (index: number) => {
        setActiveScreen(index)
        setAutoplay(false)
        // Resume autoplay after 15 seconds of inactivity
        setTimeout(() => setAutoplay(true), 15000)
    }

    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-700">
                            Trải nghiệm ứng dụng di động của chúng tôi
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            Khám phá giao diện trực quan và dễ sử dụng trên thiết bị di động của bạn
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-6xl mx-auto">
                    {/* iPhone mockup with floating effect */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        animate={{
                            y: [0, -10, 0],
                            rotateZ: [0, 1, 0],
                            rotateX: [0, 1, 0],
                        }}
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[60px] blur-xl opacity-70 -z-10"></div>
                        
                        <div className="relative w-[320px]">
                            <div className="relative">
                                <Iphone15Pro
                                    width={320}
                                    height={652}
                                    className="w-full h-auto"
                                />
                                <div className="absolute top-[4%] left-[6.5%] w-[87%] h-[92%] overflow-hidden rounded-[45.75px]">
                                    <motion.div
                                        className="h-full w-full"
                                        animate={{ x: `-${activeScreen * 100}%` }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <div className="flex h-full">
                                            {screens.map((screen, index) => (
                                                <div key={index} className="min-w-full h-full flex-shrink-0">
                                                    <Image
                                                        src={screen}
                                                        alt={`Màn hình demo ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        priority={index === activeScreen}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            {/* Reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-[55px] pointer-events-none"></div>
                        </div>
                    </motion.div>

                    {/* Feature descriptions */}
                    <div className="w-full max-w-md mt-12 md:mt-0">
                        <div className="space-y-6">
                            {[0, 1, 2, 3].map((index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    viewport={{ once: true }}
                                    className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-sm ${activeScreen === index
                                        ? 'bg-gradient-to-r from-blue-600/10 to-indigo-700/10 border border-blue-500/30 dark:border-blue-500/20 shadow-lg shadow-blue-500/5'
                                        : 'bg-white/5 dark:bg-gray-800/10 border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-300/30 dark:hover:border-blue-700/30'
                                        }`}
                                    whileHover={{ scale: 1.02, y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleScreenChange(index)}
                                >
                                    <div className="flex items-start">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${activeScreen === index
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/30'
                                            : 'bg-gray-100/80 dark:bg-gray-800/80'
                                            }`}>
                                            <span className={`text-lg font-semibold ${activeScreen === index ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-semibold mb-2 ${activeScreen === index ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
                                                }`}>
                                                {index === 0 && "Trang chủ trực quan"}
                                                {index === 1 && "Quản lý dự án"}
                                                {index === 2 && "Thống kê chi tiết"}
                                                {index === 3 && "Cài đặt cá nhân hóa"}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {index === 0 && "Giao diện người dùng hiện đại với tất cả tính năng quan trọng trong tầm tay"}
                                                {index === 1 && "Theo dõi tiến độ và quản lý công việc một cách hiệu quả"}
                                                {index === 2 && "Biểu đồ và số liệu trực quan giúp bạn đưa ra quyết định tốt hơn"}
                                                {index === 3 && "Tùy chỉnh ứng dụng theo nhu cầu và sở thích của bạn"}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center mt-12">
                    {screens.map((_, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 * index }}
                            viewport={{ once: true }}
                            onClick={() => handleScreenChange(index)}
                            className={`mx-1 rounded-full transition-all duration-300 ${activeScreen === index
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 w-10 h-3 shadow-md shadow-blue-500/30'
                                : 'bg-gray-300/50 dark:bg-gray-700/50 w-3 h-3 hover:bg-gray-400/70 dark:hover:bg-gray-600/70'
                                }`}
                            aria-label={`Xem màn hình ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
} 