'use client';

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
import { useAuth, useUser, useFirestore } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import Link from 'next/link';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const signupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Must be a valid 10-digit mobile number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !firestore) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser && name && email && mobileNumber) {
            // User is created and we have the form data, save to Firestore
            const userRef = doc(firestore, "users", firebaseUser.uid);
            const userData = {
                uid: firebaseUser.uid,
                name,
                email,
                mobileNumber,
                createdAt: new Date().toISOString(),
            };
            setDocumentNonBlocking(userRef, userData, { merge: true });

            // Clear form fields after successful registration and data save
            setName('');
            setEmail('');
            setMobileNumber('');
            setPassword('');
            
            // Redirect to dashboard
            router.push('/dashboard');
        }
    });

    return () => unsubscribe();
  }, [auth, firestore, user, router, name, email, mobileNumber]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validation = signupSchema.safeParse({ name, email, mobileNumber, password });
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
              Enter your details to sign up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" type="tel" placeholder="1234567890" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
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
