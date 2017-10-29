//1**************************************************1
//init canvas, ctx
let canvas = document.getElementById("game"); 

let ctx = canvas.getContext("2d");

//manage all instances of pets
let pets = [];

let gameOn = true;
//2**************************************************2
//create classes, functions 

clear = function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

let bone = new Image();
// bone.src below

let dog = new Image();
dog.src = "dogss.png";

let bg = new Image();
bg.src = "back.jpeg";

let cycle = 0;
draw = function(food,pet){
    let timer = 0 ;
	this.interval = setInterval(()=>{
        timer+=0.04
        clear();
        ctx.drawImage(bg,0,0,canvas.width,canvas.height); 
        
		//food
        //hp status
		ctx.beginPath();
        ctx.font = "15px Arial bold";
        ctx.fillStyle = 'rgb(102, 255, 51)';
       
        ctx.fillText(food.getHp(),food.getX()+8,food.getY()+25);
        ctx.font = "25px Arial";
        ctx.fillText(Math.floor(timer),20,40);    

        // bone (cursor)    
        bone.src = "bone.png"; // idk why but this needs to be here else bone will not load
        bone.onload = function() {
            ctx.drawImage(bone, food.getX()-20, food.getY()-20, 50, 50);
        }
		
		if (food.isStuck){
			//draw image of food stuck
        }
        
        // pet
        let sW = 32.3, sH = 32.3;
        let clipY = sH;
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
            
            if (pet.egging) {
                ctx.shadowColor = "yellow";
                ctx.drawImage(dog,cycle*sW, clipY, sW, sH, pet.x, pet.y, 20*pet.form+40, 20*pet.form+40);
            }
        });
        cycle = (cycle+1) % 4;
	}, 60);
}

// start game
function play() {
    //init objects
    var food = new Food();
    var myPet = new Pet(0,0,food);
    pets.push(myPet);

    //check mouse movement
    canvas.addEventListener("mousemove",function(evt){
        food.updPos(canvas,evt);
    });

    //re-draw the game
    draw(food,pets);
  
    
}
console.log(gameOn);
if (gameOn) {
    play();
}








