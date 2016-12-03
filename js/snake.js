var blocksize = 20;
var snake;
var food;
var w;
var h;
var col;
var row;
var offsetx;
var offsety;
var snakeHeadColor = {r: 128, g: 255, b: 160};
var paused = true;

function inbounds(x, y){
	return x >= 0 && x < col && y >= 0 && y<row;
}
function randomLocation(){
	return {x: Math.round(random(col))%col, y: Math.round(random(row))%row, life: 50};
}

function toggleSnake(pause){
	if(pause){
		frameRate(0);
		paused = true;
	}else{
		frameRate(20);
		paused = false;
	}
}
function setup() {
	//var cnv = createCanvas(document.getElementById('canvas').clientWidth, document.getElementById('canvas').clientHeight);
	var cnv = createCanvas(400, 400);
	w = 400;//Math.trunc(document.getElementById('canvas').clientWidth/blocksize)*blocksize;
	h = 400;//Math.trunc(document.getElementById('canvas').clientHeight/blocksize)*blocksize;
	offsetx = (width-w)/2;
	offsety = (height-h)/2;
	col = w/blocksize;
	row = h/blocksize;
	cnv.parent('canvas');
	snake = new Snake();
	food = randomLocation();
	frameRate(0);
}

function draw() {
	if(!paused){
		//background(0,0,255*snake.length/(col*row));
		background(32);
		noStroke();
		snake.think();
		snake.update();
		fill((food.life/50)*255,((50-food.life)/50)*128,0);
		rect(food.x*blocksize+offsetx,food.y*blocksize+offsety, blocksize, blocksize);
		snake.show();
		food.life --;
		if(food.life == 0)
			food = randomLocation();
	}
}

