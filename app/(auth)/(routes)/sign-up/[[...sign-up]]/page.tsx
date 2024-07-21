import SocialLogins from "@/components/auth-components/SocialLogins";
import AuthCardHeader from "@/components/auth-components/AuthCardHeader";
import Link from "next/link";
import { LOGIN } from "@/lib/routes";
import SignUpForm from "@/components/auth-components/SignUpForm";

function Signup() {
  return (
    <div className="grid gap-2 w-[400px] mx-5">
      <AuthCardHeader title="Create an Account" />
      <SocialLogins />
      <SignUpForm />
      <Link href={LOGIN}>Already have an account? Sign in here.</Link>
    </div>
  );
}
export default Signup;
