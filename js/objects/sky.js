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
/*global CB _c document */
(function () {
  "use strict";
  function createNight() {
    return "rgba(0, 0, 0, 0.4)";
  }
  function createFill(ctx, light) {
    let l = light * 1.5 - 50;
    let height = ctx.canvas.clientHeight;
    let grd;
    let start;
    let end;
    if (light === 0) {
      return createNight(ctx);
    }
    grd = ctx.createLinearGradient(0, 0, 0, height);
    function rgb(r, g, b) {
      const f = 2.55;
      function c(x) {
        if (x < 0) {
          return 0;
        }
        if (x > 255) {
          return 255;
        }
        return x;
      }
      r = c(Math.round(r * f));
      g = c(Math.round(g * f));
      b = c(Math.round(b * f));
      return _c.fmt("rgb({}, {}, {})", r, g, b);
    }

    if (l > 74) {
      // Day
      start = rgb(50, 50, 100);
      end = rgb(l, l, 100);
    } else if (l > 50) {
      const f = 86 - l / 2;
      start = rgb(f, f, 100);
      end = rgb(115 - l / 2, l, l + 25);
      // Sunset
    } else if (l > 25) {
      start = rgb(11 + l, 11 + l, 49 + l);
      end = rgb(115 - l / 2, l, l + 25);
      // Sunset
    } else if (l > -25) {
      start = rgb(11 + l, 11 + l, 49 + l);
      end = rgb(115 - l / 2, l, l + 25);
    } else {
      start = rgb(11 + l, 11 + l, 49 + l);
      end = rgb(200 + l * 4, l, l + 25);
    }

    grd.addColorStop(0, start);
    grd.addColorStop(1, end);
    return grd;
  }

  CB.Class("Sky", {
    label: "Sky",
    light: 100,
    properties: [
      {
        key: "light",
        max: 100,
        min: 0,
      },
    ],

    roles: {
      sky: true,
    },

    initialize: function () {
      this._fill = null;
    },

    getFill: function (ctx) {
      if (!this._fill) {
        this._fill = createFill(ctx, this.light);
      }

      return this._fill;
    },

    onPropertyUpdate: function (name, value) {
      this._fill = null;
      this[name] = value;
    },
  });
})();
