// (C) 2014 Sean Brennan

var PLUS_RESET_Z = 100; // 10 for testing, 100 for game.
var PLUS_RESET_X = 30;

var PlusUp = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.velocity = 10.1;
  this.width = 1.0;
  this.girth = 0.3;
  this.height = 2.0;
  this.rotation_period = 2.0;
  this.rotation_timer = 0;
  this.one_over_period = 1.0 / this.rotation_period;
  this.group = new THREE.Object3D();
  this.group.matrixAutoUpdate = true;
  this.group.position.x = x;
  this.group.position.y = y;
  this.group.position.z = z;
  this.hit_rad = 0.6 * this.width;
  this.center = new THREE.Object3D();
  this.group.add(this.center);
  var plusup_geo = new THREE.BoxGeometry(this.girth, this.girth, this.width);
  var plusup_mat = new THREE.MeshBasicMaterial({color: 0xbb1111, transparent:true, opacity: 0.7});
  var plusbar = new THREE.Mesh(plusup_geo, plusup_mat);
  this.center.add(plusbar);
  plusup_geo = new THREE.BoxGeometry(this.width, this.girth, this.girth);
  plusbar = new THREE.Mesh(plusup_geo, plusup_mat);
  this.center.add(plusbar);
  plusup_geo = new THREE.BoxGeometry(this.girth, this.width, this.girth);
  plusbar = new THREE.Mesh(plusup_geo, plusup_mat);
  this.center.add(plusbar);
}

var GenPlusUp = function() {
  var plusser = new PlusUp((Math.random() * PLUS_RESET_X - 3) + 2, 11,
                           Math.random() * PLUS_RESET_Z + PLUS_RESET_Z);
  return plusser;
}

var AddPlusUp = function(plussers, scene) {
  var plusser = GenPlusUp();
  plussers.push(plusser);
  scene.add(plusser.group);
}

var DelPlusUp = function(plussers, i,  scene) {
  scene.remove(plussers[i].group);
  plussers.splice(i, 1);
}

var AnimatePlusUps = function(plussers, clock_delta) {
  for (var i = plussers.length - 1; i >= 0; i--) {
    PositionPlusUps(plussers, i, clock_delta);
    MovePlusUps(plussers, i, clock_delta);
  };
}

var MovePlusUps = function(plussers, i, clock_delta) {
  plussers[i].group.position.z -= clock_delta * plussers[i].velocity * game.game_over_velocity;
  if (plussers[i].group.position.z < 0.0) {
    plussers.splice(i, 1);
  };
}

var PositionPlusUps = function(plussers, i, clock_delta) {
  plussers[i].rotation_timer += clock_delta * game.game_over_velocity;
  if (plussers[i].rotation_timer > plussers[i].rotation_period) {
    plussers[i].rotation_timer -= plussers[i].rotation_period;
  };
  var phase = plussers[i].rotation_timer * plussers[i].one_over_period;  // 0..1
  plussers[i].group.rotation.y = Math.PI * 2.0 * phase;
}
