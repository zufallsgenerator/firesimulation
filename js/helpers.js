/*jshint strict: true */
/*global CB */
(function() {
  'use strict';
  const ARC_CIRCLE = 2 * Math.PI;
  CB.Class("Helpers", {}).addStatic({
    circle : function(ctx, x, y, radius) {
      ctx.arc(x, y, radius, 0, ARC_CIRCLE, false);
    },
    dot: function(ctx, x, y) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x+2, y);
   },
   purgeDeleted: function(objects) {
     let i, filtered = [], deleted = false;
     for(i=0;i<objects.length;i++) {
       if (objects[i].deleted) {
         deleted = true;
       } else {
         filtered.push(objects[i]);
       }
     }
     if (deleted) {
       return filtered;
     }
     return objects;
   },
   getPythDist: function(x1, y1, x2, y2) {
      // Pythagora's comparison
      // a^2 + b^2 = c^2
      // If c1 is bigger than c2, then c1 square is also bigger than c2 square
      // c1^2 > c2^2 -> c1 > c2
      let x, y;
      x = Math.abs(x1 - x2);
      y = Math.abs(y1 - y2);

      return Math.sqrt((x * x) + (y * y));
    },
    
    /**
     * Get for the pythagorean distance
     *       _________
     * d = \/ x2 + y2
     * 
     * @param {Number} d - pythagorean distance
     * @param {Number} y - y distance
     * @returns {Number} x
     */
    getXforPythDist: function(d, y) {
      const factor = (d * d) - (y * y);
      return Math.sqrt(factor);
    }
  });
})();
