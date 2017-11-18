//class : food 
function Food(){
	//init food ( out cursor ) with xy position, hp ...
	this.x =800;
	this.y =800;
	this.hp =50;

    //When Steped on Poop
	this.isStuck = false;
    this.TTLStuck = 0;
    this.xStuck = 0;
    this.yStuck = 0;

	//functions :update position,  lost hp , stuck in poop , .... 
	//******************************************************************************
	//update position according to mouse
    
	this.updPos = function(canvas,evt){
        let rect = canvas.getBoundingClientRect();
		this.x = evt.clientX - rect.left;
		this.y = evt.clientY - rect.top;
       // console.log(this.x+"  "+this.y);
    }

	this.getX = function(){
		return this.x;
	}

	this.getY = function(){
		return this.y;
	}

    this.getHp = function(){
        return this.hp;
    }

	//lost 1 hp
	this.lost = function(){
		this.hp--;
	}

    this.stuck = function(){
        this.x = this.xStuck;
        this.y = this.yStuck; 
        this.TTLStuck --;
        if (this.TTLStuck == 0 ){
            this.isStuck = false;
        }
    }
}
