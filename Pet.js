//class: pet
function Pet(initx, inity, initfood) {
	//init pet, position x+y , age 1, speed, food(our cursor) .....
	this.food = initfood;
	this.x = initx; 
	this.y = inity; 
    this.age = 1; 
	this.speed = 15;
    this.foodX = this.food.getX();
    this.foodY = this.food.getY();
    this.distance = parseFloat(Math.sqrt(Math.pow((this.foodX - this.x),2) + Math.pow((this.foodY - this.y),2))) 

    this.vecX = this.speed*(this.x - this.foodX)/(this.distance);  

    this.vecY = this.speed*(this.y - this.foodY)/(this.distance);
	this.atWall = true;
    this.changeLight = false;
	this.form = 1+parseInt(this.age/10);
	// functions: move, touch food, poops,... 
	// ************************************************
	
	// move the pet according to food's position and check if has hit food)
	this.move =function() {
		//check if pet is at the wall
		//if atWall -> move to food, no longer at wall 
                
        //if has reached a wall, stop, re-coordinate . 
        let comp = 50; // compensation for right/bottom wall
        let canvasW = 700;
        let canvasH = 600;
        if ( this.x <= 0 || this.y <= 0 || this.x >= (canvasW-comp) || this.y >= (canvasH-comp) ){
            //get coordinate
			this.foodX = this.food.getX();
			this.foodY = this.food.getY();

            //set coordinate when touches wall
            if (this.x != this.foodX || this.y != this.foodY){
                this.distance = parseFloat(Math.sqrt(Math.pow((this.foodX - this.x),2) + Math.pow((this.foodY - this.y),2))) 
            } 

            this.vecX = this.speed*(this.x - this.foodX)/(this.distance);  
            this.vecY = this.speed*(this.y - this.foodY)/(this.distance);
        }
	
        //catches food
        //
        this.hit();
    
	}

	// got some food
	// food shall lose health.
	// hit the food : call hit(), get more speed, change Shadow light
	this.hit = function(){
        let x_dis = Math.abs(this.x-this.food.getX());
        let y_dis = Math.abs(this.y-this.food.getY());
        if ( (10+this.form*20) > Math.sqrt((x_dis*x_dis) + (y_dis*y_dis))) {
           // console.log("hit it !!!! : ");
            
            if (( this.food.hp % 5) == 0 ) { 
                this.changeLight = true; 
                if (this.speed <= 50) {
                    this.speed+=3;
                }
            }

            this.food.lost();
            score = (score - 200);
            if (this.age != 31){
                this.age+=1;
            }
        }
	}

    this.poop = function(){
        return new Poop(this.x, this.y,this.food);
    }
}	
