//Suport class: 
/*
	option: 0 or 1 or 2
		0:	wipe all current poops
		1:	wipe all current dogs
		2:  Slow down all dogs
	@param : int x, int y to draw
	@param : food : the food object to keep track of
*/
let Support = function(x, y, food){
	this.type = ["wipePoops","wipeDogs","slowDogs", "restoreHP"]; 
	this.x = x;
	this.y = y;
	this.option = Math.floor(Math.random()*4);
	this.food = food;
	this.radius = 6;
	this.obtain = false;

	this.getProperty = function(){
		return this.type[this.option];
	}

    this.obtained = function(){
        let x_dis = Math.abs(this.x-this.food.getX());
        let y_dis = Math.abs(this.y-this.food.getY());
        if (10+5 > Math.sqrt(Math.pow(x_dis,2)+Math.pow(y_dis,2))){
			this.obtain = true;
        }
	}
}


