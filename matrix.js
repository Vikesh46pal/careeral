(function () {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, columns, drops;
  const fontSize = 14;                 // small for subtlety
  const density = 0.6;                 // lower = fewer columns lit
  const speedMin = 2;
  const speedMax = 6;
  const charset = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    columns = Math.floor(w / fontSize);
    drops = Array.from({ length: columns }, () => ({
      y: Math.floor(Math.random() * h),
      speed: speedMin + Math.random() * (speedMax - speedMin),
      on: Math.random() < density
    }));
  }

  function draw() {
    // gentle fade to create trails
    ctx.fillStyle = 'rgba(10, 16, 28, 0.10)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columns; i++) {
      const d = drops[i];
      if (!d.on && Math.random() < 0.003) d.on = true;       // occasionally turn on
      if (d.on) {
        const char = charset[Math.floor(Math.random() * charset.length)];
        const x = i * fontSize;
        const y = d.y * fontSize;

        // soft green tones with variation
        const alpha = 0.35 + Math.random() * 0.25;           // 0.35–0.60
        const g = 180 + Math.floor(Math.random() * 50);      // vary green channel
        ctx.fillStyle = `rgba(80, ${g}, 120, ${alpha})`;
        ctx.fillText(char, x, y);

        d.y += d.speed * 0.05;                                // slow drift
        if (y > h + 50) {
          d.y = -Math.random() * 20;
          d.speed = speedMin + Math.random() * (speedMax - speedMin);
          d.on = Math.random() < density * 0.8;               // occasionally stay off
        }
      } else if (Math.random() < 0.001) {
        // rare spontaneous dim pixel
        const x = i * fontSize;
        const y = (Math.random() * h) | 0;
        ctx.fillStyle = 'rgba(60, 140, 90, 0.08)';
        ctx.fillRect(x, y, 2, 2);
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
