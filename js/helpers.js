/*
   Copyright 2013-2021 Christer Byström

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
/*jshint strict: true */
/*global CB */
(function () {
  "use strict";
  const ARC_CIRCLE = 2 * Math.PI;
  CB.Class("Helpers", {}).addStatic({
    circle: function (ctx, x, y, radius) {
      ctx.arc(x, y, radius, 0, ARC_CIRCLE, false);
    },
    dot: function (ctx, x, y) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2, y);
    },
    purgeDeleted: function (objects) {
      let i;
      let filtered = [];
      let deleted = false;
      for (i = 0; i < objects.length; i++) {
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
    getPythDist: function (x1, y1, x2, y2) {
      // Pythagora's comparison
      // a^2 + b^2 = c^2
      // If c1 is bigger than c2, then c1 square is also bigger than c2 square
      // c1^2 > c2^2 -> c1 > c2
      let x;

      let y;
      x = Math.abs(x1 - x2);
      y = Math.abs(y1 - y2);

      return Math.sqrt(x * x + y * y);
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
    getXforPythDist: function (d, y) {
      const factor = d * d - y * y;
      return Math.sqrt(factor);
    },
  });
})();
