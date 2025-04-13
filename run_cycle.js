// (C) 2014 Sean Brennan
var yinit = 9.6;

var default_tex = THREE.ImageUtils.loadTexture("zombie_test_texture.png");
var body_tex = THREE.ImageUtils.loadTexture("zombie_body_texture.png");
var head_tex = THREE.ImageUtils.loadTexture("zombie_head_texture3.png");
var leg_tex = THREE.ImageUtils.loadTexture("zombie_leg_texture.png");

var RESET_Z = 100;
var RESET_X = 30;

var Runner = function(x, z) {
  this.x = x;
  this.y = yinit;
  this.z = z;
  //this.velocity = 3.1;
  this.velocity = 12.1;
  this.run_period = 1.0;  // Seconds per run cycle.
  this.run_timer = Math.random(); // counts up to run_period.
  this.one_over_period = 1.0 / this.run_period;
  var random_factor = Math.random()
  this.width = .6 + random_factor * 0.4;
  this.height = 2.3;
  this.depth = .4 + random_factor * 0.2;
  this.group = new THREE.Object3D();
  this.group.matrixAutoUpdate = true;
  this.group.position.x = x;
  this.group.position.y = this.y;
  this.group.position.z = z;

  this.hit_rad = this.width * 0.6;

  // Hit Box:
  //var hit_geom = new THREE.PlaneGeometry(this.width * 1.4, this.depth * 1.2, 1, 1);
  //var hit_mat = new THREE.MeshBasicMaterial({color: 0xff00ff});
  //var hit_box = new THREE.Mesh(hit_geom, hit_mat);
  //hit_box.rotation.x = - Math.PI * 0.5;
  //hit_box.position.y = -.1;
  //this.group.add(hit_box);

  this.hit_x = x + this.width * 1.4;
  this.hit_z = z + this.depth * 1.2;

  // BODY
  var body_geom = new THREE.BoxGeometry(this.width, this.height * 0.5, this.depth);
  var body_mat = new THREE.MeshLambertMaterial({map: body_tex});
  //var body_mat = new THREE.MeshBasicMaterial({map: body_tex});
  //var body_mat = new THREE.MeshNormalMaterial();
  TexBox(body_geom);
  var body = new THREE.Mesh(body_geom, body_mat);
  body.position.y = this.height * 0.5;
  // body.position.x = x
  // body.position.z = z
  this.group.add(body);
  this.body = body;

  // NECK
  this.neck = new THREE.Object3D();
  var neck_geom = new THREE.BoxGeometry(this.width * 0.28, this.height * 0.28, this.depth * 0.48);
  var neck_mat = new THREE.MeshLambertMaterial({map: default_tex});
  //var neck_mat = new THREE.MeshNormalMaterial();
  var neck_mesh = new THREE.Mesh(neck_geom, neck_mat);
  this.neck.position.y = this.height * 0.75;
  neck_mesh.position.y = this.height * 0.00;
  this.neck.add(neck_mesh)
  this.group.add(this.neck);

  // HEAD
  var head_geom = new THREE.BoxGeometry(this.width * 0.48, this.height * 0.18, this.depth * 0.88);
  var head_mat = new THREE.MeshLambertMaterial({map: head_tex});
  TexBox(head_geom);
  //var head_mat = new THREE.MeshNormalMaterial();
  var head_mesh = new THREE.Mesh(head_geom, head_mat);
  head_mesh.position.y =  this.height * 0.89;
  this.group.add(head_mesh);

  // LEFT LEG
  this.left_hip = new THREE.Object3D();
  var left_leg_geom = new THREE.BoxGeometry(this.width * 0.35, this.height * 0.5, this.depth * 0.55);
  var left_leg_mat = new THREE.MeshLambertMaterial({map: leg_tex});
  //var left_leg_mat = new THREE.MeshNormalMaterial();
  TexBox(left_leg_geom);
  var left_leg = new THREE.Mesh(left_leg_geom, left_leg_mat);
  left_leg.position.x = .25 * this.width;
  this.left_hip.position.y = - this.height * 0.25;
  left_leg.position.y = - this.height * 0.25;
  this.left_hip.add(left_leg)
  body.add(this.left_hip);

  // RIGHT LEG
  this.right_hip = new THREE.Object3D();
  var right_leg_geom = new THREE.BoxGeometry(this.width * 0.35, this.height * 0.5, this.depth * 0.55);
  var right_leg_mat = new THREE.MeshLambertMaterial({map: leg_tex});
  // var right_leg_mat = new THREE.MeshNormalMaterial();
  TexBox(right_leg_geom);
  var right_leg = new THREE.Mesh(right_leg_geom, right_leg_mat);
  right_leg.position.x = -.25 * this.width;
  this.right_hip.position.y = - this.height * 0.25;
  right_leg.position.y = - this.height * 0.25;
  this.right_hip.add(right_leg)
  body.add(this.right_hip);

  // RIGHT ARM
  this.right_shoulder = new THREE.Object3D();
  var right_arm_geom = new THREE.BoxGeometry(this.width * 0.25, this.height * 0.4, this.depth * 0.40);
  var right_arm_mat = new THREE.MeshLambertMaterial({map: default_tex});
  //var right_arm_mat = new THREE.MeshNormalMaterial();
  var right_arm = new THREE.Mesh(right_arm_geom, right_arm_mat);
  right_arm.position.y = .25 * this.height;
  this.right_shoulder.position.x = this.width * 0.25;
  right_arm.position.x =  this.width * 0.40;
  this.right_shoulder.position.y = this.height * 0.25;
  this.right_shoulder.rotation.x = Math.PI;
  this.right_shoulder.add(right_arm)
  body.add(this.right_shoulder);

  // LEFT ARM
  this.left_shoulder = new THREE.Object3D();
  var left_arm_geom = new THREE.BoxGeometry(this.width * 0.25, this.height * 0.4, this.depth * 0.40);
  var left_arm_mat = new THREE.MeshLambertMaterial({map: default_tex});
  //var left_arm_mat = new THREE.MeshNormalMaterial();
  var left_arm = new THREE.Mesh(left_arm_geom, left_arm_mat);
  left_arm.position.y = .25 * this.height;
  this.left_shoulder.position.x = -this.width * 0.25;
  left_arm.position.x =  -this.width * 0.40;
  this.left_shoulder.position.y = this.height * 0.25;
  this.left_shoulder.rotation.x = -Math.PI;
  this.left_shoulder.add(left_arm)
  body.add(this.left_shoulder);
 
  return this;
}

