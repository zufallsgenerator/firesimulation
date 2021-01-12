/*jshint strict: true */
/*global CB _c document */
(function() {
  'use strict';
  function p(n) {
    return {
      key: `l${n}`,
      max: 100,
      min: 0
    };
  }

  function blendingfunc(t) {
    if (t > 0.8) {
      t = t * 1.05;
    } else if (t < 0.2 && t > 0.1) {
      t = t * 0.98;
    }
    return t;// (3 * t * t) - (2 * t * t * t);
  }

  /**
   * Fire simulation
   * Pretty CPU intense
   */
  CB.Class("Firems", {
      properties: [
        {
            key: "debug_dodraw",
            type: "boolean"
        },
        {
            key: "debug_runsimulation",
            type: "boolean"
        },
        "xvariation", "xinfluence", "yvariation", "yinfluence", "cellpersistency", "ascent", "normalizer",
        "colorfactor",
        {
          key: "minfuel",
          max: 500,
          min: 0
        }, {
          key: "maxfuel",
          max: 500,
          min: 0
        },
        "x", "y", "zindex", "width", "height", "blocksize",


        "c1", "c2", "c3", "c4", "c5", p(1), p(2), p(3), p(4), p(5)],

      label: "Fire",
      "debug_dodraw":true,
      "debug_runsimulation":true,
      "xvariation":50,
      "xinfluence":51,
      "yvariation":53,
      "yinfluence":100,
      "cellpersistency":85,
      "ascent":91,
      "normalizer":270,
      "colorfactor":175,
      "minfuel":0,
      "maxfuel":238,
      "x":0,
      "y":0,
      "zindex":1,
      "width":64,
      "height":64,
      "blocksize":4,
      "c1":"#ffffff",
      "c2":"#E9F23F",
      "c3":"#D6661C",
      "c4":"#440000",
      "c5":"#111111",
      "l1":84,
      "l2":64,
      "l3":35,
      "l4":17,
      "l5":14,

      initialize: function() {
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.height = this.height;
        tmpCanvas.width = this.width;
        this.tmpCtx = tmpCanvas.getContext("2d");
        this.initValues();

      },

      initValues: function() {
        this.grid = [];
        this.flipGrid = [];
        this.savedGrids = [];
      },

      report: function() {
          const ret = _c.fmt("Fire {}, {}", Math.round(this.maxIntensity * 100), Math.round(this.minIntensity * 100));
          this.maxIntensity = undefined;
          this.minIntensity = undefined;
          return ret;
      },

      paint: function(ctx) {
        let x;
        let y;
        let line;
        let point;
        let color;
        let b=this.blocksize;
        let g = this.grid;
        let imageData;
        if (this.savedGrids.length >= this.saveLen) {
          this.idx = ((this.idx || 0) + 1) % this.savedGrids.length;
          g = this.savedGrids[this.idx];
        }

        if (this.debug_dodraw) {
          imageData = this.tmpCtx.createImageData(this.width, this.height);//ctx.getImageData(this.x, this.y, this.width, this.height);
          const d = imageData.data;
          for (y=0;y<g.length; y++) {
            line = g[y];
            for(x=0;x<line.length;x++) {
              point = line[x];
              color = this.getColorArray(point);
              var idx = ((this.height - y) * this.width * 4) + (x * 4);
              if (!color) {
                color = [0, 0, 0, 0];
              }
              d[idx + 0] = color[0];
              d[idx + 1] = color[1];
              d[idx + 2] = color[2];
              d[idx + 3] = color[3];
            }
          }
          this.tmpCtx.putImageData(imageData, 0, 0);
          ctx.drawImage(this.tmpCtx.canvas, this.x, this.y, this.width * b, this.height * b);
        }
      },

      oldGetColorArray: function(intensity) {
        let str = this.getColor(intensity);
        let r;
        let g;
        let b;
        if (!str) {
          return null;
        }

        r = parseInt(str.substr(1, 2), 16);
        g = parseInt(str.substr(3, 2), 16);
        b = parseInt(str.substr(5, 2), 16);

        let avg = (r + g + b) / 3;
        if (avg > 50) {
          avg =  255;
        }  else {
          avg = Math.min(255, 3 * avg);
        }

        return [r, g, b, Math.round(avg)];
      },

      getColorArray: function(intensity) {
        let n = Math.min(Math.round(intensity * this.colorfactor), 255);
        if (this.maxIntensity === undefined) {
          this.maxIntensity = intensity;
          this.minIntensity = intensity;
        } else {
          this.maxIntensity = Math.max(this.maxIntensity, intensity);
          this.minIntensity = Math.min(this.minIntensity, intensity);
        }




        if (!this.colorArray) {
          this.colorArray = [];
          for(n=0;n<256;n++) {
            this.colorArray.push(this._makeColor(n));
          }
        }
        return this.colorArray[n];
      },

      _makeColor: function(n) {
        return [255, Math.min(n * 1.2, 255), Math.min(255, Math.max(n - 175, 1) * 4), n];
      },

     getColorOld: function(intensity) {
       const n = intensity * 100;

       if (this.maxIntensity === undefined) {
         this.maxIntensity = intensity;
         this.minIntensity = intensity;
       } else {
         this.maxIntensity = Math.max(this.maxIntensity, intensity);
         this.minIntensity = Math.min(this.minIntensity, intensity);

       }

       if (n > this.l1) {
         return this.c1;
       }
       if (n > this.l2) {
         return this.c2;
       }
       if (n > this.l3) {
         return this.c3;
       }
       if (n > this.l4) {
         return this.c4;
       }
       if (n > this.l5) {
         return this.c5;
       }

       return null;
     },

      tick: function(ctx, diff) {
        var x;
        var y;
        var target;
        var lower;
        var middle;
        var upper;
        var normalizer = this.normalizer / 200;
        var minfuel = this.minfuel / 100;
        var maxfuel = this.maxfuel / 100;
        var TICK_MS = 20;
        var xvariation = this.xvariation / 100;
        var yvariation = this.yvariation / 100;
        var cellpersistency = this.cellpersistency / 100;
        var ascent = this.ascent / 100;
        var xinfluence = this.xinfluence / 100;
        var yinfluence = this.yinfluence / 100;

        if (this.savedGrids.length >= this.saveLen) {
          return;
        }

        if (this.grid.length < this.height) {
          this.grid = this.createGrid(this.height);
          this.flipGrid = this.createGrid(this.height);
        }

        if (!this.debug_runsimulation) {
            return;
        }

        this.ms = (this.ms || 0) + diff;

        function processLine(target, lower, middle, upper) {
          var length = target.length;
          var sum;
          var ybias;
          var centerbias;
          var leftbias;
          var middlebias;
          var rightbias;
          var xbias;
          var topbias;
          var bottombias;
          for(x=0;x<length;x++) {
            sum = 0;

            ybias = ascent + (yvariation * (Math.random() - (1-ascent)));
            topbias =  (ybias) * yinfluence;
            bottombias = (1 - topbias) * yinfluence;
            middlebias = 0.5;
            xbias = 0.5 + (xvariation * (Math.random() - 0.5));
            leftbias = xbias * xinfluence;
            rightbias = (1 - xbias) * xinfluence;
            centerbias = 0.5;

            if (lower) {
              sum += ((leftbias * (lower[x-1] || 0)) + ((lower[x] || 0) * centerbias) +  (rightbias * (lower[(x+1)] || 0))) * topbias;
            }
            sum += ((leftbias * (middle[x-1] || 0)) + (rightbias * (middle[(x+1)] || 0))) * middlebias;
            if (upper) {
              sum += ((leftbias * (upper[x+1] || 0)) + ((upper[x] || 0) * centerbias) +  (rightbias * (upper[(x-1)] || 0))) * bottombias;
            }
            sum += middle[x] * cellpersistency;
            target[x] = blendingfunc((1/3) * normalizer * sum);
          }
        }




        while (this.ms > TICK_MS) {
          var newLine = [];
          var newVal;
          var length = this.grid[0].length;
          var margin = Math.round(this.grid[0].length * 0.1);
          var fuel = maxfuel - minfuel;
          for(x=0;x<length;x++) {
            if (Math.random() > 0.9 || x === 0) {
              newVal = minfuel + (Math.random() * fuel);
            }
            if (x > margin && x < (length-margin) && newVal > 0.9) {
              newLine.push(newVal);
            } else {
              newLine.push(0);
            }
          }
          for (y=0;y<this.grid.length;y++) {
            target = this.flipGrid[y];
            lower = this.grid[y-1];
            middle = this.grid[y];
            upper = this.grid[y + 1];
            processLine(target, lower || newLine, middle, upper);
          }
          this.ms = this.ms - TICK_MS;
        }
        const tmp = this.grid;
        this.gird = this.flipGrid;
        this.flipGrid = tmp;
      },

      createGrid: function(height) {
        let grid = [];
        let i;

        function makeLine(length) {
          let line = [];
          let j;
          for(j=0;j<length;j++) {
            line.push(0);
          }
          return line;
        }
        for(i=0;i<height;i++) {
          grid.push(makeLine(this.width));
        }
        return grid;
      },

      onPropertyUpdate: function(name, value) {
        this[name] = value;
        if (name === "height" || name === "width") {
          this.grid = [];
          this.tmpCtx.canvas.width = this.width;
          this.tmpCtx.canvas.height = this.height;
        }
      }


  });
})();
