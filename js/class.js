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
/* jshint strict: true */
const CB = {};
(function (scope) {
  "use strict";
  /**
   * Function for creating a class
   *
   * @param {String} name
   *   name of the class
   *
   * @param {Object} members
   *    methods, constants and class variables
   *
   * @return {Function}
   *    The instantiated class
   */
  scope.Class = function (name, members) {
    let klass;
    let key;
    scope[name] = function (params) {
      let key;
      let cls;
      cls = scope[name];
      if (params) {
        for (key in params) {
          if (params.hasOwnProperty(key)) {
            this[key] = params[key];
          }
        }
      }

      cls.__instanceCount__++;
      this._id = `${name}_${cls.__instanceCount__}`;
      if (this.initialize) {
        this.initialize(...arguments);
      }
    };
    klass = scope[name];

    // Copy member objects
    for (key in members) {
      if (members.hasOwnProperty(key)) {
        klass.prototype[key] = members[key];
      }
    }

    // Extra functions on prototype
    klass.__instanceCount__ = 0;

    klass.prototype.getId = klass.prototype.getInstanceId = function () {
      return this._id;
    };

    klass.prototype.toString = function () {
      return String(`<CB.${this._id} instance>`);
    };

    if (Array.constructor) {
      klass.prototype._assertParams = _assertParams;
    } else {
      klass.prototype._assertParams = function () {};
    }

    // Method for adding class methods/variables
    klass.addStatic = function (members) {
      for (const key in members) {
        if (members.hasOwnProperty(key)) {
          klass[key] = members[key];
        }
      }

      return klass;
    };

    return klass;
  };

  function _assertParams(params, template) {
    // This probably requires a pretty new web browser
    for (const name in template) {
      if (template.hasOwnProperty(name)) {
        const expectedType = template[name];
        const expectedStr =
          `parameter '${name}' of type '` + expectedType.name + "'";
        if (params[name] === undefined) {
          throw new Error(`Missing: ${expectedStr}`);
        }

        if (params[name].constructor !== expectedType) {
          throw new Error(
            `Wrong type: ${typeof params[name]}` + ". Expected " + expectedStr
          );
        }
      }
    }
  }

  scope.namespace = function (namespace) {
    let parts = namespace.split(".");
    let part;
    let i;
    let currentNode = scope;
    for (i = 0; i < parts.length; i++) {
      part = parts[i];
      if (currentNode[part] === undefined) {
        currentNode[part] = {};
      }
      currentNode = currentNode[part];
    }
  };
})(CB);
