import { SignUp } from '@clerk/nextjs';
import { ReferralCapture } from '../../../../components/auth/ReferralCapture';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <ReferralCapture />
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
}


