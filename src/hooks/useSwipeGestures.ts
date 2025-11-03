
import { useEffect, useRef, useState, useCallback } from 'react';
import { hapticFeedback } from '@/utils/mobileUtils';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmove?: boolean;
  enableHapticFeedback?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGestures = (config: SwipeConfig) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmove = false,
    enableHapticFeedback = true
  } = config;

  const startTouch = useRef<TouchPoint | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const isCleanedUp = useRef(false);

  // Memoized event handlers to prevent recreating on every render
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isEnabled || isCleanedUp.current) return;
    
    const touch = e.touches[0];
    startTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [isEnabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isCleanedUp.current) return;
    
    if (preventDefaultTouchmove) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isEnabled || !startTouch.current || isCleanedUp.current) return;

    const touch = e.changedTouches[0];
    const endTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = endTouch.x - startTouch.current.x;
    const deltaY = endTouch.y - startTouch.current.y;
    const deltaTime = endTouch.time - startTouch.current.time;

    // Ignore if too slow (longer than 300ms) or too short
    if (deltaTime > 300 || deltaTime < 50) {
      startTouch.current = null;
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        // Swipe right
        if (enableHapticFeedback) hapticFeedback.light();
        onSwipeRight?.();
      } else {
        // Swipe left
        if (enableHapticFeedback) hapticFeedback.light();
        onSwipeLeft?.();
      }
    } else if (absDeltaY > threshold && absDeltaY > absDeltaX) {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe down
        if (enableHapticFeedback) hapticFeedback.light();
        onSwipeDown?.();
      } else {
        // Swipe up
        if (enableHapticFeedback) hapticFeedback.light();
        onSwipeUp?.();
      }
    }

    startTouch.current = null;
  }, [isEnabled, threshold, enableHapticFeedback, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (isCleanedUp.current) return;
    
    const element = document.body;
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    
    isCleanedUp.current = true;
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const enableSwipes = useCallback(() => setIsEnabled(true), []);
  const disableSwipes = useCallback(() => setIsEnabled(false), []);

  useEffect(() => {
    if (isCleanedUp.current) return;
    
    const element = document.body;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmove });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return cleanup;
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouchmove, cleanup]);

  // Additional cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { enableSwipes, disableSwipes, isEnabled, cleanup };
};
