
export const checkIfElementIsHighlighted = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  return element.getAttribute('data-highlight-type') === 'permanent' ||
         element.classList.contains('bg-yellow-200') ||
         element.classList.contains('dark:bg-yellow-800');
};

export const checkIfRangeIsHighlighted = (range: Range | null): boolean => {
  if (!range) return false;
  
  const tempHighlights = document.querySelectorAll('[data-highlight-type="temporary"]');
  return Array.from(tempHighlights).some(highlight => 
    highlight.getAttribute('data-highlight-type') === 'permanent' ||
    highlight.classList.contains('bg-yellow-200') ||
    highlight.classList.contains('dark:bg-yellow-800')
  );
};
