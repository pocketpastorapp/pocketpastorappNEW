
import React, { useEffect } from 'react';
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const SwipeableSonner = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  // Add swipe gesture support to toast notifications
  useEffect(() => {
    const handleToastMounted = () => {
      // Find all toast elements and attach swipe gestures
      const toastElements = document.querySelectorAll('[data-sonner-toast]');
      
      toastElements.forEach((toastElement) => {
        if (!toastElement.hasAttribute('data-swipe-enabled')) {
          toastElement.setAttribute('data-swipe-enabled', 'true');
          
          // Create swipe handler for this specific toast
          let startTouch: { x: number; y: number; time: number } | null = null;
          
          const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            startTouch = {
              x: touch.clientX,
              y: touch.clientY,
              time: Date.now()
            };
          };
          
          const handleTouchMove = (e: TouchEvent) => {
            if (!startTouch) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startTouch.x;
            const deltaY = touch.clientY - startTouch.y;
            
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            if (absDeltaX > 10 || absDeltaY > 10) {
              const opacity = Math.max(0.3, 1 - (Math.max(absDeltaX, absDeltaY) / 200));
              const translateX = deltaX * 0.5;
              const translateY = deltaY * 0.3;
              
              (toastElement as HTMLElement).style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
              (toastElement as HTMLElement).style.opacity = opacity.toString();
            }
          };
          
          const handleTouchEnd = (e: TouchEvent) => {
            if (!startTouch) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startTouch.x;
            const deltaY = touch.clientY - startTouch.y;
            const deltaTime = Date.now() - startTouch.time;
            
            // Reset transform
            (toastElement as HTMLElement).style.transform = '';
            (toastElement as HTMLElement).style.opacity = '';
            
            if (deltaTime > 500 || deltaTime < 50) {
              startTouch = null;
              return;
            }
            
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            const threshold = 50;
            
            const isHorizontalSwipe = absDeltaX > threshold && absDeltaX > absDeltaY;
            const isVerticalSwipe = absDeltaY > threshold && absDeltaY > absDeltaX && deltaY < 0;
            
            if (isHorizontalSwipe || isVerticalSwipe) {
              // Get the toast ID and dismiss it
              const toastId = toastElement.getAttribute('data-sonner-toast-id');
              if (toastId) {
                toast.dismiss(toastId);
              } else {
                // Fallback: click the close button if it exists
                const closeButton = toastElement.querySelector('[data-close-button]');
                if (closeButton) {
                  (closeButton as HTMLElement).click();
                }
              }
            }
            
            startTouch = null;
          };
          
          toastElement.addEventListener('touchstart', handleTouchStart, { passive: true });
          toastElement.addEventListener('touchmove', handleTouchMove, { passive: true });
          toastElement.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
      });
    };

    // Use MutationObserver to detect when new toasts are added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.hasAttribute('data-sonner-toast') || element.querySelector('[data-sonner-toast]')) {
                setTimeout(handleToastMounted, 100);
              }
            }
          });
        }
      });
    });

    // Start observing
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Initial check for existing toasts
    setTimeout(handleToastMounted, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      duration={3000}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-white group-[.toast]:dark:bg-gray-800 group-[.toast]:text-gray-800 group-[.toast]:dark:text-gray-200 group-[.toast]:opacity-100 group-[.toast]:hover:bg-gray-100 group-[.toast]:dark:hover:bg-gray-700 group-[.toast]:border-2 group-[.toast]:border-gray-400 group-[.toast]:dark:border-gray-500 group-[.toast]:rounded-md group-[.toast]:h-8 group-[.toast]:w-8 group-[.toast]:min-h-[32px] group-[.toast]:min-w-[32px] group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:shadow-lg group-[.toast]:font-bold !important",
        },
      }}
      {...props}
    />
  );
};

export { SwipeableSonner as Toaster, toast };
