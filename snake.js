/*
* Mark McGuire
* CIS 580
* Snake Game
*/
/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
//frontBuffer.parentNode.appendChild(backBuffer);
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var startTime = 0;
var runTime = 0;
var timeLimit = 60;
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
var startLength = 20;
var apples = [];
var score = 0;
var _direction = "Start";
var stepSize = snakeBody[0].size*.5;

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
    case 90:
    score = 90;
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
  spawnApple();
  // TODO: Grow the snake periodically
  growSnake();
  // TODO: Move the snake
  moveSnake();
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  detectEdge();
  // TODO: Determine if the snake has eaten an apple
  detectApple();
  // TODO: Determine if the snake has eaten its tail
  detectTail();
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

  // Time Limit Check
  if(timeLimit <= Math.floor(runTime/1000)) { _direction = "Limit"; }
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
  //debug for input detection
  // backCtx.fillStyle = 'black';
  // if(input.up) backCtx.fillRect(0,0,backBuffer.width, 10);
  // if(input.down) backCtx.fillRect(0,backBuffer.height-10,backBuffer.width, backBuffer.height);
  // if(input.left) backCtx.fillRect(0,0,10, backBuffer.height);
  // if(input.right) backCtx.fillRect(backBuffer.width-10,0,backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer

  // Draws the apples on screen
  apples.forEach(function(seg){
    backCtx.beginPath();
    backCtx.fillStyle = "red";
    backCtx.moveTo(seg.posX, seg.posY);
    backCtx.arc(seg.posX, seg.posY, seg.size, 0, 2 * Math.PI);
    backCtx.fill();
    backCtx.closePath();
  });

  // Draws the snakes body
  snakeBody.forEach(function(seg){
    backCtx.beginPath();
    backCtx.fillStyle = "green";
    backCtx.moveTo(seg.posX, seg.posY);
    backCtx.arc(seg.posX, seg.posY, seg.size, 0, 2 * Math.PI);
    backCtx.fill();
    backCtx.closePath();
  });

// Writes the Score and time left
  backCtx.fillStyle = 'black';
  backCtx.font = "18px serif";
  backCtx.textAlign = "left";
  backCtx.fillText("Score: " + score + " Time: " + (timeLimit - Math.floor(runTime/1000)), 15, 25);

  // Writes the Starting message
  if (_direction === "Start") {
    backCtx.font = "24px serif";
    backCtx.textAlign = "center";
    backCtx.fillText("Press Up or W to start", backBuffer.width*.5, backBuffer.height*.4);
  }

  // Displays when the snake loses
  backCtx.fillStyle = 'black';
  backCtx.font = "24px serif";
  backCtx.textAlign = "center";
  if (_direction === "hit") backCtx.fillText("Game Over", backBuffer.width*.5, backBuffer.height*.4);
  if (_direction === "hitSnake") backCtx.fillText("Game Over", backBuffer.width*.5, backBuffer.height*.4);
  if (_direction === "Limit") backCtx.fillText("Time Up! Final score is " + score, backBuffer.width*.5, backBuffer.height*.4);
};

/**
* @function spawnApple
* Spawns an apple on a random location on the canvas
*/
function spawnApple() {
  switch(_direction) {
    case "moveUp":
    case "moveDown":
    case "moveLeft":
    case "moveRight":
    // Starts the timer for the game
    if(startTime == 0) {startTime = Date.now()}
    runTime = Date.now() - startTime;
    var sampleTime = Math.floor(runTime/1000);
    // Check to make sure there is at least one apple at play
    if (apples.length == 0) {
      var ranX = backBuffer.width/2 + Math.pow(-1, Math.floor(Math.random()+.5))*(Math.random()*(backBuffer.width/2-10));
      var ranY = backBuffer.height/2 + Math.pow(-1, Math.floor(Math.random()+.5))*(Math.random()*(backBuffer.height/2-10));
      apples.push( {
        posX: ranX,
        posY: ranY,
        size: snakeBody[0].size*.75,
      } );
    }
    // Added a small percent chance of generating an extra apple
    if (Math.random() <= sampleTime*5/runTime) {
      var ranX = backBuffer.width/2 + Math.pow(-1, Math.floor(Math.random()+.5))*(Math.random()*(backBuffer.width/2-10));
      var ranY = backBuffer.height/2 + Math.pow(-1, Math.floor(Math.random()+.5))*(Math.random()*(backBuffer.height/2-10));
      apples.push( {
        posX: ranX,
        posY: ranY,
        size: snakeBody[0].size*.75,
      } );
    }
    break;
  }
};

