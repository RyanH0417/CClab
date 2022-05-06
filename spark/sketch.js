//setting global variables
var gunSize = 3;
var gunWidth = 1;
var targets = [];
var targetNum = 6;
var targetSize = 50;

let maxPoints = 300;
let sparks = [];
let sparked = false;
let dsprRange = 250;
//color to choose
let palette1 = ["#ff00c1", "#9600ff", "#4900ff", "#00b8ff", "#00fff9"];
let palette2 = ["#daf8e3", "#97ebdb", "#00c2c7", "#0086ad", "#005582"];
let palette3 = ["#6749dc", "#ad51f3", "#f64cd5"];

//boolean variable for checking conditions
let GameStart = false;
let firstGame = true;

let Mode1_Button;
let Mode2_Button;

let Mode1Start = false;
let Mode2Start = false;

//time count
let timer = 0;
let waitTime = 0;
let score = 0;
let Addscore = false;
let initial = false;

let TargetColor;
let c = ['#ff00c1', '#9600ff', '#4900ff', '#00ff85', '#00b8ff', '#00fff9']

let time = 0;
let addTargets = true;
let scatterNum = 0;
//asset variable
let clickSound, sparkSound, elecSound;
let city;
//menu decoration variable
let particles = [];
function preload() {
  clickSound = loadSound("assets/click.mp3");
  sparkSound = loadSound("assets/spark2.mp3");
  elecSound = loadSound("assets/piano.mp3");
}

function setup() {
  let myCan = createCanvas(window.innerWidth, 815);
  myCan.parent('mywork')
  textAlign(CENTER);

  //create button, assign the method
  Mode1_Button = createButton("Mode 1");
  Mode1_Button.style('font-size', '20px');
  Mode1_Button.style('padding', '10px 30px');
  Mode1_Button.style('font-family', 'Josefin Sans');
  Mode1_Button.mousePressed(() => {
    Mode1Start = true;
    Mode2Start = false;
    GameStart = true;
    firstGame = false;
    Mode1_Button.hide();
    Mode2_Button.hide();
  })
  //create button, assign the method
  Mode2_Button = createButton("Mode 2");
  Mode2_Button.style('font-size', '20px');
  Mode2_Button.style('padding', '10px 30px');
  Mode2_Button.style('font-family', 'Josefin Sans');
  Mode2_Button.mousePressed(() => {
    Mode1Start = false;
    Mode2Start = true;
    GameStart = true;
    firstGame = false;
    Mode1_Button.hide();
    Mode2_Button.hide();
  })

}

function draw() {

  Mode2_Button.position(width / 2 + 50, height);
  Mode1_Button.position(width / 2 - 200, height);
  //initiate the game
  if (Mode1Start) {
    Mode1();
  }

  if (Mode2Start) {
    Mode2();
  }

  if (GameStart) {
    background(10, 25);
    timer = 60 - (int)(millis() / 1000) + waitTime;
    textSize(25);
    fill(255);
    text("Time : " + timer, width / 2 - 100, 100)
    text("score : " + score, width / 2 + 100, 100)
    gun(mouseX, mouseY);
  }

  //Countdown to end the game
  if (timer <= 0) {
    cursor()
    GameStart = false;
    Mode1Start = false;
    Mode2Start = false;
    sparked = false;
    Mode1_Button.show();
    Mode2_Button.show();

    ShowParticle(width / 2 - 400, height - 10);
    ShowParticle(width / 2 + 400, height - 10);
    //show score
    if (!firstGame) {
      push();
      textSize(45);
      fill(255)
      text("Your score : " + score, width / 2, height / 2 - 80)
      pop();
    }
    waitTime = (int)(millis() / 1000);
    initial = false;
  }
}
//menu decoration
function ShowParticle(x, y) {
  background(0);
  let p = new Particle(x, y);
  particles.push(p);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
}

function Mode1() {

  if (!initial) {
    initial = true;
    initialMode1();
  }
  //set the rotorelief randomness
  if (frameCount % 2000 == 0) {
    addTargets = false;
  }
  //adding target
  if (!addTargets) {
    addTargets = true;
    AddTargets();
  }
  //set up falling condition for spark
  let gravity = createVector(0, 0.01);

  //targets
  for (let i = 0; i < targets.length; i++) {
    for (let j = 0; j < targets[i].length; j++) {
      t = targets[i][j];
      //change color when mouse is on the target
      /*if (sparked) {
        if (dist(t.pos.x, t.pos.y, mouseX, mouseY) < t.s) {
          t.c = color(255);
        } else {
          t.c = c[j];
        }
      }*/
      t.update();
      t.edges();
      t.display();
      t.mouseInteraction();
    }
  }

  //sparks
  if (sparked) {
    for (let i = 0; i < sparks.length; i++) {
      for (let j = 0; j < sparks[i].length; j++) {
        s = sparks[i][j];
        if (s.R > random(130, 300)) {
          sparks[i].splice(j, 1);
        } else {
          s.update();
          s.applyForce(gravity);
          s.points();
        }
      }
    }
  }
}

