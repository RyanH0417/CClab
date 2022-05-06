let dialog1;
let dialog2;
let dialog3;
let dialog4;
let dialog5;

function setup() {
  noCanvas();
  dialog1 = select('#dialog1');
  dialog2 = select('#dialog2');
  dialog3 = select('#dialog3');
  dialog4 = select('#dialog4');
  dialog5 = select('#dialog5');
  dialog1.mousePressed(dialog1Clicked);
  dialog2.mousePressed(dialog2Clicked);
  dialog3.mousePressed(dialog3Clicked);
  dialog4.mousePressed(dialog4Clicked);
}

function draw() {
  background(220);

  if (frameCount == 100) {
    dialog1.style('opacity', '.7');
  }
}

function dialog1Clicked() {
  dialog2.style('opacity', '.7');
  dialog1.style('opacity','0')
}

function dialog2Clicked() {
  dialog3.style('opacity','.7');
  dialog2.style('opacity','0')
}
function dialog3Clicked() {
  dialog4.style('opacity', '.7');
  dialog3.style('opacity','0')
}
function dialog4Clicked() {
  dialog5.style('opacity', '.7');
  dialog4.style('opacity','0')
}
