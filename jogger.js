// (C) 2014 Sean Brennan
var jogger_body_tex  = THREE.ImageUtils.loadTexture("jogger_body_texture.png");
var jogger_leg_tex   = THREE.ImageUtils.loadTexture("jogger_leg_texture.png");
var jogger_altbody_tex  = THREE.ImageUtils.loadTexture("jogger_altbody_texture.jpg");
var jogger_altleg_tex   = THREE.ImageUtils.loadTexture("jogger_altleg_texture.jpg");

var Jogger = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.velocity = 3.1;
  this.run_period = 0.7;
  this.run_timer = Math.random();
  this.width = 0.6;
  this.height = 2.0;
  this.depth = 0.35;
  this.group = new THREE.Object3D();
  this.group.matrixAutoUpdate = true;
  this.group.position.x = x;
  this.group.position.y = y;
  this.group.position.z = z;
  this.one_over_period = 1.0 / this.run_period;
  this.hit_rad = 0.6 * this.width;
  this.death_knee_rotation_x = Math.random() * 0.2;
  this.death_hip_rotation_x = Math.random() * 0.2;
  this.death_elbow_rotation_x = Math.random() * 0.2;
  this.death_shoulder_rotation_x = Math.random() * 0.2;
  this.death_torso_rotation_x = - Math.PI * 0.5 + Math.random() * 0.2;
  this.death_timer = 0.0;
  this.death_period = 2.0;
  this.one_over_death_period = 1.0 / this.death_period;
  this.knee_right_death;
  this.hip_right_death;
  this.shoulder_right_death;
  this.elbow_right_death;
  this.default_torso_rotation_x = -0.2;
  
  var thigh_length = this.width * 0.25;
  var shin_length = this.width * 0.25;
  var foot_length = this.depth;
 
  // Hit Box:
  //var hit_geom = new THREE.PlaneGeometry(this.width * 1.4, this.depth * 1.2, 1, 1);
  //var hit_mat = new THREE.MeshBasicMaterial({color: 0xff0000});
  //var hit_box = new THREE.Mesh(hit_geom, hit_mat);
  //hit_box.rotation.x = - Math.PI * 0.5;
  //hit_box.position.y = -.1;
  //this.group.add(hit_box);

  this.hit_x = x + this.width * 1.4;
  this.hit_z = z + this.depth * 1.2;
  this.do_hit_effects = false;
  this.invincible_timer = 0;
  this.hit_texture_timer = 0;
  this.bullet_time_timer = 0;

  // Body
  this.torso = new THREE.Object3D();
  //var body_geom = new THREE.BoxGeometry(this.width, this.height * 0.5, this.depth);
  var body_geom = new THREE.BoxGeometry(this.width, this.height * 0.4, this.depth);
  this.body_mat = new THREE.MeshLambertMaterial({map: jogger_body_tex});
  TexBox(body_geom);
  this.body = new THREE.Mesh(body_geom, this.body_mat);
  this.body.position.y = this.height * 0.6;
  this.torso.rotation.x = this.default_torso_rotation_x;
  this.torso.add(this.body);
  this.group.add(this.torso);

  // Right Leg
  this.right_hip = new THREE.Object3D();
  var right_thigh_geom = new THREE.BoxGeometry(this.width * 0.35, this.height * 0.25, this.depth * 0.55);
  this.right_thigh_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  TexBox(right_thigh_geom);
  var right_thigh = new THREE.Mesh(right_thigh_geom, this.right_thigh_mat);
  right_thigh.position.x = .25 * this.width;
  this.right_hip.position.y = - this.height * 0.145;
  right_thigh.position.y = - this.height * 0.125;
  this.right_hip.add(right_thigh)
  this.body.add(this.right_hip);

  this.right_knee = new THREE.Object3D();
  var right_shin_geom = new THREE.BoxGeometry(this.width * 0.35, this.height * 0.25, this.depth * 0.55);
  this.right_shin_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  TexBox(right_shin_geom);
  var right_shin = new THREE.Mesh(right_shin_geom, this.right_shin_mat);
  this.right_knee.position.y = - this.height * 0.125;
  right_shin.position.y = - this.height * 0.125;
  this.right_knee.add(right_shin)
  right_thigh.add(this.right_knee);

  this.right_ankle = new THREE.Object3D();
  var right_foot_geom = new THREE.BoxGeometry(this.width * 0.37, this.height * 0.25, this.depth * 0.35);
  var right_foot_mat = new THREE.MeshLambertMaterial({color: 0x0000ff});
  TexBox(right_foot_geom);
  var right_foot = new THREE.Mesh(right_foot_geom, right_foot_mat);
  this.right_ankle.position.y = - this.height * 0.135;
  right_foot.position.y = - this.height * 0.025;
  this.right_ankle.add(right_foot)
  right_shin.add(this.right_ankle);

  // Left Leg
  this.left_hip = new THREE.Object3D();
  var left_thigh_geom = new THREE.BoxGeometry(this.width * 0.35, this.height * 0.25, this.depth * 0.55);
  this.left_thigh_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  TexBox(left_thigh_geom);
  var left_thigh = new THREE.Mesh(left_thigh_geom, this.left_thigh_mat);
  left_thigh.position.x = - .25 * this.width;
  this.left_hip.position.y = - this.height * 0.145;
  left_thigh.position.y = - this.height * 0.125;
  this.left_hip.add(left_thigh)
  this.body.add(this.left_hip);

  this.left_knee = new THREE.Object3D();
  var left_shin_geom = new THREE.BoxGeometry(this.width * 0.35, this.height * 0.25, this.depth * 0.55);
  this.left_shin_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  TexBox(left_shin_geom);
  var left_shin = new THREE.Mesh(left_shin_geom, this.left_shin_mat);
  this.left_knee.position.y = - this.height * 0.125;
  left_shin.position.y = - this.height * 0.125;
  this.left_knee.add(left_shin)
  left_thigh.add(this.left_knee);

  this.left_ankle = new THREE.Object3D();
  var left_foot_geom = new THREE.BoxGeometry(this.width * 0.37, this.height * 0.25, this.depth * 0.35);
  var left_foot_mat = new THREE.MeshLambertMaterial({color: 0x0000ff});
  TexBox(left_foot_geom);
  var left_foot = new THREE.Mesh(left_foot_geom, left_foot_mat);
  this.left_ankle.position.y = - this.height * 0.135;
  left_foot.position.y = - this.height * 0.025;
  this.left_ankle.add(left_foot)
  left_shin.add(this.left_ankle);


  // RIGHT ARM
  this.right_shoulder = new THREE.Object3D();
  var right_bicep_geom = new THREE.BoxGeometry(this.width * 0.25, this.height * 0.25, this.depth * 0.40);
  this.right_bicep_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  var right_bicep = new THREE.Mesh(right_bicep_geom, this.right_bicep_mat);
  right_bicep.position.y = .120 * this.height;
  this.right_shoulder.position.x = this.width * 0.25;
  right_bicep.position.x =  this.width * 0.40;
  this.right_shoulder.position.y = this.height * 0.20;
  this.right_shoulder.rotation.x = Math.PI;
  this.right_shoulder.add(right_bicep)
  this.body.add(this.right_shoulder);

  this.right_elbow = new THREE.Object3D();
  var right_forearm_geom = new THREE.BoxGeometry(this.width * 0.24, this.height * 0.26, this.depth * 0.36);
  this.right_forearm_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  var right_forearm = new THREE.Mesh(right_forearm_geom, this.right_forearm_mat);
  right_forearm.position.y = .125 * this.height;
  this.right_elbow.position.y = 0.125 * this.height;
  this.right_elbow.rotation.x = Math.PI * 0.5;
  this.right_elbow.add(right_forearm);
  right_bicep.add(this.right_elbow);

  // LEFT ARM
  this.left_shoulder = new THREE.Object3D();
  var left_bicep_geom = new THREE.BoxGeometry(this.width * 0.25, this.height * 0.25, this.depth * 0.40);
  this.left_bicep_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  var left_bicep = new THREE.Mesh(left_bicep_geom, this.left_bicep_mat);
  left_bicep.position.y = .120 * this.height;
  this.left_shoulder.position.x = -this.width * 0.25;
  left_bicep.position.x =  -this.width * 0.40;
  this.left_shoulder.position.y = this.height * 0.20;
  this.left_shoulder.add(left_bicep)
  this.body.add(this.left_shoulder);

  this.left_elbow = new THREE.Object3D();
  var left_forearm_geom = new THREE.BoxGeometry(this.width * 0.24, this.height * 0.26, this.depth * 0.36);
  this.left_forearm_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  var left_forearm = new THREE.Mesh(left_forearm_geom, this.left_forearm_mat);
  left_forearm.position.y = .125 * this.height;
  this.left_elbow.position.y = 0.125 * this.height;
  this.left_elbow.rotation.x = Math.PI * 0.5;
  this.left_elbow.add(left_forearm);
  left_bicep.add(this.left_elbow);

  // HEAD and NECK
  // NECK
  this.neck = new THREE.Object3D();
  var neck_geom = new THREE.BoxGeometry(this.width * 0.28, this.height * 0.28, this.depth * 0.48);
  this.neck_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  var neck_mesh = new THREE.Mesh(neck_geom, this.neck_mat);
  this.neck.position.y = this.height * 0.77;
  // neck_mesh.position.y = this.height * 0.00;
  this.neck.add(neck_mesh)
  this.torso.add(this.neck);

  // HEAD
  var head_geom = new THREE.BoxGeometry(this.width * 0.48, this.height * 0.18, this.depth * 0.88);
  this.head_mat = new THREE.MeshLambertMaterial({map: jogger_leg_tex});
  TexBox(head_geom);
  var head_mesh = new THREE.Mesh(head_geom, this.head_mat);
  head_mesh.position.y =  this.height * 0.92;
  this.torso.add(head_mesh);


  this.group.rotation.y = Math.PI;
  return this;
}; 


