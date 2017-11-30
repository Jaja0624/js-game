//1**************************************************1
//init canvas, ctx
let canvas = document.getElementById("game"); 
let ctx = canvas.getContext("2d");

//manage all instances of pets
let gameOn = true;



let pets = [];
	
//manage all instances of Supports, Bombs 
let poops = [] ;
let supports = [];
	
//init objects
var food = new Food();
//Pet will be init in interval
	
//for game pause, start
let gameInv ;
let cycle = 0;


//2**************************************************2
//create classes, functions 


//***************************************** 
// Draws an image with ref to canvas 2d context
function drawImage(img, x, y, width, height) {
	ctx.drawImage(img, x, y, width, height);
}

let backgroundImg = new Image();
backgroundImg.src = "back.jpeg";
backgroundImg.onload = function() {
	ctx.font = "45px Arial";
	drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

	// this gradient scheme was found from w3schools.com
	// https://www.w3schools.com/tags/canvas_stroketext.asp
	var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.5","blue");
	gradient.addColorStop("1.0","red");
	ctx.fillStyle=gradient;
	ctx.shadowColor = "purple";
	ctx.shadowBlur = 20;
	ctx.fillText("DOGS FLYING IN SPACE", 100, 190);
	ctx.font = "13px Arial";
	ctx.shadowBlur = 0;
	ctx.fillStyle = "white";
	ctx.fillText("CPSC 1045 Jamie McKee-Scott Fall 2017", 100, 215);
	ctx.fillStyle = "white";
	ctx.fillText("Kien Nguyen & Jackson Situ", 100, 237);
}


//***************************************** 
// Clear canvas
clear = function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}


//***************************************** 
// Draws timer and score at the top of canvas
let timer = 0;
let score = 0;
function drawHUD() {
	// draw timer
	ctx.beginPath();
	ctx.font = "15px Arial";
	ctx.fillStyle = 'rgb(102, 255, 51)';
	ctx.fillText(Math.floor(timer),20,30);    
	ctx.fill();

	// draw score
	ctx.beginPath();
	ctx.font = "25px Arial";
	ctx.fillStyle = 'rgb(102, 255, 51)';
	ctx.fillText(score,canvas.width/2-20,30);    
	ctx.fill();
}


//***************************************** 
// Draws the food and hp status
let foodImg = new Image();
foodImg.src = "sprites/bone.png"; 
function drawFood(isStuck, img) {
	ctx.beginPath();
	ctx.font = "15px Arial bold";
	ctx.fillStyle = 'rgb(102, 255, 51)';
	//if food is stuck, stay still for ~3 seconds
	if (isStuck){
		// food draw when stuck
		food.stuck();	
		drawImage(img, food.xStuck-20, food.yStuck, 50, 50);
		// health status
		ctx.fillText(food.getHp(),food.xStuck+12,food.yStuck+35);
	  } else {
		// food draw when running
		drawImage(img, food.getX()-20, food.getY()-20, 50, 50);
		// health status
		ctx.fillText(food.getHp(),food.getX()+12,food.getY()+25);
	}
	ctx.fill();
}


//***************************************** 
// When player intersects a support-do something
function useSupport(type) {
	switch (type) {
		case "wipePoops" : 
			//automatic garbage collection is a bless
			score += 1000*poops.length;
			poops=[];
			break;
		case "wipeDogs" : 
			//automatic garbage collection is a bless
			score += 2500*pets.length;
			pets=[]
			break;
		case "slowDogs" : 
			pets.forEach((pet)=> {
				score += 500*pets.length;
				pet.speed = pet.speed/2;
			});
			break;
		case "restoreHP" : 
			food.restoreHp();
			score += 1000*poops.length;
			poops=[];
			break;
		default : 
			console.log("Error creating support");
			break;
	}
}

//***************************************** 
// Draw support
let slow = new Image();
slow.src = "sprites/slow.png";
let wipe = new Image();
wipe.src = "sprites/wipe.png";
let milk = new Image();
milk.src = "sprites/milk.png";
function drawSupport(support, type){
	switch (type) {
		case "wipePoops" : 
			drawImage(wipe, support.x, support.y, support.width, support.height);
			break;
		case "wipeDogs" : 
			drawImage(wipe, support.x, support.y, support.width, support.height);
			break;
		case "slowDogs" : 
			drawImage(slow, support.x, support.y, support.width, support.height);
			break;
		case "restoreHP" : 
			drawImage(milk, support.x, support.y, support.width, support.height);
			break;
		default : 
			console.log("Error drawing support");
			break;
	}
}

