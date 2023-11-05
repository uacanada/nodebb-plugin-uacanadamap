<div id="uacanadamap-acp">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="uacanadamap-settings">
				<div class="mb-5">



					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Map Setup</div>
						<div class="card-body">


							<div class="mb-5">
								<label class="form-label d-block" for="mapTitle">Map Page Title</label>
								<small class="form-text">Specify the title for the map page here</small>
								<input type="text" id="mapTitle" name="mapTitle" title="Set your Map Page Title"
									class="form-control mt-2" placeholder="Title ... ">
							</div>

							<div class="mb-5">
								<label class="form-label d-block" for="mapBoxApiKey">MapBox API Key</label>
								<small class="form-text">Enter your MapBox API key for enhanced map capabilities like
									geocoding and reverse geocoding. Without it, the map defaults to OSM tiles with
									reduced functionality. We suggest using MapBox due to its free access to
									customizability and geocoding services. This plugin aims to maximize the utilization
									of MapBox's free tier.
									When entering your Mapbox API key, please note that this key may be accessible on
									the client-side. In order to prevent potential misuse of your key by malicious
									actors, it's crucial that you configure certain usage restrictions in the settings
									of your Mapbox service.
									Specifically, you should create a rule for your key that limits its use to your
									domain only. This ensures that even if someone else acquires your API key, they will
									not be able to use it on a different domain. Therefore, remember to secure your key
									with these domain restrictions to safeguard your service from any unauthorized
									usage.
								</small>
								<input type="text" id="mapBoxApiKey" name="mapBoxApiKey"
									title="Enter your MapBox API Key" class="form-control  mt-2"
									placeholder="Enter your MapBox API Key here">
							</div>

							<!-- Initial Map Coordinates -->
							<div class="mb-5">
								<label class="form-label d-block" for="initialCoordinates">Initial Map
									Coordinates</label>
								<small class="form-text"> These coordinates will be used as the default map center in
									case the plugin is unable to retrieve the user's geolocation or previous location
									preferences upon loading</small>
								<input type="text" id="initialCoordinates" name="initialCoordinates"
									title="Set your default map coordinates" class="form-control mt-2"
									placeholder="49.28269013417919, -123.12086105346681">
							</div>


							<!-- Always Load Default Location Checkbox -->
							<div class="mb-5 form-check">
							<input type="checkbox" class="form-check-input" id="alwaysUseDefaultLocation" name="alwaysUseDefaultLocation">
							<label class="form-check-label" for="alwaysUseDefaultLocation">Always Use Default Location</label>
							<small class="form-text">If checked, the map will always load on the Initial Map Coordinates, regardless of user's saved location preferences.</small>
							</div>

							<!-- Default Zoom Level -->
							<div class="mb-5">
							<label class="form-label d-block" for="defaultZoom">Default Zoom Level</label>
							<small class="form-text">Set the default zoom level when the map loads. The larger the number, the closer the zoom.</small>
							<input type="number" id="defaultZoom" name="defaultZoom" title="Set your default zoom level" class="form-control mt-2" placeholder="10">
							</div>

							<!-- Maximum Zoom Out Level -->
							<div class="mb-5">
							<label class="form-label d-block" for="maxZoomOut">Maximum Zoom Out Level</label>
							<small class="form-text">Define the maximum zoom-out level allowed. The smaller the number, the farther the zoom-out.</small>
							<input type="number" id="maxZoomOut" name="maxZoomOut" title="Set the maximum zoom-out level" class="form-control mt-2" placeholder="3">
							</div>


						</div>
					</div>


					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Content</div>
						<div class="card-body">

						<div class="mb-5">
						<h5 class="fw-bold tracking-tight settings-header">Map Hero Title</h5>
						<input type="text" id="heroTitle" name="heroTitle" title="Setup hero Title" class="form-control mt-2">
						</div>

						<div class="mb-5">
						<h5 class="fw-bold tracking-tight settings-header">Map Hero Subtitle</h5>
						<input type="text" id="heroSubtitle" name="heroSubtitle" title="Setup hero SubTitle" class="form-control mt-2">
						</div>


						<div class="mb-5">
							<h5 class="fw-bold tracking-tight settings-header">Slogans</h5>
							<div class="mb-3" data-type="sorted-list" data-sorted-list="slogans"
								data-item-template="admin/plugins/uacanadamap/partials/sorted-list/item-slogan"
								data-form-template="admin/plugins/uacanadamap/partials/sorted-list/form-slogan">
								<ul data-type="list" class="list-group mb-2"></ul>
								<small class="form-text d-block mb-2"> Define multiple dynamic slogans for your
									map's landing page. These will display in a rotating manner, providing a diverse
									introduction to your community map on each visit</small>
								<button type="button" data-type="add" class="btn btn-sm btn-info">Add
									slogan</button>
							</div>
						</div>


							<div class="mb-5">
								<label class="form-label d-block" for="placeTopicTag">Place Topic Tag</label>
								<small class="form-text"> Define a unique tag for your forum. This tag will be used to
									mark topics that have been added to the map by this plugin</small>
								<input type="text" id="placeTopicTag" name="placeTopicTag"
									title="Set your unique place topic tag" class="form-control mt-2"
									placeholder="Enter your unique tag">
							</div>

							<div class="mb-5">
								<label class="form-label d-block" for="altContentTitle">Title for Alternative
									Content</label>
								<small class="form-text">Here you can set a title for the alternative content. While
									it's typically assumed that the alternative content represents a post in a different
									language, you may use this feature for any purpose, customizing the title
									accordingly</small>
								<input type="text" id="altContentTitle" name="altContentTitle"
									title="Enter a title for the alternative content" class="form-control mt-2"
									placeholder="E.g. 'Alternative Language Content'">
							</div>

							<div class="mb-5">
								<label class="form-label d-block" for="altContentTrigger">Alternative Content
									Trigger</label>
								<small class="form-text">
									Enter a language code such as 'UA', or multiple codes separated by a pipe character
									('|'), e.g. 'UA|CN|MD'. When a user's browser language matches any of these codes,
									they will be shown alternative descriptions for locations, if available.
								</small>
								<input type="text" id="altContentTrigger" name="altContentTrigger"
									title="Specify the trigger for alternative content" class="form-control mt-2"
									placeholder="E.g. 'UA|CN|MD'">
							</div>

							


							<div class="mb-5">
								<label class="form-label d-block" for="unregisteredUserAlert">Unregistered User
									Alert</label>
								<small class="form-text">Enter a custom error message to be displayed when unregistered
									users attempt to add a topic/location to the map or perform other actions that
									require registration</small>
								<input type="text" id="unregisteredUserAlert" name="unregisteredUserAlert"
									title="Set your alert message for unregistered users" class="form-control mt-2"
									placeholder="Enter your alert message here">
							</div>

							<div class="mb-5">
								<label class="form-label d-block" for="locationSharingErrorAlert">Location Sharing Error
									Alert</label>
								<small class="form-text">Enter a custom error message to be displayed when users attempt
									to perform actions that require location sharing but they have globally or locally
									disallowed such sharing</small>
								<input type="text" id="locationSharingErrorAlert" name="locationSharingErrorAlert"
									title="Set your location sharing error alert" class="form-control mt-2"
									placeholder="Enter your error message here">
							</div>

							<div class="mt-3">
								<h5 class="fw-bold tracking-tight settings-header">Default Marker Image</h5>

								<label class="form-label" for="defaultMarkerImage">Upload Default Marker Image</label>
								<small class="form-text">Upload an image to be used as a placeholder for location cards
									where no preset photos are available. Note: This is not the marker icon! This image
									will be displayed when a location is opened.</small>
								<div class="d-flex gap-1">
									<input id="defaultMarkerImage" name="defaultMarkerImage" type="text"
										class="form-control" />
									<input value="Upload" data-action="upload" data-target="defaultMarkerImage"
										type="button" class="btn btn-light" />
								</div>

								<h5 class="mt-3 fw-bold tracking-tight settings-header">Cluster Marker Icon</h5>

								<label class="form-label" for="clusterIcon">Upload Default Cluster Icon</label>
								<small class="form-text">Upload an image for the cluster icon that groups other markers.
									We recommend using SVG format.</small>

								<div class="d-flex gap-1">
									<input id="clusterIcon" name="clusterIcon" type="text" class="form-control" />
									<input value="Upload" data-action="upload" data-target="clusterIcon" type="button"
										class="btn btn-light" />
								</div>
							</div>


						</div>
					</div>

					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Parent Categories & Tabs</div>
						<div class="card-body">

							<div class="mb-3" data-type="sorted-list" data-sorted-list="tabCategories"
								data-item-template="admin/plugins/uacanadamap/partials/sorted-list/item-category"
								data-form-template="admin/plugins/uacanadamap/partials/sorted-list/form-category">
								<ul data-type="list" class="list-group mb-2"></ul>
								<small class="form-text d-block">
									Create global parent categories (tabs) for your map locations.
									For optimal user experience, we recommend keeping these to 5-8 number and treating
									them as overarching
									categories.
									Once these global categories are in place, you'll have the flexibility to set up a
									more extensive range of
									subcategories and tags.
								</small>
								<button type="button" data-type="add" class="btn btn-sm btn-info mt-2">Add Place
									Category</button>
							</div>

						</div>
					</div>

					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Sub Categories</div>
						<div class="card-body">

							<div class="mb-3" data-type="sorted-list" data-sorted-list="subCategories"
								data-item-template="admin/plugins/uacanadamap/partials/sorted-list/item-subcategory"
								data-form-template="admin/plugins/uacanadamap/partials/sorted-list/form-subcategory">
								<ul data-type="list" class="list-group mb-2"></ul>
								<small class="form-text d-block">
									Configure a list of subcategories for map locations. Each subcategory can be
									associated with multiple parent tabs for topic organization. These subcategories
									will be user-selectable during location-topic creation. Note that global tabs are
									not selectable during this process.
									Remember, these subcategories are distinct from your forum categories, though you
									can link them by specifying forum category routing for each subcategory
								</small>
								<button type="button" data-type="add" class="btn btn-sm btn-info mt-2">Add Place Sub
									Category</button>
							</div>

						</div>
					</div>


					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Event Categories</div>
						<div class="card-body">
							<div class="mb-3" data-type="sorted-list" data-sorted-list="eventCategories"
								data-item-template="admin/plugins/uacanadamap/partials/sorted-list/item-eventcategory"
								data-form-template="admin/plugins/uacanadamap/partials/sorted-list/form-eventcategory">
								<ul data-type="list" class="list-group mb-2"></ul>
								<small class="form-text d-block">
									Define a list of categories for event locations. These are specific map locations
									that have a designated
									start date and time. Examples include Meetups, Hikes, and Board Games.
									When users create an event location, they will have the option to select from these
									categories to indicate
									the type of event they are creating.
								</small>
								<button type="button" data-type="add" class="btn btn-sm btn-info mt-2">Add events
									categories</button>
							</div>

						</div>
					</div>




					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Custom Markers</div>
						<div class="card-body">


							<div class="mb-3" data-type="sorted-list" data-sorted-list="advMarkers"
								data-item-template="admin/plugins/uacanadamap/partials/sorted-list/item-advmarkers"
								data-form-template="admin/plugins/uacanadamap/partials/sorted-list/form-advmarkers">
								<ul data-type="list" class="list-group mb-2"></ul>
								<small class="form-text d-block mb-2">List of custom Markers (Your advertisment, or
									official, etc)</small>
								<button type="button" data-type="add" class="btn btn-sm btn-info">Add
									Marker</button>
							</div>
						</div>
					</div>





					<div class="card w-100 mb-5">
						<div class="card-header tracking-tight settings-header">Geographic Scope Setup</div>
						<div class="card-body">
							<label class="form-label d-block mt-3" for="entityTitle">Field Label</label>
							<small class="form-text">Specify the label for the geographical entity field. It will serve
								as a prompt in the form:</small>
							<input type="text" id="entityTitle" name="entityTitle" title="entityTitle"
								class="form-control mt-2 mb-5" placeholder="Geographical Entity">
							<div class="mb-5" data-type="sorted-list" data-sorted-list="geographicalEntities"
								data-item-template="admin/plugins/uacanadamap/partials/sorted-list/item-geographicalEntities"
								data-form-template="admin/plugins/uacanadamap/partials/sorted-list/form-geographicalEntities">
								<ul data-type="list" class="list-group mb-2"></ul>
								<small class="form-text d-block">
									Define a list of geographical entities (e.g., provinces, states, countries) for the
									new location form. If global, list countries. If local, list relevant areas.
								</small>
								<button type="button" data-type="add" class="btn btn-sm btn-info mt-2">Add
									Entity</button>


							</div>

							<div class="mb-5">
								<label class="form-label d-block" for="citiesData">Cities</label>
								<small class="form-text">Enter a list of cities as tags, separated by commas. This is
									not an exhaustive list; users can type in any city. However, the cities you list
									here will automatically appear in autocomplete suggestions. We recommend including
									the cities most relevant to your service to assist users and prevent typos</small>
								<div class="mb-3 bootstrap-tagsinput-cities">

									<input data-field-type="tagsinput" type="text" id="citiesData" name="citiesData" />
								</div>
							</div>

							<div class="mb-5">
								<label class="form-label d-block" for="countryLimit">Restrict to Country code</label>
								<small class="form-text">Enter the country to restrict the geographic scope of the map.
									This limits geocoder functions to this specific country, optimizing the autocomplete
									suggestions for your user's location searches. If left blank, autocomplete
									suggestions will be global, potentially leading to erroneous location inputs.
									The country code should be a two-letter ISO 3166-1 alpha-2 code. Here are a few
									examples: <i>Canada: CA; United States: US; Ukraine: UA; United Kingdom: GB;
										Australia: AU</i>
								</small>
								<input type="text" id="countryLimit" name="countryLimit" title="countryLimit"
									class="form-control mt-2" placeholder="Country">
							</div>


							<div class="row">
								<h3 class="col-12"><i class="fa-solid fa-up-down-left-right"></i> Map Bounds</h3>
								<small class="col-12 form-text mb-3">This setting consists of two coordinate fields: the
									lat,lng of
									the top-left corner and the bottom-right corner of the map. If you wish to restrict
									users' map movement (which may save loading bandwidth), you can set these two points
									to create an imaginary diagonal boundary, within which the map will always be
									displayed.

									Ensure that the top-left coordinates are positioned higher and to the left on the
									map compared to the bottom-right coordinates.

									We recommend providing ample leeway by setting more degrees. Too strict boundaries
									can hinder usability. For example, to restrict the map to Canada, you might set the
									top-left at 70, -150 (above Canada, over Alaska) and the bottom-right at 15, -45
									(well below Canada, near Cuba). This is effectively the whole of North America but
									allows border exploration without map rebounding.

									If your service is GLOBAL, you may leave these boundaries unset.</i>
								</small>
								<div class="col-md-6">
									<label class="form-label d-block mb-3" for="topLeftCorner">Top Left Bound</label>
									<input type="text" id="topLeftCorner" name="topLeftCorner"
										title="Top Left Corner of Map" class="form-control" placeholder="70, -150">
								</div>
								<div class="col-md-6">
									<label class="form-label d-block mb-3" for="bottomRightCorner">Bottom Right
										Bound</label>
									<input type="text" id="bottomRightCorner" name="bottomRightCorner"
										title="Bottom Right Corner of Map" class="form-control" placeholder="15, -45">
								</div>
							</div>


						</div>
					</div>





					<h2 class="tracking-tight settings-header mb-3">Expert Settings</h2>



					<div class="accordion mb-5" id="acpAccordionMb">
						<div class="accordion-item">
							<h2 class="accordion-header" id="headingExpert">
								<button
									class="accordion-button collapsed tracking-tight settings-header bg-primary text-bg-primary"
									type="button" data-bs-toggle="collapse" data-bs-target="#collapseContextButton"
									aria-expanded="false" aria-controls="collapseContextButton">
									Context Buttons
								</button>
							</h2>
							<div id="collapseContextButton" class="accordion-collapse collapse"
								aria-labelledby="headingExpert" data-bs-parent="#acpAccordionMb">
								<div class="accordion-body">
									<div class="mb-5">
										<label class="form-label" for="contextButtonSlide">HTML and Bootstrap+FontAwesome classes</label>
										<div id="contextButtonSlideEditor"></div>
										<textarea type="text" id="contextButtonSlide" name="contextButtonSlide"
											class="d-none ace-editor-textarea"></textarea>
										<small class="form-text">
										Customize the context buttons that will appear at the bottom of the screen. You can utilize these buttons to provide links or to trigger off-canvas panels. Knowledge of HTML and Bootstrap is essential to craft effective buttons. Consider using standard Bootstrap classes and FontAwesome icons to ensure compatibility and visual coherence.
										</small>

									</div>
								</div>
							</div>
						</div>
					</div>


					<div class="accordion mb-5" id="placeInstructionsAccordion">
						<div class="accordion-item">
							<h2 class="accordion-header" id="placeInstructionsHeading">
								<button
									class="accordion-button collapsed tracking-tight settings-header bg-primary text-bg-primary"
									type="button" data-bs-toggle="collapse" data-bs-target="#placeInstructionsCollapse"
									aria-expanded="false" aria-controls="placeInstructionsCollapse">
									Custom Map Location Instructions
								</button>
							</h2>
							<div id="placeInstructionsCollapse" class="accordion-collapse collapse"
								aria-labelledby="placeInstructionsHeading" data-bs-parent="#placeInstructionsAccordion">
								<div class="accordion-body">
									<div class="mb-5">
										<label class="form-label" for="placeInstruction">HTML and Bootstrap+FontAwesome classes</label>
										<div id="placeInstructionEditor"></div>
										<textarea type="text" id="placeInstruction" name="placeInstruction"
											class="d-none ace-editor-textarea"></textarea>
										<small class="form-text">
										Enter your customized HTML instructions to guide users in adding a location to the map. These instructions will appear in a bottom sheet popup above a permanent search bar. When crafting your content, consider leading into the search bar functionality as it will always be present at the bottom of the instructions panel.
										</small>
									</div>
								</div>
							</div>
						</div>
					</div>


					<div class="accordion mb-5" id="advancedJsonSettingsAccordion">
						<div class="accordion-item">
							<h2 class="accordion-header" id="advancedJsonSettingsHeading">
								<button
									class="accordion-button collapsed tracking-tight settings-header bg-primary text-bg-primary"
									type="button" data-bs-toggle="collapse" data-bs-target="#advancedJsonSettingsCollapse"
									aria-expanded="false" aria-controls="advancedJsonSettingsCollapse">
									Advanced JSON Settings
								</button>
							</h2>
							<div id="advancedJsonSettingsCollapse" class="accordion-collapse collapse"
								aria-labelledby="advancedJsonSettingsHeading" data-bs-parent="#advancedJsonSettingsAccordion">
								<div class="accordion-body">
									<div class="mb-5">
										<label class="form-label" for="jsonInput">Insert your JSON configuration here:</label>
										<div id="jsonInputEditor"></div>
										<textarea type="text" id="jsonInput" name="customExtraSettings"
											class="d-none ace-editor-textarea" data-ace-mode="json"></textarea>
										<small class="form-text">
										Use this section to enter custom JSON settings that will enhance the default plugin configurations. Your JSON must be correctly formatted; errors may impair functionality. You are responsible for ensuring the validity of your JSON.
										</small>
									</div>
								</div>
							</div>
						</div>
					</div>




					<div class="accordion mb-5" id="acpAccordion">
						<div class="accordion-item">
							<h2 class="accordion-header" id="headingExpert">
								<button
									class="accordion-button collapsed tracking-tight settings-header bg-danger text-bg-danger"
									type="button" data-bs-toggle="collapse" data-bs-target="#collapseExpert"
									aria-expanded="false" aria-controls="collapseExpert">
									Open Expert Settings
								</button>
							</h2>
							<div id="collapseExpert" class="accordion-collapse collapse" aria-labelledby="headingExpert"
								data-bs-parent="#acpAccordion">
								<div class="accordion-body">



									<div class="mb-5">
										<label class="form-label" for="mapPageRouter">Map Page Router</label>
										<input type="text" id="mapPageRouter" name="mapPageRouter"
											title="Set your map page router" class="form-control"
											placeholder="e.g., /map, /places, /listings">
										<small class="form-text">
											This setting defines the main router for the map page. By default, it is set
											to /map, but you can change
											it to anything you prefer, like /places, /listings, /peoples, etc. The map
											page will be accessible via
											this router path (e.g., yourwebsite.com/map). If you wish for the map to be
											displayed on the home page,
											you should still set a router here. Then, you can designate this router as
											the home page in your NodeBB
											settings.
										</small>

									</div>

									<div class="mb-5">
										<label class="form-label" for="templateName">Map Template Name</label>
										<input type="text" id="templateName" name="templateName"
											title="Set your map template name" class="form-control"
											placeholder="Enter map template name">
										<small class="form-text">
											This setting determines the name of the tpl template in NodeBB that loads
											the map. It is recommended not
											to change this setting unless necessary.
										</small>

									</div>

									<div class="mb-5">
										<label class="form-label" for="bottomSheetOffset">Bottom Sheet Offset from Top
											(%)</label>
										<input type="text" id="bottomSheetOffset" name="bottomSheetOffset"
											title="Set the bottom sheet offset from the top of the screen"
											class="form-control" placeholder="100,40,10,0,0">
										<small class="form-text">
											This setting controls the offset of the bottom panel from the top of the
											screen. The first value, 100, signifies a maximum 100% offset from the top.
											Each upward swipe lifts the panel to the next step value. There are five
											steps in total.
										</small>

									</div>

									<div class="mb-5">
										<label for="zoomThreshold" class="form-label">Faraway Zoom Threshold</label>
										<input type="range" class="form-range" id="zoomThreshold" name="zoomThreshold"
											step="1" min="1" max="18">
										<small class="form-text">
											Set the zoom out threshold here. Beyond this threshold, the map is
											considered to be in a faraway view mode, and the marker design may change
											for a better map perception. The higher the slider value, the sooner this
											mode activates. If the slider is at its maximum, the marker design will
											change even at normal zoom levels.
										</small>
									</div>

									<div class="mb-5">
										<label class="form-label" for="swipeResistance">Swipe Resistance</label>
										<input type="range" class="form-range" id="swipeResistance"
											name="swipeResistance" step="1" min="1" max="100">
										<small class="form-text">
											Use this setting to calibrate the swipe resistance for gesture-sensitive
											elements like the location carousel and the topic panel offset. This setting
											does not affect the sensitivity of the bottom panel with tabs and the
											location list. The lower the value, the more responsive the panel is to
											finger swipes.
										</small>
									</div>




									<div class="mb-5">
										<label class="form-label" for="mapTriggerClass">Body class on map page</label>
										<input type="text" id="mapTriggerClass" name="mapTriggerClass"
											title="Body class on map page" class="form-control"
											placeholder="uacanada-map-page">
										<small class="form-text">
											This extra HTML class is applied to the body element on the page where the
											map is initiated. This allows you to apply CSS styles to certain native
											NodeBB elements on the map page. If you change this setting, you'll need to
											manually rewrite some CSS rules
										</small>
									</div>

									<button id="exportJson" data-bs-toggle="modal" data-bs-target="#exportedJsonModal" class="export-settings-uacanadamap btn btn-primary" type="button"><i class="fa fa-fw fas fa-solid fa-download"></i> Show all settings in JSON format</button>  


										<div class="input-group mt-5 mb-1">
								
											<input type="text" id="resetSettingsConfirmation" class="form-control" placeholder="Confirmation text" aria-label="Reset Settings" aria-describedby="resetSettings">
											<button class="btn btn btn-danger reset-settings-uacanadamap" type="button" id="resetSettings"><i class="fa fa-fw fas fa-solid fa-arrows-rotate"></i> Flush Settings</button>
									    </div>
										<small>Enter confirmation text to reset settings: You must enter "<code>I confirm the deletion of settings</code>" to proceed.</small>
									  


								</div>
							</div>
						</div>



					</div>



				</div>
				
			</form>



		</div>

		<!-- IMPORT admin/partials/settings/toc.tpl -->

	</div>



	<div class="modal fade" id="exportedJsonModal" tabindex="-1" aria-labelledby="exportedJsonModal" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Settings JSON</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body" style="background-color: rgb(33, 26, 68); color:rgb(44, 255, 97)">
					<pre><code id="exportedJson" ></code></pre>
				</div>
			</div>
		</div>
	</div>


</div>