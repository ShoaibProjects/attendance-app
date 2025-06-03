import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="group relative ring-1 ring-red-400 text-white py-2 px-5 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50"
    >
      <span className="flex items-center gap-2">
        <svg 
          className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
        Logout
      </span>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-700 ease-in-out" />
    </button>
  );
}