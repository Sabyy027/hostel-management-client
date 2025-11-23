import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message);
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <UIContext.Provider value={{ showToast, showLoading, hideLoading }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
      {loading && <LoadingSpinner fullScreen message={loadingMessage} />}
    </UIContext.Provider>
  );
};
