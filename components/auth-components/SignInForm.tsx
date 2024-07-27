"use client";

import React, { useState } from "react";
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

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useAuth } from "@/lib/providers/auth-provider";
import { SignInFormData } from "@/lib/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema } from "@/lib/constants";

function SignInForm() {
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
          variant="chatfusion"
          loading={isEmailSignInLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}

export default SignInForm;
