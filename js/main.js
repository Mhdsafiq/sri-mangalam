// Sri Mangalam — Scroll Animations & Interactions

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. SCROLL-ANIMATED HERO (Tamil Content)
  // =============================================
  const heroSection = document.getElementById('heroSection');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const canvas = document.getElementById('heroCanvas');
  
  if (heroSection) {
    // Canvas setup
    let ctx, images = [];
    const frameCount = 176;
    if (canvas) {
      ctx = canvas.getContext('2d');
      canvas.width = 1280;
      canvas.height = 590;
      
      // Preload frames
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `images/hero-frames/hero_frame_${paddedIndex}.jpg`;
        img.onload = () => {
          // Draw first frame immediately
          if (i === 0) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        images.push(img);
      }
    }

    
    const updateHeroAnimations = () => {
      const rect = heroSection.getBoundingClientRect();
      const sectionHeight = heroSection.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress within the hero section (0 to 1)
      // The sticky container is 100vh, the section is 300vh
      // So we have 200vh of scroll room (300vh - 100vh)
      const scrollRoom = sectionHeight - viewportHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollRoom);
      

      // Update Canvas Frame based on scroll progress
      if (canvas && ctx && images.length > 0) {
        // Map 0-1 progress to 0-175 frame index
        const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
        if (images[frameIndex] && images[frameIndex].complete) {
          ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
        }
      }

      // Hide scroll indicator after first scroll
      if (scrollIndicator) {
        scrollIndicator.style.opacity = progress > 0.05 ? '0' : '1';
        scrollIndicator.style.transition = 'opacity 0.4s ease';
      }
    };
    
    // Use requestAnimationFrame for smooth 60fps performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHeroAnimations();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial call
    updateHeroAnimations();
  }

  // =============================================
  // 2. STATS COUNTER ANIMATION
  // =============================================
  const counters = document.querySelectorAll('.num');
  
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    if (!target) return;
    
    const duration = 2000;
    const stepTime = Math.max(10, Math.floor(duration / target));
    let current = 0;
    
    // Prevent double animation
    if (el.dataset.animating === 'true' || el.dataset.animated === 'true') return;
    el.dataset.animating = 'true';
    
    const timer = setInterval(() => {
      const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));
      current += increment;
      
      if (current >= target) {
        el.innerText = target + (target > 100 ? '+' : '');
        el.dataset.animated = 'true';
        el.dataset.animating = 'false';
        clearInterval(timer);
      } else {
        el.innerText = current;
      }
    }, stepTime);
  };

  // Intersection Observer for Stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numElement = entry.target.querySelector('.num');
        if (numElement) {
          animateCounter(numElement);
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stat-bubble').forEach(bubble => {
    statsObserver.observe(bubble);
  });

  // =============================================
  // 3. SMOOTH SCROLLING for internal links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // =============================================
  // 4. FADE-UP ANIMATIONS (Intersection Observer)
  // =============================================
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => {
    fadeObserver.observe(el);
  });

  // =============================================
  // 5. PILL NAV — Hide on Scroll Down, Show on Scroll Up
  // =============================================
  let lastScroll = 0;
  const nav = document.getElementById('pillNav');
  
  if (nav) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50 && currentScroll > lastScroll) {
        nav.classList.add('scrolled-down');
      } else {
        nav.classList.remove('scrolled-down');
      }
      lastScroll = currentScroll;
    });
  }

  // =============================================
  // 6. WOW ABOUT US - STICKY SCROLL STORY
  // =============================================
  const storyBlocks = document.querySelectorAll('.wow-legacy-block');
  const storyImages = document.querySelectorAll('.wow-bg-img');
  
  if (storyBlocks.length > 0 && storyImages.length > 0) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Highlight active text block
          storyBlocks.forEach(b => b.classList.remove('active'));
          entry.target.classList.add('active');
          
          // Cross-fade to matching image
          const targetImageId = entry.target.getAttribute('data-image');
          storyImages.forEach(img => {
            if (img.id === targetImageId) {
              img.classList.add('active');
            } else {
              img.classList.remove('active');
            }
          });
        }
      });
    }, { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" });
    
    storyBlocks.forEach(block => storyObserver.observe(block));
  }

  // =============================================
  // 7. WOW ABOUT US - HOVER EXPANSION CARDS
  // =============================================
  const featureCards = document.querySelectorAll('.wow-feature-card');
  
  if (featureCards.length > 0) {
    featureCards.forEach(card => {
      // For desktop hover (CSS handles most of it, but JS ensures exclusivity on click for mobile)
      card.addEventListener('click', () => {
        featureCards.forEach(c => c.classList.remove('expanded'));
        card.classList.add('expanded');
      });
      
      // Also trigger on mouseenter to ensure smooth state changes
      card.addEventListener('mouseenter', () => {
        featureCards.forEach(c => c.classList.remove('expanded'));
        card.classList.add('expanded');
      });
    });
  }

});
