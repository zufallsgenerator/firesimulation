/*jshint strict: true */
/*global CB _c document */
(function() {
  'use strict';
  function p(n) {
    return {
      key: "l" + n,
      max: 100,
      min: 0
    };
  }

  function c(n) {
    return {
      key: "c" + n,
      type: "color"
    };
  }

  /**
   * Fire simulation
   * Pretty CPU intense
   */
  CB.Class("Firems", {
    properties: [
      {
        key: "optimize_onlysquares",
        label: "Only squares",
        type: "boolean"
      },
      {
        key: "optimize_rle_squares",
        label: "Grouped square paint",
        type: "boolean"
      },
      {
        key: "optimize_removedoubles",
        label: "Remove doubles",
        type: "boolean"
      },
      {
        key: "optimize_batchfill",
        label: "Batch fill",
        type: "boolean"
      },
      {
        key: "debug_drawmesh",
        label: "Show grid",
        type: "boolean"
      },
      {
        key: "useintensitymodulation",
        label: "Use intensity modulation",
        type: "boolean"
      },
      "x", "y", "zindex", "width", "height", "blocksize",
      {
        key: "runsimulation",
        label: "Run fire simulation",
        type: "boolean"
      }, {
        key: "dopaint",
        label: "Draw fire",
        type: "boolean"
      },
      {
        key: "burnfactor",
        max: 140,
        min: 100
      }, {
        key: "fuel",
        max: 350,
        min: 50
      },
      c(1), c(2), c(3), c(4), c(5), p(1), p(2), p(3), p(4), p(5)],

    label: "Fire using marching squares",
    x: 200,
    y: 0,
    height: 81,
    zindex: 1,
    width: 21,
    blocksize: 6,
    burnfactor: 129,
    fuel: 150,
    "c1":"#ffffff",
    "c2":"#E9F23F",
    "c3":"#e27023",
    "c4":"#9b3513",
    "c5":"#770000",
    l1: 84,
    l2: 64,
    l3: 35,
    l4: 22,
    l5: 11,
    runsimulation: 1,
    useintensitymodulation: 0,
    dopaint: 1,
    optimize_onlysquares: false,
    optimize_rle_squares: true,
    optimize_removedoubles: false,
    optimize_batchfill: true,
    debug_drawmesh: false,

    initialize: function() {
      this.initValues();

    },

    initValues: function() {
      this.grid = [];
      this.burnoffset = 0;
      this.mytick = 60;
      this._boost = 0;
    },

    updateBurnOffset: function() {
        this.mytick = ((this.mytick || 0) + 0.4) % 100;
        if (this.mytick > 85) {
          this.burnoffset += Math.random() * 0.6;
        }
        if (this.mytick < 50) {
          this.burnoffset *= 0.95;
        }
    },

    report: function() {
      var ret = _c.fmt("Fire {}, {}", Math.round(this.maxIntensity * 100), Math.round(this.minIntensity * 100));
      this.maxIntensity = undefined;
      this.minIntensity = undefined;
      return ret;
    },

    paint: function(ctx) {
      var i, c, g,line, point, startx, width, l, x, y, grids = [];

      if (!this.dopaint) {
        return;
      }

      ctx.translate(this.x, this.y);


      for (i=1;i<=5;i++) {
          l = this["l" + i];
          grids.push(CB.Marchingsquares.calculateAllWithInterpolation(this.grid, l/100));
      }

      if (this.optimize_removedoubles) {
        this.erasePaintDoubles(grids);
      }

      for (i=5;i>0;i--) {
        l = this["l" + i];
        c = this["c" + i];
        ctx.fillStyle = c;
        if (this.optimize_batchfill) {
          ctx.beginPath();
        }
        g = grids[i-1];

        for (y=0;y<g.length; y++) {
          line = g[y];
          for(x=0;x<line.length;x++) {
            point = line[x];
            if (point && point.length > 0) {
              // RLE squares
              if (this.optimize_rle_squares) {
                if(point[0].fullsquare) {
                  startx = x;
                  width = 0;
                  while(x<line.length && line[x] && (line[x][0] && line[x][0].fullsquare)) {
                      x++;
                      width++;
                  }
                  if (width > 0) {
                      if (startx + width >= line.length) {
                          width = line.length - startx - 1;
                      }
                      this.drawRect(ctx, startx, y, width + 1, 1, this.optimize_batchfill);
                      continue;
                  }
                }
              }
              if (this.optimize_onlysquares) {
                this.drawRect(ctx, x, y, 1, 1, this.optimize_batchfill);
              } else {
                this.drawContour(ctx, point, x, y, this.optimize_batchfill);
              }
            }
          }
        }
        if (this.optimize_batchfill) {
          ctx.fill();
        }
      }
      if (this.debug_drawmesh) {
        this.drawMesh(ctx, grids[0][0].length, grids[0].length);
      }
      ctx.translate(-this.x, -this.y);


    },

    erasePaintDoubles: function(grids) {
      var x, y, ymax = grids[0].length, xmax = grids[0][0].length, painted, cont, i;

      for (y=0;y<ymax; y++) {
        for(x=0;x<xmax;x++) {
          painted = false;
          for (i=0;i<grids.length;i++) {
              if (painted) {
                  grids[i][y][x] = null;
              } else {
                  cont = grids[i][y][x];
                  if (cont[0] && cont[0].fullsquare) {
                      painted = true;
                  }
              }
          }
        }
      }
    },

    drawMesh: function(ctx, width, height) {
      var b = this.blocksize, y, x;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#888";
        ctx.beginPath();


      for (y=0;y<=height;y++) {
        ctx.moveTo(0, 0 + (y * b));
        ctx.lineTo(0 + (width * b), 0 + (y * b));
        ctx.stroke();
      }

      for (x=0;x<=width;x++) {
        ctx.moveTo(x * b, 0);
        ctx.lineTo(x * b, b * height);
      }
      ctx.stroke();

    },

    drawRect: function(ctx, x, y, width, height = 1, dontFill) {
      var xoffset, yoffset, b=this.blocksize;
      xoffset = b * x;
      yoffset = b * y;
      if (!dontFill) {
        ctx.beginPath();
      }
      ctx.rect(xoffset, yoffset, width * b, height * b);
      if (!dontFill) {
        ctx.fill();
      }
    },

    drawContour: function(ctx, cont, x, y, dontFill) {
      var xoffset, yoffset, xx, yy, b=this.blocksize, j;

      if (!dontFill) {
        ctx.beginPath();
      }
      xoffset = b * x;
      yoffset = b * y;
      for (j=0;j<cont.length;j++) {
          xx = cont[j].x;
          yy = cont[j].y;
          if (j === 0) {
             ctx.moveTo(xoffset + (xx*b), yoffset + (yy*b));
          } else {
             ctx.lineTo(xoffset+ (xx*b), yoffset + (yy*b));
          }
      }
      ctx.closePath();
      if (!dontFill) {
        ctx.fill();
      }
    },

    boost: function() {
      this._boost += 10;
    },

    /**
     * This is where the actual simulation happens.
     * Basically interates over a grid of cells with different heat or
     * intensity. Each cell gets its intensity updated using its current value,
     * the neighbours on the side and below it, and a random value.
     *
     * The bottom line of cells in the grid gets updated with a randomly
     * initialized offline/offscreen line.
     */
    tick: function(ctx, diff) {
      var x, y, lower, upper, lastLine,
        burnfactor = (this.burnfactor + (this.useintensitymodulation ? this.burnoffset : 0) + this._boost) / 100,
        fuel = this.fuel / 100, TICK_MS = 20;

      if (!this.runsimulation) {
        if (this.grid.length < this.height) {
          this.grid = this.createGrid(this.height);
        }
        return;
      }

      this.ms = (this.ms || 0) + diff;

      function processLine(lower, upper) {
        var n, length = lower.length, sum;
        for(x=0;x<length;x++) {
          sum = 0;
          n=x-1;
          sum += (lower[n] || 0) + (lower[n+1] || 0) + (lower[n+2] || 0);
          sum += (upper[n] || 0) + (upper[n+1] || 0) + (upper[n+2] || 0);
          upper[x] = (sum * 0.167) * burnfactor * (0.5 + (Math.random() * 0.5));
        }
      }

      if (this.grid.length < this.height) {
        this.grid = this.createGrid(this.height);
      }

      while (this.ms > TICK_MS) {
        for (y=0;y<this.grid.length-1;y++) {
          lower = this.grid[y+1];
          upper = this.grid[y];
          processLine(lower, upper);
        }
        lastLine = this.grid[this.grid.length-1];
        var newLine = [];
        for(x=0;x<lastLine.length;x++) {
          newLine.push(0.5 + (Math.random() * fuel));
        }
        processLine(newLine, lastLine);
        this.ms = this.ms - TICK_MS;

        if (this.useintensitymodulation) {
          this.updateBurnOffset();
        }
        if (this._boost > 0) {
          this._boost -= 1;
        }
      }
    },

    createGrid: function(height) {
      var grid = [], i;

      function makeLine(length) {
        var line = [], j;
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
      }
    }


  });
})();