function Snake(){
	this.x = col/2;
	this.y = row/2;
	this.xspeed = 0;
	this.yspeed = 0;
	this.tail;
	this.length = 0;
	this.checked;

	this.think = function(){
		this.reinitChecked();
		var foodArea = this.area(food.x, food.y);
		if(foodArea > this.length){
			this.findFood();
		}else{
			this.survive();
		}
	};

	this.survive = function(){
		var searchGrid = [];
		for(var i = 0; i < col; i++){
			searchGrid[i] = [];
			for(var j = 0; j < row; j++){
				searchGrid[i][j] = false;
			}
		}
		searchGrid[this.x][this.y] = true;
		var queue = [];
		var current;
		var best = {depth: -1};
		queue.push({x: this.x-1, y:this.y, dir:0, depth: 0});
		queue.push({x: this.x+1, y:this.y, dir:1, depth: 0});
		queue.push({x: this.x, y: this.y-1, dir:2, depth: 0});
		queue.push({x: this.x, y: this.y+1, dir:3, depth: 0});
		while(queue.length > 0){
			current = queue.splice(-1, 1)[0];
			if(inbounds(current.x, current.y) && !searchGrid[current.x][current.y] && !this.collide(current.x, current.y, current.depth)){
				if(current.depth > best.depth)
					best = current;
				searchGrid[current.x][current.y] = true;
				queue.push({x: current.x-1, y:current.y, dir:current.dir, depth: current.depth+1});
				queue.push({x: current.x+1, y:current.y, dir:current.dir, depth: current.depth+1});
				queue.push({x: current.x, y: current.y-1, dir:current.dir, depth: current.depth+1});
				queue.push({x: current.x, y: current.y+1, dir:current.dir, depth: current.depth+1});
			}
		}
		this.applyDirection(best.dir);
	}

	this.findFood = function(){
		var searchGrid = [];
		for(var i = 0; i < col; i++){
			searchGrid[i] = [];
			for(var j = 0; j < row; j++){
				searchGrid[i][j] = false;
			}
		}
		searchGrid[this.x][this.y] = true;
		var queue = [];
		var current;
		queue.push({x: this.x-1, y:this.y, dir:0, depth: 0});
		queue.push({x: this.x+1, y:this.y, dir:1, depth: 0});
		queue.push({x: this.x, y: this.y-1, dir:2, depth: 0});
		queue.push({x: this.x, y: this.y+1, dir:3, depth: 0});
		while(queue.length > 0){
			current = queue.shift();
			if(inbounds(current.x, current.y) && !searchGrid[current.x][current.y] && !this.collide(current.x, current.y, current.depth)){
				if(current.x == food.x && current.y == food.y){
					this.applyDirection(current.dir);
					return;
				}else{
					searchGrid[current.x][current.y] = true;
					queue.push({x: current.x-1, y:current.y, dir:current.dir, depth: current.depth+1});
					queue.push({x: current.x+1, y:current.y, dir:current.dir, depth: current.depth+1});
					queue.push({x: current.x, y: current.y-1, dir:current.dir, depth: current.depth+1});
					queue.push({x: current.x, y: current.y+1, dir:current.dir, depth: current.depth+1});
				}
			}
		}
		this.applyDirection(current.dir);
		//this.survive();
	}

	this.reinitChecked = function(){
		this.checked = [];
		for(var i = 0; i < col; i++){
			this.checked[i] = [];
			for(var j = 0; j < row; j++){
				this.checked[i][j] = 0;
			}
		}
	}

	this.area = function(x, y){
		if(!inbounds(x, y))
			return 0;
		if(this.collideExternal(x,y)){
			this.checked[x][y] = 2;
			return 0;
		}else if (this.checked[x][y] != 0){
			return 0;
		}else{	
			this.checked[x][y] = 1;
			return 1 + this.area(x-1, y) + this.area(x+1, y) + this.area(x, y-1) + this.area(x, y+1);
		}
	}

	this.applyDirection = function(dir){
		switch(dir){
			case 0:
			this.xspeed = -1;
			this.yspeed = 0;
			break;
			case 1:
			this.xspeed = 1;
			this.yspeed = 0;
			break;
			case 2:
			this.xspeed = 0;
			this.yspeed = -1;
			break;
			case 3:
			this.xspeed = 0;
			this.yspeed = 1;
			break;
		}
	};
	this.collideExternal = function(x,y){
		if(x == this.x && y == this.y)
			return true;
		else
			return this.collide(x, y);
	}
	this.collide = function(x, y, depth){
		if(!inbounds(x,y))
			return true;
		if(this.tail == null || this.length < depth)
			return false;
		return this.tail.collide(x,y, depth);
	}

	this.addTail = function(){
		this.length++;
		if(this.tail == null)
			this.tail = new Tail(this);
		else
			this.tail.addTail();
	}
	this.update = function(){
		if(this.tail != null)
			this.tail.update();
		this.x = this.x+this.xspeed;
		this.y = this.y+this.yspeed;
		if(this.x == food.x && this.y == food.y){
			food = randomLocation();
			this.addTail();
		}
		if(this.collide(this.x, this.y)){
			this.length = 0;
			this.tail = null;
			this.x = col/2;
			this.y = row/2;
		}
	};

	this.show = function(){
		fill(snakeHeadColor.r, snakeHeadColor.g, snakeHeadColor.b);
		rect(offsetx+this.x*blocksize, offsety+this.y*blocksize, blocksize, blocksize);
		fill(0);
		rect(offsetx+this.x*blocksize + blocksize/2 - blocksize/8 + this.xspeed * blocksize/8 + this.yspeed * -blocksize/5, offsety+this.y*blocksize + blocksize/2 - blocksize/8 + this.xspeed * blocksize/5 + this.yspeed * blocksize/8, blocksize/4, blocksize/4 );
		rect(offsetx+this.x*blocksize + blocksize/2 - blocksize/8 + this.xspeed * blocksize/8 + this.yspeed * blocksize/5, offsety+this.y*blocksize + blocksize/2 - blocksize/8 + this.xspeed * -blocksize/5 + this.yspeed * blocksize/8, blocksize/4, blocksize/4 );
		if(this.tail!=null)
			this.tail.show(snakeHeadColor.r, snakeHeadColor.g, snakeHeadColor.b);
	}
}

function Tail(master){
	this.master = master;
	this.x = -1;
	this.y = -1;
	this.tail;
	this.length = 0;

	this.addTail = function(){
		this.length++;
		if(this.tail == null)
			this.tail = new Tail(this);
		else
			this.tail.addTail();
	}

	this.update = function(){
		if(this.tail != null)
			this.tail.update();
		this.x = master.x;
		this.y = master.y;
	}

	this.collide = function(x, y, depth){
		if(x == this.x && y == this.y)
			return true;
		if(this.tail == null || this.length < depth)
			return false;
		else
			return this.tail.collide(x,y, depth);
	}

	this.show = function(r, g, b){
		var newR = colorWrapAround(r+5);
		var newG = colorWrapAround(g+2);
		var newB = colorWrapAround(b+6);
		if(this.tail !=null )
			this.tail.show(r+5, g+2, b+6);
		fill(newR, newG, newB);
		rect(offsetx+this.x*blocksize, offsety+this.y*blocksize, blocksize, blocksize);
	}
}

function colorWrapAround(color){
	while(color < 0 || color > 255){
		if (color>255) {
			color = 510 - color;
		}
		if(color<0){
			color = -color;
		}
	}
	return color;
}