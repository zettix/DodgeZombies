// (C) 2014 Sean Brennan
// Use detector.
if (! Detector.wegbl) {
  Detector.addGetWebGLMessage();
  document.getElementById('container').innerHTML = "";
}

var worldWidth = 30, worldDepth = 100;

// Global 3D threejs routines.
var container;
var camera, controls, scene, renderer;

// Game Variables:
var runners, jogger;
var controls = {};
var plussers;

// Geometry Variables:
var ground_offset = 0.0;
var wall_offset = 0.0;
var ground_velocity = 1.72 * 500. / worldDepth;
var wall_velocity = 1.72 * 500. / worldDepth;
var ground_texture;
var wall_texture;
var marquees;
// handy vectors:
var v_origin, v_front;


// Stuff:
var dir_left = false;
var dir_right = false;
var mouse_dir_left = 0;
var mouse_dir_right = 0;
var player_x;
var player_y;
var player_z;
var player_velocity;
var player_turn_speed;
var x_min, x_max;
var game_state = 0;
var game_timeout = 4.0;
var collision_detected = false;
var health_collision_detected = false;
var game = {};
var anykey_detected = false;

// Marquees
var game_over_marquee;
var here_they_come_marquee;
var press_any_key_marquee;
var welcome_marquee;
var score_label_marquee;

// var mesh, texture;
var clock = new THREE.Clock();
game_init();
init();
animate();

function game_init() {
  // game = GameState;
  GameState.Init(game);
  GameState.Default(game);
}


