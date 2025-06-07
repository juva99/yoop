import ResetPasswordForm from "@/app/auth/reset-password/reset-password-form";
import Link from "next/link";
import AuthWrapper from "../authWrapper";

const ResetPassword = () => {
  return (
    <AuthWrapper>
      <div className="text-center">
        <h2 className="text-2xl font-bold">איפוס סיסמה</h2>
        <p className="mt-2 text-gray-600">הזן את הסיסמה החדשה שלך.</p>
      </div>
      <div className="mt-6 w-full">
        <ResetPasswordForm />
      </div>
      <div className="text-center text-sm text-gray-600">
        <div className="mt-4 flex w-full items-center justify-center gap-1">
          <p>נזכרת בסיסמה?</p>
          <Link href="/auth/login" className="text-title font-medium underline">
            חזור להתחברות
          </Link>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ResetPassword;
