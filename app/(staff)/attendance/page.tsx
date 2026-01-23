'use client';

import { useState, useMemo } from 'react';
import { useMyAttendance } from "@/hooks/useAttendance";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Timer, TrendingUp, CalendarDays, CheckCircle2 } from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default function AttendanceHistoryPage() {
    const { data: attendance, isLoading } = useMyAttendance();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Get attendance record for selected date
    const selectedAttendance = useMemo(() => {
        if (!selectedDate || !attendance) return null;
        return attendance.find(record =>
            isSameDay(new Date(record.clockIn), selectedDate)
        ) || null;
    }, [selectedDate, attendance]);

    // Get all dates that have attendance records
    const workedDates = useMemo(() => {
        if (!attendance) return [];
        return attendance.map(record => new Date(record.clockIn));
    }, [attendance]);

    // Calculate monthly stats
    const monthlyStats = useMemo(() => {
        if (!attendance) return { daysWorked: 0, totalHours: 0, approved: 0 };

        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const monthRecords = attendance.filter(record => {
            const recordDate = new Date(record.clockIn);
            return isWithinInterval(recordDate, { start: monthStart, end: monthEnd });
        });

        const totalHours = monthRecords.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
        const approved = monthRecords.filter(r => r.status === 'approved').length;

        return {
            daysWorked: monthRecords.length,
            totalHours: Math.round(totalHours * 10) / 10,
            approved,
        };
    }, [attendance, currentMonth]);

    // Custom modifiers for calendar styling
    const modifiers = useMemo(() => ({
        approved: attendance?.filter(r => r.status === 'approved').map(r => new Date(r.clockIn)) || [],
        pending: attendance?.filter(r => r.status === 'pending').map(r => new Date(r.clockIn)) || [],
        rejected: attendance?.filter(r => r.status === 'rejected').map(r => new Date(r.clockIn)) || [],
    }), [attendance]);

    const modifiersStyles = {
        approved: {
            backgroundColor: 'hsl(142.1 76.2% 36.3%)',
            color: 'white',
            borderRadius: '6px',
        },
        pending: {
            backgroundColor: 'hsl(47.9 95.8% 53.1%)',
            color: 'hsl(0 0% 9%)',
            borderRadius: '6px',
        },
        rejected: {
            backgroundColor: 'hsl(0 84.2% 60.2%)',
            color: 'white',
            borderRadius: '6px',
        },
    };

    const handleDayClick = (date: Date) => {
        const hasRecord = workedDates.some(d => isSameDay(d, date));
        if (hasRecord) {
            setSelectedDate(date);
            setIsModalOpen(true);
        }
    };

    const formatDuration = (hours?: number) => {
        if (!hours) return '-';
        const h = Math.floor(hours);
        const m = Math.round((hours % 1) * 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/30">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-600/20 text-red-500 border-red-600/30 hover:bg-red-600/30">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-600/20 text-yellow-500 border-yellow-600/30 hover:bg-yellow-600/30">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Attendance History</h1>
                <p className="text-muted-foreground mt-1">
                    Track your work hours and attendance status
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/40 bg-card/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CalendarDays className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Days Worked</p>
                                <p className="text-2xl font-bold">{monthlyStats.daysWorked}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Hours</p>
                                <p className="text-2xl font-bold">{monthlyStats.totalHours}h</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Approved</p>
                                <p className="text-2xl font-bold">{monthlyStats.approved}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <Card className="border-border/40 bg-card/50 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Calendar */}
                            <div className="flex-1 flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && handleDayClick(date)}
                                    onMonthChange={setCurrentMonth}
                                    modifiers={modifiers}
                                    modifiersStyles={modifiersStyles}
                                    className="rounded-lg"
                                    classNames={{
                                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                        month: "space-y-4",
                                        caption: "flex justify-center pt-1 relative items-center",
                                        caption_label: "text-sm font-medium",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-border/40 hover:bg-accent",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                                        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "ring-1 ring-primary/50",
                                        day_outside: "text-muted-foreground/50",
                                        day_disabled: "text-muted-foreground opacity-50",
                                    }}
                                />
                            </div>

                            {/* Legend & Info */}
                            <div className="lg:w-64 space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-4">Status Legend</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded bg-green-600" />
                                            <span className="text-sm text-muted-foreground">Approved</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded bg-yellow-500" />
                                            <span className="text-sm text-muted-foreground">Pending Review</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded bg-red-500" />
                                            <span className="text-sm text-muted-foreground">Rejected</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40">
                                    <p className="text-xs text-muted-foreground">
                                        Click on any highlighted day to view detailed attendance information for that date.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Attendance Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md border-border/40 bg-background">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedAttendance && (
                        <div className="space-y-6 pt-2">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadge(selectedAttendance.status)}
                            </div>

                            {/* Time Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-green-500" />
                                        <span className="text-xs text-muted-foreground">Clock In</span>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {format(new Date(selectedAttendance.clockIn), 'h:mm a')}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-red-500" />
                                        <span className="text-xs text-muted-foreground">Clock Out</span>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {selectedAttendance.clockOut
                                            ? format(new Date(selectedAttendance.clockOut), 'h:mm a')
                                            : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Timer className="h-4 w-4 text-primary" />
                                    <span className="text-xs text-muted-foreground">Total Duration</span>
                                </div>
                                <p className="text-2xl font-bold">
                                    {formatDuration(selectedAttendance.hoursWorked)}
                                </p>
                            </div>

                            {/* Notes */}
                            {selectedAttendance.notes && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Notes</p>
                                    <p className="text-sm p-3 rounded-lg bg-muted/30 border border-border/40">
                                        {selectedAttendance.notes}
                                    </p>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {selectedAttendance.adminNotes && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Admin Feedback</p>
                                    <p className="text-sm p-3 rounded-lg bg-muted/30 border border-border/40">
                                        {selectedAttendance.adminNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