function init() {
  v_origin = new THREE.Vector3(0.0, 0.0, 0.0);
  v_front = new THREE.Vector3(worldWidth / 2, 0.0, worldDepth);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 
      1, 20000);
  container = document.getElementById('container');
  controls.speed = 5;
  // DATA
  // x, y, x seg, y seg

  // PLAYER
  player_x = 25.0;
  player_y = 10.0;
  player_z = 4.0;
  // player_velocity = 3.64;
  // player_turn_speed = 2.80;
  player_velocity = 8.64;
  player_turn_speed = 6.80;
  collision_detected = false;
  health_collision_detected = false;

  x_min = 1.5;
  x_max = worldWidth - 1.5;

  camera.position.x = player_x;
  camera.position.y =  player_y + 1.3;
  camera.position.z = player_z - 4.0;

  var redlight = new THREE.PointLight(0xffeeee, 1, 100);
  redlight.position.set(50, 20, 50);
  // scene.add(redlight);
  var bluelight = new THREE.PointLight(0xeeeeff, 1, 100);
  bluelight.position.set(20, 20, 50);
  // scene.add(bluelight);
  var greenlight = new THREE.PointLight(0xeeffee, 1, 100);
  greenlight.position.set(25, 20, 0);
  scene.add(greenlight);
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.innerHTML = "";
  camera.lookAt(v_front);

  var fog = new THREE.FogExp2(0x000000, 0.020);
  //var fog = new THREE.FogExp2(0x715330, 0.00085);
  scene.fog = fog;

  // foo_geometry = new THREE.FooGeometry(...), has .vertices[].x/y/z
  // foo_geometry.applyMaqtrix(new THREE.Matrix4().makeRotationX(-Math.PI/2))
  // foo_gementry.verticesNeedUpdate = true;
  // foo_texture = new THREE.Texture(world coords...
  //               new THREE.UVMapping(),
  //               THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
  // foo_texture.needsUpdate = true;
  // foo_mesh  = new THREE.Mesh(foo_geometry, new THREE.MeshBasicMaterial(
  //                                              {map: foo_texture}
  // scene.add(mesh)

  // Ground
  var ground_geo = new THREE.PlaneGeometry(worldWidth, worldDepth, 10, 10);
  ground_geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  //ground_texture = THREE.ImageUtils.loadTexture("dirtydirt1k.jpg");
  ground_texture = THREE.ImageUtils.loadTexture("street2.jpg");
  wall_texture = THREE.ImageUtils.loadTexture("concrete-seamless.jpg");
  // ground_texture.anisotropy = renderer.getMaxAnisotropy();
  ground_texture.wrapS = THREE.RepeatWrapping;
  ground_texture.wrapT = THREE.RepeatWrapping;
  ground_texture.repeat.set(4, 8);
  wall_texture.wrapS = THREE.RepeatWrapping;
  wall_texture.wrapT = THREE.RepeatWrapping;
  wall_texture.repeat.set(8, 1);
  //var ground_mat = new THREE.MeshBasicMaterial({map: ground_texture});
  var ground_mat = new THREE.MeshLambertMaterial({map: ground_texture});
  var ground_mesh = new THREE.Mesh(ground_geo, ground_mat);
  ground_mesh.rotation.y += Math.PI;
  ground_mesh.position.set(worldWidth / 2, 9, worldDepth / 2);
  scene.add(ground_mesh);
  // Walls
  var wall_geo = new THREE.BoxGeometry(4, 4, worldDepth, 1, 1, 100);
  var wall_mat = new THREE.MeshLambertMaterial({map:wall_texture});
  var left_wall = new THREE.Mesh(wall_geo, wall_mat);
  var right_wall = new THREE.Mesh(wall_geo, wall_mat);
  left_wall.position.x -= 1;
  left_wall.rotation.z = Math.PI;
  right_wall.position.x += worldWidth + 1;
  left_wall.position.y += 10;
  right_wall.position.y += 10;
  left_wall.position.z = worldDepth * 0.5;
  right_wall.position.z = worldDepth * 0.5;
  scene.add(left_wall);
  scene.add(right_wall);

  // Skybox
  var sky_tex = new THREE.ImageUtils.loadTexture("skybox.jpg");
  var sky_mat = new THREE.MeshBasicMaterial({map: sky_tex});
  var sky_geo = new THREE.PlaneGeometry(1800, 1200);
  sky_mat.side = THREE.BackSide;
  var sky_mesh = new THREE.Mesh(sky_geo, sky_mat);
  sky_mesh.position.z = 200;
  scene.add(sky_mesh);
  
  // Marquees
  game_over_marquee = new GameOverMarquee();
  scene.add(game_over_marquee.mobj.group);

  here_they_come_marquee = new HereTheyComeMarquee();
  scene.add(here_they_come_marquee.mobj.group);

  press_any_key_marquee = new PressAnyKeyMarquee();
  scene.add(press_any_key_marquee.mobj.group);

  welcome_marquee = new WelcomeMarquee();
  scene.add(welcome_marquee.mobj.group);

  score_label_marquee = new ScoreLabelMarquee();
  scene.add(score_label_marquee.mobj.group);

  marquees = [game_over_marquee, score_label_marquee, welcome_marquee,
              here_they_come_marquee, press_any_key_marquee];
  
 
  // Generate some meshes here:
  runners = MakeRunners(30);
  plussers = [];
  // joggers = MakeJoggers(10);
  add_array_to_scene(scene, runners);
  add_array_to_scene(scene, plussers);
  jogger = new Jogger(player_x, player_y, player_z);
  //add_array_to_scene(scene, joggers);
  scene.add(jogger.group);
  scene.add(game.score_cubes);
  //scene.add(game.idea_cubes);
  scene.add(game.health_group);
 
   //     var blueBox = new THREE.BoxGeometry(3.0, 2.0, 4.0);
   //     var bluematerial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
   //     var cube = new THREE.Mesh( blueBox, bluematerial );
   //     cube.position.set(0, 0, 0);
   //     scene.add( cube );
  container.appendChild(renderer.domElement);
  // stats = new Stats();
  // stats.domElemt.style.positon = 'absolute';
  // stats.domElemet.style.top = '0px';
  // container.appendChild(stats.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function reset() {
  // reset stuff from init()
  for (var idx = 0; idx < runners.length; idx++) {
    scene.remove(runners[idx].group)
  }
  for (var idx = 0; idx < plussers.length; idx++) {
    scene.remove(plussers[idx].group)
  }
  runners = MakeRunners(30);
  add_array_to_scene(scene, runners);
  plussers = [];

  // PLAYER
  player_x = 25.0;
  player_y = 10.0;
  player_z = 4.0;
  jogger.group.position.set(player_x, player_y, player_z);

  // CAMERA
  camera.position.x = player_x;
  camera.position.y =  player_y + 1.9;
  camera.position.z = player_z - 4.0;
  here_they_come_marquee.mobj.group.visible = false;

  // Reset Marquee timers here:
  // TODO(sean): marquees: here they come, game over, press any key, score.

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // controls.handleResize();
}

