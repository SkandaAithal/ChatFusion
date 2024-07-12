"use client";

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
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { SignInFormData } from "@/lib/types/auth";
import { signInFormSchema } from "@/lib/constants";
import SocialLogins from "@/components/auth-components/SocialLogins";
import AuthCardHeader from "@/components/auth-components/AuthCardHeader";
import { SIGN_UP } from "@/lib/routes";
import Link from "next/link";
import redirectIfLoggedIn from "@/components/auth-components/RedirectIfLoggedIn";
import { useAuth } from "@/components/providers/auth-provider";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSignWithEmail, isEmailSignInLoading, isLoading } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="grid gap-2 w-[400px] mx-5">
      <AuthCardHeader title="Sign In to your account" />
      <SocialLogins />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignWithEmail)}
          className="space-y-4"
        >
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
            loading={isEmailSignInLoading}
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
