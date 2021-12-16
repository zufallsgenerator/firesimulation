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
/*global $ window document CB _c alert loadobjects */
window.main = (function () {
  "use strict";
  let defaultConfig = [
    {
      classname: "Sky",
      values: {
        light: 0,
      },
    },
    {
      classname: "Firems",
      values: {
        x: 0,
        y: 0,
      },
    },
  ];

  let fpsEl;
  let textProp;

  function fpsreporter(fps) {
    $("#fps").text(String(fps));
  }

  function setInputValuesFromObject(obj) {
    $("input").each(function (idx, field) {
      const type = $(field).prop("type");
      if (obj[field.id] !== undefined) {
        if (type === "checkbox") {
          if ($(field).prop("checked") !== undefined) {
            $(field).prop("checked", Boolean(obj[field.id]));
          } else {
            $(field).prop("value", obj[field.id]);
          }
        }
        if (type === "number") {
          $(field).prop("value", obj[field.id]);
        }
      }
    });
  }

  function registerInputListeners(scene) {
    let fire;
    let propId;
    $("input").on("change", function (evt) {
      let newValue;
      let type = $(evt.target).prop("type");

      if (type === "checkbox") {
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

    $.each(scene.children, function (idx, obj) {
      if (obj instanceof CB.Firems) {
        fire = obj;
      }
    });

    if (fire) {
      setInputValuesFromObject(fire);
    }

    $("#boostbutton").on("mousedown", function () {
      if (fire) {
        fire.boost();
      }
    });
  }

  function start(canvasId, controlId) {
    let canvas;
    let ctx;
    let world;

    canvas = document.getElementById(canvasId);
    if (!canvas.getContext) {
      alert("Canvas not supported!");
      return;
    }

    ctx = canvas.getContext("2d");

    world = new CB.Scene(
      {
        config: defaultConfig,
      },
      ctx
    );

    registerInputListeners(world);

    CB.frameloop(ctx, world, null, fpsreporter);
  }

  return function (canvasId, controlId) {
    start(canvasId, controlId);
  };
})();
