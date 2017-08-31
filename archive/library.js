/*

Library and Data Storage for Add_Artwork_5.0

Author: William Dowling
Build Date: 06 June, 2016

Version History:
	Version 1
		Version 1.001
			06 June, 2016
			Original Build
			Setup Library object and necessary key value pairs
			Began work on front logo function.
			Currently working for regular full chest logos.
			Need to adjust left/right chest logo functions

		Version 1.002
			07 June, 2016
			Fixed issue with variable names in left/right chest logo functions
			Currently working for all front logos on slowpitch shirts

		Version 1.003
			07 June, 2016
			Updated script UI appearance and text to be more descriptive.
			Added FD_BASE_FB_SS to library object.
		
		Version 1.004
			07 June, 2016
			Fixed bug in clip mask function that was causing the clip path to be too large.
			Found bug in left chest with full button garment. see ATTENTION below.

		Version 1.005
			08 June, 2016
			Fixed Bug in left/right chest function. typo in 'sideString' variable.
			Added function to automatically find position of front number (left right or center)
				Needs additional logic to work for full button jerseys
			Still not working to correctly determine front number position. always says "left".

		Version 1.006
			09 June, 2016
			Found and fixed bug causing front number to always be listed as "left".

		Version 1.007
			14 June, 2016
			Reworked front number function to accomodate a scaling logo.
			Currently doesn't work because front logo sizes aren't defined at runtime without app.redraw();
				Going to prototype gar object to include the smallest and next smallest logo sizes so i can get vertical movement.

		Version 1.008
			14 June, 2016
			Total bust trying to correctly position front number.
			Reverting back to 1.006 to proceed.

		Version 1.009
			16 June, 2016
			Create new object to hold front logo sizes and the bottom coordinate of each size front logo.
				Then i can use the bottom of the logo to place the top of the number.
			Currently working for consistent vertical positioning.
			Still need to adjust left/right movement

		Version 1.010
			16 June, 2016
			Fixed Front number positioning if front number is on wearer's left side. Doesn't work for the right side yet... ??
			Found bug that caused front number to always be placed as though they were left front numbers.
			Script currently works to add front logos and front numbers (in any position) to FD_SLOW and FD_BASE_FB_SS shirts.
			Still needs logic built for no logo contingency.

		Version 1.011
			24 June, 2016
			Added logic for no logo. Currently works well on mens slowpitch and base full button
			Built the following add art functions:
				Player Name
				Player Number
				Left Sleeve
				Right Sleeve
				Locker Tag
				Sponsor Logo
				Left Hood
				Right Hood
				Front Pocket
			All above are tested and working.
			Began writing logic for additional artwork.
				Attempting to automatically determine the correct dest for each piece of additional art.

		Version 1.012
			27 June, 2016
			Added logic to automatically determine correct destination piece.
			Works if logo is:
				completely contained within the shirt piece
				interesects 1 side of shrit piece
				intersects 2 adjacent sides of shirt piece
			****
			DOES NOT WORK if
			***
				intersects with 2 opposite sides of shirt piece
				logo completely encases shirt piece
			Fixed scaling and positioning. Positioning is not yet perfect, but it will do for now.
			
		Version 1.013
			05 July, 2016
			Added logic to account for 3+ sides of intersection for additional artwork
			Relative placement of additional artwork after scaling is still imperfect.
				Putting a pin in this for now. Logic needs to be much more robust. It'll do for now, the way it is.

		Version 1.014
			05 July, 2016
			Begin adding to library object for new styles
				womens slowpitch
			fixed bugs regarding scaling hoodie logos.
			Added additional logic to handle regular/raglan artwork placement
			Added youth slowpitch object.

		Version 1.015
			06 July, 2016
			Updated football 5411 placement coordinates
			Added logic to determine whether player name goes on back piece or cowl piece (based on whether the garment is football or not).
			Currently working for all garments in library object.
			Just need to keep adding garments and coordinates.

		Version 1.016
			07 July, 2016
			Added football style 250 to library.
			Added fast_fb_ss to library.
			Added fast_fb_sl to library.
			Added fdwh to library
			added base_fb_sl to library

		Version 1.017
			08 July, 2016
			Added youth football 250 to library.
			Fixed bug in youth 250 object. Sizes and Mockup Size were listed as adult sizes
			Added youth football 5411 to library

		Version 1.018
			14 July, 2016
			Added FD_BASK_RV to library
			Added FD_BASKW_RV to library

		Version 1.019
			19 July, 2016
			Added FD_BASE_2B_SS to library
			Added FD_BASE_2B_Y_SS to library
			Added FD_FAST_2B_SS to library
			Added FD_FAST_RB to library
			Added FD_FAST_SL to library
			Added FDYH to library

		Version 1.020
			20 July, 2016
			Added FD_BASKY_RV to library

		Version 1.021
			26 July, 2016
			Added logic to reposition front logo to logoTop so that logos follow 1/4" rule
			Added FD_SOC_SS to library
				Styles:
					858, 3061, 3062, 3064
					858Y, 3061Y, 3062Y, 3064Y 

		Version 1.022
			27 July, 2016
			Added FD_SOC_LSK to library
				Adult and youth

		Version 1.023
			28 July, 2016
			Added FD_SOC_SH to library
				Adult and youth
			Added FD_VOL_CS // FD_284 to library
			Updated FD_SOC_LSK to acccomodate duplicate of elbow patch/liner

		Version 1.024
			03 Aug, 2016
			Fixed issue with front number position finder.
				increased buffer to accomodate a larger front number, for example, football jerseys that have much larger front numbers
				and potentially "weird" baseline shifts.
			Fixed bug in additional artwork.
				If there was more than 1 object on the additional artwork layer, the loop exited the function before the loop could run
				the requisite number of times. 

		Version 1.025
			08 Aug, 2016
			Added functionality for no scale additional art contingency.
				instructions: add "no scale" (lowercase with a space) to the Additional Artwork layer name.

		Version 1.026
			25 Aug, 2016
			Added missing XXS placement information for women's hoodies per Mark F's bug report.

		Version 1.027
			29 Aug, 2016
			Added FD_285 (long sleeve volleyball) to library
			Added FD_210_211 (mens basketball uniform) to library

		Version 1.028
			30 Aug, 2016
			Added FD_210W_211W (women's basketball uniform) to library

		Version 1.029
			06 Sept, 2016
			Added FD_210Y_211W (youth basketball uniform) to library.

		Version 1.030
			08 Sept, 2016
			Fixed bug in full button portion of front logo function.
				Left side front logo was not being repositioned, but the right side logo was. stupid.

		Version 1.031
			08 Sept, 2016
			Added FD_BASE_FB_Y to library.

		Version 1.032
			21 Sept, 2016
			Updated volleyball uniforms.
				set scaleFrontLogo : false

		Version 1.033
			23 Sept, 2016
			Added FD_BASE_FB_Y_SL to library

		Version 1.034
			28 Sept, 2016
			Added 'binding pieces' to FD_250 
			
		Version 1.035
			28 Sept, 2016
			Added 'binding pieces' to FD_5411

		Version 1.036
			04 Oct, 2016
			Added 'binding pieces' and new sizes to FD_5411Y and 250Y

		Version 1.037
			05 Oct, 2016
			Added FD_7025 to library
			Added function to place artwork on outside collar pieces for FD_7025

		Version 1.038
			06 Oct, 2016
			Added FD_597 to library

		Version 1.039
			11 Oct, 2016
			Added no-scale option to additional artwork function.

		Version 1.040
			12 Oct, 2016
			Fixing bug in full button front number placement

	Version 2

		Version 2.001
			18 October, 2016
			Added centralized library file and removed library object from this file.
				Keeping coordinates separate from add art methods.
			Adding detailed error logging.

		Version 2.002
			19 October, 2016
			Continuing to add error logging messages.
			Detailed logging nearly complete for addArt["Front Logo"].

		Version 2.004
			10 November, 2016
			Fixing front number function in the case of a no scale front logo.

		Version 2.005
			7 November, 2016
			Adding bag tag add art functions
			Bag tag functions complete and tested.

		Version 2.006
			22 December, 2016
			Adding function to automatically determine how much to scale logo down to get to the smallest size
				This removes the dependency of adding a 

		Version 2.007
			27 December, 2016
			Changing destination piece of locker tag to cowl/yoke piece for lacrosse inset jerseys instead of "Back" piece.

		Version 2.008
			30 December, 2016
			Looking at incorrect scaling of front logos reported by setup artists.

		Version 2.009
			04 January, 2017
			changed additional art 'no scale' option to accomodate upper or lowercase n to disable scaling.
		
		Version 2.010
			16 January, 2017
			Adding women's soccer shorts functionality.

		Version 2.011
			17 January, 2017
			Adding ps pants functionality.
				Need to look through each size layer for multiple destination pieces

		Version 2.012
			02 January, 2017
			Adding FD_5060W functionality. Need to change the destination piece to account for placing art on the "front right/left leg"

		Version 2.013
			15 February, 2017
			Adding conditional no scale option to front logo.

		Version 2.014
			15 February, 2017
			Fixing a bug caused by no scale option.
				Front number function fails when no scal option is used because it looks specifically for a layer called "Front Logo".

*/

