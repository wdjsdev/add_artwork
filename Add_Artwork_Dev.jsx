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
	#include "~/Desktop/automation/utilities/Utilities_Container.js";
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


	logDest.push(getLogDest());

	//get the components
	var devPath = "~/Desktop/automation/add_artwork/components";
	var prodPath = componentsPath + "add_artwork";
	var componentFiles = includeComponents(devPath,devPath,true);

	if(componentFiles)
	{
		for(var f=0;f<componentFiles.length;f++)
		{
			var thisComponent = componentFiles[f];
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