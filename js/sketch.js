var w = 400;
var h = 400;
var game;
var paused = true;
var games = [SnakeGame];

function changeGame(ind){
	game = new games[ind]();
	game.setup();
}

function setup() {
	var cnv = createCanvas(400, 400);
	game = new games[0]();
	cnv.parent('canvas');
	game.setup();
	frameRate(0);
}

function draw() {
	if(!paused){
		game.draw();
	}
}

function toggleGame(pause){
	if(pause){
		frameRate(0);
		paused = true;
	}else{
		frameRate(10);
		paused = false;
	}
}