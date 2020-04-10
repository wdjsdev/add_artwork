#target Illustrator
function addArtwork()
{
	//global variables
	var docRef = app.activeDocument,
		layers = docRef.layers,
		artboards = docRef.artboards,
		valid = true,
		versionNum,
		garments,
		curGarment,
		componentPath,
		data,
		mockSizeLayer,
		mockSizeDest,
		ppLay,
		artLay,
		infoLay,
		smallestScale,
		logoType,
		placedLogos = {};

	var scriptName = "add_artwork"; 

	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

	var devUtilities = true;

	//Utilities
	// #include "~/Desktop/automation/utilities/Utilities_Container.js";
	// if(!devUtilities || $.getenv("USER") !== "will.dowling")
	// {
	// 	// //Production Utilities
	// 	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	// 	eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Batch_Framework.jsxbin\"");
	// }
	// else
	// {
	// 	//Dev Utilities
	// 	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Utilities_Container.js\"");
	// 	eval("#include \"/Volumes/Macintosh HD/Users/will.dowling/Desktop/automation/utilities/Batch_Framework.js\"");
	// }

	function getUtilities()
	{
		var result;
		var user,networkPath,localPath,utilPath;
		if($.os.match("Windows"))
		{
			user= $.getenv("USERNAME");
			networkPath = "//AD4/Customization/";
		}
		else
		{
			user = $.getenv("USER");
			networkPath = "/Volumes/Customization/";
			localPath = "/Volumes/Macintosh HD/Users/" + user + "/Documents/Boombah_Script_Resources/"
		}

		utilPath = networkPath + "Library/Scripts/Script Resources/Data/";
		if(Folder(utilPath).exists)
		{
			result = utilPath;
		}
		return result;

	}
	var utilitiesPath = getUtilities();
	if(utilitiesPath)
	{
		eval("#include \"" + utilitiesPath + "Utilities_Container.jsxbin" + "\"");
		eval("#include \"" + utilitiesPath + "Batch_Framework.jsxbin" + "\"");
	}
	else
	{
		alert("Failed to find the utilities..");
		return false;	
	}




	logDest.push(getLogDest());

	//get the components
	var devPath = "~/Desktop/automation/add_artwork/components";
	var prodPath = componentsPath + "add_artwork";
	var componentFiles = includeComponents(devPath,prodPath,true);

	var curPath;
	if(componentFiles)
	{
		for(var f=0;f<componentFiles.length;f++)
		{
			var thisComponent = componentFiles[f].fullName;
			eval("#include \"" + thisComponent + "\"");
		}
	}
	else
	{
		valid = false;
		errorList.push("Failed to find the necessary component files.");
	}

	///////Begin/////////
	///Logic Container///
	/////////////////////




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

		eval("#include \"" + dataPath + "central_library.js\"");
		eval("#include \"" + dataPath + "aa_special_instructions.js\"");

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