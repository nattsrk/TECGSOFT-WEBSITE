/* =========================================================
   TECGS — Main JavaScript
   Animations, Interactions, Neural Network
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initTypewriter();
  initNeuralNetwork();
  initMobileNav();
});

/* --- Navbar scroll effect --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* --- Mobile Nav --- */
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll-triggered fade animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Animated counters --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = el.getAttribute('data-count');
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const numericTarget = parseInt(target.replace(/,/g, ''));
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * numericTarget);

    let formatted = current.toLocaleString();
    el.textContent = prefix + formatted + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Typewriter effect for hero --- */
function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;

  const lines = el.getAttribute('data-typewriter').split('|');
  el.innerHTML = '';

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;

  function createLine() {
    currentLineEl = document.createElement('div');
    el.appendChild(currentLineEl);
    charIndex = 0;
    typeChar();
  }

  function typeChar() {
    if (charIndex < lines[lineIndex].length) {
      currentLineEl.textContent += lines[lineIndex][charIndex];
      charIndex++;
      setTimeout(typeChar, 50);
    } else {
      lineIndex++;
      if (lineIndex < lines.length) {
        setTimeout(createLine, 200);
      } else {
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        currentLineEl.appendChild(cursor);
        setTimeout(() => cursor.style.display = 'none', 3000);
      }
    }
  }

  setTimeout(createLine, 500);
}

/* --- Neural Network Canvas Animation --- */
function initNeuralNetwork() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, nodes, animationId;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    const count = Math.min(Math.floor((width * height) / 15000), 80);
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(197, 163, 85, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(node => {
      node.pulse += 0.02;
      const pulseSize = Math.sin(node.pulse) * 0.5 + 1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(197, 163, 85, 0.6)';
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulseSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(197, 163, 85, 0.05)';
      ctx.fill();

      // Move
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });
}

/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
