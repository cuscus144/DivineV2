/**
 * Hero component: entrance animations and mouse parallax.
 * This module adds the 'animate-in' class on load and creates
 * a subtle depth effect by moving floating cards based on mouse position.
 */

(function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // 1. Trigger entrance animations
  const addAnimationClass = () => {
    hero.classList.add('animate-in');
  };

  // Use requestAnimationFrame to ensure the browser paints before adding class
  requestAnimationFrame(() => {
    addAnimationClass();
  });

  // 2. Mouse parallax for floating cards
  const floatingCards = hero.querySelectorAll('.floating-card');
  if (floatingCards.length === 0) return;

  let isParallaxActive = false;
  let animationFrameId = null;

  const handleMouseMove = (e) => {
    if (!isParallaxActive) {
      isParallaxActive = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1

    // Map to translation offsets (max ±12px)
    const offsetX = (x - 0.5) * 24;
    const offsetY = (y - 0.5) * 24;

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(() => {
      floatingCards.forEach((card, index) => {
        // Each card moves with a slightly different intensity for depth
        const factor = 0.6 + (index * 0.2);
        const dx = offsetX * factor;
        const dy = offsetY * factor;
        // Preserve existing rotation and float animation by using a translate
        // We apply translate3d for hardware acceleration
        card.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    });
  };

  const resetParallax = () => {
    isParallaxActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    floatingCards.forEach((card) => {
      card.style.transform = '';
    });
  };

  // Only enable parallax on non-touch devices (mouse available) and if screen width > 820px
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice && window.innerWidth > 820) {
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', resetParallax);
  }

  // Re-check on resize: if width drops below 820, remove listeners
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth <= 820) {
        hero.removeEventListener('mousemove', handleMouseMove);
        hero.removeEventListener('mouseleave', resetParallax);
        resetParallax();
      } else if (!isTouchDevice) {
        // Re-attach if we removed and now width is > 820
        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', resetParallax);
      }
    }, 200);
  };

  window.addEventListener('resize', handleResize);

  // Cleanup on page unload (optional)
  // Note: we are not removing event listeners on unload because it's a single-page app,
  // but we could if needed. For completeness, we can keep them.
})();