var MakeJoggers = function(num_joggers) {
  var joggers = [];
  for (var i = 0; i < num_joggers; i++) {
    var jogger = new Jogger(Math.random() * 30, 10,  Math.random() * 30);
    joggers.push(jogger);
  }
  return joggers;
}

var hip_animation = new LinearLoop([0.0, 1.5, .0, -1.4]);
var knee_animation = new LinearLoop([-2.0, 0.0, -.2, -.34]);
var ankle_animation = new LinearLoop([1.56, 1.78, 1.3, .1]);
var torso_animation = new LinearLoop([0.0, 0.1, 0.0, -0.1]);
var shoulder_animation = new LinearLoop([-5.2, -4.0, -2.8, -4.0]);

var InitDeathAnims = function(jog) {
    jog.knee_right_death = new LinearLoop([jog.right_knee.rotation.x,
                                          jog.death_knee_rotation_x]);
    jog.hip_right_death = new LinearLoop([jog.right_hip.rotation.x,
                                          jog.death_hip_rotation_x]);
    jog.shoulder_right_death = new LinearLoop([jog.right_shoulder.rotation.x,
                                          jog.death_shoulder_rotation_x]);
    jog.elbow_right_death = new LinearLoop([jog.right_elbow.rotation.x,
                                          jog.death_elbow_rotation_x]);
    jog.knee_left_death = new LinearLoop([jog.left_knee.rotation.x,
                                          jog.death_knee_rotation_x]);
    jog.hip_left_death = new LinearLoop([jog.left_hip.rotation.x,
                                          jog.death_hip_rotation_x]);
    jog.shoulder_left_death = new LinearLoop([jog.left_shoulder.rotation.x,
                                          jog.death_shoulder_rotation_x]);
    jog.elbow_left_death = new LinearLoop([jog.left_elbow.rotation.x,
                                          jog.death_elbow_rotation_x]);
    jog.torso_death = new LinearLoop([jog.torso.rotation.x,
                                          jog.death_torso_rotation_x]);
    jog.death_timer = 0.0;
}

