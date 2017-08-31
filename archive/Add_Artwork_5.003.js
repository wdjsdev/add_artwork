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

	Version 5.003
		06 June, 2016
		built findActiveArtboard function to activate the corret artboard based on which
			garment is currently being processed
		

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

	function inProgressIndicator(bool,wearer)
	{
		//Function Description
		//Toggle on/off the IN PROGRESS indicator to let the artist know they must keep undoing
		//args:
			//bool: 
				//true = create indicator. 
				//false = remove indicator. 
			//wearer:
				//the garment layer currently being scripted

		if(bool)
		{
			var indicator = wearer.textFrames.add();
			indicator.contents = "IN PROGRESS";
		}
	}

	function findActiveArtboard(wearer)
	{
		//compare the bounds of a the first piece of art on the mockup layer
		//loop the artboards to find the artboard that contains the piece
		//set activeArtboardIndex to the container artboard
		var piece = wearer.layers["Mockup"].pageItems[0];
		var vB = piece.visibleBounds;
		var pB = {"left": vB[0], "top": vB[1], "right": vB[2], "bot": vB[3]};

		for(var ab=0;ab<artboards.length;ab++)
		{
			var cur = artboards[ab].artboardRect;
			var thisAb = {"left": cur[0], "top": cur[1], "right":cur[2], "bot":cur[3]}
			if(thisAb.left < pB.left && thisAb.top > pB.top && thisAb.right > pB.right && thisAb.bot < pB.bot)
			{
				artboards.setActiveArtboardIndex(ab)
			}
		}

		var theText = docRef.textFrames.add();
		theText.contents = "this artboard should be : " + wearer.name;
	}

	function frontLogo(clip,shrink,logo)
	{

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

	//loop layers in wearer array
	for(var a=0;a<wearer.length;a++)
	{
		var localValid = true;
		var curArtLayers = [];
		var localErrors = [];
		var artLayers = wearer[a].layers["Artwork Layer"].layers;

		//find artwork layers with art on them
		//push results to curArtLayers array
		for(var b=0;b<artLayers.length;b++)
		{
			var thisLayer = artLayers[b];
			if(thisLayer.pageItems.length == 1)
			{
				curArtLayers.push(thisLayer.name);
			}
			else if(thisLayer.pageItems.length >1)
			{
				localErrors += wearer[a].name + ": " + thisLayer.name + " has too much artwork\n";
				localValid = false;
			}
		}

		//one or more art layers has too much artwork
		if(!localValid)
		{
			errorList.push(localErrors);
			valid = false;
			sendErrors(errorList);
			return;
		}

		//curArtLayers has been populated
		//no errors, proceed
		//set activeArtboardIndex
		findActiveArtboard(wearer[a]);

	}



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/






}

container();