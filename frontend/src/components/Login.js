import React, { useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from '../redux/userSlice';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin ? { email, password } : { name, username, email, password };
      const res = await axios.post(`${USER_API_END_POINT}${endpoint}`, payload, {
        headers: { 'Content-Type': "application/json" },
        withCredentials: true,
      });
      
      if (res.data.success) {
        if (isLogin) {
          dispatch(getUser(res.data.user));
          navigate("/");
        } else {
          setIsLogin(true);
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loginSignupHandler = () => setIsLogin(!isLogin);

  // Inline styles for the hover effect
  const formStyle = {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered ? "0px 10px 20px rgba(0, 0, 0, 0.1)" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
      <div
        className="bg-white rounded-lg p-8 max-w-lg w-full"
        style={formStyle}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
      >
        <div className="text-center mb-8">
          <img 
            className="mx-auto w-20 mb-4" 
            src="/logo.png" 
            alt="logo"
          />
          <h2 className="text-3xl font-bold text-gray-800">{isLogin ? "Login" : "Signup"}</h2>
          <p className="text-gray-700 text-sm">{isLogin ? "Welcome back! Please log in." : "Sign up to join us!"}</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Full Name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Username" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </>
          )}
          <div>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold transition-all hover:bg-indigo-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Please Wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"} 
            <span 
              onClick={loginSignupHandler} 
              className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-700"
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
