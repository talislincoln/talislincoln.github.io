$(document).ready(function() {
	// UI Elements 
	var gameIntro = $("#gameIntro");
	var gameStats = $("#gameStats"); 
	var gameOver = $("#gameComplete");
	var playButton = $("#gamePlay"); 
	var canvas = $("#gameCanvas");
	var image = $("#image");

	var moves = $(".gameMoves");
	var reset = $(".gameReset");
	var showImage = $(".showImage");

	var context = canvas.get(0).getContext("2d");

	var img = document.getElementById("image");
	
	// game elements 
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height(); 
	
	var GRIDSIZE;
	var TILESIZE; 
	 
	var NUMTILES = (GRIDSIZE * GRIDSIZE) -1;
	var TILELEFTOFFSET = 0;
	var TILETOPOFFSET = 100;
	var VALLEFTOFFSET = TILESIZE/3;
	var VALTOPOFFSET = TILESIZE*2/3;

	var movesCounter = 0;

	var numTiles;
	var tiles; // our array of tiles

	// our tile object
	var Tile = function(x,y,value, imgX, imgY) {
		this.x = x; 
		this.y = y; 
		this.value = value;
		this.imgX = imgX;
		this.imgY = imgY;
	};

	function initVariables(size) {
		movesCounter = 0;

		moves.text("" + movesCounter);

		GRIDSIZE = size;
		TILESIZE = canvasWidth/GRIDSIZE;

		NUMTILES = (GRIDSIZE * GRIDSIZE) -1;
		TILELEFTOFFSET = 0;
		TILETOPOFFSET = 100;
		VALLEFTOFFSET = TILESIZE/3;
		VALTOPOFFSET = TILESIZE*2/3;

		tiles = new Array();

		// setup our tiles array with instances of Tiles 
		
		var v = 1; // will be used for the value of our tile 		
		for(var r = 0; r < GRIDSIZE; r++) {
			for(var c = 0; c < GRIDSIZE; c++) {
				var x = c * TILESIZE + TILELEFTOFFSET; 
				var y = r * TILESIZE + TILETOPOFFSET;
				var val = v;
				if(v <= NUMTILES) {
					tiles.push(new Tile(x,y, val,c*TILESIZE,r*TILESIZE));
				} 
				v++;  
			};
		};

		//last tile with zero value
		tiles.push(new Tile((GRIDSIZE-1)*TILESIZE+TILELEFTOFFSET,(GRIDSIZE-1)*TILESIZE+TILETOPOFFSET, 0,(GRIDSIZE-1)*TILESIZE,(GRIDSIZE-1)*TILESIZE));

		shuffleTiles();

		numTiles = tiles.length; 
	}

	function init(){
		dBug("in init with ");

		initVariables(3);

		gameStats.hide();
		gameOver.hide();
		canvas.hide();
		image.hide();

		//
	};

	function startGame() {
		//timer
		//mouse clicking (mouse up)

		$(window).mouseup(function(e) {
			var canvasOffset = canvas.offset();
			var canvasX = Math.floor(e.pageX - canvasOffset.left - TILELEFTOFFSET);
			var canvasY = Math.floor(e.pageY - canvasOffset.top - TILETOPOFFSET);

			var clickedRow = Math.floor(canvasY / TILESIZE);
			var clickedCol = Math.floor(canvasX / TILESIZE);

			//dBug("Click up: " + clickedRow + ", " + clickedCol);
			if((clickedRow >= 0 && clickedRow < GRIDSIZE) && (clickedCol >= 0 && clickedCol < GRIDSIZE)) {
				canMoveTile(clickedRow,clickedCol);
				update();
			}
		});

		//check to see if the tile can move
		//update call
		update();
	}

	function update() {
		if(checkWin()) {
			draw();
			dBug("You're a winner!!");
			//canvas.hide();
			gameOver.show();	
		} else {
			draw();
		}
		//draw();
	}

	function draw() {
		dBug("Drawing");

		context.clearRect(0, 0, canvasWidth, canvasHeight);

		for(var r = 0; r < GRIDSIZE; r++) {
			for(var c = 0; c < GRIDSIZE; c++) {
				
				var t = getTileInMatrix(r,c);

				if(t.value != 0)
					drawTile(t)
			}
		};

		moves.text(movesCounter);
	}

	function drawTile(tile) {
			// context.beginPath(); 
			// context.rect(tile.x, tile.y, TILESIZE, TILESIZE); // x, y, w, h 
			// context.fillStyle = "rgb(50,50,50)";
			// context.fill();
			// context.lineWidth = 5/GRIDSIZE; 
			// context.strokeStyle = "rgb(150,150,150)";
			// context.stroke(); 

			//context.drawImage(img,tile.imgX,tile.imgY,TILESIZE,TILESIZE,tile.x,tile.y,TILESIZE,TILESIZE);
			context.drawImage(img,tile.imgX,tile.imgY,TILESIZE,TILESIZE,tile.x,tile.y,TILESIZE,TILESIZE);
		
			//show values
			// context.fillStyle = "rgb(150,150,150)";
			// context.font = "bold " + Math.round(150/GRIDSIZE) + "px Arial";
			// dBug(tile.value);
			// context.fillText(tile.value, tile.x + VALLEFTOFFSET, tile.y + VALTOPOFFSET); //
	};

	function checkWin() {
		var winning = true;
		var i = 1;

		if(getTileInMatrix(0,0).value === 1) { //first tile is in first place
			for(var r = 0; r < GRIDSIZE; r++) {
				for(var c = 0; c < GRIDSIZE; c++) {
					if(i == numTiles) {
						i = 0; //the last tile in the winning sequence has a value of 0 (zero)
					}
					if((winning) && (getTileInMatrix(r,c).value === i)) {
						//still winning
						i++;
					} else {
						winning = false;
					}
				}
			}
		} else {
			winning = false;
		}

		return winning;
	}

	function getTileInMatrix(r,c) {
		return tiles[r*GRIDSIZE+c];
	}

	function canMoveTile(row, col) {
		var move = false;
		//look in each of the 4 directions
		if(row > 0) {
			if(getTileInMatrix(row - 1, col).value == 0) {
				swapTile(row, col, row -1, col)
				move = true;
			}
		}

		if(row < GRIDSIZE -1) {
			if(getTileInMatrix(row + 1, col).value == 0) {
				swapTile(row, col, row + 1, col)
				move = true;
			}
		}

		if(col > 0) {
			if(getTileInMatrix(row, col - 1).value == 0) {
				swapTile(row, col, row, col-1);
				move = true;
			}
		}

		if(col < GRIDSIZE -1) {
			if(getTileInMatrix(row, col + 1).value == 0) {
				swapTile(row, col, row, col+1)
				move = true;
			}
		}

		if(move) {
			movesCounter++;
		}

		dBugTileMap();
		return move;
	}

	function swapTile(tileR, tileC, empR, empC) {
		if(getTileInMatrix(empR, empC).value != 0) {
			//I think you hit the three
			console.error("You broke the internetz!");
		} else {
			var currentTile = getTileInMatrix(tileR, tileC);
			var nextTile = getTileInMatrix(empR, empC);

			var auxVal = currentTile.value;
			currentTile.value = 0;
			nextTile.value = auxVal;

			auxVal = currentTile.imgX; //tile.imgX,tile.imgY
			currentTile.imgX = nextTile.imgX;
			nextTile.imgX = auxVal;

			auxVal = currentTile.imgY;
			currentTile.imgY = nextTile.imgY;
			nextTile.imgY = auxVal;
		}
	}

	function shuffleTiles() {
		for(var r = GRIDSIZE-1; r > 0; r--) {
			for(var c = GRIDSIZE - 1; c > 0; c--) {
				var i = Math.floor(Math.random() * (r+1));
				var j = Math.floor(Math.random() * (c+1));

				innerShuffle(r,c,i,j);
			};
		};
		//check for win conditions while shuffle array
		if(checkWin()) {
			shuffleTiles();
		}
	};

	function innerShuffle(tileR,tileC,empR,empC) {
		var currentTile = getTileInMatrix(tileR, tileC);
		var nextTile = getTileInMatrix(empR, empC);

		var auxVal = currentTile.value;
		currentTile.value = nextTile.value;
		nextTile.value = auxVal;

		auxVal = currentTile.imgX; //tile.imgX,tile.imgY
		currentTile.imgX = nextTile.imgX;
		nextTile.imgX = auxVal;

		auxVal = currentTile.imgY;
		currentTile.imgY = nextTile.imgY;
		nextTile.imgY = auxVal;
	}

	/* ----- Clicking functions ----- */ 
	playButton.click(function(e){
		dBug("play clicked");
		gameIntro.hide();
		gameStats.show();
		canvas.show();
		startGame();
		e.preventDefault();
	}); 

	reset.click(function(e){
		dBug("reset clicked");
		resetGame(e);
	});

	showImage.click(function(e) {
		//alert("show image");
		onlyImage();

		var hideImage = setInterval(function() { 
			noImage();
		}, 5000); 

		e.preventDefault();
	});

	function onlyImage() {
		gameStats.hide();
		canvas.hide();
		image.show();
	}

	function noImage() {
		image.hide();
		gameStats.show();
		canvas.show();
	}

	function resetGame(e){
		gameIntro.show();

		init();

		e.preventDefault();
	};

	/* ----- dBugging stuffs ----- */ 
	function dBug(message){
		console.log(message);
	}; 

	function dBugTileMap() {
		var MAPSIZE = GRIDSIZE * GRIDSIZE;

		for(var r = 0; r < GRIDSIZE; r++) {
			var row = "";
			for(var c = 0; c < GRIDSIZE; c++) {
				if(getTileInMatrix(r,c).value == 0) {
					row += "[ ]"
				} else {
					row += "[" + getTileInMatrix(r,c).value + "]";
					//row += "[" + mapArray[r][c] + "]";
				}
			};

			dBug(row + "\n");
		}
	}

	function dBugTiles() {
		var numTiles = tiles.length;
		dBug("\n\n ------ TILES ------\n");
		for (var i = 0; i < numTiles; i++) {
			dBug("Tile " + i + "\n");
			dBug("    - x: " + tiles[i].x + "\n");
			dBug("    - y: " + tiles[i].y + "\n");
			dBug("    - val: " + tiles[i].value + "\n");
		};
		dBug(" ------ /TILES ------\n\n");
	};

	/* ************** FUNCTION BEING CALLED *************** */

	init();
}); 