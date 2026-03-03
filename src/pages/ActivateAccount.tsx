import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { activateAccount } from "@/services/authService"; // استيراد الفانكشن بتاعتك

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('جاري تفعيل حسابك...');

  const token = searchParams.get('token');

  useEffect(() => {
    const handleActivation = async () => {
      if (!token) {
        setStatus('توكن التفعيل غير موجود.');
        return;
      }

      try {
        await activateAccount(token); // استخدام الـ Service بتاعك
        setStatus('تم تفعيل الحساب بنجاح! جاري تحويلك لصفحة الدخول...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        setStatus('عفواً، اللينك ده غير صالح أو انتهت صلاحيته.');
      }
    };

    handleActivation();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold">{status}</h2>
    </div>
  );
};;

export default ActivateAccount;
// import { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate, Link } from 'react-router-dom';
// import { activateAccount } from '@/services/authService';
// import { Button } from "@/components/ui/button";
// import { CheckCircle, XCircle, Loader2 } from "lucide-react";

// const ActivateAccount = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   // بنستخدم الحالة (Status) عشان نغير شكل الصفحة بالكامل
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
//   const token = searchParams.get('token');

//   useEffect(() => {
//     if (token) {
//       activateAccount(token)
//         .then(() => {
//           setStatus('success');
//           // تحويل تلقائي بعد 5 ثواني لو محبش يدوس على الزرار
//           setTimeout(() => navigate('/login'), 5000);
//         })
//         .catch((err) => {
//           console.error(err);
//           setStatus('error');
//         });
//     } else {
//       setStatus('error');
//     }
//   }, [token, navigate]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4">
//       <div className="max-w-md text-center">
        
//         {/* حالة التحميل: بنظهر Spinner لتقليل توتر اليوزر */}
//         {status === 'loading' && (
//           <div className="animate-in fade-in duration-500">
//             <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary mb-6" />
//             <h1 className="text-2xl font-bold text-foreground">Verifying your account...</h1>
//             <p className="mt-3 text-muted-foreground">Please wait while we confirm your email address.</p>
//           </div>
//         )}

//         {/* حالة النجاح: نفس الـ UI اللي بعتيه بالظبط */}
//         {status === 'success' && (
//           <div className="animate-in zoom-in duration-500">
//             <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
//               <CheckCircle className="h-8 w-8" />
//             </div>
//             <h1 className="font-display text-2xl font-bold text-foreground">Email Verified!</h1>
//             <p className="mt-3 text-muted-foreground">
//               Your email has been successfully verified. You can now sign in and start exploring.
//             </p>
//             <Button asChild className="mt-6 w-full gradient-primary border-0">
//               <Link to="/login">Sign In Now</Link>
//             </Button>
//           </div>
//         )}

//         {/* حالة الفشل: لو الـ 403 لسه موجودة أو اللينك بايظ */}
//         {status === 'error' && (
//           <div className="animate-in slide-in-from-bottom duration-500">
//             <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
//               <XCircle className="h-8 w-8" />
//             </div>
//             <h1 className="font-display text-2xl font-bold text-foreground">Verification Failed</h1>
//             <p className="mt-3 text-muted-foreground">
//               The activation link is invalid or has expired. Please try registering again.
//             </p>
//             <Button asChild variant="outline" className="mt-6 w-full">
//               <Link to="/signup">Back to Sign Up</Link>
//             </Button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ActivateAccount;