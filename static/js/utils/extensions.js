"use strict";
define("utils/extensions", [
  "core/variables" /*   Global object UacanadaMap  */,
], function (UacanadaMap) {
  UacanadaMap.console = {
    log: (...args) => {
      if (app.user.isAdmin) {
        console.log(...args);
      }
    },
  };

  return UacanadaMap;
});
