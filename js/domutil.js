(function() {
'use strict';
/*global CB document */
CB.namespace("domutil");

CB.domutil.getBodyHeight = function() {
      const body = document.getElementsByTagName("body")[0];
      const html = document.getElementsByTagName("html")[0];
      return Math.max(body.scrollHeight, body.offsetHeight,
                              html.clientHeight, html.scrollHeight, html.offsetHeight);
};

CB.domutil.getBodyWidth = function() {
      const body = document.getElementsByTagName("body")[0];

      const html = document
                .getElementsByTagName("html")[0];

      return Math.max(body.scrollHeight, body.offsetWidth,
          html.clientHeight, html.scrollHeight, html.offsetWidth);
};
})();