// (C) 2014 Sean Brennan
// Linear interpolation for animation.

var LinearLoop = function(arr) {
  this.len = arr.length;
  this.segment = 1.0 / arr.length;
  this.knots = arr;
  return this;
};
  
var LoopInterpolate = function(curve, t) {
 while (t >= 1.0) {
   t -= 1.0;
 }
 var bucket = Math.floor(t * curve.len) | 0;
 var dt = (t - curve.segment * bucket) * curve.len;
 if (bucket  == curve.len - 1) {
   return curve.knots[0] * dt + curve.knots[bucket ] * (1.0 - dt);
 };
 return curve.knots[bucket] * (1.0 - dt) + curve.knots[bucket + 1] * dt;
};