//***************************************** 
//Randomly generate supports
function makeSupports(){
	//Supports 
	let supportRan = Math.random()*1000;
	if (supportRan > 990){
		supports.push(new Support(Math.random()*canvas.width,Math.random()*canvas.height,food));
	}

	//index of removable support
	let remove = -1;

	//iterate
	supports.forEach((support,index,object) => {
		//draw to canvas
		drawSupport(support, support.getProperty());
		//create support with random property
		support.obtained();
		//if support is obtained
		if (support.obtain){
			remove = index; 
			useSupport(support.getProperty());
		}
	});

	//if found a supoprt blob to remove
	if (remove != -1 ) {
		supports.splice(remove,1);
	}

}


//******************************************
// Draw dogss
let dog = new Image();
dog.src = "sprites/dogss.png";
function drawPets(){
	//sprite dimensions 
	let sW = 32.3, sH = 32.3;
	let clipY = sH;

	//move and draw each pet
	pets.forEach((pet) => {
		pet.move();
		pet.x -= parseFloat(pet.vecX);
		pet.y -= parseFloat(pet.vecY);
		if (pet.vecX < 0 ) {
			clipY = 32.3;
		} else {
			clipY = 32.3*3;
		}
		ctx.shadowColor = "yellow";
		ctx.shadowBlur = 20;
		ctx.drawImage(dog,cycle*sW, clipY, sW, sH, pet.x, pet.y, 20*pet.form+40, 20*pet.form+40);
		
		if (pet.changeLight) {
			//change shadow color when this pet has touched the bone
			ctx.shadowColor = "yellow";
			ctx.drawImage(dog,cycle*sW, clipY, sW, sH, pet.x, pet.y, 20*pet.form+40, 20*pet.form+40);
		}

		//POOP: 
		let poopRan = Math.random()*1000; 
		//Spawn Poop randomly
		if (poopRan >970) { 
			poops.push(pet.poop());
		}
	});

	//every 11 seconds => create one pet
	if (timer % 5 < 0.05 ) {
		pets.push(new Pet(0,0,food));
	}
}


//*****************************************
//Poops
let poopImg = new Image();
poopImg.src = "sprites/poop.png";
function drawPoops(){
	let remove = -1;
	poops.forEach((poop,index,object)=> {
		drawImage(poopImg, poop.x, poop.y, poop.width, poop.height);
		if (poop.checkStepped()) {
			score -= 5000;
		}
		if (poop.TTL <= 0){
			remove = index;
		}
	});
	if (remove != -1 ) {
		poops.splice(remove,1);
	}
}


//***************************************** 
// re-initialize game global variables
function reset() {
	gameInv = "";
	gameOn = true;
	pets = [];
	poops = [] ;
	supports = [];
	food = new Food();
	score = 0;
	timer = 0;
	cycle = 0;
}


//***************************************** 
// check if game is over. 
// if score is over 1 million-player wins-return true
// if health is 0 or less-player loses-return true
function gameOver(score, health){
	if (health <= 0) {
		gameOn = false;
		ctx.beginPath();
		ctx.font = "25px Arial";
		ctx.fillStyle = 'rgb(102, 255, 51)';
		ctx.fillText("lose",canvas.width/2-20,canvas.height/2);    
		ctx.fill();
		document.getElementById("instruction").innerHTML="Press space anywhere to RESTART game";
		return true;
	} else if (score > 1000000) {
		gameOn = false;
		ctx.beginPath();
		ctx.font = "25px Arial";
		ctx.fillStyle = 'rgb(102, 255, 51)';
		ctx.fillText("win",canvas.width/2-20,canvas.height/2);    
		ctx.fill();
		document.getElementById("instruction").innerHTML="Press space anywhere to RESTART game";
		return true;

	}
	return false;
}


//***************************************** 
//listen to space key
document.addEventListener("keypress" , function(e){
	if (e.keyCode == 32){
		
		if (gameInv) {
			document.getElementById("instruction").innerHTML="Press space anywhere to START game";
			//stop interval (Game)

			//stoping the interval
			clearInterval(gameInv);
			gameInv="";
			//reset event listener
			canvas.addEventListener("mousemove",function(evt){
				//nothing, emptying function of previous mouse move
			});

        //start/resume the game
		} else {
			document.getElementById("instruction").innerHTML="Press space anywhere to STOP game";

            // play
			start();
		}
	}
});


//***************************************** 
// add mouse listener
// set game interval
function start() {
	canvas.addEventListener("mousemove",function(evt){
		//update mouse position of Bone sprite
		food.updPos(canvas,evt);
	});

	gameInv = setInterval(()=>{
		//timer management
		timer+=0.04;
		clear(); // clear canvas 
		
		drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
		drawHUD(); // draw timer and score

		drawFood(food.isStuck, foodImg);

		drawPets();

		drawPoops();
		
		makeSupports();
		
		//check gameover
		if (gameOver(score,food.hp)) {	
			console.log("game over");	
			clearInterval(gameInv);		
			reset();
		}

		cycle = (cycle+1) % 4;
	}, 60);
}
