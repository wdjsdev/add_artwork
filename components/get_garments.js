/*
	Component Name: Get_Garments
	Author: William Dowling
	Creation Date: 14 June, 2017
	Description: 
		Loop all the layers in the current document and search
		for layers that could be scriptable templates that
		might need artwork added. Verify the layer is a valid
		converted template. Push all valid layers to an array.

		Make a function call to the garmentPrompt component
		to display dialog asking the user which garment they wish to
		add artwork to.

		When the garment(s) have been determined, send the array of
		valid garments to the global garments array.
	Arguments
		layers = docRef.layers array
	Return value
		success boolean

*/

function getGarments ( layers )
{
	log.h( "Beginning of getGarments function." );
	var validGarments = [];
	var selectedGarments = [];

	//loop each layer and determine whether it has the appropriate
	//converted template components such as Artwork Layer and Prepress
	//if true, push to validGarments array

	layers.forEach( function ( curLay, index )
	{
		var ppl = findSpecificLayer( curLay, "Prepress" );
		var il = findSpecificLayer( curLay, "Information" );
		var al = findSpecificLayer( curLay, "Artwork", "any" );
		var cil = il ? findSpecificLayer( il, "Prepress Completed" ) : undefined;
		if ( ppl && al && il && !cil )
		{
			validGarments.push( curLay );
		}
	} )

	//if no valid garments were found, log an error and return false
	//otherwise, if only one valid garment was found, push it to the
	//selectedGarments array and continue
	//otherwise, if multiple valid garments were found, call the
	//garmentPrompt component to display a dialog asking the user
	//which garment they wish to add artwork to.
	//add the selected garment(s) to the selectedGarments array
	//and finally return the array of selected garments
	if ( !validGarments.length )
	{
		log.e( "No valid garments were found in the document." );
		errorList.push( "No valid garments were found in the document.\nCheck for an errant 'Prepress Completed' indicator." );
		return [];
	}
	else if ( validGarments.length === 1 )
	{
		return validGarments;
	}
	else
	{
		selectedGarments = garmentPrompt( validGarments );
	}

	return selectedGarments;


}