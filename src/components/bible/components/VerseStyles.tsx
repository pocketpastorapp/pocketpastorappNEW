
import React, { useEffect } from 'react';

const VerseStyles = () => {
  useEffect(() => {
    // Create a style element and inject the CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .verse {
        position: relative;
        margin-bottom: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .verse:hover {
        background-color: rgba(24, 68, 130, 0.1);
      }
      
      .verse-number {
        font-weight: 600;
        color: #6b7280;
        margin-right: 0.5rem;
        font-size: 0.875rem;
        user-select: none;
      }
      
      .verse.selected {
        background-color: rgba(24, 68, 130, 0.2);
        border: 2px solid rgba(24, 68, 130, 0.5);
      }
      
      .verse-boundary {
        border: 2px solid rgba(24, 68, 130, 0.5);
        background-color: rgba(24, 68, 130, 0.1);
      }
      
      .verse-boundary.multiple-selection {
        border-color: rgba(168, 85, 247, 0.5);
        background-color: rgba(168, 85, 247, 0.1);
      }

      /* Favorite verse highlight */
      .favorite-verse-highlight {
        background-color: rgba(239, 68, 68, 0.15) !important;
        border-left: 4px solid rgba(239, 68, 68, 0.6) !important;
        padding-left: 8px !important;
      }

      .favorite-verse-highlight:hover {
        background-color: rgba(239, 68, 68, 0.2) !important;
      }

      /* Temporary selection styles using navy blue */
      .bg-blue-200 {
        background-color: rgba(24, 68, 130, 0.2) !important;
      }
      
      .dark\\:bg-blue-800 {
        background-color: rgba(24, 68, 130, 0.3) !important;
      }

      /* Multi-selection styles using navy blue */
      .bg-blue-100 {
        background-color: rgba(24, 68, 130, 0.15) !important;
      }
      
      .dark\\:bg-blue-900 {
        background-color: rgba(24, 68, 130, 0.25) !important;
      }

      .border-blue-400 {
        border-color: rgba(24, 68, 130, 0.6) !important;
      }

      .dark\\:border-blue-600 {
        border-color: rgba(24, 68, 130, 0.7) !important;
      }

      /* Updated highlight colors - keep same hue with slight transparency for better readability */
      .bg-yellow-200 {
        background-color: rgba(235, 216, 17, 0.6) !important;
      }
      
      .dark\\:bg-yellow-800 {
        background-color: rgba(208, 165, 8, 0.55) !important;
      }
    `;
    
    document.head.appendChild(styleElement);

    // Cleanup function to remove styles when component unmounts
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return null;
};

export default VerseStyles;
