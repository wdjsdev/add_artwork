/*
	Component Name: add_art_functions
	Author: William Dowling
	Creation Date: 26 June 2023
	Description: 
		add the current artwork to all sizes of the current garment
	Arguments
		args object containing the following properties:
			data = data object containing the placement coordinates
			srcArt = the artwork to be added
			curGarmentLay = the current garment layer
			destPieceName = the name of the piece that art should be added to
	Return value
		none

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

	//locate the largest pathItem in the group
	//this will be used to make a clipping mask if the art extends outside the piece
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
