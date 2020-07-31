var juiceSwitch;

$( document ).ready(function() {
	juiceSwitch = document.getElementById("headerTable");
	console.log(juiceSwitch);
});

function setup(){
	can = createCanvas(windowWidth, windowHeight - 1);
	can.position(0, 0);
	can.style('pointer-events', 'none');
	can.style('position', 'fixed');
	drops = [];
	start = false;

	colors = [
		color(255, 69, 0),
		color(255, 69, 155),
		color(255, 0, 0),
		color(255, 255, 0),
		color(0, 255, 69),
		color(127, 0, 255)
	];

	currentColor = random(colors);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw(){
	if(!start)
		return;
	clear();
	drops.push(new Drop(mouseX, mouseY, 5, currentColor));

	for(let i = drops.length-1; i>=0; i--){
		drops[i].update();
		if(drops[i].dead)
			drops.splice(i, 1);
	}

	for(let d of drops)
		d.show();
}

function mousePressed(){
	currentColor = random(colors);
	for(let i = 0; i<40; i++)
		drops.push(new Drop(mouseX, mouseY, 40, currentColor));
}

function mouseMoved(){
	start = true;
}

class Drop{

	constructor(x, y, a, col){
		this.col = col;
		this.x = x + random(-a, a);
		this.y = y + random(-a, a);
		this.d = random(10, 30);
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
		fill(this.col);
		noStroke();
		ellipse(this.x, this.y, this.d, this.d * 1.2);
	}

}
