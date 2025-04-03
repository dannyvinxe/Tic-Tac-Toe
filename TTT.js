const board = document.getElementById('board');
const result = document.getElementById('result');
const restartBtn = document.getElementById('restartBtn');
const toggleParticlesBtn = document.getElementById('toggleParticles');
const particleCanvas = document.getElementById('particleCanvas');
let currentPlayer = 'X';
let cells = ['', '', '', '', '', '', '', '', ''];
let particlesActive = true;

function renderBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = cells[index];
    });
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    return winPatterns.some(pattern => 
        pattern.every(index => cells[index] === currentPlayer)
    );
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (cells[index] || result.textContent) return;

    cells[index] = currentPlayer;
    renderBoard();

    if (checkWin()) {
        result.textContent = `${currentPlayer} wins!`;
        return;
    }

    if (cells.every(cell => cell)) {
        result.textContent = `It's a draw!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function restartGame() {
    cells.fill('');
    currentPlayer = 'X';
    result.textContent = '';
    renderBoard();
}

function createParticles() {
    const ctx = particleCanvas.getContext('2d');
    const particles = [];
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 5 + 1,
            speedX: Math.random() * 3 - 1.5,
            speedY: Math.random() * 3 - 1.5,
            color: `rgba(255, 255, 255, ${Math.random()})`
        });
    }

    function animateParticles() {
        if (!particlesActive) return;

        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(particle => {
            particle.x += particle.speedX / 2;
            particle.y += particle.speedY / 2;

            if (particle.x > particleCanvas.width || particle.x < 0) particle.speedX *= -1;
            if (particle.y > particleCanvas.height || particle.y < 0) particle.speedY *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

toggleParticlesBtn.addEventListener('click', () => {
    particlesActive = !particlesActive;
    particleCanvas.style.display = particlesActive ? 'block' : 'none';
});

board.addEventListener('click', handleClick);
restartBtn.addEventListener('click', restartGame);

renderBoard();
createParticles();
