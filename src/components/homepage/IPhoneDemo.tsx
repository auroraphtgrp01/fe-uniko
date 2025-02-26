'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Screen1 from '@/images/screens/screen1.jpg'
import Screen2 from '@/images/screens/screen2.jpg'
import Screen3 from '@/images/screens/screen3.jpg'
import Screen4 from '@/images/screens/screen4.jpg'

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
                        className="relative w-[320px] h-[650px]"
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

                        {/* Phone outer frame */}
                        <div className="absolute inset-0 bg-[#1A1A1C] rounded-[55px] shadow-xl border border-gray-800">
                            {/* Dynamic Island */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[38px] bg-black rounded-b-[24px] z-50 mt-4 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-gray-700 mr-14"></div>
                                <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                            </div>

                            {/* Screen */}
                            <div className="absolute inset-[5px] bg-black rounded-[50px] overflow-hidden">
                                {/* Status bar */}
                                <div className="absolute top-0 left-0 right-0 h-[48px] z-40 flex justify-between items-center px-8 pt-2">
                                    <div className="text-white text-xs font-medium">9:41</div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4">
                                            <svg viewBox="0 0 24 24" fill="white">
                                                <path d="M12.33 4.75c2.95 0 5.67 1.12 7.8 3.24 2.12 2.13 3.24 4.85 3.24 7.8h-2.4c0-2.4-.93-4.65-2.64-6.36-1.7-1.7-3.96-2.64-6.36-2.64v-2.04h.36z"></path>
                                                <path d="M12.33 9.75c1.44 0 2.78.56 3.8 1.58 1.01 1.01 1.58 2.35 1.58 3.8h-2.4c0-.8-.31-1.54-.88-2.1-.57-.57-1.31-.88-2.1-.88v-2.4z"></path>
                                                <path d="M13.2 14.4a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="w-4 h-4">
                                            <svg viewBox="0 0 24 24" fill="white">
                                                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"></path>
                                            </svg>
                                        </div>
                                        <div className="text-white text-xs font-medium">100%</div>
                                        <div className="w-5 h-3 border border-white rounded-sm relative">
                                            <div className="absolute inset-[1px] bg-white rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Screen content */}
                                <motion.div
                                    className="h-full w-full pt-[48px]"
                                    animate={{ x: `-${activeScreen * 100}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <div className="flex h-full">
                                        {screens.map((screen, index) => (
                                            <div key={index} className="min-w-full h-full flex-shrink-0 relative">
                                                <Image
                                                    src={screen}
                                                    alt={`Màn hình demo ${index + 1}`}
                                                    className="w-full h-full object-cover object-center"
                                                    priority={index === activeScreen}
                                                    quality={100}
                                                    sizes="(max-width: 320px) 100vw"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Home indicator */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[120px] h-[5px] bg-white/30 rounded-full"></div>
                            </div>

                            {/* Side buttons */}
                            <div className="absolute right-[-2px] top-[120px] w-[4px] h-[35px] bg-gray-800 rounded-l-sm"></div>
                            <div className="absolute right-[-2px] top-[170px] w-[4px] h-[70px] bg-gray-800 rounded-l-sm"></div>
                            <div className="absolute left-[-2px] top-[120px] w-[4px] h-[35px] bg-gray-800 rounded-r-sm"></div>
                            <div className="absolute left-[-2px] top-[170px] w-[4px] h-[70px] bg-gray-800 rounded-r-sm"></div>

                            {/* Bottom speaker/charging */}
                            <div className="absolute bottom-[12px] left-1/2 transform -translate-x-1/2 w-[40%] h-[4px] bg-gray-800 rounded-full"></div>
                        </div>

                        {/* Reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-[55px] pointer-events-none"></div>
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