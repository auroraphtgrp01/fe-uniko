"use client";

import React from "react";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import { motion } from "framer-motion";

// Shadcn
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Icons
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Confetti
import confetti from "canvas-confetti";

export const TourCard: React.FC<CardComponentProps> = ({
    step,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    arrow,
}) => {
    // Onborda hooks
    const { closeOnborda } = useOnborda();

    function handleConfetti() {
        closeOnborda();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative border-0 min-w-[350px] w-max max-w-full z-[50]  shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between w-full">
                        <div className="flex flex-col space-y-1">
                            <CardDescription className=" font-medium">
                                Step {currentStep + 1} of {totalSteps}
                            </CardDescription>
                            <CardTitle className="text-xl font-bold ">
                                {step.icon} {step.title}
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            className=" rounded-full"
                            size="icon"
                            onClick={() => closeOnborda()}
                        >
                            <X size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-zinc-600 py-4">{step.content}</CardContent>
                <CardFooter className="flex flex-col space-y-4 pt-2 pb-4">
                    <Progress value={(currentStep + 1) / totalSteps * 100} className="w-full" />
                    <div className="flex justify-between w-full gap-4">
                        {currentStep !== 0 ? (
                            <Button
                                onClick={() => prevStep()}
                                variant="outline"
                                className="flex-1 "
                            >
                                <ChevronLeft size={16} className="mr-2" /> Previous
                            </Button>
                        ) : (
                            <div className="flex-1" />
                        )}
                        {currentStep + 1 !== totalSteps ? (
                            <Button
                                onClick={() => nextStep()}
                                className="flex-1"
                            >
                                Next <ChevronRight size={16} className="ml-2" />
                            </Button>
                        ) : (
                            <Button
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                                onClick={handleConfetti}
                            >
                                🎉 Finish!
                            </Button>
                        )}
                    </div>
                </CardFooter>
                <span className="text-white">{arrow}</span>
            </Card>
        </motion.div>
    );
};

