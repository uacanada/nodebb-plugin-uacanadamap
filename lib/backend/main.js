"use strict";
const Plugin = module.exports;
const winston = require.main.require("winston");
const path = require("path");
const fs = require("fs");
const meta = require.main.require("./src/meta");
const db = require.main.require("./src/database");
const cache = require.main.require("./src/cache");
const topics = require.main.require("./src/topics");
const routeHelpers = require.main.require("./src/routes/helpers");
const { handleAddPlaceRequest } = require("./placeFormHandler");
const topicModifier = require("./topicModifier");

let settings;




Plugin.addPlaceFieldsToTopic = async (data) => {
  settings = await getSettings({ forceRefresh: false });
  data = topicModifier(data, settings);
  return data;
};

Plugin.onEachRender = async (data) => {
  try {
    settings = await getSettings({ forceRefresh: false });

    if (settings && settings.templateName && settings.mapTriggerClass) {
      const {
        templateData,
        templateData: {
          template: { name },
        },
      } = data;
      templateData.bodyClass +=
        name === settings.templateName ? ` ${settings.mapTriggerClass}` : "";

      data.templateData.UacanadaMapSettings = settings;

      if (templateData.mapFields) {
      }
    }
  } catch (error) {}

  return data;
};


Plugin.defineWidgetAreas = async (areas) => {
  areas = areas.concat([
    {
      name: "UCM Pull-Up Panel",
      template: "global",
      location: "ucm-pull-up-panel",
    },
  ]);
  return areas;
};

Plugin.addAdminNavigation = (header) => {
  header.plugins.push({
    route: "/plugins/uacanadamap",
    icon: "fa-compass-drafting",
    name: "UACanadaMap",
  });
  return header;
};

Plugin.activate = async (data) => {
  settings = await getSettings({ forceRefresh: true });
  const settingsExist = settings?.debuginfo?.activation; // TODO

  let newSettings = {
    debuginfo: { activation: Math.floor(Date.now() / 1000) },
  };

  if (!settingsExist) {
    try {
      
      const defaultSettingsPath = path.resolve(
        __dirname,
        '..',
        'settings',
        'defaultSettings.json'
      );
      
      const defaultSettings = JSON.parse(
        fs.readFileSync(defaultSettingsPath, "utf8")
      );
      newSettings = { ...defaultSettings, debuginfo: newSettings.debuginfo };
    } catch (error) {
      newSettings.errorLog = error.toString();
    }
  }

  await meta.settings.set("uacanadamap", newSettings);
};

Plugin.init = async ({ router, middleware, controllers, helpers } ) => {
 



};


