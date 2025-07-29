const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerSize = 20;
let playerX = (canvas.width - playerSize) / 2;
const playerY = canvas.height - playerSize - 10;
const playerSpeed = 7;

let leftPressed = false;
let rightPressed = false;

let blocks = [];
const blockWidth = 20;
const blockHeight = 20;
const blockSpeed = 3;

let score = 0;
let gameOver = false;

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = true;
  if (e.key === 'ArrowRight') rightPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = false;
  if (e.key === 'ArrowRight') rightPressed = false;
});

// Create falling blocks at random x positions
function spawnBlock() {
  const x = Math.floor(Math.random() * (canvas.width - blockWidth));
  blocks.push({ x, y: -blockHeight });
}

// Update game objects
function update() {
  if (gameOver) return;

  // Move player
  if (leftPressed && playerX > 0) playerX -= playerSpeed;
  if (rightPressed && playerX < canvas.width - playerSize) playerX += playerSpeed;

  // Move blocks down
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].y += blockSpeed;

    // Check collision with player
    if (
      blocks[i].x < playerX + playerSize &&
      blocks[i].x + blockWidth > playerX &&
      blocks[i].y < playerY + playerSize &&
      blocks[i].y + blockHeight > playerY
    ) {
      gameOver = true;
    }

    // Remove blocks that are off screen and increment score
    if (blocks[i].y > canvas.height) {
      blocks.splice(i, 1);
      i--;
      score++;
    }
  }
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player (green square)
  ctx.fillStyle = '#0f0';
  ctx.fillRect(playerX, playerY, playerSize, playerSize);

  // Draw blocks (red squares)
  ctx.fillStyle = '#f00';
  blocks.forEach(block => {
    ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
  });

  // If game over
  if (gameOver) {
    ctx.fillStyle = '#0f0';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
  }
}

// Game loop
function gameLoop() {
  update();
  draw();

  // Update score text
  document.getElementById('score').textContent = `Score: ${score}`;

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Spawn blocks every 1 second
setInterval(() => {
  if (!gameOver) spawnBlock();
}, 1000);

gameLoop();
