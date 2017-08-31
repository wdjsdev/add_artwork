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

	Version 5.004
		06 June, 2016
		Fixed generateWearer function that was not properly returning the correct layers
			buttons needed to be created from an outside function, otherwise it's always the last button that ends up being returned
		Built inProgressIndicator function to add or remove in progress indicators
		Built loop to iterate through the curArtLayers array and run function/method with the corresponding name/value from library.js file

	Version 5.005
		06 June, 2016
		Building front logo function.
		Front logo function is working for all front logos.
		Added loop to place all shirt pieces off to the side of the artboard.

	Version 5.006
		07 June, 2016
		Fixed bug in findActiveArtboard function that caused prepresses to stack on top of each other if more than 3 garments.
		Found bug in left chest on full button. investigating.
		Fixed left chest bug and improved error handling.
	
	Version 5.007
		08 June, 2016
		Fixed a few typos and removed logic that allows multiple pieces of art on a cowl.

	Version 5.008
		09 June, 2016
		Found and fixed bug that was causing front number to always be evaluated as "left". This bug would also have caused 
			many problems with the rest of the artwork. the prepress placement loop was inside the for each loop that goes through art layers.
	
	Version 5.009
		14 June, 2016
		Updated artLoc error message to show the name instead of the layer
		included error handling at the very end to see if everything came out good.

	Version 5.010
		23 June 2016
		Updated library file to work for all front numbers and place numbers based on relative position.

	Version 5.011
		27 June 2016
		Added functionality for Additional Art contingency.
			All additional art can be on the same layer, rather than making separate additional art layers for each application
		Currently working to automatically choose destination piece if one or 2 sides intersect.
		Breaks down if art intersects on 3 sides.
			These fixes will be made to library file.
		
		


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
			individual.orientation = "column";

				for(var num = 0;num<wearerLayers.length;num++)
				{
					makeButton(num,wearerLayers[num])
				}

				function makeButton(num,layer)
				{
					indButtons[num] = individual.add("button", undefined, layer.name);
					indButtons[num].onClick = function()
					{
						result.push(layer);
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

	function inProgressIndicator(bool,inProgWearer)
	{
		//Function Description
		//Toggle on/off the IN PROGRESS indicator to let the artist know they must keep undoing
		//args:
			//bool: 
				//true = create indicator. 
				//false = remove indicator. 
			//wearer:
				//the garment layer currently being scripted

		try
		{
			if(bool)
			{
				var indicator = inProgWearer.textFrames.add();
				indicator.name = "inProg";
				indicator.contents = "IN PROGRESS";
				var aB = artboards[artboards.getActiveArtboardIndex()].artboardRect;
				var size = {"width": (aB[2] - aB[0]), "height" : Math.abs(aB[3]-aB[1])};
				indicator.width = size.width;
				indicator.height = size.height;
			}
			else
			{
				var indicator = inProgWearer.textFrames["inProg"];
				indicator.remove();
			}
		}
		catch(e)
		{
			if(bool)
			{
				errorList.push("Failed while adding inProg indicator");
				valid = false;
			}
			else
			{
				errorList.push("Failed while removing inProg indicator");
				valid = false;
			}
		}
	}

	function findActiveArtboard(currentWearer)
	{
		//compare the bounds of a the first piece of art on the mockup layer
		//loop the artboards to find the artboard that contains the piece
		//set activeArtboardIndex to the container artboard
		var success = false;
		var piece = currentWearer.layers["Mockup"].pageItems[0];
		var vB = piece.visibleBounds;
		var pB = {"left": vB[0], "top": vB[1], "right": vB[2], "bot": vB[3]};

		for(var ab=0;ab<artboards.length;ab++)
		{
			var cur = artboards[ab].artboardRect;
			var thisAb = {"left": cur[0], "top": cur[1], "right":cur[2], "bot":cur[3]}
			if(thisAb.left < pB.left && thisAb.top > pB.top && thisAb.right > pB.right && thisAb.bot < pB.bot)
			{
				artboards.setActiveArtboardIndex(ab)
				success = true;
				break;
			}
		}

		if(!success)
		{
			errorList.push(currentWearer.name + ": Failed while trying to set the active artboard");
			valid = false;
			return;
		}

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
		var curArtLayers = [];
		var localErrors = [];
		var artLayers = wearer[a].layers["Artwork Layer"].layers;
		var prepress = wearer[a].layers["Prepress"].layers;
		var code = wearer[a].name.substring(0,wearer[a].name.indexOf("_0"));

		//find artwork layers with art on them
		//push results to curArtLayers array
		for(var b=0;b<artLayers.length;b++)
		{
			var thisLayer = artLayers[b];
			if(thisLayer.pageItems.length == 1 || (thisLayer.pageItems.length > 1 && thisLayer.name.indexOf("Cowl") > -1) || thisLayer.name.indexOf("Additional")>-1)
			{
				curArtLayers.push(thisLayer);
			}
			else if(thisLayer.pageItems.length >1)
			{
				localErrors += wearer[a].name + ": " + thisLayer.name + " has too much artwork\n";
				valid = false;
			}
		}


		//one or more art layers has too much artwork
		if(!valid)
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
		inProgressIndicator(true, wearer[a]);

		try
		{
			wearer[a].layers["Prepress"].visible = true;
		}
		catch(e)
		{
			errorList.push("Failed while unlocking Prepress layer for " + curArtLayers[a].name);
		}

		if(!valid)
		{
			sendErrors(errorList);
			return;
		}

		//correct artboard has been activated
		//inProg indicator has been applied
		//begin adding artwork

		for each(artLoc in curArtLayers)
		{
			//check to make sure the garment code was established
			if(code == undefined)
			{
				errorList.push("Couldn't determine the correct garment info\ncode is undefined");
				valid = false;
				return;
			}

			var gar = library[code];


			if(artLoc.name.indexOf("Additional")>-1)
				var success = addArt["Additional Art"](artLoc.pageItems);
			else
				var success = addArt[artLoc.name](artLoc.pageItems[0]);
			if(!success)
			{
				errorList.push("Failed while trying to add " + artLoc.name);
				sendErrors(errorList);
				valid = false;
				return;
			}

		}

		//Move the artwork
		//SL loop variable is for "size layers"
		for(var SL=0;SL<prepress.length;SL++)
		{
			if(valid)
			{
				var curSize = prepress[SL].name;
				for(var m=0;m<prepress[SL].groupItems.length;m++)
				{
					var thisPiece = prepress[SL].groupItems[m];
					var thisName = thisPiece.name;
					thisPiece.left = library[code].placement[curSize][thisName][0];
					thisPiece.top = library[code].placement[curSize][thisName][1];
				}
			}
			else
			{
				sendErrors(errorList);
				return;
			}
		}

		//no errors adding artwork
		//remove in progress indicator for the current artboard
		// alert('removing in prog indicator');
		inProgressIndicator(false, wearer[a]);
		if(!valid)
		{
			sendErrors(errorList);
			return;
		}
	}


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