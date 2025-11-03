
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { enableIOSScrollOptimizations } from './utils/mobileUtils'

// Initialize iOS-specific optimizations
enableIOSScrollOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
