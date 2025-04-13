// (C) 2014 Sean Brennan
var GameState = GameState || {};

// browserify support
if ( typeof module === 'object' ) {

  module.exports = GameState;

}

GameState.boxdim = 5.0;
GameState.boxsep = 0.1;
GameState.box_x = 0.0;
GameState.box_y = 11.0;
GameState.box_z = 20.0;

GameState.health_x = 0.0;
GameState.health_x_offset = 1.7;
GameState.health_y = 19.0;
GameState.health_z = 20.0;

GameState.GenHealth = function(gameobj) {

  gameobj.health_group.position.set(GameState.health_x, GameState.health_y, GameState.health_z);

  for (var i = 0; i < gameobj.num_health; i++) {
    var heart_mat = new THREE.MeshBasicMaterial({color: 0xff4444});
    // var heart_geom = new THREE.CircleGeometry(1.0, 7);
    var heart_geom = new THREE.BoxGeometry(.4, 1.0, .2);
    var heart_mesh = new THREE.Mesh(heart_geom, heart_mat)
    heart_mesh.position.set(GameState.health_x_offset * i, 0, 0);
    gameobj.health_group.add(heart_mesh);
    gameobj.health_meshes.push(heart_mesh);
  }
}

GameState.MakeCube = function(gameobj, place) {
  var number_tex = THREE.ImageUtils.loadTexture("numbers.png");
  number_tex.wrapS = THREE.RepeatWrapping;
  number_tex.wrapT = THREE.RepeatWrapping;
  number_tex.repeat.set(1,0.1);
  var cube_mat = new THREE.MeshBasicMaterial({map: number_tex});
  var cube_geometry = new THREE.BoxGeometry(GameState.boxdim,
                                                GameState.boxdim,
                                                0.1);
  //var cube_mat = new THREE.MeshNormalMaterial();
  var cube = new THREE.Mesh(cube_geometry, cube_mat);
  cube.position.set(GameState.box_x + (GameState.boxdim + GameState.boxsep) * place,
                   GameState.box_y, GameState.box_z);
  cube.visible = true;
  gameobj.score_cubes.add(cube);
  gameobj.scoreboard_textures.push(number_tex);
}

GameState.GenScoreCubes = function(gameobj) {
  gameobj.score_cubes.position.set(GameState.box_x, GameState.box_y, GameState.box_z);
  for (var i = 0; i < gameobj.num_score_cubes; i++) {
    GameState.MakeCube(gameobj, i);
  }
}

GameState.UpdateCube = function (place, dig, gameobj) {
  // var matnode = gameobj.score_cubes.children[place].material
  //matnode.offset.y = 1.0 - dig * 0.1;
  // gameobj.scoreboard_textures[place].needsUpdate = true;
  gameobj.scoreboard_textures[place].offset.y = 0.9 - 0.1 * dig;
  
};

GameState.DisplayScore = function (gameobj) {
  //num_digits = 5
  if (gameobj.score > 100000) {
    //GameState.GenScoreCubes(gameobj);
    gameobj.score = 1;
    //GameState.Foo();
  }
  var floor_score = Math.floor(gameobj.score);
  //var floor_score = Math.floor(runners.length);
  var text_score = floor_score.toString();
  var num_digits = text_score.length;
  for (var i = 0; i < num_digits; i++) {
    var diggie = text_score.charAt(num_digits - i - 1)
    GameState.UpdateCube(i, parseInt(diggie), gameobj);
    gameobj.score_cubes.children[i].visible = true;
  }
  // Move like camera, 10% to destination per frame.
  score_label_marquee.mobj.x = (score_label_marquee.mobj.x * 0.9) + ((num_digits + 0.5) * (GameState.boxdim + GameState.boxsep) + GameState.box_x) * 0.1;
  for (var i = num_digits; i < gameobj.num_score_cubes ; i++) {
    if (gameobj.state == 'PLAYING') {
      gameobj.score_cubes.children[i].visible = false;
    } else {
      //gameobj.score_cubes.children[i].visible = true;
      gameobj.score_cubes.children[i].visible = false;
    }
  }
}

GameState.DisplayHealth = function(gameobj) {
  for (var i = 0; i < gameobj.player_hits; i++) {
    gameobj.health_meshes[i].visible = true;
  }
  for (var i = gameobj.player_hits; i < gameobj.num_health ; i++) {
    gameobj.health_meshes[i].visible = false;
  }
}

