"use client"

import { cn } from "@/styles/lib/utils"
import { Button } from "@/styles/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card"
import { Input } from "@/styles/components/ui/input"
import { Label } from "@/styles/components/ui/label"
import Link from "next/link";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [role, setRole] = useState<"recruiter" | "seeker" | null>(null);
  
  return (
    <div className={cn("flex flex-col gap-6 mt-1", className)} {...props}>
      <h1 className="text-3xl font-bold text-center mb-4">WorkNest</h1>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              {/* Role selection */}
              <div className="flex gap-3 flex-col border-y py-4">
                <Button
                  type="button"
                  variant={role === "recruiter" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setRole("recruiter")}
                >
                  Recruiter
                </Button>
                <Button
                  type="button"
                  variant={role === "seeker" ? "default" : "outline"}
                  className="w-full"
                  onClick = {() => setRole("seeker")}
                >
                  Seeker
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                <Link href={role === "seeker" ? "/dashboard" : role === "recruiter" ? "/recruiter/dashboard" : "/signup"}>
                  Login
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