/**
* @function growSnake
* Increases the snake's body size to match the default length plus the score
*/
function growSnake() {
  while(snakeBody.length != startLength + score) {
    snakeBody.push( {
      posX: snakeBody[snakeBody.length-1].posX,
      posY: snakeBody[snakeBody.length-1].posY,
      size: snakeBody[0].size*.6,
    } );
  };
};

/**
* @function moveSnake
* Moves the snake in the direction it's facing
*/
function moveSnake() {
  switch(_direction){
    case "moveUp":
    for(i=snakeBody.length-1; i>0; i--){
      snakeBody[i].posX = snakeBody[i-1].posX;
      snakeBody[i].posY = snakeBody[i-1].posY;
    }
    snakeBody[0].posY -= stepSize;
    if (input.left && !(input.right || input.up || input.down)) { _direction = "moveLeft"; }
    else if(input.right && !(input.left || input.up || input.down)) { _direction = "moveRight"; }
    // debug to keep snake on screen until edge detection is complete
    // if (snakeBody[0].posY == 0) _direction = "moveDown";
    break;
    case "moveDown":
    for(i=snakeBody.length-1; i>0; i--){
      snakeBody[i].posX = snakeBody[i-1].posX;
      snakeBody[i].posY = snakeBody[i-1].posY;
    }
    snakeBody[0].posY += stepSize;
    if (input.left && !(input.right || input.up || input.down)) { _direction = "moveLeft"; }
    else if(input.right && !(input.left || input.up || input.down)) { _direction = "moveRight"; }
    // debug to keep snake on screen until edge detection is complete
    // if (snakeBody[0].posY == backBuffer.height) _direction = "moveUp";
    break;
    case "moveLeft":
    for(i=snakeBody.length-1; i>0; i--){
      snakeBody[i].posX = snakeBody[i-1].posX;
      snakeBody[i].posY = snakeBody[i-1].posY;
    }
    snakeBody[0].posX -= stepSize;
    if (input.up && !(input.down || input.right || input.left)) { _direction = "moveUp"; }
    else if(input.down && !(input.up || input.right || input.left)) { _direction = "moveDown"; }
    // debug to keep snake on screen until edge detection is complete
    // if (snakeBody[0].posX == 0) _direction = "moveRight";
    break;
    case "moveRight":
    for(i=snakeBody.length-1; i>0; i--){
      snakeBody[i].posX = snakeBody[i-1].posX;
      snakeBody[i].posY = snakeBody[i-1].posY;
    }
    snakeBody[0].posX += stepSize;
    if (input.up && !(input.down || input.left)) { _direction = "moveUp"; }
    else if(input.down && !(input.up || input.left)) { _direction = "moveDown"; }
    // debug to keep snake on screen until edge detection is complete
    // if (snakeBody[0].posX == backBuffer.width) _direction = "moveLeft";
    break;
    case "Start":
    if (input.up && !(input.down || input.left || input.right)) { _direction = "moveUp"; }
    break;
  }
};

/**
* @function detectEdge
* Detects if the snake ran into it's own tail
*/
function detectEdge() {
  if(snakeBody[0].posX - snakeBody[0].size < 0 ) { _direction = "hit" }
  if(snakeBody[0].posX + snakeBody[0].size > backBuffer.width ) { _direction = "hit" }
  if(snakeBody[0].posY - snakeBody[0].size < 0 ) { _direction = "hit" }
  if(snakeBody[0].posY + snakeBody[0].size > backBuffer.height ) { _direction = "hit" }
};

/**
* @function detectApple
* Detects if the snake ate an apple, and increments score
*/
function detectApple() {
  for (i = 0; i < apples.length; i++) {
    var touchingLine = snakeBody[0].size + apples[i].size;
    var deltaX = Math.pow(snakeBody[0].posX - apples[i].posX, 2);
    var deltaY = Math.pow(snakeBody[0].posY - apples[i].posY, 2);;
    var distance = deltaX + deltaY;
    if (distance < touchingLine*touchingLine) {
      score++;
      var removed = apples.splice(i,1);
    }
  }
};

/**
* @function detectTail
* Detects if the snake ran into it's own tail
*/
function detectTail() {
  for (i = startLength; i < snakeBody.length; i++) {
    var touchingLine = snakeBody[0].size + snakeBody[i].size;
    var deltaX = Math.pow(snakeBody[0].posX - snakeBody[i].posX, 2);
    var deltaY = Math.pow(snakeBody[0].posY - snakeBody[i].posY, 2);;
    var distance = deltaX + deltaY;
    if (distance < touchingLine*touchingLine) {_direction = "hitSnake"}
  }
};
// TODO: [Extra Credit] Determine if the snake has run into an obstacle


/* Launch the game */
window.requestAnimationFrame(loop);
