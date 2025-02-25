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
        <section className="py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-500"
                    >
                        Đa Nền Tảng
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Trải nghiệm liền mạch trên mọi thiết bị với giải pháp đa nền tảng của chúng tôi
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-3 rounded-full bg-gray-50 dark:bg-gray-700/50">
                                    {platform.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{platform.name}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{platform.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
} 