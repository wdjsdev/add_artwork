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
		mockupLayer,
		paramLayer,
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

	function getUtilities()
	{
		var result = [];
		var utilPath = "/Volumes/Customization/Library/Scripts/Script_Resources/Data/";
		var ext = ".jsxbin"

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if(devUtilitiesPreferenceFile.exists)
		{
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();
			if(prefContents === "true")
			{
				utilPath = "~/Desktop/automation/utilities/";
				ext = ".js";
			}
		}

		if($.os.match("Windows"))
		{
			utilPath = utilPath.replace("/Volumes/","//AD4/");
		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);

		if(!result.length)
		{
			valid = false;
			alert("Failed to find the utilities.");
		}
		return result;

	}

	var utilities = getUtilities();
	for(var u=0,len=utilities.length;u<len;u++)
	{
		eval("#include \"" + utilities[u] + "\"");	
	}

	if(!valid)return;


	if(user === "will.dowling")
	{
		DEV_LOGGING = true;
	}

	logDest.push(getLogDest());

	

	//get the components
	var devPath = "~/Desktop/automation/add_artwork/components";
	var prodPath = componentsPath + "add_artwork";
	var componentFiles = includeComponents(devPath,prodPath,false);

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

	//find the mockup layer and paramcolors layer
	var mockLay = findSpecificLayer(layers[0],"Mockup","any");
	var paramLay = mockLay ? findSpecificLayer(mockLay,"param","any") : undefined;

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

	if(valid && paramLay)
	{

		//here's a set of users who are testing
		//the functionality. if the current user
		//is in this list, prompt them for whether 
		//they want to use it.
		var testUsers = ["will.dowling","mark.foust","austin.clark","doug.french","aimee.myhre"];
		var userPref = false;
		if(testUsers.indexOf(user.toLowerCase())>-1)
		{
			var w = new Window("dialog");
				var msg = UI.static(w,"Do you want to automatically recolor the prepress?");
				var btnGroup = UI.group(w);
					var noBtn = UI.button(btnGroup,"No",function()
					{
						userPref = false
						w.close();
					})
					var yesBtn = UI.button(btnGroup,"Yes",function()
					{
						userPref = true;
						w.close();
					})
			w.show();
		}

		if(userPref)
		{
			recolorGarment();
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