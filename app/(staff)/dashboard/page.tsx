'use client';

import { useState, useEffect } from 'react';
import { useStaffStore } from "@/store/staff.store";
import { useCurrentClockIn, useClockIn, useClockOut } from "@/hooks/useAttendance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square, Loader2, Timer } from "lucide-react";

export default function StaffDashboardPage() {
    const { staff } = useStaffStore();

    // Attendance hooks
    const { data: currentClockIn, isLoading: isLoadingStatus } = useCurrentClockIn();
    const clockInMutation = useClockIn();
    const clockOutMutation = useClockOut();

    // Local state
    const [notes, setNotes] = useState('');
    const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

    const isClockedIn = !!currentClockIn;
    const isLoading = clockInMutation.isPending || clockOutMutation.isPending;

    // Timer effect for elapsed time
    useEffect(() => {
        if (!currentClockIn?.clockIn) {
            setElapsedTime('00:00:00');
            return;
        }

        const updateElapsed = () => {
            const start = new Date(currentClockIn.clockIn).getTime();
            const now = Date.now();
            const diff = now - start;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsedTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);
        return () => clearInterval(interval);
    }, [currentClockIn?.clockIn]);

    const handleClockIn = () => {
        clockInMutation.mutate(notes ? { notes } : undefined, {
            onSuccess: () => setNotes(''),
        });
    };

    const handleClockOut = () => {
        clockOutMutation.mutate(notes ? { notes } : undefined, {
            onSuccess: () => setNotes(''),
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Welcome message */}
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Welcome, {staff?.firstName}!</h2>
                <p className="text-muted-foreground">
                    {staff?.position} {staff?.department && `• ${staff.department}`}
                </p>
            </div>

            {/* Clock In/Out Card */}
            <Card className="overflow-hidden">
                <CardHeader className={`text-center ${isClockedIn ? 'bg-green-500/10' : 'bg-muted/50'}`}>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Timer className="h-5 w-5" />
                        Time Tracking
                    </CardTitle>
                    <CardDescription>
                        {isLoadingStatus ? 'Loading status...' : (
                            isClockedIn ? 'You are currently clocked in' : 'You are not clocked in'
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Timer Display */}
                    <div className="text-center">
                        <div className={`text-5xl font-mono font-bold tracking-wider ${isClockedIn ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                            {elapsedTime}
                        </div>
                        {isClockedIn && currentClockIn?.clockIn && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Started at {new Date(currentClockIn.clockIn).toLocaleTimeString()}
                            </p>
                        )}
                    </div>

                    {/* Notes Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Notes (optional)
                        </label>
                        <Textarea
                            placeholder={isClockedIn ? "Add notes before clocking out..." : "Add notes for your shift..."}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Clock In/Out Button */}
                    <Button
                        onClick={isClockedIn ? handleClockOut : handleClockIn}
                        disabled={isLoading || isLoadingStatus}
                        size="lg"
                        className={`w-full h-14 text-lg font-semibold ${isClockedIn
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                {isClockedIn ? 'Clocking Out...' : 'Clocking In...'}
                            </>
                        ) : isClockedIn ? (
                            <>
                                <Square className="h-5 w-5 mr-2" />
                                Clock Out
                            </>
                        ) : (
                            <>
                                <Play className="h-5 w-5 mr-2" />
                                Clock In
                            </>
                        )}
                    </Button>

                    {/* Status indicator */}
                    {currentClockIn?.status && (
                        <div className="text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentClockIn.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : currentClockIn.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                Status: {currentClockIn.status.charAt(0).toUpperCase() + currentClockIn.status.slice(1)}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
