'use client';

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useAuth";
import { useStaffLogin } from "@/hooks/useAuthStaff";

type LoginMode = 'admin' | 'staff';

export default function LoginPage() {
    const [mode, setMode] = useState<LoginMode>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const adminLogin = useLogin();
    const staffLogin = useStaffLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'admin') {
            adminLogin.mutate({ email, password });
        } else {
            staffLogin.mutate({ email, password });
        }
    };

    const isLoading = adminLogin.isPending || staffLogin.isPending;

    const toggleMode = () => {
        setMode(mode === 'admin' ? 'staff' : 'admin');
        // Reset form fields when switching
        setEmail('');
        setPassword('');
        setShowPassword(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="w-full max-w-3xl">
                {/* Dual panel container */}
                <div className="relative flex flex-col md:flex-row md:h-[480px] rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden">

                    {/* Mobile Toggle - visible only on mobile */}
                    <div className="md:hidden flex border-b border-border/50">
                        <button
                            type="button"
                            onClick={() => setMode('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${mode === 'admin'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('staff')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${mode === 'staff'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Staff
                        </button>
                    </div>

                    {/* Sliding overlay panel - hidden on mobile */}
                    <div
                        className={`hidden md:flex absolute top-0 h-full w-1/2 bg-gradient-to-br from-primary/90 to-primary flex-col items-center justify-center p-8 transition-all duration-500 ease-in-out z-10 ${mode === 'admin' ? 'translate-x-full' : 'translate-x-0'
                            }`}
                    >
                        <div className="text-center text-primary-foreground">
                            {mode === 'admin' ? (
                                <>
                                    <Users className="w-12 h-12 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Staff Member?</h2>
                                    <p className="text-primary-foreground/80 text-sm mb-6">
                                        Clock in, view your attendance, and manage your schedule
                                    </p>
                                    <Button
                                        className="bg-card border-primary-foreground/30 text-primary hover:bg-card cursor-pointer"
                                        onClick={toggleMode}
                                    >
                                        Login as Staff
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-12 h-12 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Admin?</h2>
                                    <p className="text-primary-foreground/80 text-sm mb-6">
                                        Manage businesses, staff, and view reports
                                    </p>
                                    <Button
                                        className="bg-card border-primary-foreground/30 text-primary hover:bg-card cursor-pointer"
                                        onClick={toggleMode}
                                    >
                                        Login as Admin
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Admin Login Form (Left side on desktop, full width on mobile) */}
                    <div className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 transition-opacity duration-300 ${mode === 'admin' ? 'opacity-100' : 'opacity-0 pointer-events-none hidden md:flex'
                        }`}>
                        <div className="w-full max-w-sm space-y-6">
                            <div className="space-y-2 text-center">
                                <Shield className="w-10 h-10 mx-auto text-primary" />
                                <h1 className="text-xl sm:text-2xl font-bold">Admin Login</h1>
                                <p className="text-muted-foreground text-sm">
                                    Enter your credentials to access the dashboard
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="admin-email">Email</Label>
                                    <Input
                                        id="admin-email"
                                        type="email"
                                        className="h-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="admin-password">Password</Label>
                                        <Link
                                            href="#"
                                            className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="admin-password"
                                            type={showPassword ? "text" : "password"}
                                            className="h-10 pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Staff Login Form (Right side on desktop, full width on mobile) */}
                    <div className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 transition-opacity duration-300 ${mode === 'staff' ? 'opacity-100' : 'opacity-0 pointer-events-none hidden md:flex'
                        }`}>
                        <div className="w-full max-w-sm space-y-6">
                            <div className="space-y-2 text-center">
                                <Users className="w-10 h-10 mx-auto text-primary" />
                                <h1 className="text-xl sm:text-2xl font-bold">Staff Login</h1>
                                <p className="text-muted-foreground text-sm">
                                    Clock in and manage your attendance
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="staff-email">Email</Label>
                                    <Input
                                        id="staff-email"
                                        type="email"
                                        className="h-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="staff-password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="staff-password"
                                            type={showPassword ? "text" : "password"}
                                            className="h-10 pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6 px-4">
                    By signing in, you agree to our{" "}
                    <Link href="#" className="underline underline-offset-4 hover:text-foreground">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="underline underline-offset-4 hover:text-foreground">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