function add_array_to_scene(s, arr) {
  for (var idx = 0; idx < arr.length; idx++) {
    s.add(arr[idx].group);
  }
}

function collision_check() {
  collision_detected = false;
  health_collision_detected = false;
  var x_p = jogger.group.position.x;
  var z_p = jogger.group.position.z;
  var r_p = jogger.hit_rad;

  for (var idx = 0; idx < runners.length; idx++) {
    var runner = runners[idx];
    var radx = x_p - runner.group.position.x;
    radx *= radx;
    var radz = z_p - runner.group.position.z;
    radz *= radz;
    var p_p = r_p + runner.hit_rad;
    p_p *= p_p;
    if (radx + radz < p_p) {
      ResetRunner(runners, idx);
      collision_detected = true;
      break;
    }
  }
  for (var idx = 0; idx < plussers.length; idx++) {
    var plusser = plussers[idx];
    var radx = x_p - plusser.group.position.x;
    radx *= radx;
    var radz = z_p - plusser.group.position.z;
    radz *= radz;
    var p_p = r_p + plusser.hit_rad;
    p_p *= p_p;
    if (radx + radz < p_p) {
      DelPlusUp(plussers, idx, scene);
      health_collision_detected = true;
      break;
    }
  }
}    
    

function controls_update(clock_delta) {
  var body_rotation = jogger.group.rotation.y;
  var mf = 0.5;
  if (dir_left == true || mouse_dir_left > 0) {
    player_x += player_velocity * clock_delta;
    body_rotation += player_turn_speed * clock_delta;
    if (body_rotation > Math.PI + 0.5) {
      body_rotation = Math.PI + 0.5;
    }
    mouse_dir_left--;
  } else if (dir_right == true || mouse_dir_right > 0) {
    player_x -= player_velocity * clock_delta;
    body_rotation -= player_turn_speed * clock_delta;
    if (body_rotation < Math.PI - 0.5) {
      body_rotation = Math.PI - 0.5;
    }
    mouse_dir_right--;
  } else {
    if (body_rotation > Math.PI + player_turn_speed * clock_delta * mf) {
      body_rotation -= player_turn_speed * clock_delta * mf;
    } else if (body_rotation < Math.PI - player_turn_speed * clock_delta * mf) {
      body_rotation += player_turn_speed * clock_delta * mf;
    }
  }
  if (player_x > x_max) {
    player_x = x_max;
  } else if (player_x < x_min) {
    player_x = x_min;
  }
  jogger.group.rotation.y = body_rotation;
};

var whatever_timeout = 30.0;

function UpdateRunners(clock_delta) {
  whatever_timeout -=  clock_delta;
  if (whatever_timeout < 0) {
    whatever_timeout = (600 - game.score) * 0.1;
    if (whatever_timeout < 4.0) {
      whatever_timeout = 4.0;
    }
    if (runners.length < 200) {
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
      AddRunner(runners, scene);
    }
  }
}

function UpdatePlussers(clock_delta) {
  AnimatePlusUps(plussers, clock_delta);

  if (game.score > game.next_health_score) {
    AddPlusUp(plussers, scene);
    game.next_health_score += 300;
  }
}


function Update(clock_delta) {

  if (game.state == "PLAYING") {
    AnimateRunners(runners, clock_delta);
    AnimateJoggers([jogger], clock_delta);
    controls_update(clock_delta);

    jogger.group.position.set(player_x, player_y, player_z);
    camera.position.x = (player_x * 0.5) + camera.position.x * 0.5;
    camera.position.y =  (player_y + 2.6) * 0.1 + camera.position.y * 0.9;
    camera.position.z = (player_z - 4.4) * 0.1 + camera.position.z * 0.9;
    collision_check();
    UpdateRunners(clock_delta);
    UpdatePlussers(clock_delta); 
  } else if (game.state == "IDLE") {
    // init();
  } else if (game.state == "GAME OVER") {
    // don't move anything...
    AnimateDeadJogger(jogger, clock_delta);
    AnimateRunners(runners, clock_delta);
  } else if (game.state == "INIT") {
    // TODO(): figure out init();
    ResetJogger(jogger);
    reset();
  }
  GameState.Update(game, clock_delta);
  if (jogger.do_hit_effects) {
    HitEffectsJogger(jogger, clock_delta);
  }
  AnimMarquees(marquees, clock_delta);

  // final update: disable per-frame events:
  anykey_detected = false;
}

