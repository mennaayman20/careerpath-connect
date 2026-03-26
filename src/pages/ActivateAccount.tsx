import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'; 
import { activateAccount } from "@/services/authService";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  const token = searchParams.get('token');

  useEffect(() => {
    const handleActivation = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid activation link. Missing token.');
        return;
      }

      try {
        // Calling your service: api.get("/api/auth/activate", { params: { token } })
        const response = await activateAccount(token);
        
        setStatus('success');
        setMessage(response?.message || 'Account activated successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } catch (error: unknown) {
        setStatus('error');
        // Extracts the real error message from your API response
        const serverError = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Link expired or already used.';
        setMessage(serverError);
      }
    };

    handleActivation();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
        
        {/* --- LOADING STATE --- */}
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Please Wait</h2>
                <p className="text-slate-500 font-medium tracking-wide">{message}</p>
            </div>
          </div>
        )}

        {/* --- SUCCESS STATE --- */}
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 font-sans">Verified!</h2>
                <p className="text-slate-600 font-medium">{message}</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-full origin-left animate-[progress-bar_3s_linear]" />
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Redirecting to Login...</p>
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 font-sans">Oops!</h2>
                <p className="text-slate-600 font-medium leading-relaxed">{message}</p>
            </div>
            <div className="flex flex-col w-full gap-3 pt-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-slate-200"
                >
                  Back to Signup
                </button>
                
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ActivateAccount;
// import { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { activateAccount } from "@/services/authService"; // استيراد الفانكشن بتاعتك

// const ActivateAccount = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState('جاري تفعيل حسابك...');

//   const token = searchParams.get('token');

//   useEffect(() => {
//     const handleActivation = async () => {
//       if (!token) {
//         setStatus('توكن التفعيل غير موجود.');
//         return;
//       }

//       try {
//         await activateAccount(token); // استخدام الـ Service بتاعك
//         setStatus('تم تفعيل الحساب بنجاح! جاري تحويلك لصفحة الدخول...');
//         setTimeout(() => navigate('/login'), 2000);
//       } catch (error) {
//         setStatus('عفواً، اللينك ده غير صالح أو انتهت صلاحيته.');
//       }
//     };

//     handleActivation();
//   }, [token, navigate]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <h2 className="text-xl font-bold">{status}</h2>
//     </div>
//   );
// };;

// export default ActivateAccount;

