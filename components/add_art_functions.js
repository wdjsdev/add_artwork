/*
	Component Name: add_art_functions
	Author: William Dowling
	Creation Date: 10 July, 2017
	Description: 
		A container for all of the artwork specific 'add art' functions.
	Arguments
		none
	Return value
		each function returns it's own values

*/


function addArt ( args )
{
	var data = args.data;
	var srcArt = args.srcArt;
	var curGarmentLay = args.curGarmentLay;
	var destPieceName = args.destPieceName;
	var ppLay = findSpecificLayer( curGarmentLay, "Prepress" );
	ppLay.locked = !( ppLay.visible = true );


	var masterArtLay = findSpecificLayer( curGarmentLay, "Artwork", "any" );
	var artLayName = srcArt.parent.name;

	log.l( "Adding art for art layer: " + artLayName + " and piece: " + destPieceName + "." )

	var logoScaleAmount = 3.2; //this represents half an inch of scale per size

	var srcFrontLogo; //used to determine relative placement of front number
	var frontLogoLayer = findSpecificLayer( masterArtLay, "front logo" );
	frontLogoLayer ? ( srcFrontLogo = ( frontLogoLayer.pageItems.length > 0 ) ? frontLogoLayer.pageItems[ 0 ] : undefined ) : null;

	var mockSize = data.mockupSize;
	var mockSizeLay = findSpecificLayer( ppLay, mockSize );
	var mockSizeDest = findSpecificPageItem( mockSizeLay, new RegExp( destPieceName + "$", "i" ) );

	var srcArtBounds = getBoundsData( srcArt );
	var mockSizeDestBounds = getBoundsData( mockSizeDest );

	var artType = artLayName.match( /front logo/i ) ? "Front Logo" : artLayName.replace( /[-_]n.*/i, "" );
	// $.writeln( "artType = " + artType );
	var scaleType = artLayName.match( /[-_]n/i ) ? "" : ( artType.match( /front logo/i ) ? "standard" : ( artType.match( /pocket|hood|additional/i ) ? "proportional" : "" ) );

	//if the artType is a pocket and its not set to "no scale" and it fits within the mockup piece, then set the scaleType to ""
	//if the art overlaps the edge of the mockup piece, then set the scaleType to "proportional"
	( artType.match( /pocket/i ) && scaleType && isContainedWithin( srcArt, mockSizeDest ) ) ? scaleType = "" : null;

	//if the scaleType is standard, then get the smallest scale
	//this is an integer indicating how many half inch increments will be used to shrink the logo to fit on the smallest size
	var smallestScale = scaleType === "standard" ? getSmallestScale( data ) : 0;

	var relativePlacement = null;
	var relativeX, relativeY;
	//if the scaleType is proportional or the artType is a front number, get the relative placement of the art
	if ( scaleType === "proportional" )
	{
		var maxPropDimLabel = mockSizeDestBounds.width > mockSizeDestBounds.height ? "width" : "height";
		var proportionalScaleRatio = mockSizeDestBounds[ maxPropDimLabel ] / srcArtBounds[ maxPropDimLabel ];
		// proportionalScaleRatio *= 100;
		//relativePlacement is an array of 2 numbers, representing the x and y offset of the art from the top left corner of the mockup piece as a percentage of overall width and height
		relativeX = ( mockSizeDestBounds.hc - srcArtBounds.hc ) / mockSizeDestBounds.width;
		relativeY = ( mockSizeDestBounds.vc - srcArtBounds.vc ) / mockSizeDestBounds.height;
		relativePlacement = [ relativeX, relativeY ];
	}
	else if ( artType.match( /front number/i ) && srcFrontLogo )
	{
		//relativePlacement is an array of 2 numbers
		//if the number is in the middle of the the front logo, then x = 0, and y is the distance between the bottom of the logo and the top of the number
		var frontLogoBounds = getBoundsData( srcFrontLogo );
		relativeY = frontLogoBounds.bottom - srcArtBounds.top;
		if ( srcArtBounds.hc - 5 < frontLogoBounds.hc && srcArtBounds.hc + 5 > frontLogoBounds.hc )
		{
			//this is a centered number.
			relativeX = 0;
		}
		else 
		{
			//this is a left or right number
			//get a relative x value based on the distance between the left edge of the number and the center of the front logo
			//as a percentage of the width of the front logo
			relativeX = ( frontLogoBounds.hc - srcArtBounds.hc ) / frontLogoBounds.width;

		}
		relativePlacement = [ relativeX, relativeY ];
	}
	else if ( artType.match( /front number/i ) && !srcFrontLogo )
	{
		//this is a front number, but there is no front logo.
		//get the relativePlacement relative to the mockup piece
		relativeX = ( srcArtBounds.left - mockSizeDestBounds.left ) / mockSizeDestBounds.width;
		relativeY = ( srcArtBounds.top - mockSizeDestBounds.top ) / mockSizeDestBounds.height;
		relativePlacement = [ relativeX, relativeY ];

	}



	var ppSizeLayers = afc( ppLay, "layers" );
	ppSizeLayers.forEach( function ( sizeLay, sizeLayIndex )
	{
		log.l( "doing sizeLay: " + sizeLay.name );
		sizeLay.locked = !( sizeLay.visible = true );

		findAllPageItems( sizeLay, new RegExp( destPieceName + "$", "i" ) ).forEach( function ( destPiece )
		{
			var artGroup = findSpecificPageItem( destPiece, "Art Group" );
			if ( !artGroup )
			{
				artGroup = sizeLay.groupItems.add();
				artGroup.name = "Art Group";
				artGroup.moveToBeginning( destPiece );
			}
			destPiece.locked = destPiece.hidden = false;
			var destPieceBounds = getBoundsData( destPiece );
			var destPieceMaxDimLabel = destPieceBounds.width > destPieceBounds.height ? "width" : "height";
			var artCopy = srcArt.duplicate();
			artCopy.name = sizeLay.name + " " + artType;
			var artCopyBounds = getBoundsData( artCopy );
			var curSizeFrontLogo = findSpecificPageItem( artGroup, "front logo", "any" );
			log.l( "scaleType: " + scaleType );
			if ( scaleType === "standard" )
			{
				var maxDimLabel = artCopyBounds.width > artCopyBounds.height ? "width" : "height";
				var maxDim = artCopyBounds[ maxDimLabel ];
				var scaleFactor = ( smallestScale - sizeLayIndex ) * logoScaleAmount;
				var newDim = maxDim - scaleFactor;
				var scaleRatio = ( newDim / maxDim ) * 100;
				artCopy.resize( scaleRatio, scaleRatio, true, true, true, true, scaleRatio, Transformation.TOP );
			}
			else if ( scaleType === "proportional" )
			{
				//scale the artCopy to the same proportional size as the mockup piece
				var newDim = destPieceBounds[ destPieceMaxDimLabel ] / proportionalScaleRatio;
				var newScale = ( newDim / artCopyBounds[ destPieceMaxDimLabel ] ) * 100;
				artCopy.resize( newScale, newScale, true, true, true, true, newScale, Transformation.CENTER );
			}

			if ( relativePlacement )
			{
				log.l( "relativePlacement: " + relativePlacement );
				if ( artType.match( /front number/i ) && curSizeFrontLogo )
				{
					var curSizeFrontLogoBounds = getBoundsData( curSizeFrontLogo );
					artCopy.top = curSizeFrontLogoBounds.bottom - relativePlacement[ 1 ];
					align( curSizeFrontLogo, [ artCopy ], "hcenter" );
					artCopy.left -= ( relativePlacement[ 0 ] * curSizeFrontLogoBounds.width );
				}
				else 
				{
					align( destPiece, [ artCopy ], "center" );
					artCopy.left -= ( relativePlacement[ 0 ] * destPieceBounds.width );
					artCopy.top -= ( relativePlacement[ 1 ] * destPieceBounds.height );
					// artCopy.position = [ destPieceBounds.left - ( relativePlacement[ 0 ] * destPieceBounds.width ), destPieceBounds.top - ( relativePlacement[ 1 ] * destPieceBounds.height ) ];

				}

			}

			//check to see whether the art is contained within the mockup piece
			//if not, make a clipping mask to hide the excess
			var clipMask = findSpecificPageItem( destPiece, "clip mask", "any" );

			if ( !isContainedWithin( artCopy, destPiece ) )
			{
				log.l( "art needs to be clipped" )
				if ( !clipMask )
				{
					log.l( "no clip mask found, making one" )
					makeClipMask( destPiece )
				}
			}

			artCopy.moveToEnd( artGroup );
			if ( clipMask )
			{
				clipMask.zOrder( ZOrderMethod.BRINGTOFRONT );
			}
		} )

	} )
}