function PositionRunner(runners, i, time_delta) {
  runners[i].run_timer += time_delta * game.game_over_velocity;
  if (runners[i].run_timer > runners[i].run_period) {
    runners[i].run_timer -= runners[i].run_period;
  };
  var phase = runners[i].run_timer * runners[i].one_over_period;  // 0..1
  var left_phase = Math.sin(2.0 * Math.PI * phase);
  var right_phase = Math.sin((2.0 * phase + 1.0) * Math.PI);
  runners[i].left_shoulder.rotation.x =  Math.PI * 1.5 + left_phase * 0.5;
  runners[i].right_shoulder.rotation.x =  Math.PI * 1.5 + right_phase * 0.5;
  runners[i].left_hip.rotation.x = left_phase; 
  runners[i].right_hip.rotation.x = right_phase;
  runners[i].body.rotation.y = Math.sin(phase * 2.0 * Math.PI) * 0.1;
}

function MoveRunner(runners, i, time_delta) {
  runners[i].group.position.z -= time_delta * runners[i].velocity * game.game_over_velocity;
  if (runners[i].group.position.z < 0.0) {
    ResetRunner(runners, i);
  };
}

function ResetRunner(runners, i) {
  runners[i].group.position.z += RESET_Z;
  runners[i].group.position.x = 2.0 + (RESET_X - 3) * Math.random();
}

function AnimateRunners(runners, time_delta) {
  for (var i = 0; i < runners.length; i++) {
    PositionRunner(runners, i, time_delta);
    MoveRunner(runners, i, time_delta);
  };
}

function GenRunner() {
  var runner = new Runner(Math.random() * (RESET_X - 3) + 2,
                           Math.random() * RESET_Z + RESET_Z);
  return runner;
}

function AddRunner(runners, scene) {
  var runner = GenRunner();
  runners.push(runner);
  scene.add(runner.group);
}

function MakeRunners(num_runners) {
  var runners = [];
  for (var i = 0; i < num_runners; i++) {
    var runner = GenRunner();
    runners.push(runner);
  }
  return runners;
}

function intToARGB(i) {
    var h = ((i>>24)&0xFF).toString(16) +
            ((i>>16)&0xFF).toString(16) +
            ((i>>8)&0xFF).toString(16) +
            (i&0xFF).toString(16);
    return h.substring(0, 6);
}

function rbow(x, y, z, xmax, ymax, zmax) {
  var r = (x * 255 / xmax) << 16;
  var g = (y * 255 / ymax) << 8;
  var b = (z * 255 / zmax);
  // var rgb = new THREE.Color(r, g, b).getHex()
  var rgb = r + g + b;
  rgb = 0x000088;
  return rgb;
}

function Tr(x) {
  return x * 3.0;
}

