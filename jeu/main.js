const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Jeu - assets
const background = new Image();
const walkableMask = new Image();
const foreground = new Image();
const walkableCanvas = document.createElement("canvas");
const walkableContext = walkableCanvas.getContext("2d");
const playerSprites = {
  down: new Image(),
  up: new Image(),
  left: new Image(),
  right: new Image(),
  downRight: new Image(),
  upRight: new Image(),
  downLeft: new Image(),
  upLeft: new Image(),
};

background.src = "imagesjeu/Fond.png";
walkableMask.src = "imagesjeu/walkable_area.png";
foreground.src = "imagesjeu/foreground.png";
playerSprites.down.src = "imagesjeu/walk/WalkDown.png";
playerSprites.up.src = "imagesjeu/walk/WalkUp.png";
playerSprites.left.src = "imagesjeu/walk/WalkLeft.png";
playerSprites.right.src = "imagesjeu/walk/WalkRight.png";
playerSprites.downRight.src = "imagesjeu/walk/WDRight.png";
playerSprites.upRight.src = "imagesjeu/walk/WURight.png";
playerSprites.downLeft.src = "imagesjeu/walk/WDLeft.png";
playerSprites.upLeft.src = "imagesjeu/walk/WULeft.png";

const frameWidth = 32;
const frameHeight = 32;
const frameCount = 4;
const animationSpeed = 18;
const playerScale = 2;
let currentFrame = 0;
let animationTick = 0;
let lastDirection = "down";
let worldWidth = 0;
let worldHeight = 0;

// Jeu - spawn
const playerSpawn = {
  x: 837,
  y: 875,
  useRatio: false,
};

// Jeu - joueur
const player = {
  x: 0,
  y: 0,
  speed: 4 / 9,
  width: 32,
  height: 32,
  displayWidth: frameWidth * playerScale,
  displayHeight: frameHeight * playerScale,
};

const playerFrame = {
  x: 0,
  y: 0,
  width: frameWidth,
  height: frameHeight,
};

// Jeu - controles
const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function setKey(event, isPressed) {
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "z") {
    keys.up = isPressed;
    event.preventDefault();
  }

  if (key === "arrowdown" || key === "s") {
    keys.down = isPressed;
    event.preventDefault();
  }

  if (key === "arrowleft" || key === "q") {
    keys.left = isPressed;
    event.preventDefault();
  }

  if (key === "arrowright" || key === "d") {
    keys.right = isPressed;
    event.preventDefault();
  }
}

window.addEventListener("keydown", (event) => setKey(event, true));
window.addEventListener("keyup", (event) => setKey(event, false));

// Jeu - canvas
function setupWorldCanvas() {
  worldWidth = background.naturalWidth;
  worldHeight = background.naturalHeight;
  canvas.width = worldWidth;
  canvas.height = worldHeight;
  context.imageSmoothingEnabled = false;
  canvas.style.setProperty("--world-ratio", worldWidth / worldHeight);
}

function getPlayerSpawnPosition() {
  if (playerSpawn.useRatio) {
    return {
      x: worldWidth * playerSpawn.x - player.displayWidth / 2,
      y: worldHeight * playerSpawn.y - player.displayHeight,
    };
  }

  return {
    x: playerSpawn.x - player.displayWidth / 2,
    y: playerSpawn.y - player.displayHeight,
  };
}

function applyPlayerSpawn() {
  const spawnPosition = getPlayerSpawnPosition();
  const maxX = Math.max(0, worldWidth - player.displayWidth);
  const maxY = Math.max(0, worldHeight - player.displayHeight);

  player.x = Math.max(0, Math.min(spawnPosition.x, maxX));
  player.y = Math.max(0, Math.min(spawnPosition.y, maxY));
}

window.setPlayerSpawn = function setPlayerSpawn(x, y) {
  playerSpawn.x = x;
  playerSpawn.y = y;
  playerSpawn.useRatio = false;
  applyPlayerSpawn();

  console.log(`Spawn joueur: x=${Math.round(x)}, y=${Math.round(y)}`);
};

window.getPlayerPosition = function getPlayerPosition() {
  const position = {
    x: Math.round(player.x + player.displayWidth / 2),
    y: Math.round(player.y + player.displayHeight),
  };

  console.log(position);
  return position;
};

function getMouseMapPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

canvas.addEventListener("click", (event) => {
  const mapPosition = getMouseMapPosition(event);

  console.log({
    x: Math.round(mapPosition.x),
    y: Math.round(mapPosition.y),
  });
});

// Jeu - collisions
function prepareWalkableMask() {
  walkableCanvas.width = walkableMask.width;
  walkableCanvas.height = walkableMask.height;
  walkableContext.imageSmoothingEnabled = false;
  walkableContext.drawImage(walkableMask, 0, 0);
}

function canvasToMapPoint(x, y) {
  return {
    x,
    y,
  };
}

function isWalkableAt(x, y) {
  const footX = x + player.displayWidth / 2;
  const footY = y + player.displayHeight;
  const mapPoint = canvasToMapPoint(footX, footY);
  const pixelX = Math.max(0, Math.min(Math.floor(mapPoint.x), walkableCanvas.width - 1));
  const pixelY = Math.max(0, Math.min(Math.floor(mapPoint.y), walkableCanvas.height - 1));
  const pixel = walkableContext.getImageData(pixelX, pixelY, 1, 1).data;

  return pixel[0] >= 220 && pixel[1] >= 220 && pixel[2] >= 220;
}

// Jeu - boucle
function updatePlayer() {
  let nextX = player.x;
  let nextY = player.y;
  const verticalDirection = keys.up ? "up" : keys.down ? "down" : "";
  const horizontalDirection = keys.left ? "Left" : keys.right ? "Right" : "";
  let requestedDirection = `${verticalDirection}${horizontalDirection}` || lastDirection;

  if (keys.up) {
    nextY -= player.speed;
  }

  if (keys.down) {
    nextY += player.speed;
  }

  if (keys.left) {
    nextX -= player.speed;
  }

  if (keys.right) {
    nextX += player.speed;
  }

  if (requestedDirection === "Left") {
    requestedDirection = "left";
  }

  if (requestedDirection === "Right") {
    requestedDirection = "right";
  }

  nextX = Math.max(0, Math.min(nextX, Math.max(0, worldWidth - player.displayWidth)));
  nextY = Math.max(0, Math.min(nextY, Math.max(0, worldHeight - player.displayHeight)));

  const previousX = player.x;
  const previousY = player.y;

  if (isWalkableAt(nextX, player.y)) {
    player.x = nextX;
  }

  if (isWalkableAt(player.x, nextY)) {
    player.y = nextY;
  }

  const isMoving = player.x !== previousX || player.y !== previousY;

  if (isMoving) {
    lastDirection = requestedDirection;
    animationTick += 1;

    if (animationTick >= animationSpeed) {
      currentFrame = (currentFrame + 1) % frameCount;
      animationTick = 0;
    }
  } else {
    currentFrame = 0;
    animationTick = 0;
  }
}

function drawScene() {
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(background, 0, 0);

  context.drawImage(
    playerSprites[lastDirection],
    currentFrame * frameWidth,
    0,
    playerFrame.width,
    playerFrame.height,
    player.x,
    player.y,
    player.displayWidth,
    player.displayHeight
  );

  context.drawImage(foreground, 0, 0);
}

function gameLoop() {
  updatePlayer();
  drawScene();
  requestAnimationFrame(gameLoop);
}

background.addEventListener("error", () => {
  console.error("Impossible de charger le fond : imagesjeu/Fond.png");
});

walkableMask.addEventListener("error", () => {
  console.error("Impossible de charger le masque : imagesjeu/walkable_area.png");
});

foreground.addEventListener("error", () => {
  console.error("Impossible de charger le premier plan : imagesjeu/foreground.png");
});

Object.entries(playerSprites).forEach(([direction, sprite]) => {
  sprite.addEventListener("error", () => {
    console.error(`Impossible de charger le personnage ${direction}`);
  });
});

Promise.all([
  background.decode(),
  walkableMask.decode(),
  foreground.decode(),
  ...Object.values(playerSprites).map((sprite) => sprite.decode()),
]).then(() => {
  setupWorldCanvas();
  prepareWalkableMask();
  applyPlayerSpawn();
  gameLoop();
});