function findLargestPath ( item )
{
	var largestArea = 0;
	var largestPath;
	if ( item.typename.match( /pathitem/i ) )
	{
		return item;
	}
	else if ( item.typename.match( /groupitem/i ) )
	{
		dig( item );
	}

	return largestPath;

	function dig ( subItem ) 
	{
		if ( subItem.typename.match( /groupitem/i ) )
		{
			afc( subItem, "pageItems" ).forEach( function ( g )
			{
				dig( g );
			} )
		}
		else if ( subItem.typename.match( /pathitem/i ) )
		{
			var area = subItem.width * subItem.height;
			if ( area > largestArea )
			{
				largestArea = Math.abs( area );
				largestPath = subItem;
			}
		}
	}
}



// var addArt = {
// 	"Front Logo": function ( logo, dest, sfl, placement, smallestScale )
// 	{
// 		var result = true;
// 		log.h( "Beginning execution of front logo function." );

// 		if ( logo.width > 50 )
// 		{
// 			//regular full chest logo
// 			result = regularLogo();
// 		}
// 		else
// 		{
// 			//smaller logo. prompt user for logo type
// 			//could be left/right chest or small center chest
// 			result = promptForLogoType();
// 		}


// 		///////Begin/////////
// 		///Logic Container///
// 		/////////////////////

