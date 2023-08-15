const extensions = (UacanadaMap) => {
    UacanadaMap.console = {
        log: (...args) => {
          if (app.user.isAdmin) {
            console.log(...args);
          }
        },
      };
  };
  module.exports = { extensions };
  