var AnimateDeadJogger = function(jog, clock_delta) {
    jog.death_timer += clock_delta;
    if (jog.death_timer > jog.death_period) {
      jog.death_timer = jog.death_period;
    }
    var phase = jog.death_timer * jog.one_over_death_period;
    if (phase > 0.5) {
      phase = 0.5;
    }
    jog.right_hip.rotation.x = LoopInterpolate(jog.hip_right_death, phase);
    jog.right_knee.rotation.x = LoopInterpolate(jog.knee_right_death, phase);
    jog.right_elbow.rotation.x = LoopInterpolate(jog.elbow_right_death, phase);
    jog.right_shoulder.rotation.x = LoopInterpolate(jog.shoulder_right_death, phase);
    jog.left_hip.rotation.x = LoopInterpolate(jog.hip_left_death, phase);
    jog.left_knee.rotation.x = LoopInterpolate(jog.knee_left_death, phase);
    jog.left_elbow.rotation.x = LoopInterpolate(jog.elbow_left_death, phase);
    jog.left_shoulder.rotation.x = LoopInterpolate(jog.shoulder_left_death, phase);
    jog.torso.rotation.x = LoopInterpolate(jog.torso_death, phase);
}

var AnimateJoggers = function(jogs, clock_delta) {
  for (var i = 0; i < jogs.length; i++) {
    jogs[i].run_timer += clock_delta;
    if (jogs[i].run_timer > jogs[i].run_period) {
      jogs[i].run_timer -= jogs[i].run_period;
    };
    var phase = jogs[i].run_timer * jogs[i].one_over_period;
    jogs[i].right_hip.rotation.x = LoopInterpolate(hip_animation, phase);
    jogs[i].right_knee.rotation.x = LoopInterpolate(knee_animation, phase);
    jogs[i].right_ankle.rotation.x = LoopInterpolate(ankle_animation, phase);
    jogs[i].right_shoulder.rotation.x = LoopInterpolate(shoulder_animation, phase + 0.5);
    jogs[i].left_hip.rotation.x = LoopInterpolate(hip_animation, phase + 0.5);
    jogs[i].left_knee.rotation.x = LoopInterpolate(knee_animation, phase + 0.5);
    jogs[i].left_ankle.rotation.x = LoopInterpolate(ankle_animation, phase + 0.5);
    jogs[i].body.rotation.y = LoopInterpolate(torso_animation, phase + 0.0);
    jogs[i].left_shoulder.rotation.x = LoopInterpolate(shoulder_animation, phase + 0.0);
  };
};