// 		function regularLogo ()
// 		{
// 			var result = true;
// 			var logoTop = logo.top;
// 			logoType = "regularLogo";

// 			//loop the prepress layers to add the art to the dest piece of each size
// 			var logoCopy;

// 			logoCopy = logo.duplicate();

// 			if ( sfl )
// 			{
// 				// smallestScale = getSmallestScale( ppLay );
// 				var newWidth = logo.width - ( smallestScale * 3.6 );
// 				var scaleFactor = ( newWidth / logo.width ) * 100;
// 				logoCopy.resize( scaleFactor, scaleFactor, true, true, true, true, scaleFactor, Transformation.TOP );
// 			}
// 			else
// 			{
// 				smallestScale = 0;
// 			}

// 			result = addArt[ "Generic" ]( logoCopy, dest, "Front Logo", sfl );

// 			logoCopy.remove();

// 			return result;
// 		}

// 		function sideChestLogo ()
// 		{
// 			var result = true;
// 			//get the dest piece for the mockup size to measure the 
// 			//proportional placement
// 			// var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
// 			if ( !placement )
// 			{
// 				placement = getPlacement( logo, mockSizeDest );
// 			}

// 			result = addArt[ "Generic" ]( logo, dest, "Side Chest Logo", null, placement );

// 			return result;
// 		}

// 		function promptForLogoType ()
// 		{
// 			var result;

// 			/* beautify ignore:start */
// 			var w = new Window( "dialog", curGarment.name );
// 			var txtGroup = w.add( "group" );
// 			txtGroup.orientation = "column";
// 			var garTxt = txtGroup.add( "statictext", undefined, curGarment.name );
// 			var topTxt = txtGroup.add( "statictext", undefined, "Regular Logo or Left/Right Chest?" );

