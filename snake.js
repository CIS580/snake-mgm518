/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
//frontBuffer.parentNode.appendChild(backBuffer);
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var input = {
  up: false,
  down: false,
  left: false,
  right: false,
};
var snakeBody = [ {
  posX: backBuffer.width*(1/2),
  posY: backBuffer.height*(7/8),
  size: 10,
  //direction: "up",
} ];
var apples = [];
var _direction = "moveUp";
var stepSize = snakeBody[0].size*.5;
snakeBody.push( {
  posX: snakeBody[snakeBody.length-1].posX,
  posY: snakeBody[snakeBody.length-1].posY,
  size: snakeBody[snakeBody.length-1].size,
  lengthScale: snakeBody[snakeBody.length-1].lengthScale,
  //direction: snakeBody[snakeBody.length-1].direction,
} );
snakeBody.push( {
  posX: snakeBody[snakeBody.length-1].posX,
  posY: snakeBody[snakeBody.length-1].posY,
  size: snakeBody[snakeBody.length-1].size,
  lengthScale: snakeBody[snakeBody.length-1].lengthScale,
  //direction: snakeBody[snakeBody.length-1].direction,
} );

window.onkeydown = function(event) {
  //console.log(event);
  //console.log(event.keyCode);
  event.preventDefault();
  switch(event.keyCode) {
    //up
    case 38:
    case 87:
      input.up = true;
      break;
    //left
    case 37:
    case 65:
      input.left = true;
      break;
    //right
    case 39:
    case 68:
      input.right = true;
      break;
    //down
    case 40:
    case 83:
      input.down = true;
      break;
  }
}
window.onkeyup = function(event) {
  //console.log(event);
  //console.log(event.keyCode);
  switch(event.keyCode) {
    //up
    case 38:
    case 87:
      input.up = false;
      break;
    //left
    case 37:
    case 65:
      input.left = false;
      break;
    //right
    case 39:
    case 68:
      input.right = false;
      break;
    //down
    case 40:
    case 83:
      input.down = false;
      break;
  }
}
/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;

  update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Spawn an apple periodically
  // spawnApple();
  // TODO: Grow the snake periodically
  // growSnake();
  // TODO: Move the snake
  moveSnake();
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);
  backCtx.fillStyle = 'white';
  backCtx.fillRect(0,0,backBuffer.width, backBuffer.height);
  //debug
  backCtx.fillStyle = 'black';
  if(input.up) backCtx.fillRect(0,0,backBuffer.width, 10);
  if(input.down) backCtx.fillRect(0,backBuffer.height-10,backBuffer.width, backBuffer.height);
  if(input.left) backCtx.fillRect(0,0,10, backBuffer.height);
  if(input.right) backCtx.fillRect(backBuffer.width-10,0,backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer
  snakeBody.forEach(function(seg){
    backCtx.beginPath();
    backCtx.fillStyle = "green";
    backCtx.moveTo(seg.posX, seg.posY);
    backCtx.arc(seg.posX, seg.posY, seg.size, 0, 2 * Math.PI);
    backCtx.fill();
    backCtx.closePath();
  });

};

/**
  * @function spawnApple
  * Spawns an apple on a random location on the canvas
  */
  function spawnApple() {

  };

/**
  * @function moveSnake
  * Moves the snake in the direction it's facing
  */
  function moveSnake() {
    for(i=snakeBody.length-1; i>0; i--){
      snakeBody[i].posX = snakeBody[i-1].posX;
      snakeBody[i].posY = snakeBody[i-1].posY;
    }
    switch(_direction){
      case "moveUp":
        snakeBody[0].posY -= stepSize;
        if (input.left && !(input.right || input.up || input.down)) { _direction = "moveLeft"; }
        else if(input.right && !(input.left || input.up || input.down)) { _direction = "moveRight"; }
        //debug
        if (snakeBody[0].posY == 0) _direction = "moveDown";
      break;
      case "moveDown":
        snakeBody[0].posY += stepSize;
        if (input.left && !(input.right || input.up || input.down)) { _direction = "moveLeft"; }
        else if(input.right && !(input.left || input.up || input.down)) { _direction = "moveRight"; }
        //debug
        if (snakeBody[0].posY == backBuffer.height) _direction = "moveUp";
      break;
      case "moveLeft":
        snakeBody[0].posX -= stepSize;
        if (input.up && !(input.down || input.right || input.left)) { _direction = "moveUp"; }
        else if(input.down && !(input.up || input.right || input.left)) { _direction = "moveDown"; }
        //debug
        if (snakeBody[0].posX == 0) _direction = "moveRight";
      break;
      case "moveRight":
        snakeBody[0].posX += stepSize;
        if (input.up && !(input.down || input.left)) { _direction = "moveUp"; }
        else if(input.down && !(input.up || input.left)) { _direction = "moveDown"; }
        //debug
        if (snakeBody[0].posX == backBuffer.width) _direction = "moveLeft";
      break;
    }
  };


/* Launch the game */
window.requestAnimationFrame(loop);
