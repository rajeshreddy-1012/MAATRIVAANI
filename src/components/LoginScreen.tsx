import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, GraduationCap, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, UserRole, ColorTheme } from '../types';
import { defaultTeacherProfile, defaultStudentProfile } from '../services/storageService';
import { themeService } from '../services/themeService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  currentTheme?: ColorTheme;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, currentTheme = 'indigo' as ColorTheme }) => {
  const theme = themeService.getThemeConfig(currentTheme as ColorTheme);
  const [emailOrPhone, setEmailOrPhone] = useState('teacher.rashmi@primary.sih.gov.in');
  const [password, setPassword] = useState('PrimaryTeacher@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('teacher');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailOrPhone.trim()) {
      setErrorMessage('कृपया ईमेल या फोन नंबर दर्ज करें (Please enter Email or Phone)');
      return;
    }

    if (!password) {
      setErrorMessage('कृपया पासवर्ड दर्ज करें (Please enter Password)');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए (Password must be at least 4 characters)');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('लॉगिन सफल! कक्षा में स्वागत है (Login Successful! Welcome to MaatriVaani)');

      const isStudent = emailOrPhone.toLowerCase().includes('student') || emailOrPhone.includes('roll');
      const profile: UserProfile = isStudent
        ? { ...defaultStudentProfile, emailOrPhone }
        : { ...defaultTeacherProfile, emailOrPhone };

      setTimeout(() => {
        onLoginSuccess(profile);
      }, 600);
    }, 800);
  };

  const handleQuickTeacher = () => {
    setIsLoading(true);
    setSuccessMessage('शिक्षक के रूप में प्रवेश हो रहा है... (Logging in as Teacher)');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(defaultTeacherProfile);
    }, 450);
  };

  const handleQuickStudent = () => {
    setIsLoading(true);
    setSuccessMessage('विद्यार्थी के रूप में प्रवेश हो रहा है... (Logging in as Student)');
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(defaultStudentProfile);
    }, 450);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMessage('कृपया अपना नाम दर्ज करें (Please enter your name)');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('खाता सफलतापूर्वक बनाया गया! (Account Created Successfully)');
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: regName,
        role: regRole,
        emailOrPhone: emailOrPhone || 'user@maatri.edu',
        schoolName: 'राजकीय प्राथमिक विद्यालय (Govt. Primary School)',
        district: 'दुमका (Dumka)',
        state: 'झारखंड (Jharkhand)',
        targetLanguage: 'sat',
        sourceLanguage: 'hi',
        classGrade: 3,
      };
      setTimeout(() => {
        onLoginSuccess(newProfile);
      }, 500);
    }, 700);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-200 overflow-hidden">
        {/* Brand Banner Header */}
        <div className={`${theme.heroGradient} p-7 text-center text-white relative`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-3 shadow-inner">
            <span className="text-3xl font-serif">ᱢ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            MAATRIVAANI
          </h1>
          <p className="text-white/90 text-sm font-medium mt-1.5 italic">
            &ldquo;Learning begins in the language of the heart.&rdquo;
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20">
            <Sparkles className={`w-3 h-3 ${theme.accentText}`} />
            <span>Smart India Hackathon 2026 • SIH26042</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8">
          {/* Status Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email / Phone Field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email / Phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email-phone"
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. teacher.rashmi@primary.sih.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('पासवर्ड रीसेट लिंक आपके पंजीकृत नंबर पर भेजा गया है (Reset link sent to registered phone/email)')}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Remember me on this classroom tablet</span>
                </label>
              </div>

              {/* Login Submit Button */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white ${theme.primaryBg} active:scale-[0.99] transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Role Buttons (Critical for presentation review) */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Quick 1-Click Access
                  </span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-2">
                  <button
                    id="btn-quick-teacher"
                    type="button"
                    onClick={handleQuickTeacher}
                    disabled={isLoading}
                    className={`p-2.5 rounded-xl border ${theme.primaryLightBorder} ${theme.primaryLightBg} hover:opacity-90 ${theme.primaryDarkText} font-bold text-xs flex flex-col items-center gap-1 transition shadow-xs`}
                  >
                    <GraduationCap className={`w-5 h-5 ${theme.primaryText}`} />
                    <span>Continue as Teacher</span>
                  </button>

                  <button
                    id="btn-quick-student"
                    type="button"
                    onClick={handleQuickStudent}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex flex-col items-center gap-1 transition shadow-xs"
                  >
                    <User className="w-5 h-5 text-emerald-700" />
                    <span>Continue as Student</span>
                  </button>
                </div>
              </div>

              {/* Toggle to Create Account */}
              <div className="pt-3 text-center text-xs text-stone-500">
                <span>Don&apos;t have an account? </span>
                <button
                  id="btn-toggle-register"
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMessage('');
                  }}
                  className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          ) : (
            /* Registration Mode */
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <h3 className="font-bold text-base text-stone-800 text-center">
                नया खाता बनाएं (Create New Account)
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. सोरेन माचो (Soren Master)"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Role (भूमिका)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('teacher')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      regRole === 'teacher'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    Teacher (शिक्षक)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      regRole === 'student'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    Student (विद्यार्थी)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Email / Mobile Number
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="9876543210 or email@domain.com"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white bg-amber-700 hover:bg-amber-800 transition"
              >
                {isLoading ? 'Creating...' : 'Register & Start'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-xs text-stone-600 hover:underline"
                >
                  Already registered? Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
