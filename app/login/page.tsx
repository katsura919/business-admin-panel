import Link from "next/link";
import { Building2 } from "lucide-react";
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

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="w-full max-w-sm space-y-6">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Business Admin</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to manage your businesses
                    </p>
                </div>

                {/* Login Card */}
                <Card className="border-border/50">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl">Sign in</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="#"
                                    className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-10"
                            />
                        </div>
                        <Button className="w-full h-10" asChild>
                            <Link href="/overview">Sign in</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground">
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
