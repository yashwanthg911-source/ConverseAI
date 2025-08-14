import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Load dark mode from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
        }
    }, []);

    // Save dark mode preference to localStorage
    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    function submitHandler(e) {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setConfirmError('');
        setError('');

        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid Email');
            isValid = false;
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        if (password !== confirmPassword) {
            setConfirmError('Passwords do not match');
            isValid = false;
        }

        if (!isValid) return;

        axios.post('/users/register', { email, password })
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                navigate('/');
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Registration failed');
            });
    }

    return (
        <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            {/* Left image */}
            <div
                className="w-[70%] bg-cover bg-center"
                style={{ backgroundImage: 'url("/image.png")' }}
            ></div>

            {/* Right form */}
            <div className={`w-[30%] flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-transparent'} backdrop-blur-sm`}>
                <div className={`p-10 rounded-lg shadow-2xl w-full max-w-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white/70 text-gray-800'}`}>
                    {/* Dark mode toggle */}
                    <div className="flex justify-end mb-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                                className="form-checkbox h-5 w-5"
                            />
                            <span className="text-base font-medium">{darkMode ? 'Dark' : 'Light'} Mode</span>
                        </label>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

                    {error && <p className="text-red-500 text-base mb-4">{error}</p>}

                    <form onSubmit={submitHandler}>
                        {/* Email */}
                        <div className="mb-5">
                            <label className="block text-lg font-semibold mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-4 rounded text-base focus:outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${emailError ? 'border border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                                placeholder="Enter your email"
                                required
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        {/* New Password */}
                        <div className="mb-5">
                            <label className="block text-lg font-semibold mb-2" htmlFor="password">New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full p-4 rounded text-base focus:outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${passwordError ? 'border border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                                placeholder="Enter new password"
                                required
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-5">
                            <label className="block text-lg font-semibold mb-2" htmlFor="confirm">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full p-4 rounded text-base focus:outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${confirmError ? 'border border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                                placeholder="Confirm password"
                                required
                            />
                            {confirmError && <p className="text-red-500 text-sm mt-1">{confirmError}</p>}
                        </div>

                        {/* Show password checkbox */}
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                    className="mr-2"
                                />
                                <span className="text-base font-medium">Show Passwords</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full mt-4 p-4 rounded bg-blue-600 text-white text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </form>

                    {/* Switch to login */}
                    <p className="text-center mt-6 text-base font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-700 hover:underline font-semibold">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
