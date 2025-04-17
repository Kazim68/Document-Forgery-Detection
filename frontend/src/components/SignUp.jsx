import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(resultAction)) {
            localStorage.setItem('email', formData.email);
            toast.success('Registration successful!');
            navigate('/verify-otp');
        } else {
            toast.error(resultAction.payload || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#161b22] flex items-center justify-center relative overflow-hidden">
            {/* Background bubbles / graphics */}
            <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,#1f6feb22,transparent_50%),radial-gradient(circle_at_70%_70%,#23863622,transparent_50%)] animate-pulse -z-10"></div>

            {/* Sign up card */}
            <div className="bg-[#161b22] text-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#30363d]">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#c9d1d9]">Create Your Account</h2>

                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                        className="px-4 py-3 rounded-md bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] focus:outline-none focus:border-[#1f6feb]"
                    />
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold py-3 rounded-md transition-colors"
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>

                <p className="text-sm text-center text-[#8b949e] mt-6">
                    Already have an account? <Link to="/signin" className="text-[#58a6ff] hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
