// src/utils/viewport-fix.ts

/**
 * Sets the CSS custom property --vh to 1% of the window height.
 * This fixes the issue with viewport height on mobile browsers,
 * especially iOS Safari where 100vh doesn't account for the address bar.
 */
export const setViewportHeight = (): void => {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

/**
 * Sets up viewport height fix and attaches a resize listener
 */
export const setupViewportHeightFix = (): (() => void) => {
  // Initial setup
  setViewportHeight();

  // Handle resize events
  const handleResize = () => {
    // Throttle resize events - don't update on every pixel change
    window.requestAnimationFrame(() => {
      setViewportHeight();
    });
  };

  // We listen to the resize event
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
};

export default setupViewportHeightFix;
