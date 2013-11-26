/*jshint strict: true */
/*global $ window document CB _c alert loadobjects */
window.main = (function() {
  'use strict';
  var defaultConfig = [ {
    "classname" : "Sky",
    "values" : {
      "light" : 0
    }
  }, {
    "classname":"Firems",
    values: {
      x: 0,
      y: 0
    }
    }
  ], fpsEl, textProp;

  function fpsreporter(fps) {
    $("#fps").text(String(fps));
  }

  function setInputValuesFromObject(obj) {
    $("input").each(function(idx, field) {
      if (obj[field.id] !== undefined) {
        if (field.hasOwnProperty("checked")) {
          $(field).prop("checked", Boolean(obj[field.id]));
        } else {
          $(field).prop("value", obj[field.id]);
        }
      }
    });
  }

  function registerInputListeners(scene) {
    var fire, propId;
    $("input").on("change", function(evt) {
      var newValue;
      if (evt.target.hasOwnProperty("checked")) {
        newValue = Boolean(evt.target.checked);
      } else {
        newValue = parseInt(evt.target.value, 10);
      }
      if (evt.target.id) {
        propId = evt.target.id;
        if (fire && fire.onPropertyUpdate) {
          fire.onPropertyUpdate(propId, newValue);
        }
      }
    });

    $.each(scene.children, function(idx, obj) {
      if (obj instanceof CB.Firems) {
        fire = obj;
      }
    });

    if (fire) {
      setInputValuesFromObject(fire);
    }

    $("#boostbutton").on("mousedown", function() {
      if (fire) {
        fire.boost();
      }
    });

  }




  function start(canvasId, controlId) {
    var canvas, ctx, world;

    canvas = document.getElementById(canvasId);
    if (!canvas.getContext) {
      alert("Canvas not supported!");
      return;
    }

    ctx = canvas.getContext('2d');

    world = new CB.Scene({
      config : defaultConfig
    }, ctx);

    registerInputListeners(world);

    CB.frameloop(ctx, world, null, fpsreporter);
  }


  return function(canvasId, controlId) {
      start(canvasId, controlId);
  };
})();
