'use client';

import {cn} from '@/styles/lib/utils';
import {Button} from '@/styles/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/styles/components/ui/card';
import {Input} from '@/styles/components/ui/input';
import {Label} from '@/styles/components/ui/label';
import Link from 'next/link';
import {useState} from 'react';

export function SignupForm({className, ...props}: React.ComponentProps<'div'>) {
  const [role, setRole] = useState<'recruiter' | 'seeker' | null>(null);

  return (
    <div className={cn('flex flex-col gap-6 mt-1', className)} {...props}>
      <h1 className="text-3xl font-bold text-center mb-4">WorkNest</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Fill in your details to sign up and get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {/* Full Name */}
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              {/* Confirm Password */}
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>

              {/* Role selection */}
              <div className="flex gap-3 flex-col border-y py-4">
                <Button
                  type="button"
                  variant={role === 'recruiter' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setRole('recruiter')}
                >
                  Recruiter
                </Button>
                <Button
                  type="button"
                  variant={role === 'seeker' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setRole('seeker')}
                >
                  Seeker
                </Button>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" asChild>
                  <Link
                    href={
                      role === 'seeker'
                        ? '/dashboard'
                        : role === 'recruiter'
                        ? '/recruiter/dashboard'
                        : '/'
                    }
                  >
                    Sign Up
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </div>
            </div>

            {/* Already have account? */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
