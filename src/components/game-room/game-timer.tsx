"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    initialSeconds: number;
    start: boolean;
    stop?: boolean;
    onComplete?: () => void;
}

export default function CountdownTimer({
    initialSeconds,
    start,
    stop = false,
    onComplete
}: CountdownTimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        setSeconds(initialSeconds);
        setIsRunning(false);
    }, [initialSeconds]);

    useEffect(() => {
        if (stop) {
            setIsRunning(false);
        } else if (start && !isRunning) {
            setIsRunning(true);
            setSeconds(initialSeconds);
        }
    }, [start, stop, initialSeconds, isRunning]);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(() => onComplete?.(), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, onComplete]);

    return (
        <div className="text-4xl font-bold">
            {seconds}s
        </div>
    );
}