import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UIProvider } from './context/UIContext.jsx'

const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
      <p className="text-slate-600 font-medium">Loading...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <Suspense fallback={<SuspenseFallback />}>
        <App />
      </Suspense>
    </UIProvider>
  </StrictMode>,
)
