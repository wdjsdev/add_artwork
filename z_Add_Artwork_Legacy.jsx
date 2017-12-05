/*

Script Name: Add Artwork 6.0
Author : William Dowling
Description: Rebuilt from v4.0 to maximize efficiency and reliability. Use more thorough object oriented data storage to avoid issues of incorrect index position.
Build Date: 03 June, 2016


Version History:
	Version 5
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

		Version 5.012		
			06 July, 2016
			Added logic to determine regular or raglan slowpitch for proper prepress placement coordinates
			Added logic to handle football jerseys, specifically rotating cowl piece when placing prepress

		Version 5.013
			07 July, 2016
			Added prepress completed indicator
			Added logic to check for a prepress completed indicator before performing any add artwork functions.
			Unlocks Artwork Layer before beginning script execution.

		Version 5.014
			13 July, 2016
			Updated findActiveArtboard function to look for items on the information layer rather than the mockup layer
				User had uncovered a bug where the first item in the mockup layer could be off the artboard resulting in
				an error because the function returns false.

		Version 5.015
			18 July, 2016
			Removed some redundancy by moving the gar variable defiinition outside the artwork layers loop.

		Version 5.016
			06 September, 2016
			Improved error handling and added an exit door if the current template does not have a library entry.

		Version 5.017
			06 September, 2016
			Fixed bug in automatic artboard finder.
				In some occassions the function would check the position of some art that wasn't on the artboard (NFHS requirements in volleyball) and
				the script would fail because the art didn't match any artboard.

		Version 5.018
			14 September, 2016
			Changed path of local/development version of "Library.js"

		Version 5.019
			14 October, 2016
			Experimenting with detailed log file generation.

		Version 5.020
			17 October, 2016
			Continuing logging experimentation.
		
	Version 6

		Version 6.001
			18 October, 2016
			Adding detailed logging
			Logging complete up through generateWearer function.
		
		Version 6.002
			19 October, 2016
			Continued adding detailed logging.
			Logging complete up through front logo adding.

		Version 6.003
			21 October, 2016
			Continued refining logging procedure.

		Version 6.004
			26 October, 2016
			More refining of logging procedure.

		Version 6.005
			14 October, 2016
			Added conditional include statements for cross platform use of library files

		Version 6.006
			12 December, 2016
			Removed logLayerStructure function.
			Added proper handling of non-temp layers.	
				non-converted-garments that were merged into the document via mergeTemplates will have
				'non-temp_' at the beginning of the layer name. These layers will be ignored when
				garment list is populated.

		Version 6.007
			17 January, 2017
			Adding condition to allow for artwork placement on ps pants
	
		Version 6.008
			15 February, 2017
			Adding the ability to turn off scaling of front logo
				this will function just like the additional artwork no scale
		


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



		log.h("Looping docRef.layers to determine template layers::Checking " + layers.length + " layers.");
		//populate wearerLayers
		for(var a=0;a<layers.length;a++)
		{
			log.l("Checking layer: " + a);
			log.L("this layer.name = " + layers[a].name);
			if(layers[a].name.indexOf("FD")>-1 || layers[a].name.indexOf("PS") > -1 && layers[a].name.indexOf("non-temp_") == -1)
			{
				wearerLayers.push(layers[a]);
				log.L("pushed " + layers[a].name + " to wearerLayers array");
			}
		}

		log.h("Finished looping layers.::wearerLayers array =::" + wearerLayers);

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
			log.l("There are " + wearerLayers.length + " scriptable templates in the document.::Running prompt window to determine which to add artwork to.");
			w.show();
		}

		//if only 1 scriptable layer
		else if(wearerLayers.length == 1)
		{
			log.l("There is only 1 scriptable template in the document.::result = " + wearerLayers[0].name);
			result = wearerLayers;
		}

		//no scriptable layers
		else
		{
			log.e("There are no scriptable templates in the document.");
			errorList.push("There doesn't seem to be any scriptable templates here..");
			valid = false;
			result = null;
		}


		log.L("returning \"result\" which is: " + result);
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
		var piece = currentWearer.layers["Information"].pageItems["Order Number"];
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

	function isRegOrRag(wearer,code)
	{
		var result;
		if(code.indexOf("SLOW")>-1)
		{
			var info = wearer.layers["Information"];
			for(var IL=0;IL<info.layers.length;IL++)
			{
				var curLay = info.layers[IL];
				if(curLay.name.indexOf("Regular")>-1)
				{
					result = "Regular";
					break;
				}
				else if(curLay.name.indexOf("Raglan")>-1)
				{
					result = "Raglan";
					break;
				}


			}
		}
		return result;
	}

	function completedIndicator(task, wearer)
	{
		var result = false;
		var info = wearer.layers["Information"];
		if(task == "check")
		{
			
			for(var CI=0; CI<info.layers.length;CI++)
			{
				var curLay = info.layers[CI];
				if(curLay.name == "Prepress Completed")
				{
					result = true;
					break;
				}
			}
		}
		else if(task == "add")
		{
			var indicator = info.layers.add();
			indicator.name = "Prepress Completed";
			result = true;
		}
		return result;
	}

	// function getCode(layer)
	// {
	// 	var code;
	// 	var layName = layer.name;
	// 	var lastUnder = layName.substring(layName.lastIndexOf("_")+ 1,layName.length+1);
	// 	var isInt = parseInt(lastUnder);
	// 	if(isInt > -1)
	// 	{
	// 		code = layName.substring(0,layName.lastIndexOf("_"));
			
	// 	}

	// 	//deprecated this block because anything that would be caught by this block should already have been caught in the previous if statement.
	// 	//Additionally the possibility of a gamrent code that begins with 0 could pose a problem with this approach.
	// 	// else if(layName.indexOf("_0")>-1)
	// 	// {
	// 	// 	code = layName.substring(0,layName.indexOf("_0"));
	// 	// }

	// 	else
	// 	{
	// 		layName = layName.substring(0,layName.lastIndexOf("_"))
	// 		code = layName.substring(0,layName.lastIndexOf("_"));	
	// 	}
	// 	return code;
	// }




	////////End//////////
	///Logic Container///
	///////////////////

	/*****************************************************************************/

	/////Begin////////
	////Data Storage////
	////////////////////

	//network storage

	if($.os.match('Windows')){
		//PC
		eval("#include \"N:\\Library\\Scripts\\Script Resources\\Data\\library.js\"");
		eval("#include \"N:\\Library\\Scripts\\Script Resources\\Data\\central_library.js\"");
		eval("#include \"N:\\Library\\Scripts\\Script Resources\\Data\\Utilities_Container.jsxbin\"");
		
	} else {
		// MAC
		eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/library.js\"");
		eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js\"");
		eval("#include \"/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.jsxbin\"");
	}



	// //Try/Catch Description:
	// //include library files
	// }
	// try
	// {
	// 	#include "N:\\Library\\Scripts\\Script Resources\\Data\\library.js"
	// 	#include "N:\\Library\\Scripts\\Script Resources\\Data\\central_library.js";
	// 	#include "N:\\Library\\Scripts\\Script Resources\\Data\\Utilities_Container.js";
	// }
	// catch(e)
	// {
	// 	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/library.js"
	// 	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js";
	// 	#include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";
	// }
	
	
	

	//local storage
	//for testing and development only
	// #include "/Users/will.dowling/Desktop/automation/javascript/_new_cad_workflow/add_artwork/Data/library_2.002.js";
	// #include "/Users/will.dowling/Desktop/automation/javascript/_new_cad_workflow/central_library/central_library.js"
	// #include "~/Desktop/automation/javascript/utilities/Utilities_Container.js";



	var library = prepressInfo;

	if(library == undefined)
	{
		log.e("Failed to identify the central library file::Tried to find central_library.js in the following location:::/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js")
		errorList.push("Failed to open the library file. Aborting")
		sendErrors(errorList);
		return false;
	}



	

	// #include "~/Desktop/automation/javascript/utilities/Utilities_Container.js";


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
	var versionNum = "6.001";

	var errorList = [];

	log.h("User = " + user + "::Begin Script Execution::Add_Artwork v " + versionNum);
	log.h("**********::Begin global variable definition log::***********");
	log.l("docRef.name = " + docRef.name);
	log.l("layers.length = " + layers.length);
	for(var dl=0;dl<layers.length;dl++)
	{
		var thisLay = layers[dl];
		log.l("Layer " + dl + ".name = " + thisLay.name);
		log.l("Layer " + dl + ".locked = " + thisLay.locked);
		log.l("Layer " + dl + ".visible = " + thisLay.visible);

	}
	log.h("**********::End global variable definition log::***********");





	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;


	///////Begin////////
	///Function Calls///
	////////////////////

	

	//determine layer(s) for which to create prepresses

	log.h("generateWearer()");
	var wearer = generateWearer();
	log.l("generateWearer function finished::valid = " + valid);

	// logLayerStructure(wearer);

	if(!valid)
	{
		log.e("!valid after running generateWearer function");
		sendErrors(errorList);
		printLog();
		return;
	}
	log.l("wearer = " + wearer)



	//loop layers in wearer array
	for(var a=0;a<wearer.length;a++)
	{
		placedLogos = {}
		log.h("Begin logging placedLogos contents: ::")
		log.h("Looping wearers array.::Current wearer = " + wearer[a].name);
		if(completedIndicator("check", wearer[a]))
		{
			log.l(wearer[a].name + " has a completed indicator. Skipping this garment.")
			continue;
		}
		log.l("No completed indicator detected. Proceeding to add artwork to " + wearer[a].name);
		var curArtLayers = [];
		var localErrors = [];
		var artLayers = wearer[a].layers["Artwork Layer"].layers;
		var prepress = wearer[a].layers["Prepress"].layers;
		var code = getCode(wearer[a].name);
		var regRag = isRegOrRag(wearer[a],code);

		log.l("library[code] = " + library[code])
		if(library[code] == undefined)
		{
			log.e("Garment " + code + ": has not yet been added to the library.");
			alert("Woops. This garment hasn't been added yet.\n" + code);
			printLog();
			return;
		}

		try
		{
			wearer[a].layers["Artwork Layer"].locked = false;
			wearer[a].layers["Prepress"].locked = false;
			wearer[a].layers["Prepress"].visible = true;
		}
		catch(e)
		{
			errorList.push("Failed while unlocking Artwork Layer\nThis is probably an MRAP issue. Try Restarting Illustrator");
			valid = false;
		}

		if(!valid)
		{
			sendErrors(errorList);
			printLog();
			return;
		}
		//find artwork layers with art on them
		//push results to curArtLayers array
		for(var b=0;b<artLayers.length;b++)
		{
			var thisLayer = artLayers[b];
			if(thisLayer.pageItems.length == 1 || (thisLayer.pageItems.length > 1 && thisLayer.name.indexOf("Cowl") > -1) || (thisLayer.pageItems.length > 0 && thisLayer.name.indexOf("Additional")>-1))
			{
				curArtLayers.push(thisLayer);
			}
			else if(thisLayer.pageItems.length >1)
			{
				localErrors += wearer[a].name + ": " + thisLayer.name + " has too much artwork\n";
				valid = false;
			}
		}

		log.l("curArtLayers = " + curArtLayers);


		//one or more art layers has too much artwork
		if(!valid)
		{
			log.e("localErrors = " + localErrors);
			errorList.push(localErrors);
			valid = false;
			sendErrors(errorList);
			printLog();
			return;
		}

		//curArtLayers has been populated
		//no errors, proceed
		//set activeArtboardIndex
		findActiveArtboard(wearer[a]);
		inProgressIndicator(true, wearer[a]);

		try
		{
			log.l("wearer[a].layers[\"Prepress\"].visible = " + wearer[a].layers["Prepress"].visible)
			wearer[a].layers["Prepress"].visible = true;
			log.l("after setting visibility to false: wearer[a].layers[\"Prepress\"].visible = " + wearer[a].layers["Prepress"].visible)
		}
		catch(e)
		{
			log.e("Failed to unhide prepress layer for " + wearer[a].name + "::System error code: " + e);
			errorList.push("Failed while unlocking Prepress layer for " + curArtLayers[a].name);
		}

		//correct artboard has been activated
		//inProg indicator has been applied
		//begin adding artwork

		var gar = library[code];

		for each(artLoc in curArtLayers)
		{
			//check to make sure the garment code was established
			if(code == undefined)
			{
				errorList.push("Couldn't determine the correct garment info\ncode is undefined");
				valid = false;
				return;
			}


			if(artLoc.name.indexOf("Additional")>-1)
			{
				var success = addArt["Additional Art"](artLoc.pageItems);
			}
			else if(artLoc.name.indexOf("Front Logo")>-1 && (artLoc.name.indexOf("_n")>-1 || artLoc.name.indexOf(" n")>-1 || artLoc.name.indexOf("-n")>-1))
			{
				//do not scale the front logo
				var success = addArt["Front Logo"](artLoc.pageItems[0],false)
			}
			else
			{
				if(library[code]["pantsSizing"] != undefined)
				{
					var success = addArt[artLoc.name](artLoc.pageItems[0], true);
				}
				else
				{
					var success = addArt[artLoc.name](artLoc.pageItems[0]);
				}
			}
			if(!success)
			{
				errorList.push("Failed while trying to add " + artLoc.name);
				sendErrors(errorList);
				valid = false;
				printLog();
				return;
			}

		}



		if(!valid)
		{
			sendErrors(errorList);
			return;
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
					if(regRag!= undefined)
					{
						thisPiece.left = library[code].placement[regRag][curSize][thisName][0];
						thisPiece.top = library[code].placement[regRag][curSize][thisName][1];
					}
					else
					{
						thisPiece.left = library[code].placement[curSize][thisName][0];
						thisPiece.top = library[code].placement[curSize][thisName][1];
					}
					if(library[code].rotate != undefined && thisName.indexOf("Outside Cowl")>-1)
					{
						thisPiece.rotate(180);
					}
				}
			}
			else
			{
				sendErrors(errorList);
				return;
			}
		}

		//no errors adding artwork
		//mark this prepress as having been previously created
		//so that it will be ignored on future executions
		completedIndicator("add", wearer[a]);	

		//remove in progress indicator for the current artboard
		inProgressIndicator(false, wearer[a]);
		if(!valid)
		{
			sendErrors(errorList);
			return;
		}
	}


	printLog();
	


	if(!valid)
	{
		sendErrors(errorList);
	}

	return;




	



	////////End/////////
	///Function Calls///
	////////////////////

	/*****************************************************************************/






}

container();