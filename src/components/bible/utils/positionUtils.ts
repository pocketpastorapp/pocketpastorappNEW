
export const calculateOptimalPosition = (rect: DOMRect) => {
  const buttonBarHeight = 60; // Approximate height of the button bar
  const margin = 10;
  const viewportHeight = window.innerHeight;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  console.log('Position calculation:', {
    rect: {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height
    },
    scrollY,
    viewportHeight
  });
  
  // Calculate position relative to the document (absolute positioning)
  let top = rect.bottom + scrollY + margin;
  let left = rect.left;
  
  // Check if this is likely the last verse by checking if it's in the bottom portion of the viewport
  // and if there's not enough space below for the button bar
  const spaceBelow = viewportHeight - rect.bottom;
  const isNearBottom = spaceBelow < buttonBarHeight + margin + 100; // 100px buffer for navigation buttons
  
  // Check if the buttons would appear below the viewport or if we're near the bottom
  const buttonBarBottom = rect.bottom + buttonBarHeight + margin;
  if (buttonBarBottom > viewportHeight || isNearBottom) {
    // Position above the element instead
    top = rect.top + scrollY - buttonBarHeight - margin;
    console.log('Positioning above element due to viewport constraints or near bottom');
  }
  
  // Ensure left position doesn't go off-screen
  const maxLeft = window.innerWidth - 320;
  left = Math.min(left, maxLeft);
  left = Math.max(left, 10); // Minimum left margin
  
  const finalPosition = { top, left };
  console.log('Final button position (document relative):', finalPosition);
  
  return finalPosition;
};