Plugin.addRoutes = async ({ router, middleware, controllers, helpers }) => {

  
  const middlewares = [
		middleware.ensureLoggedIn,			// use this if you want only registered users to call this route
		middleware.admin.checkPrivileges,	// use this to restrict the route to administrators
	];
  settings = await getSettings({ forceRefresh: true });
  const customRoute = settings?.mapPageRouter || "/map";

  routeHelpers.setupPageRoute(
    router,
    customRoute,
    [
      (req, res, next) => {
        setImmediate(next);
      },
    ],
    (req, res) => {
      if (settings.mapTitle && settings.mapTriggerClass) {
        res.render(settings.templateName, {
          title: settings.mapTitle,
          browserTitle: settings.mapTitle,
          uid: req.uid,
        });
      } else {
        res.render("tos", {
          termsOfUse:
            "<h2>First You need setup plugin!</h2> Deactivate & Activate Again, then restart forum",
        });
      }
    }
  );

  routeHelpers.setupPageRoute(
    router,
    customRoute + "/:username",
    [
      (req, res, next) => {
        setImmediate(next);
      },
    ],
    (req, res) => {
      const mapUsername = req.params?.username || 0;
      const needOpenPlaceTid = getTid(mapUsername);
      const uacanadamap = { needOpenPlaceTid, mapUsername };
      res.render(settings.templateName, {
        title: mapUsername + " | " + settings.mapTitle,
        browserTitle: mapUsername + " " + mapTitle,
        uid: req.uid,
        uacanadamap,
      });
    }
  );

  routeHelpers.setupAdminPageRoute(
    router,
    "/admin/plugins/uacanadamap",
    [
      (req, res, next) => {
        setImmediate(next);
      },
    ],
    (req, res) => {
      res.render("admin/plugins/uacanadamap", {
        title: "UACANADAMAP SETTINGS",
        settings,
      }); // TODO
    }
  );

  routeHelpers.setupApiRoute(
    router,
    "put",
    "/map/flushsettings/",  
    middlewares,
    async (req, res) => {
      try {
        const confirm =req.body.confirmation ==="I confirm the deletion of settings"
        const sets = await meta.settings.get("uacanadamap");

        if(!sets || !confirm){
          helpers.formatApiResponse(200, res, { error:'Settings not deleted', confirm });
          return
        }


        for (let key in sets) {
          if (sets.hasOwnProperty(key)) {
            if (Array.isArray(sets[key])) {
              // if the setting is an array, we need to delete the sorted set
              const numItems = await db.sortedSetCard(
                `settings:uacanadamap:sorted-list:${key}`
              );
              const deleteKeys = [`settings:uacanadamap:sorted-list:${key}`];
              for (let x = 0; x < numItems; x++) {
                deleteKeys.push(`settings:uacanadamap:sorted-list:${key}:${x}`);
              }
              await db.deleteAll(deleteKeys);
              await db.setRemove(`settings:uacanadamap:sorted-lists`, key);
            } else {
              // if the setting is not an array, we can just delete the field
              await db.deleteObjectField("settings:uacanadamap", key);
            }
          }
        }
        await cache.del("settings:uacanadamap");

        const updated = await meta.settings.get("uacanadamap");

        helpers.formatApiResponse(200, res, { sets, updated });
      } catch (error) {
        winston.warn(`flush_settings: ${error.message}`);
        helpers.formatApiResponse(200, res, { error: "flush_settings" });
      }
    }
  );
 
  routeHelpers.setupApiRoute(
    router,
    "post",
    "/map/addplace",
    async (req, res) => {
      await handleAddPlaceRequest(req, res, helpers);
	 }
  );

  routeHelpers.setupApiRoute(
    router,
    "get",
    "/map/delete_all_places/:pincode",
    middlewares,
    async (req, res) => {
      try {
        const result = await db.delete("uacanadamap:places");
        helpers.formatApiResponse(200, res, { deleted: true, result: result });
      } catch (error) {
        winston.warn(`delete_all_places: ${error.message}`);
        helpers.formatApiResponse(200, res, {
          error: "delete_all_places error",
        });
      }
    }
  );


  

  routeHelpers.setupApiRoute(
    router,
    "get",
    "/map/getplace/:tid",
    [],
    async (req, res) => {
      try {
        const tid = Number(req.params.tid);
        const place = await topics.getTopicField(tid, "mapFields");
        helpers.formatApiResponse(200, res, {
          status: "success",
          placeOnMap: place,
          tid,
        });
      } catch (error) {
        winston.warn(`error /map/getplace/:tid ${error.message}`);
        helpers.formatApiResponse(500, res, {
          error: "Something went wrong with getplace",
        });
      }
    }
  );

  routeHelpers.setupApiRoute(
    router,
    "get",
    "/map/getplaces/",
    [],
    async (req, res) => {
      try {
        const places = await db.getObject(`uacanadamap:places`);
        const placesArray = Object.values(places);
        helpers.formatApiResponse(200, res, { status: "success", placesArray });
      } catch (error) {
        winston.warn(`error /map/getplaces/ ${error.message}`);
        helpers.formatApiResponse(500, res, { error: "Something went wrong" });
      }
    }
  );


};

async function getSettings({ forceRefresh = false } = {}) {
  if (settings?.templateName && !forceRefresh) {
    return settings;
  } else {
    try {
      const freshSettings = await meta.settings.get("uacanadamap");
      return freshSettings;
    } catch (error) {
      return {};
    }
  }
}

function getTid(str) {
  const regex = /^\d+$/;

  if (regex.test(str)) {
    const num = parseInt(str, 10);
    if (num > 0) {
      return num;
    }
  }

  return false;
}
