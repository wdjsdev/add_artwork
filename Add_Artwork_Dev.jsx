function addArtwork()
{
	//global variables
	var docRef,
		layers,
		artboards,
		valid = true,
		versionNum,
		garments,
		curGarment,
		componentPath,
		data,
		ppLay,
		artLay,
		infoLay,
		smallestScale,
		logoType,
		placedLogos = {};

	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
	


	///////Begin/////////
	///Logic Container///
	/////////////////////

	function init()
	{
		var result = true;

		//verify open document
		if(app.documents.length > 0)
		{
			docRef = app.activeDocument;
			layers = docRef.layers;
			artboards = docRef.artboards;
			versionNum = "7";

			log.h("User " + user + "::Begin Script Execution::Add_Artwork v." + versionNum + ".");

			//development prompt to verify which components should be used
			//only will.dowling will be prompted here, other artists
			//will always get the production components.

			if(user === "will.dowling")
			{
				logDest.push(new File("~/Desktop/automation/logs/add_artwork_dev_log.txt"));
				componentPath = componentPrompt();
				if(!componentPath)
				{
					result = false;
				}
			}
			else
			{
				//send all log messages to the add_art_log file
				logDest.push(new File("/Volumes/Customization/Library/Scripts/Script Resources/Data/.script_logs/add_art_log.txt"));
				componentPath = new Folder("/Volumes/Customization/Library/Scripts/Script Resources/components/add_artwork/");
			}



			//initialization complete

		}
		else
		{
			result = false;
		}

		return result;
	}

	function componentPrompt()
	{
		var components =
		{
			regDev : new Folder("~/Desktop/automation/add_artwork/components/"),
			binDev : new Folder("~/Desktop/automation/add_artwork/comp_bin/"),
			prod: new Folder("/Volumes/Customization/Library/Scripts/Script Resources/components/add_artwork/")
		}

		var result = false;

		var w = new Window("dialog","Which components do you want to use?");
			var txtGroup = w.add("group");
				var topTxt = txtGroup.add("statictext", undefined, "Select the component group.");

			var btnGroup = w.add("group");
				btnGroup.orientation = "column";
				var regDev = btnGroup.add("button", undefined, "Regular Development");
					regDev.onClick = function()
					{
						result = components.regDev;
						log.l("Using regular development components.");
						w.close();
					}
				var binDev = btnGroup.add("button", undefined, "Binary Development");
					binDev.onClick = function()
					{
						result = components.binDev;
						log.l("Using binary development components.");
						w.close();
					}
				var production = btnGroup.add("button", undefined, "Production Components");
					production.onClick = function()
					{
						result = components.prod;
						log.l("Using production components.");
						w.close();
					}
				var cancel = btnGroup.add("button", undefined, "Cancel");
					cancel.onClick = function()
					{
						result = false;
						w.close();
					}
		w.show();

		return result;
	}




	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************//*****************************************************************************/
	/*****************************************************************************//*****************************************************************************/
	/*****************************************************************************//*****************************************************************************/
	/*****************************************************************************//*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////

		eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js\"");
		eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js\"");

		var library = prepressInfo;

		if(library == undefined)
		{
			log.e("Failed to identify the central library file::Tried to find central_library.js in the following location:::/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js")
			errorList.push("Failed to open the library file. Aborting")
			valid = false;
		}

	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************//*****************************************************************************/
	/*****************************************************************************//*****************************************************************************/
	/*****************************************************************************//*****************************************************************************/
	/*****************************************************************************//*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	if(valid)
	{
		valid = init();
	}

	if(valid)
	{
		//init was successful
		//bring in necessary components
		var compFiles = componentPath.getFiles();
		for(var cf=0;cf<compFiles.length;cf++)
		{
			if(compFiles[cf].name.indexOf("js")>-1)
			{
				eval("#include \"" + compFiles[cf] + "\"");
			}
		}
	}

	if(valid)
	{
		if(!getGarments(layers))
		{
			valid = false;
			log.e("getGarments function failed.");
		}	
	}

	if(valid)
	{
		if(!masterLoop(garments))
		{
			valid = false;
			log.e("masterLoop function failed.");
		}
	}

	if(errorList.length > 0)
	{
		sendErrors(errorList);
	}

	printLog();
	return valid;

}
addArtwork();