//Local Storage. Testing and development only.
// #include "~/Desktop/automation/javascript/_new_cad_workflow/central_library/central_library.js";
// #include "~/Desktop/automation/javascript/utilities/Utilities_Container.js";

//Network Storage. Production version.
// #include "/Volumes/Customization/Library/Scripts/Script Resources/Data/central_library.js";
// #include "/Volumes/Customization/Library/Scripts/Script Resources/Data/Utilities_Container.js";

// var library = prepressInfo;

var placedLogos = {};

var addArt = 
	{
		"Front Logo": function(logo,flscale)
			{
				var localValid = true;
				if(logo == undefined)
				{
					log.e("No logo argument (or an undefined argument) was passed to the front logo function.::logo = " + logo);
					errorList.push("Couldn't determine the correct front logo.\nlogo is undefined");
					valid = false;
					return;
				}


				if(flscale != undefined && flscale == false)
				{
					gar.scaleFrontLogo = false;
				}

				//logo is a full width front logo
				if(logo.width > 50)
				{
					localValid = regularLogo();
				}

				//logo is less than 50pt wide. Could be a left/right chest
				//prompt user for what kind of logo
				//left/right chest logos are not scaled
				else
				{
					promptForLogoType();
				}
				///////////////////
				//Logic Container//
				///////////////////
					
				function regularLogo()
				{
					log.h("Beginning regularLogo function for garment: " + wearer[a].name);
					log.l("logo = " + logo);
					var RLValid = true;
					log.l("declared RLValid variable and set to true");
					var logoTop = logo.top;
					log.l("logoTop = " + logoTop);


					var scaleBool = gar.scaleFrontLogo;

					log.l("scaleBool = " + scaleBool);

					if(scaleBool)
					{
						var smallestScale = getSmallestScale();
						var newWidth = logo.width - (smallestScale*3.6);
					}

					// var newWidth = logo.width - gar.smallestWidth;
					for(var fls=0;fls<prepress.length;fls++)
					{
						log.h("looping prepress layers for " + wearer[a].name + "::loop variable (fls) = " + fls + "::curSize = " + prepress[fls].name);
						var scale = (newWidth/logo.width)*100;
						var curSize = prepress[fls].name;
						var logoCopy;
						if(gar.fullButton == undefined)
						{
							log.l("Garment is not full button. proceeding with standard logo function");
							//garment is not a full button
							//duplicate logo to the "front" piece
							var curLoc = prepress[fls].groupItems[curSize + " Front"];
							logoCopy = logo.duplicate(curLoc);
							if(scaleBool)
							{
								logoCopy.resize(scale,scale,true,true,true,true,00);
							}
							logoCopy.name = curSize + " Front Logo";
							logoCopy.top = logoTop;
							log.l("succesfully added front logo to " + curLoc);

							log.l("sending logo info with parameters: ::logoCopy = " + logoCopy + "::curSize = " + curSize);
							
							try
							{
								sendLogoInfo(logoCopy, curSize);
							}
							catch(e)
							{
								log.e("error while trying to send logo info to placedLogos object.")
								RLValid = false;
								return RLValid;
							}
						}
						else
						{
							//Garment is full button. Duplicate logo to each of the front pieces
							log.h("Garment is a full button. duplicating front logo for both front jersey pieces.");
							// try
							// {
								var curLocLeft = prepress[fls].groupItems[curSize + " Left Front"];
								var curLocRight = prepress[fls].groupItems[curSize + " Right Front"];
								log.l("curLocLeft = " + curLocLeft + "::curLocRight = " + curLocRight);
								
								//duplicate logo to left front
								logoCopyLeft = logo.duplicate();
								logoCopyRight = logo.duplicate();
								logoCopyLeft.name = curSize + " Left Front Logo";
								logoCopyRight.name = curSize + " Right Front Logo";
								log.l("logoCopyLeft = " + logoCopyLeft + "::logoCopyRight = " + logoCopyRight);
								if(scaleBool)
								{
									logoCopyLeft.resize(scale,scale,true,true,true,true,00);
									logoCopyRight.resize(scale,scale,true,true,true,true,00);
								}
								
								logoCopyLeft.top = logoTop;
								logoCopyRight.top = logoTop;
								//make clipping mask

								log.h("frontLogoClipMask()::sending parameters: ::curLocLeft = " + curLocLeft + "::logoCopyLeft + " + logoCopyLeft);
								if(frontLogoClipMask(curLocLeft,logoCopyLeft))
								{
									log.h("Successfully completed the cliping mask function.::Added " + logoCopyLeft + " to " + curLocLeft);
									if(sendLogoInfo(logoCopyLeft, curSize))
									{
										log.h("Sucessfully added " + logoCopyLeft + " to placedLogos");
									}
									else
									{
										log.e("Error in sendLogoInfo function::passed the following arguments into sendLogoInfo()::logoCopyLeft = " + logoCopyLeft + "::curSize = " + curSize);
										RLValid = false;
									}
								}
								else
								{
									log.e("Failed while adding clip path to " + curLocLeft + "::dest.locked = " + curLocLeft.locked + "::dest.visible = " + curLocLeft.visible);
									RLValid = false;
								}

								if(RLValid)
								{	
									//make clipping mask
									if(frontLogoClipMask(curLocRight,logoCopyRight))
									{
										log.h("Successfully completed the cliping mask function.::Added " + logoCopyRight + " to " + curLocRight);
									}
									else
									{
										log.e("Error in frontLogoClipMask function.::" + logoCopyRight + " was not added to " + curLocRight);
									}

								}
							// }
							// catch(e)
							// {
							// 	errorList.push("Failed while making front logo clipping masks");
							// 	RLValid = false;

							// }
						}
						newWidth = newWidth + 3.6;
					}
					return RLValid;

					/////////////////////
					///logic container///
					/////////////////////

					//getSmallestScale Function Description
					//find the factor by which to shrink the front logo to accomodate the smallest size
					function getSmallestScale()
					{
						var counter = 0;
						var slowpitch = false;
						for(var size in gar.placement)
						{
							if(size == "Regular" || size == "Raglan")
							{
								slowpitch = true;
								break;
							}
							if(size == gar.mockupSize)
							{
								break;
							}
							counter++;
						}
						if(slowpitch)
						{
							for(var size in gar.placement["Regular"])
							{
								if(size == gar.mockupSize)
								{
									break;
								}
								counter++;
							}
						}
						return counter;
					}


					/////////////////////
					///logic container///
					/////////////////////					

				}

				

				function frontLogoClipMask(dest,logo)
				{
					var flcmValid = true;
					//function description
					//find bounds of shirt piece
					//create a rectangle with the same bounds and use that to make a clipping mask
					var bounds = [dest.visibleBounds[1],dest.visibleBounds[0],dest.width,dest.height];
					log.l("bounds = " + bounds);
					var tmpLay = docRef.layers.add();
					tmpLay.name = "temporary";
					var clip = tmpLay.pathItems.rectangle(bounds[0],bounds[1],bounds[2],bounds[3]);
					logo.move(dest,ElementPlacement.PLACEATBEGINNING);
					var clipGroup = dest.groupItems.add();
					clipGroup.name = "Clipping Mask";
					logo.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
					clip.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
					clip.clipping = true;
					clipGroup.clipped = true;
					tmpLay.remove();

					return flcmValid;
				}


				//functions sideChest and promptForLogoType go here

				function sideChest(sideString)
				{
					//determine which piece to use for measuring the placement ratio
					if(gar.fullButton == undefined)
					{
						var thePiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Front"];
					}
					else
					{
						var thePiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " " + sideString + " Front"];
					}



					var horzDist = logo.left - thePiece.left;
					var vertDist = thePiece.top - logo.top;
					var horzRatio = Math.abs(horzDist/thePiece.width);
					var vertRatio = Math.abs(vertDist/thePiece.height);

					//add logos to each size and adjustplacement according to ratios
					for(var SC=0;SC<prepress.length;SC++)
					{
						var curSize = prepress[SC].name;
						if(gar.fullButton == undefined){
							var curLoc = prepress[SC].groupItems[curSize + " Front"];
						}
						else{
							var curLoc = prepress[SC].groupItems[curSize + " " + sideString + " Front"];
						}
						var logoCopy = logo.duplicate(curLoc, ElementPlacement.PLACEATBEGINNING);
						logoCopy.name = curSize + " " + sideString + " Chest Logo";
						var desiredHorz = curLoc.left + (curLoc.width*horzRatio);
						var desiredVert = curLoc.top - (curLoc.height*vertRatio);
						logoCopy.left = desiredHorz;
						logoCopy.top = desiredVert;
						sendLogoInfo(logoCopy,curSize);
					}
				}

				function promptForLogoType()
				{
					var type;
					var isLeftChest = new Window("dialog", wearer[a].name);
						var textGroup = isLeftChest.add("group");
						textGroup.orientation = "column";
							var wearerText = textGroup.add("statictext", undefined, wearer[a].name);
							var text = textGroup.add("statictext", undefined, "Is this a regular front logo or a Left/Right Chest?");
						var buttonGroup = isLeftChest.add("group");
							buttonGroup.orientation = "column";
							var reg = buttonGroup.add("button", undefined, "Regular Front Logo");
								reg.onClick = function(){
									type = "regular";
									isLeftChest.close();
									try
									{
										regularLogo();
									}
									catch(e)
									{
										errorList.push("Failed while adding a regular front logo.");
										valid = false;
									}
								}
							var lc = buttonGroup.add("button", undefined, "Left Chest Logo");
								lc.onClick = function(){
									type = "leftChest";
									isLeftChest.close();
									try
									{
										sideChest("Left");
									}
									catch(e)
									{
										errorList.push("Failed while adding left chest logo");
										valid = false;
										return;
									}
								}
							var rc = buttonGroup.add("button", undefined, "Right Chest Logo");
								rc.onClick = function(){
									type = "rightChest";
									isLeftChest.close();
									sideChest("Right");
								}
					isLeftChest.show();

					return type;
				}


				function sendLogoInfo(logo,size)
				{
					if(logo!=undefined)
					{
						placedLogos[size] = logo;
						return true;
					}
					else 
					{
						return false;
					}
				}

				///////////////////
				//Logic Container//
				///////////////////					


				return localValid;	 
			},

		"Front Number": function(frontNum)
			{
				//function argument frontNum = pageItems[0] from Front Number layer

				var frontNumValid = false;

				//determine whether there is a front logo to use for placement of front number.
				var logoBool = false;

				//find the front logo layer
				//front logo layer name may have -n _n or [space]n
				var frontLogoLayer;
				for(var fll=0;fll<artLayers.length;fll++)
				{
					var thisLay = artLayers[fll];
					if(thisLay.name.indexOf("Front Logo")>-1)
					{
						frontLogoLayer = thisLay;
						break;
					}
				}

				if(frontLogoLayer.pageItems.length>0)
				{
					logoBool = true;
				}

				var FB = false;
				if(gar.fullButton != undefined)
					FB = true;

				//automatically determine position of front number
				var numCenter = frontNum.left + (frontNum.width/2);
				if(FB)
					var shirt = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Right Front"];
				else
					var shirt = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Front"];
				var shirtCenter = shirt.left + (shirt.width/2);
				var numPos = findNumPos(numCenter,shirtCenter);
				return frontNumValid;


				///////////////////
				//Logic Container//
				///////////////////	

				function findNumPos(numCenter,shirtCenter)
				{
					//buffer is range of tolerance left or right from center of jersey.
					var buffer = 20;
					// var result;

					//logic to fix shirtCenter if garment is full button
					if(FB)
					{
						//garment is full button
						//find center point of the 2 front pieces of mockup size
						var LF = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Left Front"];
						var RF = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Right Front"];
						var farRight = LF.left + LF.width;
						shirtCenter = (RF.left + farRight)/2;
					}
					
					if ((shirtCenter + buffer) < numCenter)
					{
						// result = "left";
						placeFrontNum("Left",logoBool);
					}
					else if (numCenter < (shirtCenter + buffer)  && numCenter > (shirtCenter - buffer))
					{
						// result = "center";
						placeFrontNum("Center",logoBool);
					}
					else if ((shirtCenter - buffer) > numCenter)
					{
						// result = "right";
						placeFrontNum("Right",logoBool);
					}
					
					// return result;

				}

				function placeFrontNum(loc,logoBool)
				{
					//front logo exists
					//place front number according to change in logo height and width
					if(logoBool)
					{

						//find spacing between bottom of logo and top of number

						// var numLogoRelationship = numLogoSpacing(artLayers["Front Logo"].pageItems[0],artLayers["Front Number"].pageItems[0],loc)
						var numLogoRelationship = relativeNumPos(loc);

						var vertSpace = numLogoRelationship.v;
						var horzStart = numLogoRelationship.h;

						if(loc == "Center" && FB)
						{
							errorList.push("Can't put a centered front number on a full button.");
							valid = false;
							return;
						}
						// else
						// {
						// 	var numLeft = horzStart;
						// }

						var sizeCounter = 0;

						//loop size layers to duplicate front number to each front piece
						for(var FN=0;FN<prepress.length;FN++)
						{
							var curSize = prepress[FN].name;
							var curLay = prepress[FN];
							var thisPlacedLogo = placedLogos[curSize];
							//find the bottom of the logo of the current size
							var curLogoBot = getLogoBot(curSize);
							// alert(curSize + " : " + curLogoBot);
							var numTop = curLogoBot - vertSpace;
							if(!FB)
							{
								var dest = curLay.groupItems[curSize + " Front"]
							}
							else
							{
								var dest = curLay.groupItems[curSize + " " + loc + " Front"];
							}



							var fNumberCopy = frontNum.duplicate(dest);
							fNumberCopy.name = curSize + " Front Number";
							// fNumberCopy.left = numLeft;
							if(loc == "Right")
							{
								fNumberCopy.left = thisPlacedLogo.left + horzStart;
							}
							else if(loc == "Left")
							{
								fNumberCopy.left = thisPlacedLogo.left + thisPlacedLogo.width - horzStart;
							}
							fNumberCopy.top = numTop;

							// if(loc == "Left")
							// {
							// 	numLeft = numLeft + 1.8;
							// }
							// else if(loc == "Right")
							// {
							// 	numLeft = numLeft - 1.8;
							// }

							

						}
					}
					else
					{
						//there is no front logo. position front number
						//relative to the left and top of shirt

						//determine the top and left coordinates of the mockup size shirt
						var mockJersey = prepress[gar.mockupSize].groupItems;
						if(!FB)
						{
							mockJersey = mockJersey[gar.mockupSize + " Front"];
						}
						else
						{
							mockJersey = mockJersey[gar.mockupSize + " " + loc + " Front"];
						}
						var fnRatio = findRatio(frontNum,mockJersey);
						var ratLeft = fnRatio.LP;
						var ratTop = fnRatio.TP;

						for(var FN=0;FN<prepress.length;FN++)
						{
							var curSize = prepress[FN].name;
							var curLay = prepress[FN];

							if(!FB)
								var dest = curLay.pageItems[curSize + " Front"];
							else
								var dest = curLay.pageItems[curSize + " " + loc + " Front"];

							var curPlacement = curRatio(dest,fnRatio.LP,fnRatio.TP);
							var fNumberCopy = frontNum.duplicate(dest);
							fNumberCopy.left = dest.left + curPlacement.curLeft;
							fNumberCopy.top = dest.top - curPlacement.curTop;
							fNumberCopy.name = curSize + " Front Number";
						}


					}

					frontNumValid =  true;

				}

				function getLogoBot(size)
				{
					var thisLogo = placedLogos[size];
					var bot = thisLogo.top - thisLogo.height;
					return bot;
				}

				//relativeNumPos Function Description
				//Find the relative position of front logo and front number.
				function relativeNumPos(loc)
				{
					var result = {};
					var num = frontNum;
					// var logo = artLayers["Front Logo"].pageItems[0];
					var logo = frontLogoLayer.pageItems[0];
					var logoBot = logo.top - logo.height;
					var vertSpace = logoBot - num.top;

					if(loc == "Right")	
					{					
						var horzStart = num.left - logo.left;
					}
					else if(loc == "Left")
					{
						var horzStart = (logo.left + logo.width) - num.left;
					}
					
					result.h = horzStart;
					result.v = vertSpace;

					return result;
				
					
				}

				function numLogoSpacing(theLogo,theNum,loc)
				{
					var result = {};
					var logoBot = theLogo.top - theLogo.height;
					var space = logoBot - theNum.top;
					result.vSpace = space;

					var logoCenter = theLogo.left + (theLogo.width/2);

					if(loc == "Left")
					{
						var distFromCenter = theNum.left - logoCenter;
						var startPosition = (logoCenter + distFromCenter) - (1.8 * gar.smallestScale);		
					}
					else if(loc == "Right")
					{
						var distFromCenter = logoCenter - theNum.left;
						var startPosition = (logoCenter - distFromCenter) + (1.8 * gar.smallestScale);
					}
					else
					{
						startPosition = theNum.left;
					}

					result.hStart = startPosition;



					return result;

				}

				function findRatio(num,mock)
				{
					var distFromLeft = num.left - mock.left;
					var distFromTop = mock.top - num.top;

					var leftPercentage = distFromLeft/mock.width;
					var topPercentage = distFromTop/mock.height;

					return {LP: leftPercentage, TP: topPercentage};
				}

				function curRatio(dest,ratLeft,ratTop)
				{
					var CL = dest.width * ratLeft;
					var CT = dest.height * ratTop;
					return {curLeft: CL, curTop: CT};
				}





				///////////////////
				//Logic Container//
				///////////////////


			},

		"Player Name": function(playerName)
			{
				if(code.indexOf("5411")>-1 || code.indexOf("250")>-1)
				{
					var thisLoc = "Outside Cowl";
				}
				else
				{
					var thisLoc = "Back";
				}
				if(addArt["Generic"](playerName, thisLoc, "Player Name"))
					return true;
			},

		"Back Number": function(backNum)
			{
				if(addArt["Generic"](backNum, "Back", "Back Number"))
					return true;
			},

		"Left Sleeve" : function(leftSleeve)
			{
				if(addArt["Generic"](leftSleeve,"Left Sleeve", "Left Sleeve"))
					return true;
			},

		"Right Sleeve" : function(rightSleeve)
			{
				if(addArt["Generic"](rightSleeve,"Right Sleeve", "Right Sleeve"))
					return true;
			},

		"Locker Tag" : function(lockerTag)
			{
				if(code.indexOf("3007")>-1)
				{
					var ltDest = "Cowl Yoke";
				}
				else
				{
					var ltDest = "Back";
				}
				if(addArt["Generic"](lockerTag,ltDest, "Locker Tag"))
					return true;
			},

		"Sponsor Logo" : function(sponsorLogo)
			{
				if(addArt["Generic"](sponsorLogo,"Back", "Sponsor Logo"))
					return true;
			},

		"Left Hood" : function(leftHood)
			{
				var scale;
				var hoodPiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Left Outside Hood"];
				if(hoodPiece.width <= leftHood.width)
					scale = hoodPiece.width/leftHood.width;
				else
					scale = leftHood.width/hoodPiece.width;
				if(addArt["Generic"](leftHood,"Left Outside Hood", "Left Hood Logo", scale))
					return true;
			},

		"Right Hood" : function(rightHood)
			{
				var scale;
				var hoodPiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Right Outside Hood"];
				if(hoodPiece.width <= rightHood.width)
					scale = hoodPiece.width/rightHood.width;
				else
					scale = rightHood.width/hoodPiece.width;
				if(addArt["Generic"](rightHood,"Right Outside Hood", "Right Hood Logo", scale))
					return true;
			},

		"Front Pocket" : function(frontPocket)
			{
				var scale;
				var pocketPiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Pocket"];
				if(frontPocket.width <= pocketPiece.width)
					scale = frontPocket.width / pocketPiece.width;
				else
					scale = pocketPiece.width/frontPocket.width;
				
				if(addArt["Generic"](frontPocket,"Pocket", "Front Pocket Logo",scale))
					return true;
			},

		"Left Cowl" : function(leftCowl)
			{
				if(addArt["Generic"](leftCowl,"Outside Cowl", "Left Cowl"))
					return true;
			},

		"Right Cowl" : function(rightCowl)
			{
				if(addArt["Generic"](rightCowl, "Outside Cowl", "Right Cowl"))
					return true;
			},

		"Left Leg" : function(leftLeg,pantsSizing)
			{
				if(pantsSizing)
				{
					//generic function won't work with this sizing structure.
					//loop each size layer and find all instances of "left leg art" 
					//and add the artwork locally rather than calling generic function.
					for(var g=0;g<prepress.length;g++)
					{
						var curSize = prepress[g].name;
						var curLay = prepress[g];
						for(var pan=0;pan<curLay.groupItems.length;pan++)
						{
							var thisItem = curLay.groupItems[pan];
							if(thisItem.name.indexOf("Left Leg Panel") > -1)
							{
								var artCopy = leftLeg.duplicate();
								artCopy.moveToBeginning(thisItem);
							}
						}
					}
					return true;

				}
				else
				{
					if(code.indexOf("5060W")>-1)
					{
						var pantsDest = "Front Left Leg";
					}
					else
					{
						var pantsDest = "Left Leg Panel";
					}

					if(addArt["Generic"](leftLeg,pantsDest, "Left Leg Art"))
						return true;
				}
			},

		"Right Leg" : function(rightLeg,pantsSizing)
			{
				if(pantsSizing)
				{
					//generic function won't work with this sizing structure.
					//loop each size layer and find all instances of "left leg art" 
					//and add the artwork locally rather than calling generic function.
					for(var g=0;g<prepress.length;g++)
					{
						var curSize = prepress[g].name;
						var curLay = prepress[g];
						for(var pan=0;pan<curLay.groupItems.length;pan++)
						{
							var thisItem = curLay.groupItems[pan];
							if(thisItem.name.indexOf("Right Leg Panel") > -1)
							{
								var artCopy = rightLeg.duplicate();
								artCopy.moveToBeginning(thisItem);
							}
						}
					}
					return true;

				}
				else
				{
					if(code.indexOf("5060W")>-1)
					{
						var pantsDest = "Front Right Leg";
					}
					else
					{
						var pantsDest = "Right Leg Panel";
					}
					
					if(addArt["Generic"](rightLeg,pantsDest, "Right Leg Art"))
						return true;
				}
			},

		"Right Front Leg" : function(rightLeg)
			{
				if(addArt["Generic"](rightLeg, "Front Right", "Front Right Art"))
					return true;
			},
		

		"Collar Art" : function(collarArt)
			{
				if(addArt["Generic"](collarArt,"Inside Collar", "Collar Art"))
					return true;
			},

		"BT_Logo" : function(logo)
			{
				var localValid = true;
				try
				{
					for(var btl=0;btl<prepress["Front"].groupItems.length;btl++)
					{
						var thisTag = prepress["Front"].groupItems[btl];
						if(addArt["Bag Tag Art"](logo,("Front" + (btl+1)), "Bag Tag Logo"))
						{
							localValid = true;
						}
						else
						{
							localValid = false;
						}
					}
				}
				catch(e)
				{
					alert(e);
				}
				return localValid
				
			},

		"BT_Player Name" : function(name)
			{
				var localValid = true;
				try
				{
					for(var btl=0;btl<prepress["Front"].groupItems.length;btl++)
					{
						var thisTag = prepress["Front"].groupItems[btl];
						if(addArt["Bag Tag Art"](name,("Front" + (btl+1)), "Bag Tag Name"))
						{
							localValid = true;
						}
						else
						{
							localValid = false;
						}
					}
				}
				catch(e)
				{
					alert(e);
				}
				return localValid
			},

		"BT_Player Number" : function(number)
			{
				var localValid = true;
				try
				{
					for(var btl=0;btl<prepress["Front"].groupItems.length;btl++)
					{
						var thisTag = prepress["Front"].groupItems[btl];
						if(addArt["Bag Tag Art"](number,("Front" + (btl+1)), "Bag Tag Number"))
						{
							localValid = true;
						}
						else
						{
							localValid = false;
						}
					}
				}
				catch(e)
				{
					alert(e);
				}
				return localValid
			},

		"Bag Tag Art" : function(art,loc,name)
			{
				var dest = prepress["Front"].groupItems[loc];
				var artCopy = art.duplicate();
				artCopy.moveToBeginning(dest);
				artCopy.name = name;
				return true;
			},

		"Additional Art" : function(additionalArt)
			{
				var addArtSuccess = false;
				var addArtLoc = [];

				if(artLoc.name.toLowerCase().indexOf(" n") > -1)
				{
					var scaleBool = false;
				}
				else
				{
					var scaleBool = true;
				}


				//loop all pageItems on additional art layer
				//determine the piece with which the art shares bounds
				//run generic function using that shirt piece
				for(var aa=0;aa<additionalArt.length;aa++)
				{
					addArtLoc = [];
					var destGroup;
					var curAddArt = additionalArt[aa];
					var localValid = false;

					//loop the potential destinations to find overlap
					for(var pd=0;pd<prepress[gar.mockupSize].groupItems.length;pd++)
					{
						var curGroup = prepress[gar.mockupSize].groupItems[pd];
						if(validDest(curGroup, curGroup.name.toLowerCase(),curAddArt) && intersect(curAddArt,curGroup))
						{
							destGroup = curGroup;
							addArtLoc.push(curGroup.name.substring(curGroup.name.indexOf(" ")+1, curGroup.name.length));
						}
					}

					if(addArtLoc.length == 0)
					{
						errorList.push("One or more pieces of Additional Art are not on top of a vailid destination.");
						valid = false;
						return false;
					}
					else if(addArtLoc.length >1)
					{
						//eventually add logic here to determine most likely destination based on how much overlap
						//or possibly add scriptUI buttons to prompt user to choose which piece
						errorList.push("One or more pieces of Additional Art are intersecting with too many pieces of art.");
						valid = false;
						return false;
					}
					else
					{
						if(!scaleBool)
						{
							var scale = undefined;
						}
						else
						{
							var scale = getScale(curAddArt, destGroup);
						}

						var placement = getPlacement(curAddArt,destGroup);
						if(!addArt["Generic"](curAddArt, addArtLoc[0], "Additional Art", scale, placement))
							return false;
						else
						{
							localValid = true;

						}

					}

				}

				if(localValid)
					return true;


				//Logic Container

				function intersect(art, dest)  
				{  
					var intersect = false;  
					var artBounds = art.geometricBounds;  
					var destBounds = dest.geometricBounds;  

					var AL = artBounds[0];  
					var AT = artBounds[1];  
					var AR = artBounds[2];  
					var AB = artBounds[3];  

					var DL = destBounds[0];  
					var DT = destBounds[1];  
					var DR = destBounds[2];  
					var DB = destBounds[3];  
				  
					 //check for intersection of 1 or 2 sides  
					 //this part breaks down if 3 sides are intersected  
					if(((AL >= DL && AL <= DR) || (AR >= DL && AR <= DR)) && ((AT <= DT && AT >= DB) || (AB <= DT && AB >= DB)))  
						  //this art intersects this destination on one or two sides  
						  intersect = true;
					else if((((AL<=DR && AL >= DL) || (AL <= DL && AR >= DL)) && (AT >= DT && AB <= DB)) || (((AB<=DT && AB >= DB) || (AT >= DB && AT <= DT)) && AL<=DL && AR >= DR))
					{
						//art covers 3 sides of dest piece
						intersect = true;
					}
					else if(AT >= DT && AR >= DR && AB <= DB && AL <= DL)
					{
						//art completely covers dest piece
						intersect = true;
					}
				  
					 return intersect;  
				}

				function getScale(art,dest)
				{
					// if(!scaleBool)
					// {
					// 	return undefined;
					// }
					var ratio = art.width/dest.width;
					return ratio;
				}

				function getPlacement(art,dest)
				{
					var result = {};
					var left = ((art.left + art.width/2) - dest.left)/dest.width;
					var top = (dest.top - (art.top + art.height/2))/dest.height;
					result.left = left;
					result.top = top;
					return result;
				}

				function validDest(curGroup, curGroupName, art)
				{
					var result = true;
					var undesirable = ["collar","waistband","cuff","placard","placket","side"];
					
					for(var vd=0;vd<undesirable.length;vd++)
					{
						if(curGroupName.indexOf(undesirable[vd])>-1)
						{
							result = false;
							break;
						}
					}
					return result;
				}
				
			},
		
		


		"Generic" : function(art,loc,name,scale,placement)
			{
				for(var g=0;g<prepress.length;g++)
				{
					var curSize = prepress[g].name;
					var curLay = prepress[g];
					var dest = curLay.groupItems[curSize + " " + loc];
					var artCopy = art.duplicate();
					artCopy.name = curSize + " " + name;
					if(scale != undefined)
					{
						var newWidth = dest.width * scale;
						var newScale = (newWidth/artCopy.width)*100;
						if(loc == "Pocket" || loc.indexOf("Hood")>-1)
							artCopy.resize(newScale,newScale,true,true,true,true,newScale,Transformation.BOTTOM);
						else
						{
							var leftR = (placement.left * dest.width);
							var topR = (placement.top * dest.height);
							artCopy.resize(newScale,newScale,true,true,true,true,newScale);
							artCopy.left = (dest.left - artCopy.width/2) + leftR;
							artCopy.top = (dest.top - artCopy.height/2) - topR;
						}

						
					}
					artCopy.moveToBeginning(dest);
					if(artCopy.name.indexOf("Additional")>-1)
					{
						artCopy.zOrder(ZOrderMethod.SENDTOBACK);
						artCopy.zOrder(ZOrderMethod.BRINGFORWARD);
					}
				}
				return true;
			}
	}