// 			var btnGroup = w.add( "group" );
// 			btnGroup.orientation = "column";
// 			var reg = btnGroup.add( "button", undefined, "Regular Front Logo" );
// 			reg.onClick = function ()
// 			{
// 				if ( !regularLogo() )
// 				{
// 					result = false;
// 					errorList.push( "Failed while adding the front logo to: " + curGarment.name );
// 					log.e( "Failed while adding the front logo to: " + curGarment.name );
// 				}
// 				w.close();
// 			}
// 			var lrChest = btnGroup.add( "button", undefined, "Left/Right Chest" );
// 			lrChest.onClick = function ()
// 			{
// 				logoType = "sideChest";
// 				if ( !sideChestLogo() )
// 				{
// 					result = false;
// 					errorList.push( "Failed while adding the front logo to: " + curGarment.name );
// 					log.e( "Failed while adding the front logo to: " + curGarment.name );
// 				}
// 				w.close();
// 			}
// 			w.show();
// 			/* beautify ignore:end */

// 			return result;
// 		}

// 		return result;
// 	},

// 	"Front Number": function ( art, dest, scale )
// 	{
// 		var result = true;

// 		var centerNumber = false;
// 		var centerBuffer = 10;
// 		var artCenter = art.left + art.width / 2;
// 		// var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
// 		var mockSizeDestCenter = mockSizeDest.left + mockSizeDest.width / 2;

// 		var frontNumPlacement = { "vertSpace": undefined, "horzSpace": undefined, "counter": undefined, "inc": undefined, "center": undefined };
// 		var placement = null;

// 		//check whether this is a split front garment
// 		//like full button or full zip
// 		var splitFrontPat = /((front|left|right) ?){2}/ig;

// 		if ( artCenter + centerBuffer > mockSizeDestCenter && artCenter - centerBuffer < mockSizeDestCenter && !splitFrontPat.test( dest ) )
// 		{
// 			centerNumber = true;
// 		}

// 		if ( !logoType || logoType === "sideChest" )
// 		{
// 			if ( !centerNumber )
// 			{
// 				placement = getPlacement( art, mockSizeDest );
// 			}
// 			if ( scale === false )
// 			{
// 				placement = null;
// 			}
// 			result = addArt[ "Generic" ]( art, dest, "Front Number", null, placement );
// 		}
// 		else
// 		{
// 			var logoCenter = ( placedLogos[ data.mockupSize ].left + placedLogos[ data.mockupSize ].width / 2 );
// 			var vertSpace = ( placedLogos[ data.mockupSize ].top - placedLogos[ data.mockupSize ].height ) - art.top;
// 			var horzSpace = art.left - logoCenter;
// 			frontNumPlacement.vertSpace = vertSpace;
// 			if ( centerNumber )
// 			{
// 				frontNumPlacement.horzSpace = null;
// 			}
// 			else
// 			{
// 				frontNumPlacement.horzSpace = horzSpace;
// 			}
// 			frontNumPlacement.counter = smallestScale;
// 			frontNumPlacement.inc = -1;

// 			if ( artCenter < logoCenter )
// 			{
// 				frontNumPlacement.inc = 1;
// 				frontNumPlacement.counter *= -1;
// 			}

// 			if ( scale === false )
// 			{
// 				frontNumPlacement = null;
// 			}
// 			result = addArt[ "Generic" ]( art, dest, "Front Number", null, frontNumPlacement );
// 		}

// 		return result;
// 	},

// 	"Pocket": function ( art, dest, scale, placement )
// 	{
// 		//check to see if pocket art intersects the "Front" piece as well
// 		var result = true;
// 		var overflowLocs = [];

