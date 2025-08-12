import React from 'react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Spline */}
      <div className="relative h-screen">
        <Spline scene="https://prod.spline.design/eMRb5nQ2pqJ9mMRN/scene.splinecode" />
        
        {/* Signup Button */}
        <div className="absolute top-8 right-8 z-10">
          <Link
            to="/auth/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
