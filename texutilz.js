// (C) 2014 Sean Brennan
var TexBox = function(geometry) {
  // Basic: 2x3 image, 0-0.5,0-0.3 front, top, right, left, bottom, back.
  // 
  var tx_back   = [new THREE.Vector2(.5, 0),    new THREE.Vector2( 1, 0),    new THREE.Vector2( 1, .333), new THREE.Vector2(.5, .333)];
  var tx_front = [new THREE.Vector2( 0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1),    new THREE.Vector2(0, 1)];
  var tx_right =  [new THREE.Vector2( 0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
  var tx_left =  [new THREE.Vector2(.5, .333), new THREE.Vector2( 1, .333), new THREE.Vector2( 1, .666), new THREE.Vector2(.5, .666)];
  var tx_bot =   [new THREE.Vector2( 0, 0),    new THREE.Vector2(.5, 0),    new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
  var tx_top =  [new THREE.Vector2(.5, .666), new THREE.Vector2( 1, .666), new THREE.Vector2( 1, 1),    new THREE.Vector2(.5, 1)];


  geometry.faceVertexUvs[0][0] = [ tx_right[3], tx_right[0], tx_right[2] ]; 
  geometry.faceVertexUvs[0][1] = [ tx_right[0], tx_right[1], tx_right[2] ];
 
  geometry.faceVertexUvs[0][2] = [ tx_left[3], tx_left[0], tx_left[2] ];
  geometry.faceVertexUvs[0][3] = [ tx_left[0], tx_left[1], tx_left[2] ];
 
  geometry.faceVertexUvs[0][4] = [ tx_top[2], tx_top[1], tx_top[3] ];
  geometry.faceVertexUvs[0][5] = [ tx_top[1], tx_top[0], tx_top[3] ];
 
  geometry.faceVertexUvs[0][6] = [ tx_bot[0], tx_bot[1], tx_bot[3] ];
  geometry.faceVertexUvs[0][7] = [ tx_bot[1], tx_bot[2], tx_bot[3] ];
 
  // The back
  geometry.faceVertexUvs[0][8] = [ tx_back[3], tx_back[0], tx_back[2] ];
  geometry.faceVertexUvs[0][9] = [ tx_back[0], tx_back[1], tx_back[2] ];

  // This is the front 
  geometry.faceVertexUvs[0][10] = [ tx_front[3], tx_front[0], tx_front[2] ];  // upper tri.
  geometry.faceVertexUvs[0][11] = [ tx_front[0], tx_front[1], tx_front[2] ]; 
};