// 		var mockSizeLay = findSpecificLayer( ppLay, data.mockupSize );
// 		// var mockSizeDest = findSpecificPageItem(mockSizeLay,dest);
// 		if ( isContainedWithin( art, mockSizeDest ) )
// 		{
// 			result = addArt[ "Generic" ]( art, dest, "Pocket", scale, placement );
// 		}
// 		else
// 		{
// 			overflowLocs = getDest( art, data.mockupSize );
// 			overflowLocs.splice( overflowLocs.indexOf( dest ), 1 );
// 			result = addArt[ "Generic" ]( art, dest, "Pocket", scale, placement, undefined, overflowLocs );
// 		}

// 		return result;
// 	},

// 	"Additional Art": function ( art, dest, scale, placement )
// 	{
// 		var result = true;
// 		// var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
// 		// var placement = getPlacement(art, mockSizeDest);
// 		result = addArt[ "Generic" ]( art, dest, "Additional Art", scale, placement );
// 		return result;
// 	},

// 	//bag tag functions
// 	"BT_Logo": function ( logo )
// 	{
// 		var localValid = true;
// 		try
// 		{
// 			for ( var btl = 0; btl < ppLay.layers[ "Front" ].groupItems.length; btl++ )
// 			{
// 				var thisTag = ppLay.layers[ "Front" ].groupItems[ btl ];
// 				if ( addArt[ "Bag Tag Art" ]( logo, ( "Front" + ( btl + 1 ) ), "Bag Tag Logo" ) )
// 				{
// 					localValid = true;
// 				}
// 				else
// 				{
// 					localValid = false;
// 				}
// 			}
// 		}
// 		catch ( e )
// 		{
// 			alert( e );
// 		}
// 		return localValid
// 	},

// 	"BT_Player Name": function ( name )
// 	{
// 		var localValid = true;
// 		try
// 		{
// 			for ( var btl = 0; btl < ppLay.layers[ "Front" ].groupItems.length; btl++ )
// 			{
// 				var thisTag = ppLay.layers[ "Front" ].groupItems[ btl ];
// 				if ( addArt[ "Bag Tag Art" ]( name, ( "Front" + ( btl + 1 ) ), "Bag Tag Name" ) )
// 				{
// 					localValid = true;
// 				}
// 				else
// 				{
// 					localValid = false;
// 				}
// 			}
// 		}
// 		catch ( e )
// 		{
// 			alert( e );
// 		}
// 		return localValid
// 	},

// 	"BT_Player Number": function ( number )
// 	{
// 		var localValid = true;
// 		try
// 		{
// 			for ( var btl = 0; btl < ppLay.layers[ "Front" ].groupItems.length; btl++ )
// 			{
// 				var thisTag = ppLay.layers[ "Front" ].groupItems[ btl ];
// 				if ( addArt[ "Bag Tag Art" ]( number, ( "Front" + ( btl + 1 ) ), "Bag Tag Number" ) )
// 				{
// 					localValid = true;
// 				}
// 				else
// 				{
// 					localValid = false;
// 				}
// 			}
// 		}
// 		catch ( e )
// 		{
// 			alert( e );
// 		}
// 		return localValid
// 	},

// 	"Bag Tag Art": function ( art, loc, name )
// 	{
// 		var dest = ppLay.layers[ "Front" ].groupItems[ loc ];
// 		var artCopy = art.duplicate();
// 		artCopy.moveToBeginning( dest );
// 		artCopy.name = name;
// 		return true;
// 	},

// 	"Generic": function ( art, loc, name, scale, placement, frontNumPlacement, overflowLoc )
// 	{
// 		var result = true,
// 			ppLen = ppLay.layers.length,
// 			mockSizeLayer = findSpecificLayer( ppLay, data.mockupSize ),
// 			mockSizeDest = findSpecificPageItem( mockSizeLayer, data.mockupSize + " " + loc, "match" ),
// 			destLen,
// 			curSize,
// 			curLay,
// 			dest,
// 			lowName = name.toLowerCase(),
// 			artCopy,
// 			newWidth = art.width,
// 			widthIncrement = 3.6,
// 			newScale = 100,
// 			propScale,
// 			leftR,
// 			topR,
// 			artTop = art.top;

