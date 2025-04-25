import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';
import useRecaptcha from './UseRecaptcha.jsx';
import { verifyRecaptcha } from '../api/captcha.js';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!capchaToken) {
            toast.error("Please complete the reCAPTCHA.");
            return;
        }
        // verify on backend
        try {
            await verifyRecaptcha(capchaToken);
        } catch (err) {
            toast.error("reCAPTCHA failed verification.");
            return;
        }

        const resultAction = await dispatch(loginUser(formData));
        console.log(resultAction);
        if (loginUser.fulfilled.match(resultAction)) {
            toast.success('Login successful!');
            //navigate('/dashboard');
        } else {
            if (resultAction?.payload?.detail == "Email not verified.") {
                toast.error("Email not verified. Please verify your email to login.");
                navigate("/verify-otp", { replace: true });
                return;
            }
            else {
                toast.error(resultAction.payload || 'Login failed');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#161b22] flex items-center justify-center relative overflow-hidden">
            {/* Background bubbles / graphics */}
            <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,#1f6feb22,transparent_50%),radial-gradient(circle_at_70%_70%,#23863622,transparent_50%)] animate-pulse -z-10"></div>

            {/* Sign up card */}
            <div className="bg-[#161b22] text-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#30363d]">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#c9d1d9]">Login to Your Account</h2>

                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        onChange={handleChange}
                        required
                        className="px-4 py-3 rounded-md bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] focus:outline-none focus:border-[#1f6feb]"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        required
                        className="px-4 py-3 rounded-md bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] focus:outline-none focus:border-[#1f6feb]"
                    />

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_SITE_KEY}
                            onChange={handleRecaptcha}
                            theme="dark"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold py-3 rounded-md transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>

                <p className="text-sm text-center text-[#8b949e] mt-6">
                    Don't have an account? <Link to="/signup" className="text-[#58a6ff] hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
