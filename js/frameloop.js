(function() {
'use strict';
/*global CB document setTimeout */
var WAITMS_RUN = 1000 / 60;
var WAITMS_PAUSE = 200;

/**
 * The main loop,
 * @param {CanvasContext} ctx
 * @param {Object} mainobj - object on which to call .tick(ctx, diff)
 */
CB.frameloop = function(ctx, mainobj, ctrl, fpsfunc) {
  var animate, lastTs = new Date(), s = 0, pause, frames = 0;

  if (ctrl) {
    ctrl.handleProperties(mainobj);
    ctrl.registerLoopCallback(function (message) {
      if (message === "pause") {
        pause = true;
      }
      if (message === "run") {
        pause = false;
      }
    });
  }

  animate = function() {
    var curTs = new Date() - 0, diff = curTs - lastTs, report = "", logStr;
    setTimeout(animate, pause ? WAITMS_PAUSE : WAITMS_RUN);
    lastTs = curTs;
    s = s + diff;
    frames++;
    if (s >= 1000) {
      if (mainobj.report) {
        report = mainobj.report();
      }
      logStr = "FPS: " + frames + (report ? ", " + report : "");
      if (ctrl) {
        ctrl.showLog(logStr);
      }
      if (fpsfunc) {
        fpsfunc(frames);
      }
      s = 0;
      frames = 0;
    }
    if (!pause) {
      mainobj.tick(ctx, diff);
    }
    if (mainobj.draw) {
      mainobj.draw(ctx);
    }
  };

  animate();
};
})();