GameState.Init = function(gameobj) {
  gameobj.state = 'INIT';
  gameobj.zombie_timeout = 100;

  gameobj.num_score_cubes = 9;
  gameobj.scoreboard_textures = [];
  gameobj.score_cubes = new THREE.Object3D();
  gameobj.next_health_score = 500;

  gameobj.num_health = 6;
  gameobj.health_meshes = [];
  gameobj.health_group = new THREE.Object3D();

  gameobj.idea_cubes_meshes = [];
  gameobj.idea_cubes = new THREE.Object3D();
  // score display boxes:
  GameState.GenScoreCubes(gameobj);
  GameState.GenIdeaCubes(gameobj);
  GameState.GenHealth(gameobj);

  GameState.Default(gameobj);
}

GameState.GenIdeaCubes = function(gameobj) {
  var cube_geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
  var cube_mat = new THREE.MeshNormalMaterial();
  for (var i  = 0; i < 4; i++) {
    var cube = new THREE.Mesh(cube_geometry, cube_mat);
    cube.position.set(GameState.box_x + 3.0 * i + 16,  GameState.box_y + 2, GameState.box_z - 13);
    cube.visible = true;
    gameobj.idea_cubes_meshes.push(cube);
    gameobj.idea_cubes.add(cube);
  }
}

GameState.Default = function(gameobj) {
  gameobj.score = 0;
  gameobj.next_health_score = 500;
  gameobj.player_hits = 3;
  gameobj.game_over_timer = 0.0;
  gameobj.game_over_anykey_period = 3.0;
  gameobj.game_over_period = 10.0;
  gameobj.camera_angle = 0.0;
  gameobj.game_over_velocity = 1.0;
  gameobj.game_over_anim = new LinearLoop([gameobj.game_over_velocity,
                                           0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
}


GameState.Update = function(gameobj, clock_delta) {
  GameState.DisplayScore(gameobj);
  GameState.DisplayHealth(gameobj);
  //gameobj.score_cubes.rotation.y += 0.01;
  if (gameobj.state == 'IDLE') {
    GameState.SpinCamera(gameobj, clock_delta);
    if (anykey_detected) {
      GameState.Default(gameobj);
      gameobj.state = 'PLAYING';
      welcome_marquee.mobj.group.visible = false;
      press_any_key_marquee.mobj.group.visible = false;
      here_they_come_marquee.mobj.group.visible = true;
      here_they_come_marquee.do_animate = true;
      here_they_come_marquee.timer = 0;
      jogger.group.visible = true;
      //gameobj.idea_cubes_meshes[0].visible = true;
      //gameobj.idea_cubes_meshes[1].visible = true;
    }
  } else if (gameobj.state == 'PLAYING') {
    gameobj.score += clock_delta * 10.0;
    if (collision_detected && jogger.invincible_timer <= 0) {
      gameobj.player_hits -= 1;
      if (gameobj.player_hits == 0) {
        // Set up stuff.
        InitDeathAnims(jogger);
        gameobj.state = 'GAME OVER';
        //gameobj.idea_cubes_meshes[0].visible = false;
        //gameobj.idea_cubes_meshes[1].visible = false;
        game_over_marquee.mobj.group.visible = true;
        game_over_marquee.do_animate = true;
        game_over_marquee.timer = 0;
        press_any_key_marquee.mobj.group.visible = true;
      } else {
        HitJogger(jogger);
      }
    }
    // TODO(collision detect heath powerup / shield powerup here.
    if (health_collision_detected) {
      if (gameobj.player_hits < 6) {
        gameobj.player_hits++;
      }
    }
    // Score update: progressive? 
    gameobj.score += clock_delta;
  } else if (gameobj.state == 'GAME OVER') {
    gameobj.game_over_timer += clock_delta;
    //gameobj.idea_cubes_meshes[0].visible = true;
    //gameobj.idea_cubes_meshes[1].visible = false;
    if (gameobj.game_over_timer > gameobj.game_over_period) {
      gameobj.state = 'INIT';
      //GameState.Default(gameobj);
    }
    if (gameobj.game_over_timer > gameobj.game_over_anykey_period) {
      if (anykey_detected) {
        gameobj.state = 'INIT';
      }
    }
    var phase = (gameobj.game_over_timer / gameobj.game_over_period) * 0.5;
    //phase = 0.9;
    gameobj.game_over_velocity = LoopInterpolate(gameobj.game_over_anim, phase);
  } else if (gameobj.state == 'INIT') {
      welcome_marquee.mobj.group.visible = true;
      game_over_marquee.mobj.group.visible = false;
      gameobj.state = 'IDLE';
      jogger.group.visible = false;
      // INIT is run just once.
  }
}
  

GameState.SpinCamera = function(gameobj, clock_delta) {
  return true;
}
