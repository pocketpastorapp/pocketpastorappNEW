
import { useEffect, useRef } from 'react';
import { trapFocus, handleEscapeKey, announceToScreenReader } from '@/utils/accessibilityUtils';

interface UseAccessibilityOptions {
  trapFocusOnMount?: boolean;
  announceOnMount?: string;
  handleEscape?: () => void;
  restoreFocusOnUnmount?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    trapFocusOnMount = false,
    announceOnMount,
    handleEscape,
    restoreFocusOnUnmount = false
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store the previously focused element
    if (restoreFocusOnUnmount) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Announce to screen readers
    if (announceOnMount) {
      announceToScreenReader(announceOnMount);
    }

    // Setup focus trap
    let cleanupFocusTrap: (() => void) | undefined;
    if (trapFocusOnMount && elementRef.current) {
      cleanupFocusTrap = trapFocus(elementRef.current);
    }

    // Setup escape key handler
    let cleanupEscapeHandler: (() => void) | undefined;
    if (handleEscape) {
      cleanupEscapeHandler = handleEscapeKey(handleEscape);
    }

    return () => {
      cleanupFocusTrap?.();
      cleanupEscapeHandler?.();
      
      // Restore focus to previously focused element
      if (restoreFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [trapFocusOnMount, announceOnMount, handleEscape, restoreFocusOnUnmount]);

  return {
    elementRef,
    announce: announceToScreenReader
  };
};
