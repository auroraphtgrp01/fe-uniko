'use client'

import { motion } from 'framer-motion'
import { Laptop, Smartphone, TabletSmartphone } from 'lucide-react'

export const PlatformSection = () => {
    const platforms = [
        {
            name: 'Web',
            icon: <Laptop className="w-12 h-12 md:w-14 md:h-14 text-rose-500" />,
            description: 'Trải nghiệm mượt mà trên mọi trình duyệt với giao diện đáp ứng hoàn hảo'
        },
        {
            name: 'Android',
            icon: <Smartphone className="w-12 h-12 md:w-14 md:h-14 text-green-500" />,
            description: 'Ứng dụng Android tối ưu với hiệu suất cao và trải nghiệm người dùng tuyệt vời'
        },
        {
            name: 'iOS',
            icon: <TabletSmartphone className="w-12 h-12 md:w-14 md:h-14 text-gray-700 dark:text-gray-300" />,
            description: 'Thiết kế tinh tế và mượt mà trên các thiết bị iOS'
        }
    ]

    return (
        <section className="py-24 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/20 opacity-50 pointer-events-none"></div>
            <div className="relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300"
                    >
                        Sẵn sàng trên mọi thiết bị
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-500"
                    >
                        Đa Nền Tảng
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg"
                    >
                        Trải nghiệm liền mạch trên mọi thiết bị với giải pháp đa nền tảng của chúng tôi
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 },
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            }}
                            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 p-4 rounded-full bg-gray-50 dark:bg-gray-700/50 transform transition-transform group-hover:scale-110 duration-300 shadow-md">
                                    {platform.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">{platform.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{platform.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
} 