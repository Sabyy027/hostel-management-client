import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <p className="text-slate-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
