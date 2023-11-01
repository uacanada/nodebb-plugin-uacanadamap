"use strict";
const Plugin = {};

const path = require("path");
const fs = require("fs");

const winston = require.main.require("winston");
const meta = require.main.require("./src/meta");
const db = require.main.require("./src/database");
const cache = require.main.require("./src/cache");
const topics = require.main.require("./src/topics");
const {setupPageRoute, setupApiRoute, setupAdminPageRoute} = require.main.require("./src/routes/helpers");

const { handleAddPlaceRequest } = require("./placeFormHandler");
const topicModifier = require("./topicModifier");

let settings;

Plugin.init = async ({ router, middleware, controllers, helpers } ) => {



  settings = await getSettings({ forceRefresh: true });
  const customRoute = settings?.mapPageRouter || "/map";
  console.log("static:api.routes hook triggered");
 


  setupAdminPageRoute(
    router,
    "/admin/plugins/uacanadamap",
    [],
    (req, res) => {
      res.render("admin/plugins/uacanadamap", {
        title: "UACANADAMAP SETTINGS",
        settings,
      }); // TODO
    }
  );

  
 setupPageRoute(
  router,
  customRoute,
  [
    // (req, res, next) => {
    //   setImmediate(next);
    // },
  ],
   (req, res) => {
    console.log("PAGE route "+customRoute+" was hit")
    if (settings.templateName && settings.mapTitle && settings.mapTriggerClass) {
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

  // setupPageRoute(
  //   router,
  //   customRoute + "/:username",
  //   [],
  //   (req, res) => {
  //     const mapUsername = req.params?.username || 0;
  //     const needOpenPlaceTid = getTid(mapUsername);
  //     const uacanadamap = { needOpenPlaceTid, mapUsername };
  //     const title = settings.mapTitle|| 'Unsetted Map Plugin'
  //     res.render(settings.templateName, {
  //       title: mapUsername + " | " + title,
  //       browserTitle: mapUsername + " " + title,
  //       uid: req.uid,
  //       uacanadamap,
  //     });
  //   }
  // );

  



};


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
  } catch (error) {
    console.log(`onEachRender Error `,error)
  }

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
    name: "Uacanadamap",
  });
  return header;
};




Plugin.activate = async (data) => {
  
  setDefaultSettings()

};





Plugin.addRoutes = async ({ router, middleware, helpers }) => {
  if (!helpers || !helpers.formatApiResponse) {
    console.log('Helpers or formatApiResponse is undefined.');
    return;
  }

  const onlyAdmin = [
		middleware.ensureLoggedIn,			// use this if you want only registered users to call this route
		middleware.admin.checkPrivileges,	// use this to restrict the route to administrators
	];



  // The prefix '/api/v3/plugins/' ensures compatibility with the current API version.




// setupApiRoute(
//   router,
//   "get",
//   "/map/delete_all_places/:pincode",
//   middlewares,
//   async (req, res) => {
//     console.log("API route /map/delete_all_places/:pincode was hit")
//     try {
//       const result = await db.delete("uacanadamap:places");
//       helpers.formatApiResponse(200, res, { deleted: true, result: result });
//     } catch (error) {
//       winston.warn(`delete_all_places: ${error.message}`);
//       helpers.formatApiResponse(200, res, {
//         error: "delete_all_places error",
//       });
//     }
//   }
// );


setupApiRoute(
  router,
  "get",
  "/map/getplace/:tid",
  [],
  async (req, res) => {
    console.log("API route /map/getplace/:tid was hit")
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

setupApiRoute(
  router,
  "get",
  "/map/getplaces",
  [],
  async (req, res) => {
    console.log("API route /map/getplaces/ was hit")
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


 setupApiRoute(
  router,
  "post",
  "/map/addplace",
  [],
  async (req, res) => {
      await handleAddPlaceRequest(req, res, helpers);
 }
);


setupApiRoute(  router,"get",  "/uacanadamap/flushsettings/:confirmation",
onlyAdmin,
async (req, res) => {
  console.log("API route /uacanadamap/pluginsettings/flushsettings/:confirmation was hit")
  try {
    const {confirmation} = req.params
    const confirmed = confirmation === "I confirm the deletion of settings"
    const sets = await meta.settings.get("uacanadamap");

    if(!confirmed){
      helpers.formatApiResponse(200, res, { error:'Settings not deleted', confirmed,  confirmation});
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


setupApiRoute(  router,"get",  "/uacanadamap/setdefaults", onlyAdmin, async (req, res) => {
  let result = await setDefaultSettings()// TODO remove
  helpers.formatApiResponse(200, res, { message: "setdefaults, please rebuild and restart NodeBB", result }); 
})


};

async function setDefaultSettings() {
  try {
    let settings = await getSettings({ forceRefresh: true });
    if (settings?.debuginfo?.activation) {
      return settings;
    }

    const defaultSettingsPath = path.resolve(
      __dirname,
      '..',
      '..',
      'settings',
      'defaultSettings.json'
    );

    let defaultSettings = JSON.parse(fs.readFileSync(defaultSettingsPath, "utf8"));
    let newSettings = {
      ...defaultSettings,
      debuginfo: { activation: Math.floor(Date.now() / 1000) }
    };

    await meta.settings.set("uacanadamap", newSettings);
    return newSettings;

  } catch (error) {
    console.log('Error:', error);
    return { errorLog: 'Error: ' + error.toString() };
  }
}


async function getSettings({ forceRefresh = false } = {}) {
  if (settings?.templateName && !forceRefresh) {
    return settings;
  } else {
    try {
      const freshSettings = await meta.settings.get("uacanadamap");

      if(Object.keys(freshSettings).length === 0){
       //  const defaults = await setDefaultSettings()
         return {};
      } else {
        return freshSettings;
      }

     
     
    } catch (error) {
      console.log(`getSettings error`, error)
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


module.exports = Plugin;