// 		if ( scale === "proportional" )
// 		{
// 			propScale = art.width / mockSizeDest.width;
// 		}

// 		for ( var g = 0; g < ppLen; g++ )
// 		{
// 			curSize = ppLay.layers[ g ].name;
// 			curLay = ppLay.layers[ g ];
// 			destLen = curLay.pageItems.length;
// 			for ( var d = 0; d < destLen; d++ )
// 			{
// 				// dest = curLay.groupItems[curSize + " " + loc];
// 				dest = curLay.pageItems[ d ];
// 				if ( dest.name.substring( dest.name.indexOf( " " ) + 1, dest.name.length ) !== loc )
// 				{
// 					continue;
// 				}

// 				artCopy = art.duplicate();
// 				artCopy.name = curSize + " " + name;

// 				if ( scale === "standard" )
// 				{
// 					artCopy.resize( newScale, newScale, true, true, true, true, newScale );
// 					newWidth += widthIncrement;
// 					newScale = ( newWidth / art.width ) * 100;
// 				}
// 				else if ( scale === "proportional" )
// 				{
// 					newWidth = dest.width * propScale;
// 					newScale = ( newWidth / artCopy.width ) * 100;
// 					artCopy.resize( newScale, newScale, true, true, true, true, newScale );
// 				}

// 				if ( placement )
// 				{
// 					leftR = ( placement.left * dest.width );
// 					topR = ( placement.top * dest.height );
// 					artCopy.left = ( dest.left - artCopy.width / 2 ) + leftR;
// 					artCopy.top = ( dest.top + artCopy.height / 2 ) - topR;
// 				}
// 				else if ( frontNumPlacement )
// 				{
// 					if ( frontNumPlacement.horzSpace )
// 					{
// 						artCopy.left = ( placedLogos[ curSize ].left + placedLogos[ curSize ].width / 2 ) + ( frontNumPlacement.horzSpace - ( 1.8 * frontNumPlacement.counter ) );
// 					}
// 					artCopy.top = placedLogos[ curSize ].top - ( placedLogos[ curSize ].height + frontNumPlacement.vertSpace );
// 					frontNumPlacement.counter += frontNumPlacement.inc;
// 				}
// 				else
// 				{
// 					artCopy.top = artTop;
// 				}

// 				if ( overflow( artCopy, dest ) && lowName.indexOf( "additional" ) === -1 )
// 				{
// 					// artCopy = makeClipMask(artCopy, dest);
// 					makeClipMask( artCopy, dest );
// 				}
// 				else
// 				{
// 					log.l( "moving " + artCopy.name + " to " + dest.name );
// 					artCopy.moveToBeginning( dest );
// 				}

// 				if ( overflowLoc && overflowLoc.length )
// 				{
// 					var overflowLocPiece, overflowArt;
// 					//get the overflow loc piece from the prepress layer
// 					for ( var of = 0, ofLen = overflowLoc.length; of < ofLen; of++ )
// 					{
// 						overflowLocPiece = findSpecificPageItem( curLay, overflowLoc[ of ] );
// 						if ( overflowLocPiece )
// 						{
// 							overflowArt = artCopy.duplicate( overflowLocPiece );
// 						}
// 					}

// 				}

// 				if ( lowName.indexOf( "additional" ) > -1 )
// 				{
// 					artCopy.zOrder( ZOrderMethod.SENDTOBACK );
// 					artCopy.zOrder( ZOrderMethod.BRINGFORWARD );
// 				}
// 				else if ( lowName.indexOf( "front logo" ) > -1 )
// 				{
// 					sendLogoInfo( artCopy, curSize );
// 				}
// 			}

// 		}
// 		return result;
// 	}
// }