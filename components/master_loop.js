/*
	Component Name: master_loop
	Author: William Dowling
	Creation Date: 15 June, 2017
	Description: 
		loop each converted template mockup selected by the user
		and perform the add_artwork functions to each mockup
	Arguments
		garments = array of layers that have been validated as converted templates
	Return value
		success boolean

*/

function masterLoop ( garmentLayers )
{
	var result = true;
	var garLength = garmentLayers.length;
	log.h( "Beginning of masterLoop function. Processing garmentLayers: " + garmentLayers.map( function ( a ) { return a.name; } ).join( ", " ) );

	aaTimer.beginTask( "getData" )

	eval( "#include \"" + dataPath + "central_library.js\"" );

	aaTimer.endTask( "getData" )

	var library = prepressInfo;

	if ( !library )
	{
		log.e( "Failed to identify the central library file::Tried to find central_library.js in the following location:::/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js" )
		errorList.push( "Failed to open the library file. Aborting" )
		valid = false;
	}


	garmentLayers.forEach( function ( curGarLay )
	{
		setActiveArtboard( curGarLay );

		var garCode = getCode( curGarLay.name );
		log.l( "garCode evaluated to: " + garCode );
		var libEntry = library[ garCode ] || library[ garCode.replace( "-", "_" ) ] || library[ garCode.replace( "_", "-" ) ] || undefined;
		if ( !libEntry )
		{
			errorList.push( "Sorry. The garment: " + garCode + " is not in the database. Please let william know about this error." );
			log.e( garCode + " is not in the central_library.js file. Skipping this garment." );
			return;
		}

		//strip out any womens sizing
		if ( libEntry.mockupSize.match( /^w[xsml234]/i ) )
		{
			libEntry.mockupSize = libEntry.mockupSize.replace( /^w/i, "" );
			for ( var size in libEntry.placement )
			{
				if ( size.match( /^w/i ) )
				{
					var newObj = {};
					for ( var prop in libEntry.placement[ size ] )
					{
						newObj[ prop.replace( /^w/i, "" ) ] = libEntry.placement[ size ][ prop ];
					}
					libEntry.placement[ size.replace( /^w/i, "" ) ] = newObj;
					delete libEntry.placement[ size ];
				}
			}
		}

		revealPrepressLayersAndItems( curGarLay );

		//add the artwork to the garment for all sizes
		if ( !loopArtLayers( curGarLay, libEntry ) )
		{
			return;
		}

		var curPpLay = findSpecificLayer( curGarLay, "prepress", "any" );
		if ( !moveArtwork( libEntry, curPpLay ) )
		{
			return;
		}

		var curInfoLay = findSpecificLayer( curGarLay, "info", "any" );
		curInfoLay.layers.add().name = "Prepress Completed";
	} );

	return result;
}