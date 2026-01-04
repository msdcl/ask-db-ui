import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Database, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import { validateLoginForm, getFirstError } from '../utils/validation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(getFirstError(validation.errors));
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success(SUCCESS_MESSAGES.LOGIN);
        navigate(result.user.userType === 'admin' ? '/admin' : '/dashboard');
      } else {
        toast.error(result.error || ERROR_MESSAGES.API.LOGIN);
      }
    } catch (error) {
      toast.error(ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob-gradient blob-primary w-[500px] h-[500px] -top-48 -left-48 opacity-40" />
        <div className="blob-gradient blob-accent w-[400px] h-[400px] top-1/4 -right-32 animation-delay-2000 opacity-30" />
        <div className="blob-gradient blob-sky w-[350px] h-[350px] bottom-0 left-1/4 animation-delay-1000 opacity-35" />
        <div className="blob-gradient blob-rose w-[300px] h-[300px] -bottom-24 right-1/4 animation-delay-500 opacity-25" />
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Main card */}
      <div className="card w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Card header with logo */}
        <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shadow-soft-lg">
                <Database className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-accent-400 to-accent-500 rounded-lg flex items-center justify-center shadow-soft animate-bounce-soft">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">NL to SQL</h1>
          <p className="text-secondary-500 text-sm sm:text-base">
            Transform natural language into powerful queries
          </p>
        </div>

        {/* Form section */}
        <div className="px-6 pb-8 sm:px-8 sm:pb-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-800 text-center mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-secondary-500 text-center">
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label className="input-label">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field input-with-icon ${errors.email ? 'input-field-error' : ''}`}
                  placeholder="you@example.com"
                  autoFocus
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="input-error">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="input-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field input-with-icon ${errors.password ? 'input-field-error' : ''}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="input-error">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary group mt-8"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner w-5 h-5" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-secondary-100">
            <div className="flex items-center justify-center gap-2 text-xs text-secondary-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Secured with JWT authentication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-secondary-400">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
        <span>AI-Powered Database Assistant</span>
      </div>
    </div>
  );
}