function Mode2() {
  if (!initial) {
    initial = true;
    initialMode2();
  }

  //targets
  for (let t of targets) {
    t.updateMode2();
    t.edges();
    t.displayMode2();
    //assign the boolean to see which circle is hitted
    t.checkHit()
    //different circles with different scores added
    if (t.hit10) {
      score += 7
      if (!elecSound.isPlaying()) {
        elecSound.play();
      }
      sparks.push(new Spark(mouseX, mouseY, random(2, 8), t.c, random(0, 360), random(0.5, 5)));
    } else if (t.hit1) {
      score += 2
      if (!elecSound.isPlaying()) {
        elecSound.play();
      }
      sparks.push(new Spark(mouseX, mouseY, random(2, 8), t.c, random(0, 360), random(0.5, 5)));
    } else {
      t.c = TargetColor;
      elecSound.stop();
    }
  }
  //set up the spark effect
  for (let i = 0; i < sparks.length; i++) {
    s = sparks[i];
    if (s.R > random(50, 130)) {
      sparks.splice(i, 1);
    } else {
      s.update();
      s.points();
    }
  }
}
//starting condition mode1
function initialMode1() {
  noCursor();
  background(10);
  score = 0;
  scatterNum = 0;
  sparks.length = 0;
  targets.length = 0;
  AddTargets();
  sparked = false;
}
//making a rotorelief
function AddTargets() {
  let t = [];
  for (let i = 0; i < targetNum; i++) {
    t[i] = new Target(width / 2, height / 2, c[i], 200 - 30 * i, 1.5 - 0.2 * i, 0.03);
  }
  targets.push(t);
}
//setting start condition for mode2
function initialMode2() {
  noCursor();
  background(10);
  score = 0;
  sparks.length = 0;
  targets.length = 0;
  TargetColor = random(c);
  targets[0] = new Target(width / 2, height / 2, TargetColor, targetSize, 1.5, 0.02);
  sparked = false;
}
//aim set
function gun(x, y) {
  push();
  rectMode(CENTER)
  fill(255)
  noStroke()
  rect(x, y, gunSize, gunSize)
  rect(x - 3 * gunSize, y - 3 * gunSize, gunSize, gunSize)
  rect(x - 2 * gunSize, y - 2 * gunSize, gunSize, gunSize)
  rect(x + 3 * gunSize, y - 3 * gunSize, gunSize, gunSize)
  rect(x + 2 * gunSize, y - 2 * gunSize, gunSize, gunSize)
  rect(x - 3 * gunSize, y + 3 * gunSize, gunSize, gunSize)
  rect(x - 2 * gunSize, y + 2 * gunSize, gunSize, gunSize)
  rect(x + 3 * gunSize, y + 3 * gunSize, gunSize, gunSize)
  rect(x + 2 * gunSize, y + 2 * gunSize, gunSize, gunSize)
  pop();
}
//change your cursor shape when press the mouse
function mousePressed() {
  gunSize = 6;
  gunWidth = 3;
}

function mouseReleased() {
  gunSize = 3;
  gunWidth = 1;
}

function mouseClicked() {
  //click to see the spark
  for (let i = 0; i < targets.length; i++) {
    for (let j = 0; j < targets[i].length; j++) {
      t = targets[i][j];
      if (dist(t.pos.x, t.pos.y, mouseX, mouseY) <= t.s && t.scatter) {
        Addscore = true;
        //reassign it, easy trick to create a new one and automatically delete the old one
        targets[i][j] = new Target(random(targetSize, width - targetSize), random(targetSize, height - targetSize), c[j], targetSize, 1.5 - 0.2 * j, 0.03);
        targets[i][j].scatter = true;
        AddSpark();
      }
    }
  }

  if (sparked) {
    if (Addscore) {
      score += 100;
      Addscore = false;
    } else {
      score -= 100;
    }
  }
  //click to scatter the rotorelief
  if (Mode1Start && targets.length > scatterNum && dist(mouseX, mouseY, width / 2, height / 2) < 200) {
    scatterNum++;
    clickSound.play();
    sparked = true;
    for (let i = 0; i < targets.length; i++) {
      for (let j = 0; j < targets[i].length; j++) {
        targets[i][j].scatter = true;
      }
    }
  }
}
//construct the spark effect, the speed, the color palette
function AddSpark() {
  let colorPalette;
  let num = random(1);

  sparkSound.play();

  if (num <= 0.3) {
    colorPalette = palette1;
  } else if (num > 0.3 && num <= 0.6) {
    colorPalette = palette2;
  } else {
    colorPalette = palette3;
  }

  let spark = [];
  for (let i = 0; i < maxPoints; i++) {
    spark[i] = new Spark(mouseX, mouseY, random(2, 8), random(colorPalette), random(0, 360), random(0.5, 5));
  }
  sparks.push(spark);
}

