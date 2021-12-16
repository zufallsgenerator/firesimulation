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
(function () {
  "use strict";
  /*global CB document setTimeout */
  const WAITMS_RUN = 1000 / 60;
  const WAITMS_PAUSE = 200;

  /**
   * The main loop,
   * @param {CanvasContext} ctx
   * @param {Object} mainobj - object on which to call .tick(ctx, diff)
   */
  CB.frameloop = function (ctx, mainobj, ctrl, fpsfunc) {
    let animate;
    let lastTs = new Date();
    let s = 0;
    let pause;
    let frames = 0;

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

    animate = function () {
      let curTs = new Date() - 0;
      let diff = curTs - lastTs;
      let report = "";
      let logStr;
      setTimeout(animate, pause ? WAITMS_PAUSE : WAITMS_RUN);
      lastTs = curTs;
      s = s + diff;
      frames++;
      if (s >= 1000) {
        if (mainobj.report) {
          report = mainobj.report();
        }
        logStr = `FPS: ${frames}${report ? `, ${report}` : ""}`;
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
