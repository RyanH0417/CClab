
// drag the root of these branches to change where it grows
// press any key after the sketch finished, and it automatically generate another one



// have a empty array for object
let branches = [];
// (initial) x, y ,xSpd, ySpd
let root = [
  [0, 0, 1.5, 1],
  [800, 700, -1.5, -1],
  [800, 0, -1.5, 1],
  [0, 700, 1.5, -1],
];
//have random color (improvement from peerreview)
let colorList = [
  [83,57,95],
  [102,178,178],
  [236,230,255],
  [85,77,77],
  [61,52,52],
]

function setup() {
  createCanvas(800, 700);
  
  //add a root
  rootAttr = random(root);
  colorAttr = random(colorList)


}

function draw() {
  
  
  background(175);
  //have some shadow
  if (branches.length == 0){
    rootAttr = random(root);
    colorAttr = random(colorList)
    branches.push(new Branch(rootAttr[0],
                             rootAttr[1],
                             15,
                             colorAttr[0],
                             colorAttr[1],
                             colorAttr[2]
                            ));
    //decide the initial root attribute
    branches[0].xSpd = rootAttr[2];
    branches[0].ySpd = rootAttr[3];
    
  }
  
  for (let i = 0; i < branches.length; i++) {
    branches[i].displayS();
  }

  //establish an array of objects, and grow them
  for (let i = 0; i < branches.length; i++) {
    branches[i].grow();
    let new_branch = branches[i].checkNewBranch();

    //check for return value, constrain branch numbers
    if (new_branch != null && branches.length < 370) {
      branches.push(new_branch);
    }

    branches[i].checkIfOutOfScreen();
    branches[i].reactTowardMouse();
    branches[i].display();
  }
  //key interaction, repeat patterns (improvement from peerreview)
  if (branches.length == 370 && branches[branches.length-1].xSpd == 0 && keyIsPressed){
    for(let i = 0; i < branches.length; i++){
      branches[i].repeatPattern();
    }
  }
  let DrawIsClear = true
  for(let i = 0; i < branches.length; i++){
    if (branches[i].y < 700 || branches[i].ly < 700){
        DrawIsClear = false
      }
  }
  
  if (DrawIsClear == true){
    branches.splice(0,branches.length)
  }
  
}
//my class
class Branch {
  constructor(x, y, s, r, g, b) {
    this.x = x;
    this.y = y;
    this.bk = 130;
    this.r = r
    this.g = g
    this.b = b
    this.color = color(r, g, b);
    this.lx = x;
    this.ly = y;
    this.xSpd = random(-0.5, 0.5);
    this.ySpd = random(-0.5, 0.5);
    this.stroke = s;
  }

  display() {
    //draw a branch
    stroke(this.color);
    strokeWeight(this.stroke);
    line(this.x, this.y, this.lx, this.ly);
  }
  //shadow
  displayS() {
    stroke(this.bk);
    strokeWeight(this.stroke * 2);
    push();
    translate(1.4, 1.4);
    line(this.x, this.y, this.lx, this.ly);
    pop();
  }

  grow() {
    //increasing length
    this.lx += this.xSpd;
    this.ly += this.ySpd;
    //gradient change of shadow
    this.bk = map(noise(frameCount * 0.01), -1, 1, 90, 255);
  }

  checkIfOutOfScreen() {
    //if out of screen, stop growing
    if (this.lx < 0 || this.lx > width || this.ly < 0 || this.ly > height) {
      this.xSpd = 0;
      this.ySpd = 0;
    }

  }

  checkNewBranch() {
    //if length > 150, have a new, thinner branch
    if (dist(this.x, this.y, this.lx, this.ly) > 150 && random(100) > 95) {
      let nextStroke = 0.5 * this.stroke;
      return new Branch(this.lx, this.ly, nextStroke, this.r, this.g, this.b);
    } else {
      return null;
    }
  }

  reactTowardMouse() {
    //if mouse on the branch root, we can control the position of it
    if (dist(this.x, this.y, pmouseX, pmouseY) < 10) {
      //hint for mouse interaction
      push()
      stroke(255)
      strokeWeight(2*this.stroke)
      point(this.x,this.y)
      pop()
      if (mouseIsPressed){
        this.color = color("#9a1919");
        this.x = mouseX;
        this.y = mouseY;  
      }
    } else {
      this.color = color(this.r, this.g, this.b);
    }
  }
  repeatPattern(){
    this.y += 4
    this.ly += 8
  }
}
