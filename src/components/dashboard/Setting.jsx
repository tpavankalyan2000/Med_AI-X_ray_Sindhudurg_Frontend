import { useState } from "react";
import { motion } from "framer-motion";

const Setting = () => {
  return (
    <div className="h-full flex items-center justify-center">
      {/* Police-style Under Process Banner with Barriers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-white p-6 rounded-lg shadow-lg text-center max-w-2xl mx-auto relative"
      >
        {/* Barrier Stripes */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 via-white to-blue-100 opacity-40"></div>

        {/* Banner Icon */}
        <div className="absolute top-0 left-0 right-0 flex justify-center items-center mt-3">
          <div className="h-4 w-4 rounded-full bg-gray-400"></div>
          <div className="h-4 w-4 rounded-full bg-gray-400 mx-1"></div>
          <div className="h-4 w-4 rounded-full bg-gray-400"></div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-extrabold mb-4 text-blue-700">
          🚧 Under Process 🚧
        </h1>
        <p className="text-lg font-medium text-gray-700">
          The conversion process is currently under development. Please check back later.
        </p>

        {/* Barrier at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-400 h-6 flex justify-center items-center">
          <div className="bg-yellow-500 w-1/6 h-2 mx-1"></div>
          <div className="bg-yellow-500 w-1/6 h-2 mx-1"></div>
          <div className="bg-yellow-500 w-1/6 h-2 mx-1"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Setting;
