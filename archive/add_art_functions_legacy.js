var placedLogos = {};

var addArt = {
	"Front Logo": function(logo, flscale) {
		var localValid = true;
		if (logo == undefined) {
			log.e("No logo argument (or an undefined argument) was passed to the front logo function.::logo = " + logo);
			errorList.push("Couldn't determine the correct front logo.\nlogo is undefined");
			valid = false;
			return;
		}


		if (flscale != undefined && flscale == false) {
			gar.scaleFrontLogo = false;
		}

		//logo is a full width front logo
		if (logo.width > 50) {
			localValid = regularLogo();
		}

		//logo is less than 50pt wide. Could be a left/right chest
		//prompt user for what kind of logo
		//left/right chest logos are not scaled
		else {
			promptForLogoType();
		}
		///////////////////
		//Logic Container//
		///////////////////

		function regularLogo() {
			log.h("Beginning regularLogo function for garment: " + wearer[a].name);
			log.l("logo = " + logo);
			var RLValid = true;
			log.l("declared RLValid variable and set to true");
			var logoTop = logo.top;
			log.l("logoTop = " + logoTop);


			var scaleBool = gar.scaleFrontLogo;

			log.l("scaleBool = " + scaleBool);

			if (scaleBool) {
				var smallestScale = getSmallestScale();
				var newWidth = logo.width - (smallestScale * 3.6);
			}

			// var newWidth = logo.width - gar.smallestWidth;
			for (var fls = 0; fls < prepress.length; fls++) {
				log.h("looping prepress layers for " + wearer[a].name + "::loop variable (fls) = " + fls + "::curSize = " + prepress[fls].name);
				var scale = (newWidth / logo.width) * 100;
				var curSize = prepress[fls].name;
				var logoCopy;
				if (gar.fullButton == undefined) {
					log.l("Garment is not full button. proceeding with standard logo function");
					//garment is not a full button
					//duplicate logo to the "front" piece
					var curLoc = prepress[fls].groupItems[curSize + " Front"];
					logoCopy = logo.duplicate(curLoc);
					if (scaleBool) {
						logoCopy.resize(scale, scale, true, true, true, true, 0);
					}
					logoCopy.name = curSize + " Front Logo";
					logoCopy.top = logoTop;
					log.l("succesfully added front logo to " + curLoc);

					log.l("sending logo info with parameters: ::logoCopy = " + logoCopy + "::curSize = " + curSize);

					try {
						sendLogoInfo(logoCopy, curSize);
					} catch (e) {
						log.e("error while trying to send logo info to placedLogos object.")
						RLValid = false;
						return RLValid;
					}
				} else {
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
					if (scaleBool) {
						logoCopyLeft.resize(scale, scale, true, true, true, true, 0);
						logoCopyRight.resize(scale, scale, true, true, true, true, 0);
					}

					logoCopyLeft.top = logoTop;
					logoCopyRight.top = logoTop;
					//make clipping mask

					log.h("frontLogoClipMask()::sending parameters: ::curLocLeft = " + curLocLeft + "::logoCopyLeft + " + logoCopyLeft);
					if (frontLogoClipMask(curLocLeft, logoCopyLeft)) {
						log.h("Successfully completed the cliping mask function.::Added " + logoCopyLeft + " to " + curLocLeft);
						if (sendLogoInfo(logoCopyLeft, curSize)) {
							log.h("Sucessfully added " + logoCopyLeft + " to placedLogos");
						} else {
							log.e("Error in sendLogoInfo function::passed the following arguments into sendLogoInfo()::logoCopyLeft = " + logoCopyLeft + "::curSize = " + curSize);
							RLValid = false;
						}
					} else {
						log.e("Failed while adding clip path to " + curLocLeft + "::dest.locked = " + curLocLeft.locked + "::dest.visible = " + curLocLeft.visible);
						RLValid = false;
					}

					if (RLValid) {
						//make clipping mask
						if (frontLogoClipMask(curLocRight, logoCopyRight)) {
							log.h("Successfully completed the cliping mask function.::Added " + logoCopyRight + " to " + curLocRight);
						} else {
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
			function getSmallestScale() {
				var counter = 0;
				var slowpitch = false;
				for (var size in gar.placement) {
					if (size == "Regular" || size == "Raglan") {
						slowpitch = true;
						break;
					}
					if (size == gar.mockupSize) {
						break;
					}
					counter++;
				}
				if (slowpitch) {
					for (var size in gar.placement["Regular"]) {
						if (size == gar.mockupSize) {
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



		function frontLogoClipMask(dest, logo) {
			var flcmValid = true;
			//function description
			//find bounds of shirt piece
			//create a rectangle with the same bounds and use that to make a clipping mask
			var bounds = [dest.visibleBounds[1], dest.visibleBounds[0], dest.width, dest.height];
			log.l("bounds = " + bounds);
			var tmpLay = docRef.layers.add();
			tmpLay.name = "temporary";
			var clip = tmpLay.pathItems.rectangle(bounds[0], bounds[1], bounds[2], bounds[3]);
			logo.move(dest, ElementPlacement.PLACEATBEGINNING);
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

		function sideChest(sideString) {
			//determine which piece to use for measuring the placement ratio
			if (gar.fullButton == undefined) {
				var thePiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Front"];
			} else {
				var thePiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " " + sideString + " Front"];
			}



			var horzDist = logo.left - thePiece.left;
			var vertDist = thePiece.top - logo.top;
			var horzRatio = Math.abs(horzDist / thePiece.width);
			var vertRatio = Math.abs(vertDist / thePiece.height);

			//add logos to each size and adjustplacement according to ratios
			for (var SC = 0; SC < prepress.length; SC++) {
				var curSize = prepress[SC].name;
				if (gar.fullButton == undefined) {
					var curLoc = prepress[SC].groupItems[curSize + " Front"];
				} else {
					var curLoc = prepress[SC].groupItems[curSize + " " + sideString + " Front"];
				}
				var logoCopy = logo.duplicate(curLoc, ElementPlacement.PLACEATBEGINNING);
				logoCopy.name = curSize + " " + sideString + " Chest Logo";
				var desiredHorz = curLoc.left + (curLoc.width * horzRatio);
				var desiredVert = curLoc.top - (curLoc.height * vertRatio);
				logoCopy.left = desiredHorz;
				logoCopy.top = desiredVert;
				sendLogoInfo(logoCopy, curSize);
			}
		}

		function promptForLogoType() {
			var type;
			var isLeftChest = new Window("dialog", wearer[a].name);
			var textGroup = isLeftChest.add("group");
			textGroup.orientation = "column";
			var wearerText = textGroup.add("statictext", undefined, wearer[a].name);
			var text = textGroup.add("statictext", undefined, "Is this a regular front logo or a Left/Right Chest?");
			var buttonGroup = isLeftChest.add("group");
			buttonGroup.orientation = "column";
			var reg = buttonGroup.add("button", undefined, "Regular Front Logo");
			reg.onClick = function() {
				type = "regular";
				isLeftChest.close();
				try {
					regularLogo();
				} catch (e) {
					errorList.push("Failed while adding a regular front logo.");
					valid = false;
				}
			}
			var lc = buttonGroup.add("button", undefined, "Left Chest Logo");
			lc.onClick = function() {
				type = "leftChest";
				isLeftChest.close();
				try {
					sideChest("Left");
				} catch (e) {
					errorList.push("Failed while adding left chest logo");
					valid = false;
					return;
				}
			}
			var rc = buttonGroup.add("button", undefined, "Right Chest Logo");
			rc.onClick = function() {
				type = "rightChest";
				isLeftChest.close();
				sideChest("Right");
			}
			isLeftChest.show();

			return type;
		}


		function sendLogoInfo(logo, size) {
			if (logo != undefined) {
				placedLogos[size] = logo;
				return true;
			} else {
				return false;
			}
		}

		///////////////////
		//Logic Container//
		///////////////////					


		return localValid;
	},

	"Front Number": function(frontNum) {
		//function argument frontNum = pageItems[0] from Front Number layer

		var frontNumValid = false;

		//determine whether there is a front logo to use for placement of front number.
		var logoBool = false;

		//find the front logo layer
		//front logo layer name may have -n _n or [space]n
		var frontLogoLayer;
		for (var fll = 0; fll < artLayers.length; fll++) {
			var thisLay = artLayers[fll];
			if (thisLay.name.indexOf("Front Logo") > -1) {
				frontLogoLayer = thisLay;
				break;
			}
		}

		if (frontLogoLayer.pageItems.length > 0) {
			logoBool = true;
		}

		var FB = false;
		if (gar.fullButton != undefined)
			FB = true;

		//automatically determine position of front number
		var numCenter = frontNum.left + (frontNum.width / 2);
		if (FB)
			var shirt = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Right Front"];
		else
			var shirt = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Front"];
		var shirtCenter = shirt.left + (shirt.width / 2);
		var numPos = findNumPos(numCenter, shirtCenter);
		return frontNumValid;


		///////////////////
		//Logic Container//
		///////////////////	

		function findNumPos(numCenter, shirtCenter) {
			//buffer is range of tolerance left or right from center of jersey.
			var buffer = 20;
			// var result;

			//logic to fix shirtCenter if garment is full button
			if (FB) {
				//garment is full button
				//find center point of the 2 front pieces of mockup size
				var LF = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Left Front"];
				var RF = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Right Front"];
				var farRight = LF.left + LF.width;
				shirtCenter = (RF.left + farRight) / 2;
			}

			if ((shirtCenter + buffer) < numCenter) {
				// result = "left";
				placeFrontNum("Left", logoBool);
			} else if (numCenter < (shirtCenter + buffer) && numCenter > (shirtCenter - buffer)) {
				// result = "center";
				placeFrontNum("Center", logoBool);
			} else if ((shirtCenter - buffer) > numCenter) {
				// result = "right";
				placeFrontNum("Right", logoBool);
			}

			// return result;

		}

		function placeFrontNum(loc, logoBool) {
			//front logo exists
			//place front number according to change in logo height and width
			if (logoBool) {

				//find spacing between bottom of logo and top of number

				// var numLogoRelationship = numLogoSpacing(artLayers["Front Logo"].pageItems[0],artLayers["Front Number"].pageItems[0],loc)
				var numLogoRelationship = relativeNumPos(loc);

				var vertSpace = numLogoRelationship.v;
				var horzStart = numLogoRelationship.h;

				if (loc == "Center" && FB) {
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
				for (var FN = 0; FN < prepress.length; FN++) {
					var curSize = prepress[FN].name;
					var curLay = prepress[FN];
					var thisPlacedLogo = placedLogos[curSize];
					//find the bottom of the logo of the current size
					var curLogoBot = getLogoBot(curSize);
					// alert(curSize + " : " + curLogoBot);
					var numTop = curLogoBot - vertSpace;
					if (!FB) {
						var dest = curLay.groupItems[curSize + " Front"]
					} else {
						var dest = curLay.groupItems[curSize + " " + loc + " Front"];
					}



					var fNumberCopy = frontNum.duplicate(dest);
					fNumberCopy.name = curSize + " Front Number";
					// fNumberCopy.left = numLeft;
					if (loc == "Right") {
						fNumberCopy.left = thisPlacedLogo.left + horzStart;
					} else if (loc == "Left") {
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
			} else {
				//there is no front logo. position front number
				//relative to the left and top of shirt

				//determine the top and left coordinates of the mockup size shirt
				var mockJersey = prepress[gar.mockupSize].groupItems;
				if (!FB) {
					mockJersey = mockJersey[gar.mockupSize + " Front"];
				} else {
					mockJersey = mockJersey[gar.mockupSize + " " + loc + " Front"];
				}
				var fnRatio = findRatio(frontNum, mockJersey);
				var ratLeft = fnRatio.LP;
				var ratTop = fnRatio.TP;

				for (var FN = 0; FN < prepress.length; FN++) {
					var curSize = prepress[FN].name;
					var curLay = prepress[FN];

					if (!FB)
						var dest = curLay.pageItems[curSize + " Front"];
					else
						var dest = curLay.pageItems[curSize + " " + loc + " Front"];

					var curPlacement = curRatio(dest, fnRatio.LP, fnRatio.TP);
					var fNumberCopy = frontNum.duplicate(dest);
					fNumberCopy.left = dest.left + curPlacement.curLeft;
					fNumberCopy.top = dest.top - curPlacement.curTop;
					fNumberCopy.name = curSize + " Front Number";
				}


			}

			frontNumValid = true;

		}

		function getLogoBot(size) {
			var thisLogo = placedLogos[size];
			var bot = thisLogo.top - thisLogo.height;
			return bot;
		}

		//relativeNumPos Function Description
		//Find the relative position of front logo and front number.
		function relativeNumPos(loc) {
			var result = {};
			var num = frontNum;
			// var logo = artLayers["Front Logo"].pageItems[0];
			var logo = frontLogoLayer.pageItems[0];
			var logoBot = logo.top - logo.height;
			var vertSpace = logoBot - num.top;

			if (loc == "Right") {
				var horzStart = num.left - logo.left;
			} else if (loc == "Left") {
				var horzStart = (logo.left + logo.width) - num.left;
			}

			result.h = horzStart;
			result.v = vertSpace;

			return result;


		}

		function numLogoSpacing(theLogo, theNum, loc) {
			var result = {};
			var logoBot = theLogo.top - theLogo.height;
			var space = logoBot - theNum.top;
			result.vSpace = space;

			var logoCenter = theLogo.left + (theLogo.width / 2);

			if (loc == "Left") {
				var distFromCenter = theNum.left - logoCenter;
				var startPosition = (logoCenter + distFromCenter) - (1.8 * gar.smallestScale);
			} else if (loc == "Right") {
				var distFromCenter = logoCenter - theNum.left;
				var startPosition = (logoCenter - distFromCenter) + (1.8 * gar.smallestScale);
			} else {
				startPosition = theNum.left;
			}

			result.hStart = startPosition;



			return result;

		}

		function findRatio(num, mock) {
			var distFromLeft = num.left - mock.left;
			var distFromTop = mock.top - num.top;

			var leftPercentage = distFromLeft / mock.width;
			var topPercentage = distFromTop / mock.height;

			return {
				LP: leftPercentage,
				TP: topPercentage
			};
		}

		function curRatio(dest, ratLeft, ratTop) {
			var CL = dest.width * ratLeft;
			var CT = dest.height * ratTop;
			return {
				curLeft: CL,
				curTop: CT
			};
		}



		///////////////////
		//Logic Container//
		///////////////////


	},

	"Player Name": function(playerName) {
		if (code.indexOf("5411") > -1 || code.indexOf("250") > -1) {
			var thisLoc = "Outside Cowl";
		} else {
			var thisLoc = "Back";
		}
		if (addArt["Generic"](playerName, thisLoc, "Player Name"))
			return true;
	},

	"Back Number": function(backNum) {
		if (addArt["Generic"](backNum, "Back", "Back Number"))
			return true;
	},

	"Left Sleeve": function(leftSleeve) {
		if (addArt["Generic"](leftSleeve, "Left Sleeve", "Left Sleeve"))
			return true;
	},

	"Right Sleeve": function(rightSleeve) {
		if (addArt["Generic"](rightSleeve, "Right Sleeve", "Right Sleeve"))
			return true;
	},

	"Locker Tag": function(lockerTag) {
		if (code.indexOf("3007") > -1) {
			var ltDest = "Cowl Yoke";
		} else {
			var ltDest = "Back";
		}
		if (addArt["Generic"](lockerTag, ltDest, "Locker Tag"))
			return true;
	},

	"Sponsor Logo": function(sponsorLogo) {
		if (addArt["Generic"](sponsorLogo, "Back", "Sponsor Logo"))
			return true;
	},

	"Left Hood": function(leftHood) {
		var scale;
		var hoodPiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Left Outside Hood"];
		if (hoodPiece.width <= leftHood.width)
			scale = hoodPiece.width / leftHood.width;
		else
			scale = leftHood.width / hoodPiece.width;
		if (addArt["Generic"](leftHood, "Left Outside Hood", "Left Hood Logo", scale))
			return true;
	},

	"Right Hood": function(rightHood) {
		var scale;
		var hoodPiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Right Outside Hood"];
		if (hoodPiece.width <= rightHood.width)
			scale = hoodPiece.width / rightHood.width;
		else
			scale = rightHood.width / hoodPiece.width;
		if (addArt["Generic"](rightHood, "Right Outside Hood", "Right Hood Logo", scale))
			return true;
	},

	"Front Pocket": function(frontPocket) {
		var scale;
		var pocketPiece = prepress[gar.mockupSize].groupItems[gar.mockupSize + " Pocket"];
		if (frontPocket.width <= pocketPiece.width)
			scale = frontPocket.width / pocketPiece.width;
		else
			scale = pocketPiece.width / frontPocket.width;

		if (addArt["Generic"](frontPocket, "Pocket", "Front Pocket Logo", scale))
			return true;
	},

	"Left Cowl": function(leftCowl) {
		if (addArt["Generic"](leftCowl, "Outside Cowl", "Left Cowl"))
			return true;
	},

	"Right Cowl": function(rightCowl) {
		if (addArt["Generic"](rightCowl, "Outside Cowl", "Right Cowl"))
			return true;
	},

	"Left Leg": function(leftLeg, pantsSizing) {
		if (pantsSizing) {
			//generic function won't work with this sizing structure.
			//loop each size layer and find all instances of "left leg art" 
			//and add the artwork locally rather than calling generic function.
			for (var g = 0; g < prepress.length; g++) {
				var curSize = prepress[g].name;
				var curLay = prepress[g];
				for (var pan = 0; pan < curLay.groupItems.length; pan++) {
					var thisItem = curLay.groupItems[pan];
					if (thisItem.name.indexOf("Left Leg Panel") > -1) {
						var artCopy = leftLeg.duplicate();
						artCopy.moveToBeginning(thisItem);
					}
				}
			}
			return true;

		} else {
			if (code.indexOf("5060W") > -1) {
				var pantsDest = "Front Left Leg";
			} else {
				var pantsDest = "Left Leg Panel";
			}

			if (addArt["Generic"](leftLeg, pantsDest, "Left Leg Art"))
				return true;
		}
	},

	"Right Leg": function(rightLeg, pantsSizing) {
		if (pantsSizing) {
			//generic function won't work with this sizing structure.
			//loop each size layer and find all instances of "left leg art" 
			//and add the artwork locally rather than calling generic function.
			for (var g = 0; g < prepress.length; g++) {
				var curSize = prepress[g].name;
				var curLay = prepress[g];
				for (var pan = 0; pan < curLay.groupItems.length; pan++) {
					var thisItem = curLay.groupItems[pan];
					if (thisItem.name.indexOf("Right Leg Panel") > -1) {
						var artCopy = rightLeg.duplicate();
						artCopy.moveToBeginning(thisItem);
					}
				}
			}
			return true;

		} else {
			if (code.indexOf("5060W") > -1) {
				var pantsDest = "Front Right Leg";
			} else {
				var pantsDest = "Right Leg Panel";
			}

			if (addArt["Generic"](rightLeg, pantsDest, "Right Leg Art"))
				return true;
		}
	},

	"Right Front Leg": function(rightLeg) {
		if (addArt["Generic"](rightLeg, "Front Right", "Front Right Art"))
			return true;
	},


	"Collar Art": function(collarArt) {
		if (addArt["Generic"](collarArt, "Inside Collar", "Collar Art"))
			return true;
	},

	"BT_Logo": function(logo) {
		var localValid = true;
		try {
			for (var btl = 0; btl < prepress["Front"].groupItems.length; btl++) {
				var thisTag = prepress["Front"].groupItems[btl];
				if (addArt["Bag Tag Art"](logo, ("Front" + (btl + 1)), "Bag Tag Logo")) {
					localValid = true;
				} else {
					localValid = false;
				}
			}
		} catch (e) {
			alert(e);
		}
		return localValid

	},

	"BT_Player Name": function(name) {
		var localValid = true;
		try {
			for (var btl = 0; btl < prepress["Front"].groupItems.length; btl++) {
				var thisTag = prepress["Front"].groupItems[btl];
				if (addArt["Bag Tag Art"](name, ("Front" + (btl + 1)), "Bag Tag Name")) {
					localValid = true;
				} else {
					localValid = false;
				}
			}
		} catch (e) {
			alert(e);
		}
		return localValid
	},

	"BT_Player Number": function(number) {
		var localValid = true;
		try {
			for (var btl = 0; btl < prepress["Front"].groupItems.length; btl++) {
				var thisTag = prepress["Front"].groupItems[btl];
				if (addArt["Bag Tag Art"](number, ("Front" + (btl + 1)), "Bag Tag Number")) {
					localValid = true;
				} else {
					localValid = false;
				}
			}
		} catch (e) {
			alert(e);
		}
		return localValid
	},

	"Bag Tag Art": function(art, loc, name) {
		var dest = prepress["Front"].groupItems[loc];
		var artCopy = art.duplicate();
		artCopy.moveToBeginning(dest);
		artCopy.name = name;
		return true;
	},

	"Additional Art": function(additionalArt) {
		var addArtSuccess = false;
		var addArtLoc = [];

		if (artLoc.name.toLowerCase().indexOf(" n") > -1) {
			var scaleBool = false;
		} else {
			var scaleBool = true;
		}


		//loop all pageItems on additional art layer
		//determine the piece with which the art shares bounds
		//run generic function using that shirt piece
		for (var aa = 0; aa < additionalArt.length; aa++) {
			addArtLoc = [];
			var destGroup;
			var curAddArt = additionalArt[aa];
			var localValid = false;

			//loop the potential destinations to find overlap
			for (var pd = 0; pd < prepress[gar.mockupSize].groupItems.length; pd++) {
				var curGroup = prepress[gar.mockupSize].groupItems[pd];
				if (validDest(curGroup, curGroup.name.toLowerCase(), curAddArt) && intersect(curAddArt, curGroup)) {
					destGroup = curGroup;
					addArtLoc.push(curGroup.name.substring(curGroup.name.indexOf(" ") + 1, curGroup.name.length));
				}
			}

			if (addArtLoc.length == 0) {
				errorList.push("One or more pieces of Additional Art are not on top of a vailid destination.");
				valid = false;
				return false;
			} else if (addArtLoc.length > 1) {
				//eventually add logic here to determine most likely destination based on how much overlap
				//or possibly add scriptUI buttons to prompt user to choose which piece
				errorList.push("One or more pieces of Additional Art are intersecting with too many pieces of art.");
				valid = false;
				return false;
			} else {
				if (!scaleBool) {
					var scale = undefined;
				} else {
					var scale = getScale(curAddArt, destGroup);
				}

				var placement = getPlacement(curAddArt, destGroup);
				if (!addArt["Generic"](curAddArt, addArtLoc[0], "Additional Art", scale, placement))
					return false;
				else {
					localValid = true;

				}

			}

		}

		if (localValid)
			return true;


		//Logic Container

		function intersect(art, dest) {
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
			if (((AL >= DL && AL <= DR) || (AR >= DL && AR <= DR)) && ((AT <= DT && AT >= DB) || (AB <= DT && AB >= DB)))
			//this art intersects this destination on one or two sides  
				intersect = true;
			else if ((((AL <= DR && AL >= DL) || (AL <= DL && AR >= DL)) && (AT >= DT && AB <= DB)) || (((AB <= DT && AB >= DB) || (AT >= DB && AT <= DT)) && AL <= DL && AR >= DR)) {
				//art covers 3 sides of dest piece
				intersect = true;
			} else if (AT >= DT && AR >= DR && AB <= DB && AL <= DL) {
				//art completely covers dest piece
				intersect = true;
			}

			return intersect;
		}

		function getScale(art, dest) {
			// if(!scaleBool)
			// {
			// 	return undefined;
			// }
			var ratio = art.width / dest.width;
			return ratio;
		}

		function getPlacement(art, dest) {
			var result = {};
			var left = ((art.left + art.width / 2) - dest.left) / dest.width;
			var top = (dest.top - (art.top + art.height / 2)) / dest.height;
			result.left = left;
			result.top = top;
			return result;
		}

		function validDest(curGroup, curGroupName, art) {
			var result = true;
			var undesirable = ["collar", "waistband", "cuff", "placard", "placket", "side"];

			for (var vd = 0; vd < undesirable.length; vd++) {
				if (curGroupName.indexOf(undesirable[vd]) > -1) {
					result = false;
					break;
				}
			}
			return result;
		}

	},



	"Generic": function(art, loc, name, scale, placement) {
		for (var g = 0; g < prepress.length; g++) {
			var curSize = prepress[g].name;
			var curLay = prepress[g];
			var dest = curLay.groupItems[curSize + " " + loc];
			var artCopy = art.duplicate();
			artCopy.name = curSize + " " + name;
			if (scale != undefined) {
				var newWidth = dest.width * scale;
				var newScale = (newWidth / artCopy.width) * 100;
				if (loc == "Pocket" || loc.indexOf("Hood") > -1)
					artCopy.resize(newScale, newScale, true, true, true, true, newScale, Transformation.BOTTOM);
				else {
					var leftR = (placement.left * dest.width);
					var topR = (placement.top * dest.height);
					artCopy.resize(newScale, newScale, true, true, true, true, newScale);
					artCopy.left = (dest.left - artCopy.width / 2) + leftR;
					artCopy.top = (dest.top - artCopy.height / 2) - topR;
				}


			}
			artCopy.moveToBeginning(dest);
			if (artCopy.name.indexOf("Additional") > -1) {
				artCopy.zOrder(ZOrderMethod.SENDTOBACK);
				artCopy.zOrder(ZOrderMethod.BRINGFORWARD);
			}
		}
		return true;
	}
}