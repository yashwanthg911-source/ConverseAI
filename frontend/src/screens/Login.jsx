import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const submitHandler = (e) => {
        e.preventDefault();

        setError('');
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid Email');
            isValid = false;
        }

        if (password.length < 6) {
            setPasswordError('Invalid Password');
            isValid = false;
        }

        if (!isValid) return;

        axios.post('/users/login', { email, password })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                setUser(res.data.user);
                navigate('/');
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Invalid credentials');
            });
    };

    const darkStyles = darkMode
        ? {
              formContainer: 'bg-gray-900 text-white',
              label: 'text-gray-300',
              input: 'bg-gray-800 text-white border border-gray-700 focus:ring-blue-500',
              checkboxLabel: 'text-gray-300',
              link: 'text-blue-400',
          }
        : {
              formContainer: 'bg-white/70 text-gray-800',
              label: 'text-gray-700',
              input: 'bg-gray-100 text-gray-800 focus:ring-blue-500',
              checkboxLabel: 'text-gray-700',
              link: 'text-blue-700',
          };

    return (
        <div className="min-h-screen flex">
            {/* Left: background image */}
            <div
                className="w-[70%] bg-cover bg-center hidden md:block"
                style={{ backgroundImage: 'url("/image.png")' }}
            ></div>

            {/* Right: form */}
            <div className="w-full md:w-[30%] flex items-center justify-center bg-transparent backdrop-blur-sm">
                <div className={`relative backdrop-blur-xl p-10 rounded-lg shadow-black shadow-2xl w-full max-w-md ${darkStyles.formContainer}`}>
                    {/* Dark Mode Toggle */}
                    <div className="absolute top-4 right-4 flex items-center">
                        <input
                            type="checkbox"
                            id="darkModeToggle"
                            className="mr-2"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <label htmlFor="darkModeToggle" className={`text-sm font-medium ${darkStyles.label}`}>
                            Dark Mode
                        </label>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

                    {error && <p className="text-red-500 text-base mb-4">{error}</p>}

                    <form onSubmit={submitHandler}>
                        <div className="mb-5">
                            <label htmlFor="email" className={`block text-lg mb-2 ${darkStyles.label}`}>Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-4 rounded text-base focus:outline-none focus:ring-2 ${darkStyles.input} ${emailError ? 'border border-red-500' : ''}`}
                                placeholder="Enter your email"
                                required
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className={`block text-lg mb-2 ${darkStyles.label}`}>Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full p-4 rounded text-base focus:outline-none focus:ring-2 ${darkStyles.input} ${passwordError ? 'border border-red-500' : ''}`}
                                placeholder="Enter your password"
                                required
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

                            <div className="mt-3">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    className="mr-2"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label htmlFor="showPassword" className={`text-base font-medium ${darkStyles.checkboxLabel}`}>Show Password</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 p-4 rounded bg-blue-600 text-white text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>

                    <p className={`text-center mt-6 text-base font-medium ${darkStyles.label}`}>
                        Don’t have an account?{' '}
                        <Link to="/register" className={`hover:underline font-semibold ${darkStyles.link}`}>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
