import { SignIn } from '@clerk/nextjs';
import { ReferralCapture } from '../../../../components/auth/ReferralCapture';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <ReferralCapture />
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
}


