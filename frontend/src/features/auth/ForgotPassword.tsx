import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Mail, ChevronLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authApi.forgotPassword({ email });
      if (response.data.success) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(response.data.message || "Failed to send reset email.");
      }
    } catch (err: any) {
      console.error("Forgot password failed", err);
      setError(
        err.response?.data?.message || 
        "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[#f4f7fe] to-[#e9edf7] p-5 font-['Inter']">
      <div className="w-full max-w-[420px] bg-white p-10 rounded-[32px] shadow-2xl shadow-indigo-100/50 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex justify-center mb-6">
          <div className="bg-[#f4f7fe] p-5 rounded-full inline-flex">
            <Mail size={32} className="text-[#422afb]" />
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-[#2b3674] mb-3 tracking-tight">
          Forgot Password?
        </h1>
        <p className="text-[#a3aed0] text-base leading-relaxed mb-8">
          No worries! Enter the email address associated with your account and we'll send you a recovery link.
        </p>

        {success ? (
          <div className="space-y-6">
            <div className="bg-emerald-50 text-emerald-500 p-6 rounded-2xl font-semibold border border-emerald-100/50">
              <div className="flex items-center justify-center gap-2.5 mb-2">
                <CheckCircle2 size={22} />
                <span className="text-lg">Email Sent Successfully</span>
              </div>
              <p className="text-sm font-normal opacity-90 leading-relaxed">
                We've sent a password reset link to your email. Please check your inbox.
              </p>
            </div>
            <Link 
              to="/login" 
              className="block w-full py-4 rounded-2xl bg-[#422afb] text-white text-base font-bold shadow-lg shadow-indigo-200 hover:bg-[#3311db] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 no-underline"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 text-[#ee5d50] p-4 rounded-xl text-sm font-medium border border-red-100/50 animate-in fade-in duration-300">
                {error}
              </div>
            )}

            <div className="text-left">
              <label className="block mb-2.5 text-[#2b3674] font-semibold text-sm">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-5 py-4 rounded-2xl border border-[#e0e5f2] outline-none text-[15px] text-[#2b3674] bg-white placeholder:text-[#a3aed0] focus:border-[#422afb] focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#422afb] text-white text-base font-bold shadow-lg shadow-indigo-200 hover:bg-[#3311db] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending link...
                </span>
              ) : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-8">
            <Link to="/login" className="text-[#a3aed0] text-sm font-medium hover:text-[#422afb] transition-colors duration-200 no-underline">
              <div className="flex items-center justify-center gap-1.5">
                <ChevronLeft size={18} />
                <span>Return to Sign In</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
