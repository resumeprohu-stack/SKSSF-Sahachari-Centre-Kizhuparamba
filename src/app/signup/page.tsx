'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import Link from 'next/link';

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export default function SignupPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validation = signupSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.errors[0].message;
      setError(firstError);
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: firstError,
      });
      return;
    }
    
    initiateEmailSignUp(auth, email, password);
    // The onAuthStateChanged listener in FirebaseProvider will handle the redirect
    // and potential errors will be caught by the global error handler.
    toast({
        title: "Creating account...",
        description: "Please wait while we set up your account."
    })
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] bg-background">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
              Enter your email and password to sign up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isUserLoading}>
                {isUserLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline hover:text-primary">
                    Log in
                </Link>
              </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