function windowResized() {
  resizeCanvas(windowWidth, 815);
}

class Target {
  constructor(x, y, color, size, rotp1, rotp2) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.s = size;
    this.c = color;
    this.rotp1 = rotp1;
    this.static = rotp1;
    this.rotp2 = rotp2;
    this.scatter = false;
  }

  update() {
    if (this.rotp1 < 15) {
      this.pos.x += map(cos(frameCount * this.rotp2), -1, 1, -this.rotp1, this.rotp1);
      this.pos.y += map(sin(frameCount * this.rotp2), -1, 1, -this.rotp1, this.rotp1);
    } else {
      this.pos.x += map(cos(frameCount * this.rotp2), -1, 1, -this.static, this.static);
      this.pos.y += map(sin(frameCount * this.rotp2), -1, 1, -this.static, this.static);
    }
  }

  updateMode2() {

    let v = random(1);
    let speed = random(0.5);
    if (v < 0.25) {
      this.vel.x += speed;
    } else if (v >= 0.25 && v < 0.5) {
      this.vel.y += speed;
    } else if (v >= 0.5 && v < 0.75) {
      this.vel.x += -speed;
    } else {
      this.vel.y += -speed;
    }

    this.vel.limit(6);
    this.pos.add(this.vel);

  }

  edges() {
    if (this.pos.y >= height - this.s) {
      this.pos.y = height - this.s;
      this.vel.y *= -1;
    } else if (this.pos.y <= this.s) {
      this.pos.y = this.s;
      this.vel.y *= -1;
    }

    if (this.pos.x >= width - this.s) {
      this.pos.x = width - this.s;
      this.vel.x *= -1;
    } else if (this.pos.x <= this.s) {
      this.pos.x = this.s;
      this.vel.x *= -1;
    }
  }


  display() {
    push();
    fill(this.c);
    noStroke();
    circle(this.pos.x, this.pos.y, this.s);
    pop();
  }

  displayMode2() {

    push();
    let x = this.pos.x;
    let y = this.pos.y;

    for (let i = 0; i < 3; i++) {
      let prevx = x;
      let prevy = y;

      let n = i * 2 + 1;
      let radius = this.s * (4 / (n * PI));
      x += radius * cos(n * time);
      y += radius * sin(n * time);

      fill(palette1[i + 2])
      stroke('#005582')

      if (i == 0 && this.hit1) {
        strokeWeight(3)
        stroke(this.c)
      } else if (i == 1 && this.hit10) {
        strokeWeight(3)
        stroke(this.c)
      } else {
        strokeWeight(1)
      }

      ellipse(prevx, prevy, radius * 2);
      //line(prevx, prevy, x, y);

      if (i == 1) { // middle
        this.second = {
          x: prevx,
          y: prevy,
          d: radius * 2
        }
      }
    }
    pop();

    time += 0.05;
  }

  // check which cicle hit
  checkHit() {
    this.hit10 = dist(this.second.x, this.second.y, mouseX, mouseY) <= this.second.d
    this.hit1 = dist(this.pos.x, this.pos.y, mouseX, mouseY) <= this.s + 45

    if (this.hit10) {
      this.c = color('#3bd6c6');
    } else if (this.hit1) {
      this.c = color('#b3ecec');
    }
  }
  //fall the rotorelief apart
  mouseInteraction() {
    if (this.scatter) {
      this.rotp1 *= random(1.01, 1.03)
      if (this.s > targetSize) {
        this.s -= 1;
      }
    }
  }
}
//particle class: for menu decoration use
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.7, 0.7);
    this.vy = random(-5, -1);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1.5;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, 16);
  }
}
//spark effect, when you click the circle, it would be generated
class Spark {

  //reference： https://openprocessing.org/sketch/1527178
  constructor(x, y, radius, color, angle, speed) {
    this.pos = createVector(x, y);
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.color = color;
    this.angle = angle;
    this.speed = speed;
    this.R = 0;
    this.vel = createVector(0, 0);
    this.acc = createVector(cos(this.angle) * this.speed, sin(this.angle) * this.speed);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.R = sqrt((this.pos.x - this.x) * (this.pos.x - this.x) + (this.pos.y - this.y) * (this.pos.y - this.y));
  }

  points() {
    push();
    noStroke();
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.radius);
    pop();
  }


}