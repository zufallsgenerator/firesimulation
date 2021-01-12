/* jshint strict: true */
var CB = {};
(function(scope) {
  'use strict';
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
  scope.Class = function(name, members) {
    var klass, key;
    scope[name] = function(params) {
      var key, cls;
      cls = scope[name];
      if (params) {
        for(key in params) {
          if (params.hasOwnProperty(key)) {
            this[key] = params[key];
          }
        }
      }

      cls.__instanceCount__++;
      this._id = "" + name + "_" + cls.__instanceCount__;
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

    klass.prototype.getId = klass.prototype.getInstanceId = function() {
      return this._id;
    };

    klass.prototype.toString = function() {
      return String("<CB." + this._id + " instance>");
    };


    if (Array.constructor) {
      klass.prototype._assertParams = _assertParams;
    } else {
      klass.prototype._assertParams = function() {};
    }


    // Method for adding class methods/variables
    klass.addStatic = function(members) {
      for (var key in members) {
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
    for (var name in template) {
      if (template.hasOwnProperty(name)) {
        var expectedType = template[name];
        var expectedStr = "parameter '" + name + "' of type '" +
        expectedType.name + "'";
        if (params[name] === undefined) {
          throw new Error("Missing: " + expectedStr);
        }

        if (params[name].constructor !== expectedType) {
        throw new Error("Wrong type: " + (typeof params[name]) +
          ". Expected " + expectedStr);
        }
      }
    }
  }

  scope.namespace = function(namespace) {
    var parts = namespace.split("."), part, i, currentNode = scope;
    for(i=0;i<parts.length;i++) {
      part = parts[i];
      if (currentNode[part] === undefined) {
        currentNode[part] = {};
      }
      currentNode = currentNode[part];
    }
  };
})(CB);
