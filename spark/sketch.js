var gunSize = 50;
var gunWidth = 1;
var targets = [];
var targetNum = 6;
var targetSize = 50;

let maxPoints = 300;
let sparks = [];
let sparked = false;
let dsprRange = 250;

let palette1 = ["#ff00c1", "#9600ff", "#4900ff", "#00b8ff", "#00fff9"];
let palette2 = ["#daf8e3", "#97ebdb", "#00c2c7", "#0086ad", "#005582"];
let palette3 = ["#6749dc", "#ad51f3", "#f64cd5"];

let GameStart = false;

let Mode1_Button;
let Mode2_Button;

let Mode1Start = false;
let Mode2Start = false;

let timer;
let waitTime = 0;
let score = 0;
let Addscore = false;
let inital = false;

let TargetColor;
let c = ['#ff00c1', '#9600ff', '#4900ff', '#00ff85', '#00b8ff', '#00fff9']

let time = 0;
let addtarget = true;
let scatterNum = 0;

let clickSound, sparkSound, elecSound;
function preload() {
  clickSound = loadSound("assets/click.mp3");
  sparkSound = loadSound("assets/spark.mp3");
  elecSound = loadSound("assets/electricity.mp3");
}

function setup() {
  myCan = createCanvas(window.innerWidth , 815);
  myCan.parent('mywork')
  textAlign(CENTER);

  Mode1_Button = createButton("Mode 1");
  Mode1_Button.style('font-size', '20px');
  Mode1_Button.style('padding', '10px 30px');
  Mode1_Button.style('font-family', 'Josefin Sans');
  Mode1_Button.mousePressed(() => {
    Mode1Start = true;
    Mode2Start = false;
    GameStart = true;
    Mode1_Button.hide();
    Mode2_Button.hide();
  })

  Mode2_Button = createButton("Mode 2");
  Mode2_Button.style('font-size', '20px');
  Mode2_Button.style('padding', '10px 30px');
  Mode2_Button.style('font-family', 'Josefin Sans');
  Mode2_Button.mousePressed(() => {
    Mode1Start = false;
    Mode2Start = true;
    GameStart = true;
    Mode1_Button.hide();
    Mode2_Button.hide();
  })
}

function draw() {
  background(10, 25);
  Mode2_Button.position(width / 2 + 50, height);
  Mode1_Button.position(width / 2 - 200, height);
  if (Mode1Start) {
    Mode1();
  }

  if (Mode2Start) {
    Mode2();
  }

  if (GameStart) {
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
    background(10);
    GameStart = false;
    Mode1Start = false;
    Mode2Start = false;
    sparked = false;
    textSize(45);
    text("Your score : " + score, width / 2, height / 2 - 80)
    Mode1_Button.show();
    Mode2_Button.show();
    waitTime = (int)(millis() / 1000);
    inital = false;
  }
}

function Mode1() {

  if (!inital) {
    inital = true;
    initalMode1();
  }

  if (frameCount % 2000 == 0) {
    addtarget = false;
  }

  if (!addtarget) {
    addtarget = true;
    AddTargets();
  }

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
        if (s.R > random(120, 250)) {
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
  if (!inital) {
    inital = true;
    initalMode2();
  }

  //targets
  for (let t of targets) {
    t.updateMode2();
    t.edges();
    t.displayMode2();

    if (dist(t.pos.x, t.pos.y, mouseX, mouseY) <= t.s) {
      t.c = color(255);
      score++;
      if (!elecSound.isPlaying()) {
        elecSound.play();
      }
      sparks.push(new Spark(mouseX, mouseY, random(2, 8), random(palette3), random(0, 360), random(0.5, 5)));
    } else {
      t.c = TargetColor;
      elecSound.stop();
    }
  }

  for (let i = 0; i < sparks.length; i++) {
    s = sparks[i];
    if (s.R > random(50, 100)) {
      sparks.splice(i, 1);
    } else {
      s.update();
      s.points();
    }
  }
}

function initalMode1() {
  noCursor();
  background(10);
  score = 0;
  scatterNum = 0;
  sparks.length = 0;
  targets.length = 0;
  AddTargets();
  sparked = false;
}

function AddTargets() {
  let t = [];
  for (let i = 0; i < targetNum; i++) {
    t[i] = new Target(width / 2, height / 2, c[i], 200 - 30 * i, 1.5 - 0.2 * i, 0.03);
  }
  targets.push(t);
}

function initalMode2() {
  noCursor();
  background(10);
  score = 0;
  sparks.length = 0;
  targets.length = 0;
  TargetColor = random(c);
  targets[0] = new Target(width / 2, height / 2, TargetColor, targetSize, 1.5, 0.02);
  sparked = false;
}

function gun(x, y) {
  push();
  noFill();
  stroke(150);
  strokeWeight(gunWidth);
  circle(x, y, gunSize);
  line(x, y - 40, x, y + 40);
  line(x - 40, y, x + 40, y);
  pop();
}

function mousePressed() {
  gunSize = 30;
  gunWidth = 3;
}

function mouseReleased() {
  gunSize = 50;
  gunWidth = 1;
}

function mouseClicked() {
  //spark mode
  for (let i = 0; i < targets.length; i++) {
    for (let j = 0; j < targets[i].length; j++) {
      t = targets[i][j];
      if (dist(t.pos.x, t.pos.y, mouseX, mouseY) <= t.s && t.scatter) {
        Addscore = true;
        targets[i][j] = new Target(random(targetSize, width - targetSize), random(targetSize, height - targetSize), c[j], targetSize, 1.5 - 0.2 * j, 0.03);
        targets[i][j].scatter = true;
        AddSpark();
      }
    }
  }

  if(sparked){
    if (Addscore) {
      score += 100;
      Addscore = false;
    } else {
      score -= 100;
    }
  }


  if (Mode1Start && targets.length > scatterNum) {
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
    spark[i] = new Spark(mouseX, mouseY, random(2, 8), random(colorPalette), random(0, 360), random(0.5,5));
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

      stroke(this.c);
      noFill();
      ellipse(prevx, prevy, radius * 2);
      line(prevx, prevy, x, y);
    }
    pop();

    time += 0.05;
  }

  mouseInteraction() {
    if (this.scatter) {
      this.rotp1 *= random(1.01, 1.03)
      if (this.s > targetSize) {
        this.s -= 1;
      }
    }
  }
}
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