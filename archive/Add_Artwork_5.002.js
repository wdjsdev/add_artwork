/*

Script Name: Add Artwork 5.0
Author : William Dowling
Description: Rebuilt from v4.0 to maximize efficiency and reliability. Use more thorough object oriented data storage to avoid issues of incorrect index position.
Build Date: 03 June, 2016


Version History:
	
	Version 5.001
		03 June, 2016
		Initial Build and setting up layout
		Built generateWearer function and sendErrors function

	Version 5.002
		03 June, 2016
		Added more info to library object
		Moved library object to an external file to keep code clean and readable.
		Tested and working to generate wearer information

*/

function container()
{
	
	/*****************************************************************************/

	///////Begin/////////
	///Logic Container///
	/////////////////////


	function sendErrors(errors)
	{
		var allErrors = "The Following Errors Occurred:\n";
		for each(e in errors)
		{
			allErrors += e + '\n';
		}
		alert(allErrors);
	}

	function generateWearer()
	{
		//Function description:
		//Look at top level layers and determine for which layers to add artwork.
		//Loop layers to determine scriptable layers. push to array
		//Prompt with scriptUI whether to automatically make all prepresses or pick one individually.

		//Return an array of layers

		//array of scriptable layers
		var wearerLayers = [];
		var result = [];
		var indButtons = [];

		//populate wearerLayers
		for(var a=0;a<layers.length;a++)
		{
			if(layers[a].name.indexOf("FD")>-1)
			{
				wearerLayers.push(layers[a]);
			}
		}

		//begin prompt to ask which layers for add artwork
		var w = new Window("dialog", "Which Prepress Do You Want To Generate?");


			//all the things button
			var all = w.add("group");
				var img = "/Volumes/Customization/Library/Scripts/Script Resources/Images/all.jpg";
				var allButton = all.add("iconButton", undefined, img);
				allButton.onClick = function()
				{
					result = wearerLayers;
					w.close();
				}


			//group of buttons to generate an individual prepress
			var individual = w.add("group");
				
				for each(a in wearerLayers)
				{
					indButtons[a] = individual.add("button", undefined, a.name)
					indButtons[a].onClick = function()
					{
						result.push(a);
						w.close();
					}
				}
		//if more than 1 scriptable layer, call prompt.
		if(wearerLayers.length>1)
		{
			w.show();
		}

		//if only 1 scriptable layer
		else if(wearerLayers.length == 1)
		{
			result = wearerLayers;
		}

		//no scriptable layers
		else
		{
			errorList.push("There doesn't seem to be any scriptable templates here..");
			valid = false;
			result = null;
		}


		return result;
	}





	////////End//////////
	///Logic Container///
	/////////////////////

	/*****************************************************************************/

	///////Begin////////
	////Data Storage////
	////////////////////

	//local storage
	//for testing and development only
	#include "/Users/will.dowling/Desktop/In Progress/zzzzz~OLD/Automation/Javascript/_New CAD Workflow/Add_Artwork/Data/library.js";

	//network storage
	//for production version of script
	//#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/library.js";


	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	
	///////////////////////////
	//Script Global Variables//
	///////////////////////////
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var artboards = docRef.artboards;
	var valid = true;

	var errorList = [];

	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;


	///////Begin////////
	///Function Calls///
	////////////////////

	//determine layer(s) for which to create prepresses
	var wearer = generateWearer();
	if(!valid)
	{
		sendErrors(errorList);
		return;
	}



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/






}

container();