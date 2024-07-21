import SocialLogins from "@/components/auth-components/SocialLogins";
import AuthCardHeader from "@/components/auth-components/AuthCardHeader";
import { SIGN_UP } from "@/lib/routes";
import Link from "next/link";
import SignInForm from "@/components/auth-components/SignInForm";

function SignIn() {
  return (
    <div className="grid gap-2 w-[400px] mx-5">
      <AuthCardHeader title="Sign In to your account" />
      <SocialLogins />
      <SignInForm />
      <Link href={SIGN_UP}>Don&apos;t have an account? Sign up here.</Link>
    </div>
  );
}
export default SignIn;
