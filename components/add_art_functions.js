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
	var scaleType = artLayName.match( /[-_]n/i ) ? "" : ( ( artType.match( /front logo/i ) && srcArtBounds.maxDim > 50 ) ? "standard" : ( artType.match( /pocket|hood|additional/i ) ? "proportional" : "" ) );

	//if the artType is a pocket and its not set to "no scale" and it fits within the mockup piece, then set the scaleType to ""
	//if the art overlaps the edge of the mockup piece, then set the scaleType to "proportional"
	( artType.match( /pocket/i ) && scaleType && isContainedWithin( srcArt, mockSizeDest ) ) ? scaleType = "" : null;



	//if the scaleType is standard, then get the smallest scale
	//this is an integer indicating how many half inch increments will be used to shrink the logo to fit on the smallest size
	var smallestScale = scaleType === "standard" ? getSmallestScale( data ) : 0;


	var srcFrontLogoBounds, alignToFrontLogo;
	if ( srcFrontLogo )
	{
		srcFrontLogoBounds = getBoundsData( srcFrontLogo );
		alignToFrontLogo = artType.match( /front number/i ) && srcFrontLogoBounds.maxDim > 50;

	}


	var relativePlacement = null;
	var relativeX = 0, relativeY = 0;
	//if the scaleType is proportional or the artType is a front number, get the relative placement of the art
	if ( scaleType === "proportional" )
	{
		var proportionalScaleRatio = mockSizeDestBounds[ mockSizeDestBounds.maxDimProp ] / srcArtBounds[ mockSizeDestBounds.maxDimProp ];
		//relativePlacement is an array of 2 numbers, representing the x and y offset of the art from the top left corner of the mockup piece as a percentage of overall width and height
		relativeX = ( mockSizeDestBounds.hc - srcArtBounds.hc ) / mockSizeDestBounds.width;
		relativeY = ( mockSizeDestBounds.vc - srcArtBounds.vc ) / mockSizeDestBounds.height;
	}
	else if ( artType.match( /front number/i ) )
	{
		if ( alignToFrontLogo )
		{
			relativeX = ( srcFrontLogoBounds.hc - 5 < srcArtBounds.hc && srcFrontLogoBounds.hc + 5 > srcArtBounds.hc ) ? 0 : ( srcFrontLogoBounds.hc - srcArtBounds.hc ) / srcFrontLogoBounds.width;
			relativeY = srcFrontLogoBounds.bottom - srcArtBounds.top;
		}
		else 
		{
			relativeX = ( mockSizeDestBounds.hc - 5 < srcArtBounds.hc && mockSizeDestBounds.hc + 5 > srcArtBounds.hc ) ? 0 : ( mockSizeDestBounds.hc - srcArtBounds.hc ) / mockSizeDestBounds.width;
		}
	}
	else if ( artType.match( /front logo/i ) && !scaleType )
	{
		relativeX = ( srcArtBounds.hc - 5 < mockSizeDestBounds.hc && srcArtBounds.hc + 5 > mockSizeDestBounds.hc ) ? 0 : ( mockSizeDestBounds.hc - srcArtBounds.hc ) / mockSizeDestBounds.width;
		relativeY = ( mockSizeDestBounds.vc - srcArtBounds.vc ) / mockSizeDestBounds.height;
	}

	relativePlacement = [ relativeX, relativeY ];

	log.l( "finished setup for art layer " + artLayName + " and piece " + destPieceName + "." )
	log.l( "artType: " + artType );
	log.l( "scaleType: " + scaleType );
	log.l( "relativePlacement: " + relativePlacement );
	log.l( "smallestScale: " + smallestScale );
	log.l( "alignToFrontLogo: " + alignToFrontLogo );




	var ppSizeLayers = afc( ppLay, "layers" );
	ppSizeLayers.forEach( function ( sizeLay, sizeLayIndex )
	{
		sizeLay.locked = !( sizeLay.visible = true );
		var curSizeItems = findAllPageItems( sizeLay, new RegExp( destPieceName + "$", "i" ) );
		curSizeItems.forEach( function ( destPiece )
		{
			log.l( "adding art to " + destPiece.name );
			var artGroup = findSpecificPageItem( destPiece, "Art Group" );
			if ( !artGroup )
			{
				artGroup = sizeLay.groupItems.add();
				artGroup.name = "Art Group";
				artGroup.moveToBeginning( destPiece );
			}
			destPiece.locked = destPiece.hidden = false;
			var destPieceBounds = getBoundsData( destPiece );
			var artCopy = srcArt.duplicate();
			artCopy.name = sizeLay.name + " " + artType;
			var artCopyBounds = getBoundsData( artCopy );
			var curSizeFrontLogo = findSpecificPageItem( artGroup, "front logo", "any" );
			if ( scaleType === "standard" )
			{
				var maxDim = artCopyBounds.maxDim;
				var scaleFactor = ( smallestScale - sizeLayIndex ) * logoScaleAmount;
				var newDim = ( Math.round( maxDim * 100 ) / 100 ) - scaleFactor;
				var scaleRatio = ( newDim / maxDim ) * 100;
				artCopy.resize( scaleRatio, scaleRatio, true, true, true, true, scaleRatio, Transformation.TOP );
			}
			else if ( scaleType === "proportional" )
			{
				//scale the artCopy to the same proportional size as the mockup piece
				var newDim = destPieceBounds.maxDim / proportionalScaleRatio;
				var newScale = ( newDim / artCopyBounds[ destPieceBounds.maxDimProp ] ) * 100;
				artCopy.resize( newScale, newScale, true, true, true, true, newScale, Transformation.CENTER );
			}

			if ( relativePlacement )
			{
				if ( alignToFrontLogo )
				{
					if ( !curSizeFrontLogo )
					{
						curSizeFrontLogo = srcFrontLogo;
					}
					var curSizeFrontLogoBounds = getBoundsData( curSizeFrontLogo );
					artCopy.top = curSizeFrontLogoBounds.bottom - relativePlacement[ 1 ];
					align( curSizeFrontLogo, [ artCopy ], "hcenter" );
					artCopy.left -= ( relativePlacement[ 0 ] * curSizeFrontLogoBounds.width );
				}
				else 
				{
					if ( relativePlacement[ 0 ] !== 0 )
					{
						align( destPiece, [ artCopy ], "hcenter" );
						artCopy.left -= ( relativePlacement[ 0 ] * destPieceBounds.width );
					}
					if ( relativePlacement[ 1 ] !== 0 )
					{
						align( destPiece, [ artCopy ], "vcenter" );
						artCopy.top -= ( relativePlacement[ 1 ] * destPieceBounds.height );
					}
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
