'use client';

import { useMyAttendance } from "@/hooks/useAttendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Timer } from "lucide-react";
import { format } from "date-fns";

export default function AttendanceHistoryPage() {
    const { data: attendance, isLoading } = useMyAttendance();

    const formatDuration = (hours?: number) => {
        if (!hours) return '-';
        const h = Math.floor(hours);
        const m = Math.round((hours % 1) * 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge variant="default" className="bg-green-600">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Attendance History</h2>
                <p className="text-muted-foreground">View your clock in/out records</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : !attendance || attendance.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No attendance records</h3>
                        <p className="text-muted-foreground text-sm">Your attendance history will appear here</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {attendance.map((record) => (
                        <Card key={record._id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {format(new Date(record.clockIn), 'EEEE, MMMM d, yyyy')}
                                    </CardTitle>
                                    {getStatusBadge(record.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-green-600" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Clock In</p>
                                            <p className="font-medium">{format(new Date(record.clockIn), 'h:mm a')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-red-600" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Clock Out</p>
                                            <p className="font-medium">
                                                {record.clockOut ? format(new Date(record.clockOut), 'h:mm a') : '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Timer className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-muted-foreground text-xs">Duration</p>
                                            <p className="font-medium">{formatDuration(record.hoursWorked)}</p>
                                        </div>
                                    </div>
                                </div>
                                {record.notes && (
                                    <div className="mt-3 pt-3 border-t">
                                        <p className="text-xs text-muted-foreground">Notes</p>
                                        <p className="text-sm">{record.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
