//1**************************************************1
//init canvas, ctx
let canvas = document.getElementById("game"); 
let ctx = canvas.getContext("2d");

//manage all instances of pets
let pets = [];

//manage all instances of Supports, Bombs 
let poops = [] ;
let supports = [];

//init objects
var food = new Food();
//Pet will be init in interval

//for game pause, start
let gameOn = false;
let gameInv ;
let timer = 0;
let cycle = 0;

//2**************************************************2
//create classes, functions 

clear = function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

let bone = new Image();
bone.src = "bone.png"; 

let dog = new Image();
dog.src = "dogss.png";

let bg = new Image();
bg.src = "back.jpeg";

//pause, start of game
document.addEventListener("keypress" , function(e){
	if (e.keyCode == 32){
		//change state of game
		gameOn = !gameOn;

        //Stop the game
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

			//check mouse movement
			canvas.addEventListener("mousemove",function(evt){
				//update mouse position of Bone sprite
				food.updPos(canvas,evt);
			});

            //3************************************************3
            //game Interval
			gameInv = setInterval(()=>{
				//timer management
				timer+=0.04;
				clear();
				ctx.drawImage(bg,0,0,canvas.width,canvas.height); 
				
                //******************************************
				//hp status
				ctx.beginPath();
				ctx.font = "25px Arial";
				ctx.fillText(Math.floor(timer),20,20);    
				ctx.fill();

                //**************************************
                //FOOD
				ctx.beginPath();
				ctx.font = "15px Arial bold";
				ctx.fillStyle = 'rgb(102, 255, 51)';
				//if food is stuck, stay still for ~3 seconds
				if (food.isStuck){
					// food draw when stuck
					food.stuck();	
					ctx.drawImage(bone, food.xStuck-20, food.yStuck-20, 50, 50);

					ctx.fillText(food.getHp(),food.xStuck+8,food.yStuck+25);
  				} else {
					// food draw when running
					ctx.drawImage(bone, food.getX()-20, food.getY()-20, 50, 50);

					ctx.fillText(food.getHp(),food.getX()+8,food.getY()+25);
				}
				ctx.fill();

                //******************************************
				//PETS 
                //size to draw sprites
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

                //*****************************************
                //Poops
                let remove = -1;
                poops.forEach((poop,index,object)=> {
                    ctx.beginPath();
                    ctx.fillStyle = "brown";
                    ctx.arc(poop.x,poop.y,poop.radius,0,2*Math.PI);
                    ctx.fill();
                    poop.checkStepped();
                    if (poop.TTL <= 0){
                        remove = index;
                    }
                });
                if (remove != -1 ) {
                    poops.splice(remove,1);
                }

                //*****************************************
                //Supports 
                let supportRan = Math.random()*1000;
                if (supportRan > 990){
                    supports.push(new Support(Math.random()*canvas.width,Math.random()*canvas.height,food));
                }

                remove = -1;
                supports.forEach((support,index,object) => {
					console.log(support.x+"--"+support.y+" "+support.getProperty()+"--"+support.option);
					ctx.beginPath();
                    ctx.fillStyle="pink";
                    ctx.arc(support.x,support.y,support.radius,0,2*Math.PI);
					ctx.fill();
                    //create support with random property
                    support.obtained();
                    if (support.obtain){
                        remove = index; 
                        switch (support.getProperty()) {
                            case "wipePoops" : 
                                //automatic garbage collection is a bless
                                poops=[];
                                break;
                            case "wipeDogs" : 
                                //automatic garbage collection is a bless
                                pets=[]
                                break;
                            case "slowDogs" : 
                                pets.forEach((pet)=> {
                                    pet.speed = 15;
                                });
                                break;
                            default : 
                                console.log("Error creating support");
                                break;
                        }
                    }
                });
                if (remove != -1 ) {
                    supports.splice(remove,1);
                }

                //*********************************************
                //Ended Support
                
				cycle = (cycle+1) % 4;
			}, 60);
		}
	}
});
