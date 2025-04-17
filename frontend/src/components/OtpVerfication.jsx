import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const email = localStorage.getItem('email');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            toast.error('Please enter the 6-digit OTP.');
            return;
        }

        if (!email) {
            toast.error('Email is missing for OTP verification.');
            return;
        }

        const resultAction = await dispatch(verifyOtp({ email: email, otp_code: code }));
        if (verifyOtp.fulfilled.match(resultAction)) {
            toast.success('OTP verified successfully!');
            navigate('/dashboard');
        } else {
            toast.error(resultAction.payload || 'OTP verification failed.');
        }
    };

    const handleResend = async () => { 
        const resultAction = await dispatch(resendOtp(email));
        if (resendOtp.fulfilled.match(resultAction)) {
            toast.success('OTP resent successfully!');
        } else {
            toast.error(resultAction.payload || 'Failed to resend OTP.');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#161b22] flex items-center justify-center relative overflow-hidden">
            <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,#1f6feb22,transparent_50%),radial-gradient(circle_at_70%_70%,#23863622,transparent_50%)] animate-pulse -z-10"></div>

            <div className="bg-[#161b22] text-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#30363d]">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#c9d1d9]">Enter Verification Code</h2>

                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                    <div className="flex space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                                className="w-12 h-12 text-center text-xl rounded-md bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] focus:outline-none focus:border-[#1f6feb]"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold py-3 px-6 rounded-md transition-colors"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>

                <p className="text-sm text-center text-[#8b949e] mt-6">
                    Didn't receive the code? <button className="text-[#58a6ff] hover:underline cursor-pointer" onClick={handleResend}>Resend</button>
                </p>
            </div>
        </div>
    );
};

export default OtpVerification;
