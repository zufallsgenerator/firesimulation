_c = (function() {
  'use strict';
  return {
    forEachKeyValue: function(obj, fn) {
      const key = null;
      for(key in obj) {
        if (obj.hasOwnProperty(key)) {
          fn(key, obj[key]);
        }
      }
    },
    each: function(arr, fn) {
      let i;
      for (i=0;i<arr.length;i++) {
        fn(arr[i], i);
      }
    },
    
    filter: function(arr, fn) {
      let ret = [];
      let i;
      for(i=0;i<arr.length;i++) {
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
    fmt: function() {
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
    }
  };
})();
