// Função para obter a string da URL
function getStringFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('text') || 'VOCÊ';
}

function generateLetters(text) {
  const balloonDiv = document.getElementById('balloon');
  balloonDiv.innerHTML = '';
  const animations = ['balloon1', 'balloon2', 'balloon3', 'balloon4'];
  const colors = [
    'rgba(182, 15, 97, 0.9)',
    'rgba(242, 112, 45, 0.9)',
    'rgba(45, 181, 167, 0.9)',
    'rgba(190, 61, 244, 0.9)',
    'rgba(180, 224, 67, 0.9)',
    'rgba(242, 194, 58, 0.9)',
  ];

  for (let i = 0; i < text.length; i++) {
    const letterDiv = document.createElement('div');
    const letterSpan = document.createElement('span');
    letterSpan.textContent = text[i];
    letterDiv.appendChild(letterSpan);

    letterDiv.style.left = `${i * 120}px`;
    letterDiv.style.background = colors[i % colors.length];
    letterDiv.style.boxShadow = `inset 10px 10px 10px ${
      colors[i % colors.length]
    }`;
    letterDiv.style.animation = `${
      animations[i % animations.length]
    } 6s ease-in-out infinite`;

    balloonDiv.appendChild(letterDiv);
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function changeColor() {
  const title = document.getElementById('title');
  title.style.color = getRandomColor();
}

const text = getStringFromUrl();
generateLetters(text);

setInterval(changeColor, 500);

function createFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Firework {
    constructor(x, y, targetX, targetY, hue) {
      this.x = x;
      this.y = y;
      this.targetX = targetX;
      this.targetY = targetY;
      this.hue = hue;
      this.history = [];
      this.angle = Math.atan2(targetY - y, targetX - x);
      this.speed = 1;
      this.acceleration = 1.05;
      this.brightness = Math.random() * 60 + 50;
      this.alpha = 1;
      this.fade = 0.03;

      for (let i = 0; i < 3; i++) {
        this.history.push({ x: this.x, y: this.y });
      }
    }

    update() {
      this.history.pop();
      this.history.unshift({ x: this.x, y: this.y });
      this.speed *= this.acceleration;

      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;

      this.x += vx;
      this.y += vy;

      if (
        Math.abs(this.x - this.targetX) < this.speed &&
        Math.abs(this.y - this.targetY) < this.speed
      ) {
        this.alpha = 0;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(
        this.history[this.history.length - 1].x,
        this.history[this.history.length - 1].y
      );
      ctx.lineTo(this.x, this.y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.stroke();
    }
  }

  const fireworks = [];
  let hue = 120;

  function animate() {
    requestAnimationFrame(animate);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    if (Math.random() < 0.5) {
      const startX = Math.random() * canvas.width;
      const startY = canvas.height;
      const targetX = Math.random() * canvas.width;
      const targetY = (Math.random() * canvas.height) / 2;
      fireworks.push(new Firework(startX, startY, targetX, targetY, hue));
      hue += 20;
    }

    fireworks.forEach((firework, index) => {
      firework.update();
      firework.draw();
      if (firework.alpha <= 0) {
        fireworks.splice(index, 1);
      }
    });
  }

  animate();
}

createFireworks();
