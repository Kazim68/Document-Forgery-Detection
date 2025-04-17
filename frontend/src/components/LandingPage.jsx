import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-3xl text-[#c9d1d9] mb-6 text-center">
                Welcome to the Forgery Detection System
            </h1>
            <button
                onClick={handleRedirect}
                className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold px-6 py-2 rounded-md transition-all"
            >
                Get Started
            </button>
        </div>
    );
};

export default LandingPage;
