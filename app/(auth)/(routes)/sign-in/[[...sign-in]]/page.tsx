"use client";

import { auth } from "@/lib/firebase/config";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthActionTypes, SignInFormData } from "@/lib/types/auth";
import { signInFormSchema } from "@/lib/constants";
import SocialLogins from "@/components/auth-components/SocialLogins";
import AuthCardHeader from "@/components/auth-components/AuthCardHeader";
import { HOME, SIGN_UP } from "@/lib/routes";
import Link from "next/link";
import redirectIfLoggedIn from "@/components/auth-components/RedirectIfLoggedIn";
import { useAuth } from "@/components/providers/auth-provider";
import { setTokenAndExpiryTime } from "@/lib/utils/auth";

function SignIn() {
  const router = useRouter();
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, , isGoogleLoading] = useSignInWithGoogle(auth);
  const [signInWithGithub, , isGithubLoading] = useSignInWithGithub(auth);
  const { dispatch, setIsLoggedin } = useAuth();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = isGithubLoading || isGoogleLoading || loading;

  useEffect(() => {
    if (error?.code.includes("auth/invalid-credential")) {
      toast.error("Invalid credentials. Please try again", {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: SignInFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        values.email,
        values.password
      );

      if (userCredential && userCredential.user) {
        const payload = {
          uid: userCredential.user.uid,
          userName: userCredential.user.displayName,
          email: userCredential.user.email,
          userImage: userCredential.user.photoURL,
        };
        setTokenAndExpiryTime(userCredential.user);
        setIsLoggedin(true);
        dispatch({ type: AuthActionTypes.CREATE_USER, payload });
        router.push(HOME);
        toast.success("Signed in successfully", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error("Error signing in! Please try again.", {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="grid gap-2 w-96 mx-5">
      <AuthCardHeader title="Sign In to your account" />
      <SocialLogins
        isGithubLoading={isGithubLoading}
        isGoogleLoading={isGoogleLoading}
        isLoading={isLoading}
        signInWithGithub={signInWithGithub}
        signInWithGoogle={signInWithGoogle}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <IoMdEyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <IoMdEye className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            variant={"discord"}
            loading={loading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>
      </Form>
      <Link href={SIGN_UP}>Don&apos;t have an account? Sign up here.</Link>
    </div>
  );
}
export default redirectIfLoggedIn(SignIn);
