
function setup(){
	can = createCanvas(windowWidth, windowHeight);
	can.position(0, 0);
	can.style('z-index', -1);
	drops = [];
}

function draw(){
	clear();
	drops.push(new Drop(mouseX, mouseY, 5));
	
	for(let i = drops.length-1; i>=0; i--){
		drops[i].update();
		if(drops[i].dead)
			drops.splice(i, 1);
	}
	
	for(let d of drops)
		d.show();
}

function mousePressed(){
	for(let i = 0; i<40; i++)
		drops.push(new Drop(mouseX, mouseY, 40));
}

class Drop{
	
	constructor(x, y, a){
		this.x = x + random(-a, a);
		this.y = y + random(-a, a);
		this.d = random(5, 20);
		this.vx = (this.x - x) * 0.04;
		this.vy = (this.y - y) * 0.04;
		this.dead = false;
	}
	
	update(){
		this.vy += 0.3;
		this.x += this.vx;
		this.y += this.vy;
		let dif = height - (this.y - this.d/2);
		if(dif < 0)
			this.dead = true;
		else if(dif < this.d){
			this.vy = 0.1;
		}
	}
	
	show(){
		fill(255, 69, 0);
		noStroke();
		ellipse(this.x, this.y, this.d, this.d * 1.2);
	}
	
}

