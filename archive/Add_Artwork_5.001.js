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

	var library = 
	{
		"FD_SLOW" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"pieces" : ["Collar", "Left Sleeve", "Right Sleeve", "Front", "Back"],
			"scaleFrontLogo" : true,
			"placement" : 
			{
				"XS" : {"XS Collar" : [-946.671,622.35],"XS Left Sleeve" : [-194.351,715.67],"XS Right Sleeve" : [-194.351,594.609],"XS Back" : [-448.011,721.26],"XS Front" : [-718.381,721.659]},
				"S" : {"S Collar" : [-948.921,362.97],"S Left Sleeve" : [-197.541,458.19],"S Right Sleeve" : [-197.541,335.319],"S Back" : [-453.541,465.449],"S Front" : [-723.901,465.84]},
				"M" : {"M Collar" : [-951.171,96.539],"M Left Sleeve" : [-200.731,193.359],"M Right Sleeve" : [-200.731,68.979],"M Back" : [-458.921,202.55],"M Front" : [-729.291,202.899]},
				"L" : {"L Collar" : [-953.421,-177.48],"L Left Sleeve" : [-202.961,-78.461],"L Right Sleeve" : [-202.961,-205.28],"L Back" : [-464.311,-67.771],"L Front" : [-734.681,-67.421]},
				"XL" : {"XL Collar" : [-955.221,-458.711],"XL Left Sleeve" : [-205.691,-357.86],"XL Right Sleeve" : [-205.691,-486.771],"XL Back" : [-469.771,-345.471],"XL Front" : [-740.061,-345.141]},
				"2XL" : {"2XL Collar" : [-957.921,-747.111],"2XL Left Sleeve" : [-209.061,-644.611],"2XL Right Sleeve" : [-209.061,-775.031],"2XL Back" : [-475.081,-630.181],"2XL Front" : [-745.451,-629.88]},
				"3XL" : {"3XL Collar" : [-960.171,-1042.73],"3XL Left Sleeve" : [-211.781,-938.281],"3XL Right Sleeve" : [-211.781,-1070.65],"3XL Back" : [-480.461,-922.261],"3XL Front" : [-750.841,-921.951]},
				"4XL" : {"4XL Collar" : [-962.421,-1345.42],"4XL Left Sleeve" : [-214.901,-1239.521],"4XL Right Sleeve" : [-214.901,-1373.14],"4XL Back" : [-485.991,-1221.381],"4XL Front" : [-756.361,-1221.101]},
				"5XL" : {"5XL Collar" : [-964.671,-1654.82],"5XL Left Sleeve" : [-218.041,-1546.841],"5XL Right Sleeve" : [-218.041,-1682.9],"5XL Back" : [-491.381,-1527.101],"5XL Front" : [-761.751,-1526.81]}
			}
		},
		"FD_5411" :
		{
			"mockupSize" : "XL",
			"sizes" : ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			"artLayers" : ["Front Logo", "Front Number", "Player Name", "Back Number", "Right Sleeve", "Left Sleeve", "Right Cowl", "Left Cowl", "Sponser Logo", "Additional Art"],
			"pieces" : ["Front", "Left Cuff", "Right Cuff", "Back", "Collar", "Left Side Panel", "Right Side Panel", "Left Sleeve", "Outside Cowl", "Right Sleeve", "Inside Cowl"],
			"scaleFrontLogo" : false,
			"placement" : 
			{
				"S" : {"S Inside Cowl" : [225.809,199.65],"S Right Sleeve" : [274.823,-124.919],"S Outside Cowl" : [37.614,-317.605],"S Left Sleeve" : [274.811,-209.032],"S Right Side Panel" : [476.893,292.279],"S Left Side Panel" : [136.916,292.279],"S Collar" : [223.589,237.73],"S Back" : [430.864,-51.791],"S Right Cuff" : [260.789,274.13],"S Left Cuff" : [261.085,319.97],"S Front" : [44.465,-52.051]},
				"M" : {"M Inside Cowl" : [222.209,199.617],"M Right Sleeve" : [274.823,-124.919],"M Outside Cowl" : [34.014,-317.605],"M Left Sleeve" : [274.811,-209.032],"M Right Side Panel" : [476.892,296.017],"M Left Side Panel" : [136.916,296.017],"M Collar" : [223.761,237.73],"M Back" : [426.886,-51.791],"M Right Cuff" : [261.078,274.13],"M Left Cuff" : [261.023,319.97],"M Front" : [40.483,-52.051]},
				"L" : {"L Inside Cowl" : [218.609,199.617],"L Right Sleeve" : [274.823,-124.919],"L Outside Cowl" : [30.414,-317.605],"L Left Sleeve" : [274.811,-209.032],"L Right Side Panel" : [476.892,299.535],"L Left Side Panel" : [136.916,299.535],"L Collar" : [223.723,237.73],"L Back" : [422.074,-51.791],"L Right Cuff" : [260.628,274.13],"L Left Cuff" : [260.79,319.97],"L Front" : [35.674,-52.051]},
				"XL" : {"XL Inside Cowl" : [215.009,199.617],"XL Right Sleeve" : [274.823,-124.919],"XL Outside Cowl" : [26.814,-317.605],"XL Left Sleeve" : [274.811,-209.032],"XL Right Side Panel" : [476.893,303.216],"XL Left Side Panel" : [136.916,303.216],"XL Collar" : [223.799,237.729],"XL Back" : [416.513,-51.791],"XL Right Cuff" : [260.762,274.13],"XL Left Cuff" : [261.029,319.971],"XL Front" : [30.113,-52.051]},
				"2XL" : {"2XL Inside Cowl" : [211.409,199.579],"2XL Right Sleeve" : [274.823,-124.919],"2XL Outside Cowl" : [23.214,-317.605],"2XL Left Sleeve" : [274.811,-209.032],"2XL Right Side Panel" : [476.892,306.839],"2XL Left Side Panel" : [136.916,306.839],"2XL Collar" : [223.607,237.729],"2XL Back" : [410.616,-51.791],"2XL Right Cuff" : [261.233,274.13],"2XL Left Cuff" : [261.233,319.97],"2XL Front" : [24.221,-52.051]},
				"3XL" : {"3XL Inside Cowl" : [207.809,199.701],"3XL Right Sleeve" : [274.824,-124.919],"3XL Outside Cowl" : [19.615,-317.236],"3XL Left Sleeve" : [274.811,-209.032],"3XL Right Side Panel" : [476.892,310.24],"3XL Left Side Panel" : [136.916,310.24],"3XL Collar" : [223.662,237.73],"3XL Back" : [407.425,-51.791],"3XL Right Cuff" : [260.437,274.13],"3XL Left Cuff" : [260.467,319.97],"3XL Front" : [21.027,-52.051]},
				"4XL" : {"4XL Inside Cowl" : [204.209,199.579],"4XL Right Sleeve" : [274.823,-124.919],"4XL Outside Cowl" : [16.014,-317.605],"4XL Left Sleeve" : [274.811,-209.032],"4XL Right Side Panel" : [476.892,316.471],"4XL Left Side Panel" : [136.916,316.471],"4XL Collar" : [223.567,237.73],"4XL Back" : [402.915,-51.791],"4XL Right Cuff" : [260.785,274.13],"4XL Left Cuff" : [260.71,319.971],"4XL Front" : [16.516,-52.051]},
				"5XL" : {"5XL Inside Cowl" : [200.609,199.579],"5XL Right Sleeve" : [274.825,-124.919],"5XL Outside Cowl" : [12.414,-317.604],"5XL Left Sleeve" : [274.818,-209.028],"5XL Right Side Panel" : [476.892,318.793],"5XL Left Side Panel" : [136.916,318.793],"5XL Collar" : [223.365,237.729],"5XL Back" : [398.569,-51.791],"5XL Right Cuff" : [260.614,274.13],"5XL Left Cuff" : [260.94,319.97],"5XL Front" : [12.17,-52.051]}
			}
		}
	}


	////////End/////////
	////Data Storage////
	////////////////////

	/*****************************************************************************/

	///////Begin////////
	///Function Calls///
	////////////////////

	//Script Global Variables
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var artboards = docRef.artboards;
	var valid = true;

	var errorList = [];

	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;


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