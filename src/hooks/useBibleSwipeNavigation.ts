
import { useSwipeGestures } from './useSwipeGestures';
import { useNavigate } from 'react-router-dom';
import { hapticFeedback } from '@/utils/mobileUtils';

interface BibleSwipeNavigationConfig {
  onNextChapter?: () => void;
  onPreviousChapter?: () => void;
  onGoToSearch?: () => void;
  onGoToBookmarks?: () => void;
  enabled?: boolean;
}

export const useBibleSwipeNavigation = (config: BibleSwipeNavigationConfig) => {
  const {
    onNextChapter,
    onPreviousChapter,
    onGoToSearch,
    onGoToBookmarks,
    enabled = true
  } = config;

  const navigate = useNavigate();

  const { enableSwipes, disableSwipes, isEnabled } = useSwipeGestures({
    onSwipeLeft: () => {
      if (onNextChapter) {
        hapticFeedback.light();
        onNextChapter();
      }
    },
    onSwipeRight: () => {
      if (onPreviousChapter) {
        hapticFeedback.light();
        onPreviousChapter();
      }
    },
    onSwipeUp: () => {
      if (onGoToSearch) {
        hapticFeedback.medium();
        onGoToSearch();
      } else {
        hapticFeedback.medium();
        navigate('/bible/search');
      }
    },
    onSwipeDown: () => {
      if (onGoToBookmarks) {
        hapticFeedback.medium();
        onGoToBookmarks();
      } else {
        hapticFeedback.medium();
        navigate('/favorites');
      }
    },
    threshold: 60,
    enableHapticFeedback: true
  });

  // Enable/disable swipes based on the enabled prop
  if (enabled && !isEnabled) {
    enableSwipes();
  } else if (!enabled && isEnabled) {
    disableSwipes();
  }

  return {
    enableSwipes,
    disableSwipes,
    isSwipeEnabled: isEnabled
  };
};
