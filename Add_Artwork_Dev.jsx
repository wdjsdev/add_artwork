#target Illustrator
function addArtwork ()
{
	//global variables
	var docRef = app.activeDocument,
		swatches = docRef.swatches,
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


	function getUtilities ()
	{
		var utilNames = [ "Utilities_Container" ]; //array of util names
		var utilFiles = []; //array of util files
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";

		for ( var u = 0; u < utilNames.length; u++ )
		{
			var utilFile = new File( dataResourcePath + utilNames[ u ] + ".jsxbin" );
			if ( utilFile.exists )
			{
				utilFiles.push( utilFile );
			}

		}

		if ( !utilFiles.length )
		{
			alert( "Could not find utilities. Please ensure you're connected to the appropriate Customization drive." );
			return [];
		}


		return utilFiles;

	}
	var utilities = getUtilities();

	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}

	if ( !valid || !utilities.length ) return;


	if ( user === "will.dowling" )
	{
		DEV_LOGGING = true;
	}

	logDest.push( getLogDest() );


	var aaTimer = new Stopwatch();
	aaTimer.logStart();

	aaTimer.beginTask( "Add Artwork" );
	aaTimer.beginTask( "getComponents" );

	//get the components
	var devPath = "~/Desktop/automation/add_artwork/components";
	var prodPath = componentsPath + "add_artwork";
	// var componentFiles = includeComponents(devPath,prodPath,false);
	var componentFiles = getComponents( $.fileName.toLowerCase().indexOf( "dev" ) > -1 ? devPath : prodPath );

	var curPath;
	if ( componentFiles )
	{
		for ( var f = 0; f < componentFiles.length; f++ )
		{
			var thisComponent = componentFiles[ f ].fullName;
			log.l( thisComponent );
			try
			{
				eval( "#include \"" + thisComponent + "\"" );
			}
			catch ( e )
			{
				log.e( "failed to include: " + componentFiles[ f ].name );
			}
		}
	}
	else
	{
		valid = false;
		errorList.push( "Failed to find the necessary component files." );
	}

	aaTimer.endTask( "getComponents" );

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

	aaTimer.beginTask( "getData" )

	eval( "#include \"" + dataPath + "central_library.js\"" );
	eval( "#include \"" + dataPath + "aa_special_instructions.js\"" );

	aaTimer.endTask( "getData" )

	var library = prepressInfo;

	if ( library == undefined )
	{
		log.e( "Failed to identify the central library file::Tried to find central_library.js in the following location:::/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js" )
		errorList.push( "Failed to open the library file. Aborting" )
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
	var mockLay = findSpecificLayer( layers[ 0 ], "Mockup", "any" );
	var paramLay = mockLay ? findSpecificLayer( mockLay, "param", "any" ) : undefined;

	if ( valid )
	{
		if ( !getGarments( layers ) )
		{
			valid = false;
			log.e( "getGarments function failed." );
		}
	}
	if ( valid )
	{
		revealPrepressLayersAndItems();
	}

	if ( valid && paramLay )
	{
		aaTimer.beginTask( "recolorGarment" );
		recolorGarment();
		aaTimer.endTask( "recolorGarment" );
	}

	if ( valid )
	{
		aaTimer.beginTask( "masterLoop" );
		if ( !masterLoop( garments ) )
		{
			valid = false;
			log.e( "masterLoop function failed." );
		}
		aaTimer.endTask( "masterLoop" );
	}

	if ( valid )
	{
		var dupSwatches = [];
		//check to see if there are duplicate swatches
		for ( var x = 0; x < swatches.length; x++ )
		{
			if ( /\sb[\d]$/i.test( swatches[ x ].name ) )
				dupSwatches.push( swatches[ x ].name );
		}
		if ( dupSwatches.length )
		{
			errorList.push( "Don't forget to merge the following duplicate swatches:\n" + dupSwatches.join( "\n" ) );
		}
	}

	if ( valid )
	{
		//if any garment layers were not processed, hide the prepress layer
		hideSuperfluousPrepressLayers();
	}


	if ( errorList.length > 0 )
	{
		sendErrors( errorList );
	}

	aaTimer.endTask( "Add Artwork" );

	printLog();
	return valid;

}
addArtwork();