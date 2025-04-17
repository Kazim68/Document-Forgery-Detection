import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-5xl font-bold text-[#c9d1d9] mb-4">404</h1>
      <p className="text-lg text-[#8b949e] mb-6">Oops, the page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-[#238636] hover:bg-[#2ea043] text-white font-semibold px-6 py-2 rounded-md">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
