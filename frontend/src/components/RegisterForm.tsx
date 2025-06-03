import { useState } from 'react';
import { registerUser, loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { Eye, EyeOff, UserPlus, LogIn, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ name: username, email, password });

      const res = await loginUser({ email, password });
      const { name, email: userEmail } = res.data.user;
      localStorage.setItem('token', res.data.token);

      setUser(name, userEmail);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Floating particles animation
  const particleVariants = {
    animate: {
      y: [0, -15, 0],
      x: [0, 8, 0],
      opacity: [0.2, 0.6, 0.2],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles around form */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-400/40 rounded-full"
            style={{
              left: `${45 + Math.random() * 10}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{
              delay: i * 0.8,
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
            }}
          />
        ))}

        {/* Subtle grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 py-7 border border-slate-700/50 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          {/* Card inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5 rounded-2xl" />
          
          <div className="relative z-10">
            {/* Header */}
            <motion.div 
              className="text-center mb-4"
              variants={itemVariants}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-sky-500/10 rounded-full mb-2"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <UserPlus className="w-8 h-8 text-sky-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-2">
                Join ClassTrack
              </h2>
              <p className="text-slate-400 text-sm">
                Create your account to start your learning journey
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <motion.input
                    type="text"
                    value={username}
                    required
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <motion.input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ 
                    scale: loading ? 1 : 1.02,
                    boxShadow: loading ? undefined : "0 10px 40px -10px rgba(14, 165, 233, 0.4)"
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div 
              className="my-3 mt-4 flex items-center"
              variants={itemVariants}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <span className="px-4 text-sm text-slate-400">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </motion.div>

            {/* Sign In Link */}
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <p className="text-slate-400 text-sm mb-4">
                Already have an account?
              </p>
              <Link to="/login">
                <motion.button
                  type="button"
                  className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 py-3 px-4 rounded-lg font-semibold transition-all duration-300 border border-slate-600 hover:border-slate-500 flex items-center justify-center gap-2"
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: "rgb(148 163 184 / 0.8)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LogIn className="w-5 h-5" />
                  Sign In Instead
                </motion.button>
              </Link>
            </motion.div>

            {/* Footer */}
            <motion.p 
              className="text-center text-xs text-slate-500 mt-6"
              variants={itemVariants}
            >
              Secure registration powered by ClassTrack
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}