/* Author: Nicholas Parker Stanford

 */
$(document).ready(function() {
	//Aquire the context of the canvas
	var game_canvas = $('#snake');
	var ctx = game_canvas[0].getContext('2d');

	//game constants
	BLOCK_SIZE = 10;
	//the size of one of the squares in the game
	INIT_SNAKE_LENGTH = 10;
	INIT_Y = 1;
	INIT_X = 1;
	GAME_HEIGHT = game_canvas.height() / BLOCK_SIZE;
	GAME_WIDTH = game_canvas.width() / BLOCK_SIZE;
	BLOCK_GAP = 1;
	DEFAULT_DIR = 'right';
	BORDER_WIDTH = 5;

	//game variables
	var snake;
	var foodLoc = new Coordinate();
	var score;
	var paused;
	var d;  
	var dx; //the current change in the direction of the snake
	var dy; //the vertical change
	//the current direction

	//sets the initial values for the snake, randomly places a dot
	function init() {
		dx = 1;
		dy = 0;
		paused = false;
		
		//clear screen
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.rect(0, 0, GAME_HEIGHT*BLOCK_SIZE, GAME_WIDTH*BLOCK_SIZE);
		ctx.fill();
		
		
		drawBorder();
		score = 0;
		snake = new snakeObj(INIT_SNAKE_LENGTH);
		//draw the entire snake
		for (var i = 0; i < snake.body.length; i++) {
			var x = snake.body[i].x;
			var y = snake.body[i].y;
			drawSquare(x, y, 'blue');
		};

		drawNewFood(true);

		d = DEFAULT_DIR;

	}

	//erases the last square and draws a new first square
	function update() {
		
		if (paused) {
			return;
		}

		//see where new movement is and if it is on food
		var head = snake.head();
		var newHead = new Coordinate(head.x + dx, head.y + dy);

		if (newHead.x == foodLoc.x && newHead.y == foodLoc.y) {
			snake.body.push(newHead);
			drawNewFood(true);
			score++;
		} else {
			//check for collisions
			if (checkBorder(newHead) || checkCollision(newHead)) {
				console.log('game over');
				gameOver();
				return;
			}
			snake.body.push(newHead);
			tail = snake.body.shift();
			drawSquare(tail.x, tail.y, 'white');
			drawSquare(snake.head().x, snake.head().y, 'blue');
			drawNewFood(false);
		}
		
		//redraw the border in case the snake screws it up
		drawBorder();
		
		score_text = 'score: ' + score;
		ctx.fillText(score_text, 5, GAME_HEIGHT*BLOCK_SIZE - 5);
		
	}

	/****
	 * Utility functions
	 */
	//constructer for a coordinate object
	function Coordinate(x, y) {
		this.x = x;
		this.y = y;
	}

	//constructer for snake object
	function snakeObj(size) {
		snakeArray = [];
		for (var i = 0; i < size; i++) {
			var point = new Coordinate(i + INIT_X, INIT_Y);
			snakeArray.push(point);
		};
		this.body = snakeArray;

		this.head = function() {
			return this.body[this.body.length - 1];
		}

		this.tail = function() {
			return this.body[0];
		}

		this.curDir = 'right';
	}

	//draw a square
	function drawSquare(x, y, color) {
		x = x * BLOCK_SIZE;
		y = y * BLOCK_SIZE;
		ctx.beginPath();
		ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
		ctx.fillStyle = color;
		ctx.fill();

		ctx.lineWidth = BLOCK_GAP;
		ctx.strokeStyle = 'white';
		ctx.stroke();

	}

	//draw the game border
	function drawBorder() {
		ctx.beginPath();
		ctx.rect(0, 0, GAME_HEIGHT * BLOCK_SIZE, GAME_WIDTH * BLOCK_SIZE);
		ctx.lineWidth = BORDER_WIDTH;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}

	//draws a new food part, if true, or redraws the old one if false
	function drawNewFood(newFood) {
		if (newFood) {
			foodLoc.x = Math.round(Math.random() * GAME_WIDTH);
			foodLoc.y = Math.round(Math.random() * GAME_HEIGHT);
		}
		//draw the food
		drawSquare(foodLoc.x, foodLoc.y, 'blue');
	}

	//register handler for keypress
	$(document).keydown(function(e) {
		var key = e.which;
		console.log('key pressed:' + key);
		if (key == '37')
			d = 'left';
		else if (key == '38')
			d = 'up';
		else if (key == '39')
			d = 'right';
		else if (key == '40')
			d = 'down';
		else if (key == '32')
			d = 'space';
			
		//get current direction from controls
		if (d == 'right' && snake.curDir != 'left') {
			dx = 1;
			dy = 0;
			snake.curDir = 'right';
		} else if (d == 'up' && snake.curDir != 'down') {
			dx = 0;
			dy = -1;
			snake.curDir = 'up';
		}
		if (d == 'left' && snake.curDir != 'right') {
			dx = -1;
			dy = 0;
			snake.curDir = 'left';
		}
		if (d == 'down' && snake.curDir != 'up') {
			dx = 0;
			dy = 1;
			snake.curDir = 'down';
		}
		if (d == 'space') {
			if (paused) paused = false;
			else paused = true;
		}
		
	});
	
	//check boundaries
	function checkBorder(newHead){
		if ((newHead.x >= GAME_WIDTH) || (newHead.x <= 0) || (newHead.y <= 0) || (newHead.y >= GAME_HEIGHT)){
			console.log('hit border');
			return true;
		} else {return false;}
	}
	
	//check for collisions with itself
	function checkCollision(newHead){
		for (var i=0; i < snake.body.length; i++) {
		  if ((snake.body[i].x == newHead.x) && snake.body[i].y == newHead.y){
		  	console.log('collision with self');
		  	return true;
		  }
		};
		return false;
	}
	
	//draw score 

	//gameOver
	function gameOver() {
		init();
	}

	//star thte game
	init()
	setInterval(update, 60);
})