function animate()  {
  var clock_delta = clock.getDelta();
  requestAnimationFrame(animate);  // loop right here.
  render();
  // STATS.UPDATE();
  // other animation routines.
  ground_offset += clock_delta * ground_velocity * 0.1 * game.game_over_velocity;
  if (ground_offset > 1.0) {
    ground_offset -= 1.0;
  }
  ground_texture.offset.set(0.0, ground_offset);
  wall_offset += clock_delta * wall_velocity * 0.1 * game.game_over_velocity;
  if (wall_offset > 1.0) {
    wall_offset -= 1.0;
  }
  wall_texture.offset.set(wall_offset, 0.0);

  Update(clock_delta);


  // CAMERA
  camera.lookAt(v_front);

  // DEBUG INFO.
  if (game.state == "PLAYING") {
    game.idea_cubes_meshes[0].visible = true;
    game.idea_cubes_meshes[1].visible = false;
    game.idea_cubes_meshes[2].visible = false;
    game.idea_cubes_meshes[3].visible = false;
  } else if (game.state == "IDLE") {
    game.idea_cubes_meshes[0].visible = true;
    game.idea_cubes_meshes[1].visible = true;
    game.idea_cubes_meshes[2].visible = true;
    game.idea_cubes_meshes[3].visible = true;
  } else if (game.state == "GAME OVER") {
    game.idea_cubes_meshes[0].visible = true;
    game.idea_cubes_meshes[1].visible = true;
    game.idea_cubes_meshes[2].visible = true;
    game.idea_cubes_meshes[3].visible = false;
  } else {
    game.idea_cubes_meshes[0].visible = true;
    game.idea_cubes_meshes[1].visible = false;
    game.idea_cubes_meshes[2].visible = true;
    game.idea_cubes_meshes[3].visible = true;
  }
}

function kup(evt) {
  keycode = evt.keyCode;
  if (keycode == 37) {  // left arrow
     dir_left = false;
  } else if (keycode == 39) {  // right arrow
     dir_right = false;
  };
  anykey_detected = false;
};

function kdown(evt) {
  keycode = evt.keyCode;
  if (keycode == 37) {  // left arrow
     dir_left = true;
  } else if (keycode == 39) {  // right arrow
     dir_right = true;
  };
  if ((game_state == 2) || (game_state == 0)) {
    if (game_timeout < 1) {
      game_state = 1;
      init();
    };
  };
  anykey_detected = true;
};

function MouseUp(evt) {
  dir_left = false;
  anykey_detected = false;
  dir_right = false;
}

function MouseDown(evt) {
    var x = 0;
    var y = 0;
    if (evt.layerX || evt.layerX == 0) { // Firefox
      x = evt.layerX; y = evt.layerY;
    } else if (evt.offsetX || evt.offsetX == 0) { // Opera
      x = evt.offsetX; y = evt.offsetY;
    }
    if (x > window.innerWidth * 0.5) {
      dir_right = true;
    } else {
      dir_left = true;
    }
  anykey_detected = true;
};

function MouseClick(evt) {
    var x = 0;
    var y = 0;
    if (evt.layerX || evt.layerX == 0) { // Firefox
      x = evt.layerX; y = evt.layerY;
    } else if (evt.offsetX || evt.offsetX == 0) { // Opera
      x = evt.offsetX; y = evt.offsetY;
    }
    if (x > window.innerWidth * 0.5) {
      mouse_dir_right += 3;
    } else {
      mouse_dir_left += 3;
    }
  anykey_detected = true;
};

function render() {
  renderer.render(scene, camera);
}