var HitEffectsJogger = function(jog, clock_delta) {
  jog.invincible_timer -= clock_delta;
  jog.hit_texture_timer -= clock_delta;
  jog.bullet_time_timer -= clock_delta;
  var effects_off = 3;
  if (jog.invincible_timer < 0) {
    effects_off--;
  }
  if (jog.bullet_time_timer < 0) {
    game.game_over_velocity =  game.game_over_velocity * 0.1 + .9;
    effects_off--;
  } else {
    game.game_over_velocity =  game.game_over_velocity * 0.9 + 0.1 * 0.5;
  }
  if (jog.hit_texture_timer < 0) {
    ApplyAltTexture(jog, false);
    effects_off--;
  } else {
    var parity = Math.floor(jog.hit_texture_timer * 10.0) % 2;
    if (parity == 1) {
      ApplyAltTexture(jog, false);
    } else {
      ApplyAltTexture(jog, true);
    }
  }
  if (effects_off == 0) {
    game.game_over_velocity = 1.0;
    jog.do_hit_effects = false;
  }
}

var ApplyAltTexture = function(jog, altmode) {
  if (altmode) {
	  jog.body_mat.map = jogger_altbody_tex;
	  jog.right_thigh_mat.map = jogger_altleg_tex;
	  jog.right_shin_mat.map = jogger_altleg_tex;
	  jog.left_thigh_mat.map = jogger_altleg_tex;
	  jog.right_bicep_mat.map = jogger_altleg_tex;
	  jog.right_forearm_mat.map = jogger_altleg_tex;
	  jog.left_bicep_mat.map = jogger_altleg_tex;
	  jog.left_forearm_mat.map = jogger_altleg_tex;
	  jog.neck_mat.map = jogger_altleg_tex;
	  jog.head_mat.map = jogger_altleg_tex;
  } else {
    jog.body_mat.map = jogger_body_tex;
    jog.right_thigh_mat.map = jogger_leg_tex;
    jog.right_shin_mat.map = jogger_leg_tex;
    jog.left_thigh_mat.map = jogger_leg_tex;
    jog.right_bicep_mat.map = jogger_leg_tex;
    jog.right_forearm_mat.map = jogger_leg_tex;
    jog.left_bicep_mat.map = jogger_leg_tex;
    jog.left_forearm_mat.map = jogger_leg_tex;
    jog.neck_mat.map = jogger_leg_tex;
    jog.head_mat.map = jogger_leg_tex;
  }
}


var HitJogger = function(jog) {
  // When you hit a jogger, various effects take place.
  jog.do_hit_effects = true;
  jog.invincible_timer = 2;
  jog.hit_texture_timer = 2;
  jog.bullet_time_timer = 1;
}

var ResetJogger = function(jog) {
  // for posing, maybe a future feature.  mostly fixes elbows from death anim.
  AnimateJoggers([jog], 0);
  jog.right_elbow.rotation.x = Math.PI * 0.5;
  jog.left_elbow.rotation.x = Math.PI * 0.5;
  jog.right_shoulder.rotation.x = 3.14;
  jog.left_shoulder.rotation.x = 3.14;
  jog.right_ankle.rotation.x = 1.57;
  jog.left_ankle.rotation.x = 1.57;
  jog.right_hip.rotation.x = 0;
  jog.left_hip.rotation.x = 0;
  jog.right_knee.rotation.x = 0;
  jog.left_knee.rotation.x = 0;
  jog.torso.rotation.x = jog.default_torso_rotation_x;
  jog.do_hit_effects = false;
  jog.invincible_timer = 0;
  jog.hit_texture_timer = 0;
  jog.bullet_time_timer = 0;
}
