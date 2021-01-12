/*jshint strict: true */
/*global CB console _c */
(function() {
  'use strict';
  CB.Class("Scene", {
    properties: [
    ],
    label: "Scene",

    light: 100,

    initialize: function(params, ctx) {
      let cfg;
      let obj;
      let i;
      let classname;
      this._balls = [];

      this.children = [];

      for (i=0;i<this.config.length;i++) {
        cfg = this.config[i];
        classname = cfg.classname;
        obj = null;
        try {
          obj = new CB[classname](cfg.values);
        } catch(e) {
          console.log(_c.fmt("Failed instantiating object of class CB.{}", classname));
          continue;
        }
        this.children.push(obj);
      }
    },

    tick: function(ctx, diff) {
      let i;
      let obj;
      this.children = CB.Helpers.purgeDeleted(this.children);
      for(i=0;i<this.children.length;i++) {
        obj = this.children[i];
        if (obj.tick) {
          obj.tick(ctx, diff);
        }
      }
    },

    draw: function(ctx) {
      var i;
      var sorted;
      var obj;

      var sky = _c.filter(this.children, function(o) {
         return o && o.roles && o.roles.sky;
      })[0];

      if (sky) {
        this.fillContext(ctx, sky.getFill(ctx));
      }

      sorted = [].concat(this.children);
      sorted.sort(function(a, b) { return (a.zindex || 1)- (b.zindex || 1); });
      for(i=0;i<sorted.length;i++) {
        obj = sorted[i];
        if (obj.paint) {
          if (obj.hovered) {
            if (obj.paintHovered) {
              obj.paintHovered(ctx, obj.hovered.x, obj.hovered.y);
            } else {
              obj.paint(ctx);

            }
          } else {
            obj.paint(ctx);

          }
        }
      }
    },

    clearContext: function(ctx) {
      var width = ctx.canvas.width;
      var height = ctx.canvas.height;
      ctx.clearRect(0, 0, width, height);
    },

    fillContext: function(ctx, fill) {
      var width = ctx.canvas.width;
      var height = ctx.canvas.height;
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fillStyle = fill;
      ctx.fill();
    },


    report: function() {
      return "";
    },

    onPropertyUpdate: function(name, value) {
      this[name] = value; // Dangerous!!

    }
  });
})();