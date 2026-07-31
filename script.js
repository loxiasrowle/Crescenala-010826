/* ===================================================================
   GREETING CARD — SCRIPT  (rewritten)
   =================================================================== */

(function () {
  'use strict';

  const card       = document.getElementById('card');
  const helperText = document.getElementById('helperText');
  const canvas     = document.getElementById('particles');
  const ctx        = canvas.getContext('2d');

  const closeBtn  = document.getElementById('closeBtn');
  let isOpen = false;
  let closeTimeout = null;

  // ---- Open card ----
  function openCard() {
    if (isOpen) return;
    isOpen = true;
    card.classList.add('opened');
    helperText.classList.add('hidden');
    // Show close button after the opening animation finishes
    closeTimeout = setTimeout(() => {
      closeBtn.classList.add('visible');
    }, 1200);
  }

  // ---- Close card ----
  function closeCard() {
    if (!isOpen) return;
    isOpen = false;
    card.classList.remove('opened');
    closeBtn.classList.remove('visible');
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
    // Re-show helper text after closing animation
    setTimeout(() => {
      if (!isOpen) helperText.classList.remove('hidden');
    }, 600);
  }

  card.addEventListener('click', (e) => {
    if (!isOpen) {
      openCard();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCard();
  });

  // ---- Floating particles (tiny hearts & sparkles) ----
  const PARTICLE_COUNT = 24;
  const particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(randomY) {
      this.reset();
      if (randomY) this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x       = Math.random() * canvas.width;
      this.y       = canvas.height + 10;
      this.size    = Math.random() * 5 + 3;
      this.speedY  = Math.random() * 0.22 + 0.08;
      this.speedX  = (Math.random() - 0.5) * 0.12;
      this.opacity = Math.random() * 0.22 + 0.06;
      this.type    = Math.random() > 0.5 ? 'heart' : 'sparkle';
      this.wobble  = Math.random() * Math.PI * 2;
      this.wobbleSpd = Math.random() * 0.007 + 0.003;
    }

    update() {
      this.y -= this.speedY;
      this.wobble += this.wobbleSpd;
      this.x += Math.sin(this.wobble) * 0.2 + this.speedX;
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      this.type === 'heart' ? this._heart() : this._sparkle();
      ctx.restore();
    }

    _heart() {
      const s = this.size;
      ctx.fillStyle = '#F6C8D4';
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.2, 0, s);
      ctx.bezierCurveTo(s, s * 0.2, s * 0.5, -s * 0.2, 0, s * 0.35);
      ctx.fill();
    }

    _sparkle() {
      const s = this.size * 0.55;
      ctx.fillStyle = '#F6C8D4';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a  = (Math.PI / 2) * i;
        const ia = a + Math.PI / 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
        else         ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
        ctx.lineTo(Math.cos(ia) * s * 0.3, Math.sin(ia) * s * 0.3);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(true));
  }

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) { p.update(); p.draw(); }
    requestAnimationFrame(animate);
  })();

})();
