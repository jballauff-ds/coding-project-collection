float R = 2;
Snowflake flake;

void setup () {
 size(600,600);
 flake = new Snowflake(width/2, height/2, random(170,230));
}

void draw() {
  background(0);
  boolean existing = flake.update();
  if(!existing) {
    flake = new Snowflake(width/2, height/2, random(170,230));
  }
  flake.show();
}


void mousePressed() {
  flake.disperse();
}
