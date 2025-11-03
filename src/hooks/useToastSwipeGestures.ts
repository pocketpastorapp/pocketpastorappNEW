
import { useEffect, useRef, useCallback } from 'react';
import { hapticFeedback } from '@/utils/mobileUtils';

interface ToastSwipeConfig {
  onSwipeClose: () => void;
  threshold?: number;
  enableHapticFeedback?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useToastSwipeGestures = (config: ToastSwipeConfig) => {
  const {
    onSwipeClose,
    threshold = 50,
    enableHapticFeedback = true
  } = config;

  const startTouch = useRef<TouchPoint | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startTouch.current || !elementRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.current.x;
    const deltaY = touch.clientY - startTouch.current.y;

    // Apply visual feedback during swipe
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > 10 || absDeltaY > 10) {
      const opacity = Math.max(0.3, 1 - (Math.max(absDeltaX, absDeltaY) / 200));
      const translateX = deltaX * 0.5;
      const translateY = deltaY * 0.3;
      
      elementRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      elementRef.current.style.opacity = opacity.toString();
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!startTouch.current || !elementRef.current) return;

    const touch = e.changedTouches[0];
    const endTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = endTouch.x - startTouch.current.x;
    const deltaY = endTouch.y - startTouch.current.y;
    const deltaTime = endTouch.time - startTouch.current.time;

    // Reset transform
    elementRef.current.style.transform = '';
    elementRef.current.style.opacity = '';

    // Ignore if too slow or too short
    if (deltaTime > 500 || deltaTime < 50) {
      startTouch.current = null;
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check for swipe gestures
    const isHorizontalSwipe = absDeltaX > threshold && absDeltaX > absDeltaY;
    const isVerticalSwipe = absDeltaY > threshold && absDeltaY > absDeltaX && deltaY < 0; // Only upward swipes

    if (isHorizontalSwipe || isVerticalSwipe) {
      if (enableHapticFeedback) hapticFeedback.light();
      onSwipeClose();
    }

    startTouch.current = null;
  }, [threshold, enableHapticFeedback, onSwipeClose]);

  const attachToElement = useCallback((element: HTMLElement | null) => {
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchstart', handleTouchStart);
      elementRef.current.removeEventListener('touchmove', handleTouchMove);
      elementRef.current.removeEventListener('touchend', handleTouchEnd);
    }

    elementRef.current = element;

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: true });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('touchstart', handleTouchStart);
        elementRef.current.removeEventListener('touchmove', handleTouchMove);
        elementRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { attachToElement };
};
