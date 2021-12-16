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
_c = (function () {
  "use strict";
  return {
    forEachKeyValue: function (obj, fn) {
      const key = null;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          fn(key, obj[key]);
        }
      }
    },
    each: function (arr, fn) {
      let i;
      for (i = 0; i < arr.length; i++) {
        fn(arr[i], i);
      }
    },

    filter: function (arr, fn) {
      let ret = [];
      let i;
      for (i = 0; i < arr.length; i++) {
        if (fn(arr[i])) {
          ret.push(arr[i]);
        }
      }
      return ret;
    },

    /**
     * Very basic string formatter for positional and non-positional arguments,
     * python String.format style.
     *
     * Examples:
     *
     *   _c.fmt("{}, {}!", "Hello", "world");
     *   _c.fmt("Someone please call {0} {0} {1}", "one", "two");
     *
     */
    fmt: function () {
      let str = arguments[0];
      let i;
      let r;
      for (i = 1; i < arguments.length; i++) {
        r = new RegExp(`\\{${i - 1}\\}`, "g");
        if (r.test(str)) {
          r.lastIndex = 0; // Reset regexp
          str = str.replace(r, String(arguments[i]));
        } else {
          str = str.replace("{}", String(arguments[i]));
        }
      }
      return str;
    },
  };
})();
