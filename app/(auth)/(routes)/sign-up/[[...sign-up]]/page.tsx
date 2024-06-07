"use client";

import {
  auth,
  sendEmailVerification,
  updateProfile,
} from "@/lib/firebase/config";
import {
  useCreateUserWithEmailAndPassword,
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
import { SignUpFormData } from "@/lib/types/auth";
import { signUpFormSchema } from "@/lib/constants";
import SocialLogins from "@/components/auth-components/SocialLogins";
import AuthCardHeader from "@/components/auth-components/AuthCardHeader";
import Link from "next/link";
import { LOGIN } from "@/lib/routes";
import redirectIfLoggedIn from "@/components/auth-components/RedirectIfLoggedIn";

function Signup() {
  const router = useRouter();
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithGoogle, , isGoogleLoading] = useSignInWithGoogle(auth);
  const [signInWithGithub, , isGithubLoading] = useSignInWithGithub(auth);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = isGithubLoading || isGoogleLoading || loading;

  useEffect(() => {
    if (error) {
      if (error.code.includes("auth/email-already-in-use")) {
        toast.error("This email already exists!", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });
      } else {
        toast.error("Could not create your account. Please try again", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });
      }
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: SignUpFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      if (userCredential && userCredential.user) {
        router.push("/sign-in");
        await updateProfile(userCredential.user, {
          displayName: `${values.firstname} ${values.lastname}`,
        });
        toast.success("Your account is created successfully", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });

        if (!auth.currentUser?.emailVerified) {
          await sendEmailVerification(auth.currentUser as any);
        }
      }
    } catch (err) {
      toast.error("Error creating a user! Please try again.", {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="grid gap-2 w-96 mx-5">
      <AuthCardHeader title="Create an account" />
      <SocialLogins
        isGithubLoading={isGithubLoading}
        isGoogleLoading={isGoogleLoading}
        isLoading={isLoading}
        signInWithGithub={signInWithGithub}
        signInWithGoogle={signInWithGoogle}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
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
                      placeholder="Create a password"
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
            Continue
          </Button>
        </form>
      </Form>
      <Link href={LOGIN}>Already have an account? Sign in here.</Link>
    </div>
  );
}
export default redirectIfLoggedIn(Signup);
