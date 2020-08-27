var typefunEngine;
var typefunBoxes;
var typefunWalls;

window.onload = typefunSetup;

function typefunSetup() {
  typefunBoxes = [];
  typefunWalls = [];
  var canvas = document.getElementById('typefunjuice');
  canvas.setAttribute("tabindex", 0);
  canvas.addEventListener("keydown", typefunKeyDown);
  var clearBtn = document.getElementById('typefunclearbtn');
  clearBtn.onclick = typefunClear;
  typefunEngine = Matter.Engine.create();
  addWall(0, canvas.height, canvas.width, canvas.height + 100);
  addWall(-10, 0, 0, canvas.height);
  addWall(canvas.width, 0, canvas.width + 10, canvas.height);
  // addWall(0, 60, 100, 80);
  // addWall(0, 200, 100, 120);
  addWallCenter(canvas.width/2, canvas.height * 0.75, 500, 20);
  addWallCenter(canvas.width/4, canvas.height * 0.4, 250, 20);
  addWallCenter(canvas.width*0.75, canvas.height * 0.4, 250, 20);
  Matter.Engine.run(typefunEngine);
  window.requestAnimationFrame(typefunjuiceDraw);
}

function typefunClear () {
  for (let b of typefunBoxes)
    Matter.World.remove(typefunEngine.world, b.body);
  typefunBoxes = [];
}

function typefunjuiceDraw () {
  var canvas = document.getElementById('typefunjuice');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let box of typefunBoxes)
    box.show(ctx);
  for (let wall of typefunWalls)
    wall.show(ctx);

  window.requestAnimationFrame(typefunjuiceDraw);
}

function typefunKeyDown(e) {
  let canvas = e.srcElement;
  let x = Math.random() * canvas.width/2 + canvas.width/4
  let y = 0;
  let b = new TypefunBox(x, y, e.key);
  typefunBoxes.push(b);
}

function addWall(startx, starty, endx, endy) {
  let x = (startx + endx) / 2;
  let y = (starty + endy) / 2;
  let w = endx - startx;
  let h = endy - starty;
  let wall = new TypefunWall(x, y, w, h);
  typefunWalls.push(wall);
}

function addWallCenter(x, y, w, h) {
  let wall = new TypefunWall(x, y, w, h);
  typefunWalls.push(wall);
}

function TypefunWall (x, y, w, h) {
  this.w = w;
  this.h = h;
  this.body = Matter.Bodies.rectangle(x, y, w, h, {isStatic: true});
  Matter.World.add(typefunEngine.world, this.body);
  this.show = function (context) {
      let pos = this.body.position;
      context.save();
      context.translate(pos.x, pos.y);
      context.rotate(this.body.angle);
      context.fillStyle = "darkcyan";
      context.fillRect(-this.w/2, -this.h/2, this.w, this.h);
      context.restore();
  }
}


function TypefunBox (x, y, letter) {
  this.letter = letter;
  this.font = '40px serif';
  measure = measureTextHeight(this.letter, this.font);
  this.h = measure.height;
  this.offset = measure.offset;
  this.w = getTextWidth(this.letter, this.font);
  this.body = Matter.Bodies.rectangle(x, y, this.w, this.h);
  Matter.World.add(typefunEngine.world, this.body);
  this.show = function (context) {
      let pos = this.body.position;
      context.save();
      context.translate(pos.x, pos.y);
      context.rotate(this.body.angle);
      context.font = this.font;
      context.fillStyle = "black";
      context.fillText(this.letter, -this.w/2, this.h/2 - this.offset);
      context.restore();
  }
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function measureTextHeight(text, fontSizeFace) {

    // create a temp canvas
    var width=1000;
    var height=800;
    var canvas=document.createElement("canvas");
    canvas.width=width;
    canvas.height=height;
    var ctx=canvas.getContext("2d");

    // Draw the entire a-z/A-Z alphabet in the canvas
    ctx.save();
    ctx.font=fontSizeFace;
    ctx.clearRect(0,0,width,height);
    ctx.fillText(text, 0, 500);
    ctx.restore();

    // Get the pixel data from the canvas
    var data = ctx.getImageData(0,0,width,height).data,
        first = false,
        last = false,
        r = height,
        c = 0;

    // Find the last line with a non-transparent pixel
    while(!last && r) {
        r--;
        for(c = 0; c < width; c++) {
            if(data[r * width * 4 + c * 4 + 3]) {
                last = r;
                break;
            }
        }
    }

    // Find the first line with a non-transparent pixel
    while(r) {
        r--;
        for(c = 0; c < width; c++) {
            if(data[r * width * 4 + c * 4 + 3]) {
                first = r;
                break;
            }
        }

        // If we've got it then return the height
        if(first != r){
          return {height: last-first, offset: last - 499};
        }
    }

    // error condition if we get here
    return 0;
}
