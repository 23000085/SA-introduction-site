document.addEventListener("DOMContentLoaded", function () {
  
  // ==========================================
  // 1. PARTICLE BACKGROUND (Canvas Animation)
  // ==========================================
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const colors = ["#00f2fe", "#4facfe", "#b224ef"];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let mouse = { x: null, y: null, radius: 150 };
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(0, 242, 254, " + (0.1 * (1 - dist / 120)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // ==========================================
  // 2. SCROLL EFFETS & FADE INS
  // ==========================================
  const faders = document.querySelectorAll('.fade-in');
  faders.forEach((fader, index) => {
    setTimeout(() => {
      fader.classList.add('visible');
    }, index * 200 + 100);
  });

  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const scrollTriggers = document.querySelectorAll('.scroll-trigger');
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        const stats = entry.target.querySelectorAll('.stat-num');
        if (stats.length > 0) {
          stats.forEach(stat => startCounter(stat));
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  scrollTriggers.forEach(trigger => {
    scrollObserver.observe(trigger);
  });


  // ==========================================
  // 3. STATS NUMERICAL COUNTER
  // ==========================================
  function startCounter(el) {
    if (el.dataset.noScroll === "true") return; 
    
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / target), 15);
    
    const timer = setInterval(() => {
      current += Math.ceil(target / 40);
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = current + suffix;
      }
    }, stepTime);
  }


  // ==========================================
  // 4. RESEARCH FIELDS TAB SYSTEM
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      const targetTab = button.dataset.tab;
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });


  // ==========================================
  // 5. MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
  });

  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = mobileMenuBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });


  // ==========================================
  // 6. SYSTEM CLOCK / FOOTER TIMESTAMP
  // ==========================================
  const clockElement = document.getElementById('techClock');
  
  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, '/');
    clockElement.innerHTML = '<span style="color: rgba(255,255,255,0.4)">SYSTEM_LOG //</span> ' + dateString + ' ' + timeString + ' <span style="color: var(--color-success)">// ONLINE</span>';
  }
  
  setInterval(updateClock, 1000);
  updateClock();

});
