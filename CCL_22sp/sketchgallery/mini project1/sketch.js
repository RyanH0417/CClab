rL = [30, 45, 60];
cL = ["#ff00c1", "#9600ff", "#4900ff", "#107dac", "#00b8ff", "#00fff9"];
sL = [0.5, 0.7, 1, 1.3, 1.5, -0.5, -0.7, -1, -1.3, -1.5];
function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent(sketch)
  rectMode(CENTER);
    background("#7df9ff");
  for (let i = 100; i < 600; i += 150) {
    for (let j = 100; j < 600; j += 150) {
      drawCreature(i, j, random(cL), random(sL), random(rL));
    }
  }

}
function drawCreature(x, y, c, s, r) {
  drawArm(x, y, c, s, r);
  drawBody(x, y, c, s, r);
  drawHead(x, y, c, s, r);
  // YOUR CODE GOES HERE
  // introduce additional functions
  // for parts of your creature that
  // are repeated, and call them from
  // here
}
function drawArm(x, y, c, s, r) {
    //arm&hand&foot
    push();
    strokeWeight(2);
    translate(x, y);
    scale(s);
    rotate(r);

    fill(c);
    ellipse(-50, 113, 70, 70);
    ellipse(50, 113, 70, 70);
    fill(255);
    ellipse(-30, 196, 57, 20);
    ellipse(30, 196, 57, 20);
    circle(-81, 133, 26);
    circle(81, 133, 26);
    pop();
}

function drawBody(x, y, c, s, r) {
    push();
    translate(x, y);
    scale(s);
    rotate(r);

    //body
    fill(c);
    strokeWeight(2);
    ellipse(0, 125, 139, 140);
    fill(255);
    ellipse(0, 115, 110, 105);
    arc(0, 115, 80, 80, 0, PI, CHORD);
    pop();
}

function drawHead(x, y, c, s, r) {
    push();
    translate(x, y);
    scale(s);
    rotate(r);

    //head blue
    fill(c);
    strokeWeight(2);
    ellipse(0, 0, 170, 155);

    //head white
    fill(255);
    ellipse(1.8, 19, 152, 115);

    //mouse
    push();
    fill("#ff7878");
    beginShape();
    curveVertex(-37, 16);
    curveVertex(-37, 16);
    curveVertex(-42, 20);
    curveVertex(-42, 37);
    curveVertex(-36, 46);
    curveVertex(-23, 55);
    curveVertex(0, 59);
    curveVertex(30, 49);
    curveVertex(50, 32);
    curveVertex(47, 10);
    curveVertex(-3, 23);
    endShape(CLOSE);
    pop();

    //inside mouse
    push();
    fill("#ffc2cd");
    ellipse(-2, 44.5, 65, 28);
    noStroke();
    circle(-43, 2, 28);
    circle(35, -3, 28);
    pop();

    //nose
    push();

    line(1, 22, 0, -3);
    fill("#9a8262");
    circle(0, -13, 20);
    fill(255);
    line(-33, -19, -78, -47);
    line(-33, 3, -95, -12);
    line(-55, 17, -96, 12);
    line(29, -21, 74, -56);
    line(29, -3, 95, -27);
    line(57, 13, 86, 12);
    noStroke();
    circle(-5, -17, 7);
    pop();

    //eyes

    ellipse(-15, -36, 25, 33);
    ellipse(11, -38, 25, 33);
    strokeWeight(3);
    ellipse(-10, -36, 5, 9);
    ellipse(4, -36, 5, 9);
    fill("#a70000");

    //bell
    rect(3, 70, 120, 10);
    fill("#ecb939");
    circle(0, 80, 20);
    fill(0);
    circle(0, 81, 4);
    line(0, 81, 0, 89);
    strokeWeight(1);
    line(-11, 80, 11, 80);
    line(-11, 78, 11, 78);
    pop();
}