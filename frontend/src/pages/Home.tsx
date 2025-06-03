// src/pages/Home.tsx
import { useUserStore } from '../store/useUserStore';
import { Link } from 'react-router-dom';
import AttendanceSearchForm from '../components/AttendanceSearchForm';
import LogoutButton from '../components/LogOutBtn';
import { FiLogIn, FiUserPlus, FiCalendar, FiHome, FiTrendingUp, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const { name, isLoggedIn } = useUserStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Floating particles animation
  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Grid animation
  const gridVariants = {
    animate: {
      opacity: [0.1, 0.3, 0.1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-w-screen min-h-screen relative overflow-hidden text-slate-100 p-4 sm:p-6 flex flex-col justify-center items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sky-900/20 via-transparent to-cyan-900/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(14, 165, 233, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(6, 182, 212, 0.1) 100%)",
              "linear-gradient(225deg, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(14, 165, 233, 0.1) 100%)",
              "linear-gradient(45deg, rgba(14, 165, 233, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(6, 182, 212, 0.1) 100%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
          variants={gridVariants}
          animate="animate"
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sky-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{
              delay: i * 0.5,
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
            }}
          />
        ))}

        {/* Large floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Animated border lines */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4
          }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
            delay: 1.5
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {!isLoggedIn ? (
          <motion.div 
            className="w-full max-w-md m-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="bg-slate-800/70 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all relative overflow-hidden"
            >
              {/* Card inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="p-4 bg-sky-500/10 rounded-full"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiTrendingUp className="text-4xl text-sky-400" />
                  </motion.div>
                </div>
                
                <motion.h1 
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300"
                >
                  Welcome to ClassTrack
                </motion.h1>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-slate-300 mb-8 text-sm sm:text-base leading-relaxed"
                >
                  Seamlessly track your attendance for all your coding classes. Stay on top of your learning journey!
                </motion.p>
                
                <motion.div 
                  variants={containerVariants}
                  className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/login"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
                    >
                      <FiLogIn className="text-lg" />
                      Login
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-slate-600/30 hover:-translate-y-0.5"
                    >
                      <FiUserPlus className="text-lg" />
                      Register
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="mt-8 text-xs text-slate-500"
            >
              Empowering the next generation of coders.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.header 
              className="flex flex-col sm:flex-row justify-between items-center mb-8 py-4 border-b border-slate-700"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-sky-500/10 rounded-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiHome className="text-2xl text-sky-400" />
                </motion.div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                    Attendance Dashboard
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Welcome back, <span className="font-semibold text-sky-400">{name}</span>!
                  </p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
                  <FiUser className="text-sky-400" />
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <LogoutButton />
              </div>
            </motion.header>

            <motion.div 
              className="bg-slate-800/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {/* Card inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-cyan-500/5 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <FiCalendar className="text-2xl text-sky-400" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-200">
                    Search Your Attendance
                  </h2>
                </div>
                <AttendanceSearchForm username={name} />
              </div>
            </motion.div>

            <motion.footer 
              className="mt-12 text-center text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>Track. Analyze. Improve.</p>
            </motion.footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;