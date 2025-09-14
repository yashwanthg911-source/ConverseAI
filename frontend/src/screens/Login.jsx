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

    // Forgot Password States
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const submitHandler = async (e) => {
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

        try {
            const res = await axios.post('/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    const handlePasswordReset = async () => {
        setResetError('');
        setResetSuccess('');

        if (!forgotEmail || !newPassword || !confirmPassword) {
            setResetError('All fields are required.');
            return;
        }

        if (newPassword.length < 6) {
            setResetError('Password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setResetError('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post('/users/forgot-password', {
                email: forgotEmail,
                newPassword,
                confirmPassword,
            });

            setResetSuccess(res.data.message || 'Password updated successfully');
            setForgotEmail('');
            setNewPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                setShowForgotModal(false);
                setResetSuccess('');
            }, 2000);
        } catch (error) {
            setResetError(error.response?.data?.message || 'Something went wrong');
        }
    };

    // 🔁 Clear form and close modal
    const handleCancelReset = () => {
        setForgotEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setResetError('');
        setResetSuccess('');
        setShowForgotModal(false);
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
        <>
            {/* 🔓 Forgot Password Modal */}
            {showForgotModal && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="modal-content w-[90%] max-w-md" style={{ backgroundColor: '#f1f0ff', padding: '20px', borderRadius: '10px' }}>
                        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            style={{ backgroundColor: 'white', marginBottom: '10px' }}
                            className="w-full p-2 rounded mb-2"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ backgroundColor: 'white', marginBottom: '10px' }}
                            className="w-full p-2 rounded mb-2"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ backgroundColor: 'white', marginBottom: '10px' }}
                            className="w-full p-2 rounded mb-4"
                        />

                        {resetError && <p className="text-red-600 text-sm mb-2">{resetError}</p>}
                        {resetSuccess && <p className="text-green-600 text-sm mb-2">{resetSuccess}</p>}

                        <button
                            onClick={handlePasswordReset}
                            style={{ backgroundColor: '#673ab7' }}
                            className="w-full text-white py-2 rounded mb-2"
                        >
                            Change Password
                        </button>

                        <p
                            onClick={handleCancelReset}
                            className="text-center text-sm text-blue-700 hover:underline cursor-pointer"
                        >
                            Cancel
                        </p>
                    </div>
                </div>
            )}

            {/* Main Login Layout */}
            <div className="min-h-screen flex">
                <div
                    className="w-[70%] bg-cover bg-center hidden md:block"
                    style={{ backgroundImage: 'url("/image.png")' }}
                ></div>

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

                                <p style={{ marginTop: '10px' }}>
                                    <span
                                        style={{ color: '#673ab7', cursor: 'pointer' }}
                                        onClick={() => setShowForgotModal(true)}
                                    >
                                        Forgot Password?
                                    </span>
                                </p>
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
        </>
    );
};

export default Login;
