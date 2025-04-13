// (C) 2014 Sean Brennan
var game_over_tex = THREE.ImageUtils.loadTexture("marquee_game_over.jpg");
var here_they_come_tex = THREE.ImageUtils.loadTexture("marquee_here_they_come.jpg");
var score_label_tex = THREE.ImageUtils.loadTexture("marquee_score_label.jpg");
var welcome_tex = THREE.ImageUtils.loadTexture("marquee_welcome.jpg");
var press_any_key_tex = THREE.ImageUtils.loadTexture("marquee_press_any_key.jpg");


var Marquee = function(x, y, z, xd, yd, tex) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.group = new THREE.Object3D();
  this.geom = new THREE.PlaneGeometry(xd, yd);
  var mat = new THREE.MeshBasicMaterial({map: tex});
  //mat.side = THREE.BackSide;
  this.marquee = new THREE.Mesh(this.geom, mat);
  this.marquee.rotation.y = Math.PI;
  this.group.add(this.marquee);
}

var GameOverMarquee = function() {
  this.name = "GameOverMarquee";
  this.mobj = new Marquee(15, 13.3, 100, 9, 4, game_over_tex);
  this.anim_z = new LinearLoop([ 100, GameState.box_z - 1]);
  this.timer = 0.0;
  this.period = 2.0;
  this.one_over_period = 1.0 / this.period;
  this.do_animate = false;
  SetPosition(this);
}

var ScoreLabelMarquee = function () {
  this.name = "ScoreLabelMarquee";
  this.mobj = new Marquee(30, GameState.box_y * 2, GameState.box_z * 2, GameState.boxdim * 2, GameState.boxdim, score_label_tex);
  this.anim_z = new LinearLoop([GameState.box_z * 2, GameState.box_z * 2 + 1]);
  this.timer = 0.0;
  this.period = 10.0;
  this.one_over_period = 1.0 / this.period;
  this.do_animate = true;
  SetPosition(this);
}

var HereTheyComeMarquee = function () {
  this.name = "HereTheyComeMarquee";
  this.mobj = new Marquee(20, GameState.box_y, 2, 2.4, 1, here_they_come_tex);
  this.anim_z = new LinearLoop([2.3, 7.5, 100, 100]);
  this.timer = 0.0;
  this.period = 8.0;
  this.one_over_period = 1.0 / this.period;
  this.do_animate = false;
  this.mobj.group.visible = false;
  SetPosition(this);
}

var WelcomeMarquee = function () {
  this.name = "WelcomeMarquee";
  this.mobj = new Marquee(25, GameState.box_y + 0.5 , 2.2, 1.2, 1, welcome_tex);
  this.anim_z = new LinearLoop([2.0, 2.1, 2.12, 2.02]);
  this.timer = 0.0;
  this.period = 10.0;
  this.one_over_period = 1.0 / this.period;
  this.do_animate = true;
  SetPosition(this);
}

var PressAnyKeyMarquee = function () {
  this.name = "PressAnyKeyMarquee";
  this.mobj = new Marquee(24, GameState.box_y + 0.9 , 1.5, 0.8, 0.43, press_any_key_tex);
  this.anim_z = new LinearLoop([1.45, 1.40]);
  this.timer = 0.0;
  this.period = 1.0;
  this.one_over_period = 1.0 / this.period;
  this.do_animate = true;
  SetPosition(this);
}

var SetPosition = function(marquee) {
  marquee.mobj.group.position.x = marquee.mobj.x;
  marquee.mobj.group.position.y = marquee.mobj.y;
  marquee.mobj.group.position.z = marquee.mobj.z;
}

var ResetMarquees = function(marquees) {
  for (var idx = 0; idx < marquees.length; idx++) {
    marquees[idx].timer = 0.0;
    SetPosition(marquees[idx]);
  }
}

var AnimMarquees = function(marquees, clock_delta) {
  for (var idx = 0; idx < marquees.length; idx++) {
    if (marquees[idx].do_animate) {
      marquees[idx].timer += clock_delta;
      while (marquees[idx].timer > marquees[idx].period) {
        marquees[idx].timer -= marquees[idx].period;
      }
      var phase = marquees[idx].timer * marquees[idx].one_over_period;
      marquees[idx].mobj.z = LoopInterpolate(marquees[idx].anim_z, phase);
      SetPosition(marquees[idx]);
      if (phase > 0.5) {
        if (marquees[idx].name == "HereTheyComeMarquee") {
          marquees[idx].do_animate = false;
        }
        if (marquees[idx].name == "GameOverMarquee") {
          marquees[idx].do_animate = false;
        }
      }
    }
  }
}
