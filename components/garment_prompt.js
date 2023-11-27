/*
	Component Name: garment_prompt
	Author: William Dowling
	Creation Date: 14 June, 2017
	Description: 
		Prompt the user to select one or all of the valid garments 
		on which to execute the add artwork script 
	Arguments
		validGarments = array of validated script template layers
	Return value
		array of garments
*/

function garmentPrompt ( garLayers )
{
	var result = [];
	var indButtons = [];

	var w = new Window( "dialog", "Which garments do you want to process?" );

	//all the things button
	var allButton = w.add( "group" );
	var img = resourcePath + "Images/all.jpg";
	var allButton = ( File( img ).exists ) ? allButton.add( "iconButton", undefined, img ) : allButton.add( "button", undefined, "All" );

	allButton.onClick = function ()
	{
		result = garLayers;
		w.close();
	}


	//group of buttons to generate an individual prepress
	var individual = w.add( "group" );
	individual.orientation = "column";

	for ( var num = 0; num < garLayers.length; num++ )
	{
		makeButton( num, garLayers[ num ] )
	}

	function makeButton ( num, layer )
	{
		indButtons[ num ] = individual.add( "button", undefined, layer.name );
		indButtons[ num ].onClick = function ()
		{
			result.push( layer );
			w.close();
		}
	}
	w.show();


	return result;
}