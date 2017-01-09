﻿//----------------------------------------------------------
// Animated Galleries
//----------------------------------------------------------

(function($) {

    jQuery.fn.wpgallery = function(settings) {

        //-----------------------------------
        // Extend jQuery settings to include arguments
        //-----------------------------------
        settings = jQuery.extend({}, settings);

        //-----------------------------------
        // Declare thumb style enumeration
        //-----------------------------------
        var eThumbStyle = 
        { 
            None:0, 
            Resize:1, 
            ResizeActive:2, 
            ResizeHover:3, 
            Opacity:4,
            OpacityActive:5,
            OpacityHover:6              
        }; 
 
        //-----------------------------------
        // Declare thumb position enumeration
        //-----------------------------------
        var eThumbPosition = 
        { 
            Horizontal:0,
            Vertical:1
        }; 
        
        //-----------------------------------
        // Declare transition style enumeration
        //-----------------------------------
        var eTransitStyle = 
        { 
            Basic:0,
            OpaqueFade:1, 
            LeftToRight:2, 
            TopToBottom:3, 
            SquareFade:4, 
            VerticalFlip:5, 
            HorizontalFlip:6 
        }; 

        //-----------------------------------
        // Declare control bar style enumeration
        //-----------------------------------
        var eControlBarStyle = 
        { 
            InternalTop:0,
            InternalTopAnimated:1,
            InternalBottom:2,
            InternalBottomAnimated:3,
            ExternalBottom:4
        };
        
        //-----------------------------------
        // Declare navbar alignment enumeration
        //-----------------------------------
        var eNavbarAlignment = 
        { 
            Centre:0,
            Left:1,
            Right:2
        };
        
        //-----------------------------------
        // Declare browser enumeration
        //-----------------------------------
        var eBrowser = 
        { 
            Msie:0,
            Mozilla:1,
            Safari:2,
            Opera:3,
            Chrome:4
        };
         
        //-----------------------------------
        // Declare browser enumeration
        //-----------------------------------
        var eImageData = 
        { 
            ImageSrc:0,
            ImageWidth:1,
            ImageHeight:2,
            ImageCaption:3,
            ThumbSrc:4
        };
       
        //-----------------------------------
        // Declare member variables
        //-----------------------------------
        var $mainDiv = this;
        
        var $frameDiv = null;
        var $controlDiv = null;
        var $imageDiv = null;
        var $captionDiv = null;
        var $thumbDiv = null;
        var $thumb1Div = null;
        var $thumb2Div = null;
        var $navBarDiv = null;   
        var $rewindButton = null;
        var $previousButton = null;
        var $playButton = null;
        var $nextButton = null;
        var $forwardButton = null;
        var $rewindMap = null;
        var $previousMap = null;
        var $playMap = null;
        var $nextMap = null;
        var $forwardMap = null;
        
        var $thumbRewindButton = null;
        var $thumbRewindMap = null;
        var $thumbForwardButton = null;
        var $thumbForwardMap = null;
        
        var nCurrentImage = 0;
        var nPreviousImage = 0;
        var bPlaying = false;
        var bPrevious = false;
        var bGoToImage = false;
        var bJumpToImage = false;
        var bJumpForward = true;
        var bFirstThumbDiv = true;
        var nThumbFirstImg = 0;
        var bMouseOverThumbs = false;
        var bScrollingThumbs = false;
        
        var nThumbHoverBoundary = 20;
        var nThumbMinorHoverBoundary = 10;
        var nThumbDivBoundary = 100;
        var nThumbActiveResize = 10; 
        
        var strZoomId = settings.imageArray + '_zoom'; 
        var strRewindMapId = settings.imageArray + '_RewindMapId'; 
        var strPreviousMapId = settings.imageArray + '_PreviousMapId'; 
        var strPlayMapId = settings.imageArray + '_PlayMapId'; 
        var strNextMapId = settings.imageArray + '_NextMapId'; 
        var strForwardMapId = settings.imageArray + '_ForwardMapId'; 
        var strThumbRewindMapId = settings.imageArray + '_ThumbRewindMapId'; 
        var strThumbForwardMapId = settings.imageArray + '_ThumbForwardMapId'; 
        
        var nGalleryLeft = settings.nGalleryLeft + ( settings.bPageCentred ?  (( $(document).width() - settings.nPageWidth ) / 2 ): 0 );
        var bShowNavFwrdNReverse = ( settings.nTotalImages > settings.nTotalThumbs );
        var nNavBarWidth = ( ( settings.bShowThumbnails && bShowNavFwrdNReverse ) ? settings.nNavBarIconWidth * 5 : settings.nNavBarIconWidth * 3 ); 
        settings.nTotalThumbs = Math.min( settings.nTotalThumbs, settings.nTotalImages );
        settings.bShowThumbnailArrows = ( settings.bShowThumbnailArrows && bShowNavFwrdNReverse );

        var nBrowser = eBrowser.Opera;
        if( jQuery.browser.mozilla )
            nBrowser = eBrowser.Mozilla;
        if( jQuery.browser.msie )
            nBrowser = eBrowser.Msie;
        else if( /chrome/.test( navigator.userAgent.toLowerCase() ) )
            nBrowser = eBrowser.Chrome;
        else if( jQuery.browser.safari )
            nBrowser = eBrowser.Safari;
            
        var bPngHack = ( jQuery.browser.msie && jQuery.browser.version < 7 );
        
        var nThumbDivHeight = 0;
        var nThumbDivTop = 0;
        var nThumbDivWidth = 0;
        var nThumbDivLeft = 0;
 
        if( settings.nThumbPosition == eThumbPosition.Horizontal )
        {
            nThumbDivHeight = ( settings.nThumbStyle == eThumbStyle.Resize ||  settings.nThumbStyle == eThumbStyle.ResizeActive ||  settings.nThumbStyle == eThumbStyle.ResizeHover ) ? settings.nThumbSize * 2 : settings.nThumbSize;
            nThumbDivTop = settings.nThumbTop;
            nThumbDivWidth = ( settings.nThumbSize * settings.nTotalThumbs ) + ( settings.nThumbSpacing * ( settings.nTotalThumbs - 1 ) ) + nThumbDivBoundary;
            nThumbDivLeft = ( ( settings.nGalleryWidth - nThumbDivWidth ) / 2 );
        }
        else // Vertical Thumb Position
        {
            nThumbDivWidth = ( settings.nThumbStyle == eThumbStyle.Resize ||  settings.nThumbStyle == eThumbStyle.ResizeActive ||  settings.nThumbStyle == eThumbStyle.ResizeHover ) ? settings.nThumbSize * 2 : settings.nThumbSize;
            nThumbDivLeft = settings.nThumbLeft;
            nThumbDivHeight = ( settings.nThumbSize * settings.nTotalThumbs ) + ( settings.nThumbSpacing * ( settings.nTotalThumbs - 1 ) ) + nThumbDivBoundary;
            nThumbDivTop = ( ( settings.nGalleryHeight - nThumbDivHeight ) / 2 );
        }        
        
        //-----------------------------------
        // Initialise gallery
        //-----------------------------------
        initialise();

        //-----------------------------------
        // Event handlers - Window resize
        //-----------------------------------
        if( settings.bPageCentred )
        {
            $(window).bind('resize', function() 
            {
                nGalleryLeft = settings.nGalleryLeft + (( $(document).width() - settings.nPageWidth ) / 2 );
            });
        }
 
        //-----------------------------------
        // Event handlers - Navigation Controls
        //-----------------------------------
        if( settings.bShowNavBar )
        {
            if( settings.bShowThumbnails && bShowNavFwrdNReverse )
            {
                $rewindButton.click(function() 
                {
                    bJumpForward = false;
                    var nTargetImg = nThumbFirstImg - 1;
                    if( nTargetImg < 0 )
                        nTargetImg = settings.nTotalImages - 1;
                    goToImage( nTargetImg, true );
                });       
            
                $forwardButton.click(function() 
                {
                    bJumpForward = true;
                    var nTargetImg = nThumbFirstImg + settings.nTotalThumbs;
                    if( nTargetImg >= settings.nTotalImages )
                        nTargetImg = 0;
                    goToImage( nTargetImg, true );
                });
                
                if( bPngHack )
                {
                    $rewindMap.hover(function() { $rewindButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.rewindoverButtonSrc + '\', sizingMethod=\'scale\')' }); }, function() { $rewindButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.rewindButtonSrc + '\', sizingMethod=\'scale\')' }); });
                    $forwardMap.hover(function() { $forwardButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.forwardoverButtonSrc + '\', sizingMethod=\'scale\')' }); }, function() { $forwardButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.forwardButtonSrc + '\', sizingMethod=\'scale\')' }); });
                }
                else
                {
                    $rewindButton.hover(function() { $(this).attr('src', settings.rewindoverButtonSrc); }, function() { $(this).attr('src', settings.rewindButtonSrc); });
                    $forwardButton.hover(function() { $(this).attr('src', settings.forwardoverButtonSrc); }, function() { $(this).attr('src', settings.forwardButtonSrc); });
                }                
            }

            $previousButton.click(function() 
            {
                stopTimer();
                bPrevious = true;
                switchSlide();
                bPrevious = false;
            });

            $playButton.click(function() 
            {
                if (bPlaying) 
                {
                    stopTimer();
                }
                else 
                {
                    switchSlide();
                    startTimer();
                }
            });

            $nextButton.click(function() 
            {
                stopTimer();
                switchSlide();
            });

            if( bPngHack )
            {
                $previousMap.hover(function() { $previousButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.prevoverButtonSrc + '\', sizingMethod=\'scale\')' }); }, function() { $previousButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.prevButtonSrc + '\', sizingMethod=\'scale\')' }); });
                $playMap.hover(function() 
                { if (bPlaying) $playButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.pauseoverButtonSrc + '\', sizingMethod=\'scale\')' }); else $playButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.playoverButtonSrc + '\', sizingMethod=\'scale\')' }); }, 
                function() 
                { if (bPlaying) $playButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.pauseButtonSrc + '\', sizingMethod=\'scale\')' }); 
                else $playButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.playButtonSrc + '\', sizingMethod=\'scale\')' }); });
                $nextMap.hover(function() { $nextButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.nextoverButtonSrc + '\', sizingMethod=\'scale\')' }); }, function() { $nextButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.nextButtonSrc + '\', sizingMethod=\'scale\')' }); });
            }
            else
            {
                $previousButton.hover(function() { $(this).attr('src', settings.prevoverButtonSrc); }, function() { $(this).attr('src', settings.prevButtonSrc); });
                $playButton.hover(function() 
                { if (bPlaying) $(this).attr('src', settings.pauseoverButtonSrc); else $(this).attr('src', settings.playoverButtonSrc); }, 
                function() 
                { if (bPlaying) $(this).attr('src', settings.pauseButtonSrc); else $(this).attr('src', settings.playButtonSrc); });
                $nextButton.hover(function() { $(this).attr('src', settings.nextoverButtonSrc); }, function() { $(this).attr('src', settings.nextButtonSrc); });
            }                
        }
        
        if( settings.bShowThumbnails && bShowNavFwrdNReverse && settings.bShowThumbnailArrows )
        {
            $thumbRewindButton.click(function() 
            {
                bJumpForward = false;
                var nTargetImg = nThumbFirstImg - 1;
                if( nTargetImg < 0 )
                    nTargetImg = settings.nTotalImages - 1;
                goToImage( nTargetImg, true );
            });       
        
            $thumbForwardButton.click(function() 
            {
                bJumpForward = true;
                var nTargetImg = nThumbFirstImg + settings.nTotalThumbs;
                if( nTargetImg >= settings.nTotalImages )
                    nTargetImg = 0;
                goToImage( nTargetImg, true );
            });                
 
            if( bPngHack )
            {
                $thumbRewindMap.hover(function() { $thumbRewindButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumboverRewindButtonSrc + '\', sizingMethod=\'scale\')' }); }, function() { $thumbRewindButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumbRewindButtonSrc + '\', sizingMethod=\'scale\')' }); });
                $thumbForwardMap.hover(function() { $thumbForwardButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumboverForwardButtonSrc + '\', sizingMethod=\'scale\')' }); }, function() { $thumbForwardButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumbForwardButtonSrc + '\', sizingMethod=\'scale\')' }); });
            }
            else
            {
                $thumbRewindButton.hover(function() { $(this).attr('src', settings.thumboverRewindButtonSrc); }, function() { $(this).attr('src', settings.thumbRewindButtonSrc); });
                $thumbForwardButton.hover(function() { $(this).attr('src', settings.thumboverForwardButtonSrc); }, function() { $(this).attr('src', settings.thumbForwardButtonSrc); });
            }
        }
        
        //-----------------------------------
        // Event handlers - Controls (caption and nav bar hover-slide action)
        //-----------------------------------
        if( settings.bShowNavBar || settings.bShowCaption )
        {
            if( settings.nControlBarStyle == eControlBarStyle.InternalTopAnimated ) 
                $frameDiv.hover(function() { $controlDiv.css({ visibility:'visible' }); $controlDiv.animate({ top: 0 }, 250); }, function() { $controlDiv.animate({ top: -$controlDiv.height() }, 250, function() { $controlDiv.css({ visibility:'hidden' }); }); });
            else if( settings.nControlBarStyle == eControlBarStyle.InternalBottomAnimated ) 
                $frameDiv.hover(function() { $controlDiv.css({ visibility:'visible' }); $controlDiv.animate({ top: settings.nImageDivHeight - $controlDiv.height() }, 250); }, function() { $controlDiv.animate({ top: settings.nImageDivHeight }, 250, function() { $controlDiv.css({ visibility:'hidden' }); }); });
       }

        //-----------------------------------
        // Event handlers - Thumbnails
        //-----------------------------------
        if( settings.bShowThumbnails )
        {
            if( settings.nThumbStyle == eThumbStyle.Resize || settings.nThumbStyle == eThumbStyle.ResizeHover ) 
            {
                $mainDiv.mousemove(function(e)
                { 
                    var ptMouseX = 0;
                    var ptMouseY = 0;
 
                    switch( nBrowser )
                    {
                        case eBrowser.Msie: 
                            {
                                if( jQuery.browser.version < 7  ) // IE6 and below don't support zoom
                                {
                                    ptMouseX = e.pageX - ( nGalleryLeft + nThumbDivLeft );
                                    ptMouseY = e.pageY - ( settings.nGalleryTop + nThumbDivTop );
                                }
                                else // IE7 and above support zoom
                                {
                                    var fZoom = getZoom();
                                    
                                    if( settings.nThumbPosition == eThumbPosition.Horizontal )
                                        ptMouseY = ( e.pageY / fZoom ) - ( settings.nGalleryTop + nThumbDivTop );
                                    else 
                                        ptMouseY = ( e.pageY / fZoom ) - ( settings.nGalleryTop + nThumbDivTop ) + ( fZoom > 1.0 ? ( ( e.pageY - e.clientY ) / fZoom ) : 0 );

                                    if( settings.bPageCentred )
                                    {
                                        nGalleryLeft = settings.nGalleryLeft + (( ( $(document).width() * ( fZoom < 1.0 ? fZoom : 1 ) ) - ( settings.nPageWidth / ( fZoom > 1.0 ? fZoom : 1 ) ) ) / 2 );                               
                                        ptMouseX = ( e.pageX / fZoom ) - ( nGalleryLeft + nThumbDivLeft ) + ( ( e.pageX - e.clientX ) / fZoom );
                                    }
                                    else
                                    {
                                        ptMouseX = ( e.pageX / fZoom ) - ( nGalleryLeft + nThumbDivLeft ) + ( ( e.pageX - e.clientX ) / fZoom );
                                    }
                                }
                            } 
                            break;
                    
                        case eBrowser.Mozilla:
                            {
                                ptMouseX = e.pageX - ( nGalleryLeft + nThumbDivLeft );
                                ptMouseY = e.pageY - ( settings.nGalleryTop + nThumbDivTop );
                            }
                            break;

                        case eBrowser.Opera:
                        case eBrowser.Safari:
                        case eBrowser.Chrome:
                            {
                                if( settings.bPageCentred )
                                {
                                    var fZoom = getZoom();
                                    nGalleryLeft = settings.nGalleryLeft + (( ( $(document).width() / ( fZoom > 0.99 ? fZoom : 1 ) ) - settings.nPageWidth ) / 2 );
                                }
                               
                                ptMouseX = e.pageX - ( nGalleryLeft + nThumbDivLeft );
                                ptMouseY = e.pageY - ( settings.nGalleryTop + nThumbDivTop );
                            }
                            break;
                    }
                    
                    if( settings.nThumbPosition == eThumbPosition.Horizontal )
                    {
                        if( ptMouseX > -1 && ptMouseX < nThumbDivWidth && ptMouseY > -1 && ptMouseY < ( nThumbDivHeight + nThumbHoverBoundary ) )
	                    {
	                        var nBorderRatio = 1;
	                        if( ptMouseX < nThumbHoverBoundary )
	                            nBorderRatio = 1 - Math.max( 0, ( ( nThumbHoverBoundary - ptMouseX ) / nThumbHoverBoundary ) );
	                        else if( ptMouseX > nThumbDivWidth - nThumbHoverBoundary )
	                            nBorderRatio = Math.max( 0, ( ( nThumbDivWidth - ptMouseX ) / nThumbHoverBoundary ) );
	                        else if( ptMouseY < nThumbHoverBoundary )
	                            nBorderRatio = 1 - Math.max( 0, ( ( nThumbHoverBoundary - ptMouseY ) / nThumbHoverBoundary ) );
	                        else if( ptMouseY > nThumbDivHeight )
	                            nBorderRatio = Math.max( 0, ( ( nThumbDivHeight + nThumbMinorHoverBoundary - ptMouseY ) / nThumbMinorHoverBoundary ) );
	                            
	                        var nSlideX = ( ptMouseX - ( nThumbDivWidth / 2 ) ) * 0.1 * nBorderRatio;

	                        var $frontThumbDiv = bFirstThumbDiv ? $thumb1Div : $thumb2Div;
	                        
	                        for (var i = 0; i < settings.nTotalThumbs; ++i) 
	                        {
	                            var nThumbCentre = ( (i + 0.5) * (settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );
	                            var nXOffset = ( ptMouseX - nThumbCentre ) < 0 ? nThumbCentre - ptMouseX : ptMouseX - nThumbCentre;
	                            var nRatio = Math.max( 0, ( 150 - nXOffset ) / 150 );

	                            var nImgResize = settings.nThumbSize * nRatio * nBorderRatio;
	                            var nImgLeft = (i * (settings.nThumbSize + settings.nThumbSpacing)) - ( nImgResize / 2 ) + ( nThumbDivBoundary / 2 ) - nSlideX;
	                            $frontThumbDiv.find('img:eq('+ i +')').css({ 'left': nImgLeft, 'width':(settings.nThumbSize + nImgResize), 'top':-nImgResize, 'height': (settings.nThumbSize + nImgResize) });
	                        }
	                        
	                        bMouseOverThumbs = true;
	                    }
	                    else if( bMouseOverThumbs )
	                    {
	                        bMouseOverThumbs = false;
	                        resetThumbSize( true );
	                    }
                    }
                    else
                    {
                        if( ptMouseX > -nThumbMinorHoverBoundary && ptMouseX < nThumbDivWidth  && ptMouseY > -1 && ptMouseY < nThumbDivHeight )
                        {
                            var nBorderRatio = 1;
                            if( ptMouseY < nThumbHoverBoundary )
                                nBorderRatio = 1 - Math.max( 0, ( ( nThumbHoverBoundary - ptMouseY ) / nThumbHoverBoundary ) );
                            else if( ptMouseY > nThumbDivHeight - nThumbHoverBoundary )
                                nBorderRatio = Math.max( 0, ( ( nThumbDivHeight - ptMouseY ) / nThumbHoverBoundary ) );
                            else if( ptMouseX > nThumbDivWidth - nThumbHoverBoundary )
                                nBorderRatio = Math.max( 0, ( ( nThumbDivWidth - ptMouseX ) / nThumbHoverBoundary ) );
                            if( ptMouseX < 0 )
                                nBorderRatio = Math.max( 0, ( ( nThumbMinorHoverBoundary + ptMouseX ) / nThumbMinorHoverBoundary ) );
                                
                            var nSlideY = ( ptMouseY - ( nThumbDivHeight / 2 ) ) * 0.1 * nBorderRatio;
                            
                            var $frontThumbDiv = bFirstThumbDiv ? $thumb1Div : $thumb2Div;
                            
                            for (var i = 0; i < settings.nTotalThumbs; ++i) 
                            {
                                var nThumbCentre = ( (i + 0.5) * (settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );
                                var nYOffset = ( ptMouseY - nThumbCentre ) < 0 ? nThumbCentre - ptMouseY : ptMouseY - nThumbCentre;
                                var nRatio = Math.max( 0, ( 150 - nYOffset ) / 150 );

                                var nImgResize = settings.nThumbSize * nRatio * nBorderRatio;
                                var nImgTop = (i * (settings.nThumbSize + settings.nThumbSpacing)) - ( nImgResize / 2 ) + ( nThumbDivBoundary / 2 ) - nSlideY;
                                $frontThumbDiv.find('img:eq('+ i +')').css({ 'left':0, 'width':(settings.nThumbSize + nImgResize), 'top':nImgTop, 'height': (settings.nThumbSize + nImgResize) });
                            }
 
                            bMouseOverThumbs = true;
                        }
                        else if( bMouseOverThumbs )
                        {
                            bMouseOverThumbs = false;
                            resetThumbSize( true );
                        }
                    }                   
                }); 
            }
        }
        
        //-----------------------------------
        // Final action once everything declared - start autoplay
        //-----------------------------------
        if( settings.bAutoplay )
            startTimer();
 
        //-----------------------------------
        // Function Declarations
        //-----------------------------------

        function initialise() 
        {
            // Append div for calculting zoom
            if( nBrowser == eBrowser.Safari || nBrowser == eBrowser.Opera )
                $mainDiv.append('<div id="' + strZoomId + '" style="position:fixed; top:0px; left:-100px; width:1px; height:100%;"></div>');

            // Append thumb div
            if( settings.bShowThumbnails )
            {
                $mainDiv.append('<div style="position:absolute; top:' + nThumbDivTop + '; left:' + nThumbDivLeft + '; width:' + nThumbDivWidth + '; height:' + nThumbDivHeight + '; z-index:' + ( settings.nZIndex + 5 ) +';"></div>');
                $thumbDiv = $mainDiv.find('div:last');
            }

            // Append frame div
            $mainDiv.append('<div style="position:absolute; top:' + settings.nImageDivTop + '; left:' + settings.nImageDivLeft + '; width:' + settings.nImageDivWidth + '; height:' + settings.nImageDivHeight + '; overflow:hidden"></div>');
            $frameDiv = $mainDiv.find('div:last');
            
            // Append first image and image div
            var nImageWidth = Math.min( settings.nImageDivWidth, getImageData( 0, eImageData.ImageWidth ) );
            var nImageHeight = Math.min( settings.nImageDivHeight, getImageData( 0, eImageData.ImageHeight ) );
            var nImageLeft = ( settings.nImageDivWidth - nImageWidth ) / 2;
            var nImageTop = ( settings.nImageDivHeight - nImageHeight ) / 2;
            $frameDiv.append('<div style="position:absolute; top:0; left:0; width:' + settings.nImageDivWidth + '; height:' + settings.nImageDivHeight + '"><img src=' + getImageData( 0, eImageData.ImageSrc ) + ' style="position:absolute; top:' + nImageTop + '; left:' + nImageLeft + '; width:' + nImageWidth + '; height:' + nImageHeight + '; z-index:' + ( settings.nZIndex + 1 ) + '; opacity:1.0; visibility:visible;"  title="' + getImageData( 0, eImageData.ImageCaption ) + '"/></div>');
            $imageDiv = $frameDiv.find('div:first');
 
            if( settings.bShowNavBar || settings.bShowCaption )
            {
                // Append control div
                switch( settings.nControlBarStyle )
                {
                    case eControlBarStyle.InternalTop:
                        $frameDiv.append('<div style="position:absolute; visibility:hidden; top:0; left:0; width:' + settings.nImageDivWidth + '; z-index:' + ( settings.nZIndex + 3 ) + ';"></div>');
                        $controlDiv = $frameDiv.find('div:last');
                    break;
     
                    case eControlBarStyle.InternalTopAnimated:
                        $frameDiv.append('<div style="position:absolute; visibility:hidden; top:' + (-100) +'; left:0; width:' + settings.nImageDivWidth + '; z-index:' + ( settings.nZIndex + 3 ) + ';"></div>');
                        $controlDiv = $frameDiv.find('div:last');
                    break;
                
                    case eControlBarStyle.InternalBottom:
                        $frameDiv.append('<div style="position:absolute; visibility:hidden; top:' + ( settings.nImageDivHeight - 20 ) +'; left:0; width:' + settings.nImageDivWidth + '; z-index:' + ( settings.nZIndex + 3 ) + ';"></div>');
                        $controlDiv = $frameDiv.find('div:last');
                    break;
     
                    case eControlBarStyle.InternalBottomAnimated:
                        $frameDiv.append('<div style="position:absolute; visibility:hidden; top:' + settings.nImageDivHeight +'; left:0; width:' + settings.nImageDivWidth + '; z-index:' + ( settings.nZIndex + 3 ) + '"></div>');
                        $controlDiv = $frameDiv.find('div:last');
                    break;
     
                    case eControlBarStyle.ExternalBottom:
                        $mainDiv.append('<div style="position:absolute; top:' + settings.nControlBarExternalTop +'; left:' + ( ( settings.nGalleryWidth - settings.nImageDivWidth ) / 2 ) + '; width:' + settings.nGalleryWidth + '; z-index:' + ( settings.nZIndex + 3 ) + '"></div>');
                        $controlDiv = $mainDiv.find('div:last');
                    break;
                }
           
                if( settings.bShowNavBar && settings.bNavBarOnTop )
                {
                    var nNavBarLeftPadding = ( settings.nNavBarAlignment == eNavbarAlignment.Right ) ? settings.nImageDivWidth - nNavBarWidth : ( settings.nNavBarAlignment == eNavbarAlignment.Left ) ? 0 : ( ( settings.nImageDivWidth - nNavBarWidth ) / 2 );
                    var strNavBarColour = ( settings.strNavBarColour == 'none' ? '' : ('background-color:' + settings.strNavBarColour + ';') );
                    var strNavBarOpacity = ( settings.nNavBarOpacity >= 1.0 ? '' : (' filter:alpha(opacity=' + ( settings.nNavBarOpacity * 100 ) + '); opacity:' + settings.nNavBarOpacity + '; -moz-opacity:' + settings.nNavBarOpacity + ';') );
                    var strNavDiv= '<div style="padding-left:' + nNavBarLeftPadding + '; width:100%; height:' + settings.nNavBarIconHeight + '; ' + strNavBarColour + strNavBarOpacity + '"></div>';
                    $controlDiv.append( strNavDiv );
                    $navBarDiv = $controlDiv.find('div:first');
                }
                if( settings.bShowCaption )
                {
                    var strCaptionText = showCaptionCount() + getImageData( 0, eImageData.ImageCaption );
                    var strCaptionColour = ( settings.strCaptionColour == 'none' ? '' : ('background-color:' + settings.strCaptionColour + ';') );
                    var strCaptionOpacity = ( settings.nCaptionOpacity >= 1.0 ? '' : (' filter:alpha(opacity=' + ( settings.nCaptionOpacity * 100 ) + '); opacity:' + settings.nCaptionOpacity + '; -moz-opacity:' + settings.nCaptionOpacity + ';') );
                    
                    var strCaptionDiv = '<div style="width:100%; height:' + settings.nCaptionFontSize + '; ' + strCaptionColour + strCaptionOpacity + ' color:' + settings.strCaptionTextColour + '; font-family:' + settings.strCaptionFontType + '; font-size:' + settings.nCaptionFontSize + '; font-weight:' + settings.strCaptionFontWeight + '; text-align:' + settings.strCaptionAlign + '; padding:5px"> ' + strCaptionText + ' </div>';
                    $controlDiv.append( strCaptionDiv );
                    $captionDiv = $controlDiv.find('div:last');
                }
                if( settings.bShowNavBar )
                {
                    if( !settings.bNavBarOnTop  )
                    {
                        var nNavBarLeftPadding = ( settings.nNavBarAlignment == eNavbarAlignment.Right ) ? settings.nImageDivWidth - nNavBarWidth : ( settings.nNavBarAlignment == eNavbarAlignment.Left ) ? 0 : ( ( settings.nImageDivWidth - nNavBarWidth ) / 2 );
                        var strNavBarColour = ( settings.strNavBarColour == 'none' ? '' : ('background-color:' + settings.strNavBarColour + ';') );
						var strNavBarOpacity = ( settings.nNavBarOpacity >= 1.0 ? '' : (' filter:alpha(opacity=' + ( settings.nNavBarOpacity * 100 ) + '); opacity:' + settings.nNavBarOpacity + '; -moz-opacity:' + settings.nNavBarOpacity + ';') );
						var strNavDiv= '<div style="padding-left:' + nNavBarLeftPadding + '; width:100%; height:' + settings.nNavBarIconHeight + '; ' + strNavBarColour + strNavBarOpacity + '"></div>';
                        $controlDiv.append( strNavDiv );
                        $navBarDiv = $controlDiv.find('div:last');
                    }
 
                    // Append nav bar buttons
                    if( settings.bShowThumbnails && bShowNavFwrdNReverse )
                    {
                        if( bPngHack )
                        {
                            $navBarDiv.append('<map id="' + strRewindMapId + '" name="' + strRewindMapId + '" style="position:relative; left:' + nNavBarLeftPadding + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strRewindToolTip + '" usemap="#' + strRewindMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.rewindButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $navBarDiv.append('<map id="' + strPreviousMapId + '" name="' + strPreviousMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + settings.nNavBarIconWidth ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strPreviousToolTip + '" usemap="#' + strPreviousMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.prevButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $navBarDiv.append('<map id="' + strPlayMapId + '" name="' + strPlayMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + ( settings.nNavBarIconWidth * 1 ) ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strPlayToolTip + '" usemap="#' + strPlayMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.playButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $navBarDiv.append('<map id="' + strNextMapId + '" name="' + strNextMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + ( settings.nNavBarIconWidth * 2 ) ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strNextToolTip + '" usemap="#' + strNextMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.nextButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $navBarDiv.append('<map id="' + strForwardMapId + '" name="' + strForwardMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + ( settings.nNavBarIconWidth * 3 ) ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strForwardToolTip + '" usemap="#' + strForwardMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.forwardButtonSrc + '\', sizingMethod=\'scale\');">');                        
                       
                            $rewindMap = $navBarDiv.find('map:eq(0)');
                            $previousMap = $navBarDiv.find('map:eq(1)');
                            $playMap = $navBarDiv.find('map:eq(2)');
                            $nextMap = $navBarDiv.find('map:eq(3)');
                            $forwardMap = $navBarDiv.find('map:eq(4)');
                        }
                        else
                        {
                           $navBarDiv.append('<img src=' + settings.rewindButtonSrc + ' title="' + settings.strRewindToolTip + '" style="border-style:none; cursor:pointer;">');
                           $navBarDiv.append('<img src=' + settings.prevButtonSrc + ' title="' + settings.strPreviousToolTip + '" style="border-style:none; cursor:pointer;">');
                           $navBarDiv.append('<img src=' + settings.playButtonSrc + ' title="' + settings.strPlayToolTip + '" style="border-style:none; cursor:pointer;">');
                           $navBarDiv.append('<img src=' + settings.nextButtonSrc + ' title="' + settings.strNextToolTip + '" style="border-style:none; cursor:pointer;">');
                           $navBarDiv.append('<img src=' + settings.forwardButtonSrc + ' title="' + settings.strForwardToolTip + '" style="border-style:none; cursor:pointer;">');
                        }

                        $rewindButton = $navBarDiv.find('img:eq(0)');
                        $previousButton = $navBarDiv.find('img:eq(1)');
                        $playButton = $navBarDiv.find('img:eq(2)');
                        $nextButton = $navBarDiv.find('img:eq(3)');
                        $forwardButton = $navBarDiv.find('img:eq(4)');
                    }
                    else
                    {
                        if( bPngHack )
                        {
                            $navBarDiv.append('<map id="' + strPreviousMapId + '" name="' + strPreviousMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + settings.nNavBarIconWidth ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strPreviousToolTip + '" usemap="#' + strPreviousMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.prevButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $navBarDiv.append('<map id="' + strPlayMapId + '" name="' + strPlayMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + ( settings.nNavBarIconWidth * 1 ) ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strPlayToolTip + '" usemap="#' + strPlayMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.playButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $navBarDiv.append('<map id="' + strNextMapId + '" name="' + strNextMapId + '" style="position:relative; left:' + ( nNavBarLeftPadding + ( settings.nNavBarIconWidth * 2 ) ) + 'px; top:0px; width:' + settings.nNavBarIconWidth + 'px; height:' + settings.nNavBarIconHeight + 'px;"><area shape="rect" coords="0,0,' + settings.nNavBarIconWidth + ',' + settings.nNavBarIconHeight + '"></map><img src="' + settings.blankSrc + '" width="' + settings.nNavBarIconWidth + 'px" height="' + settings.nNavBarIconHeight + 'px" border="0" title="' + settings.strNextToolTip + '" usemap="#' + strNextMapId + '" style="cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.nextButtonSrc + '\', sizingMethod=\'scale\');">');                        
                       
                            $previousMap = $navBarDiv.find('map:eq(0)');
                            $playMap = $navBarDiv.find('map:eq(1)');
                            $nextMap = $navBarDiv.find('map:eq(2)');
                        }
                        else
                        {
                            $navBarDiv.append('<a style="cursor:pointer;"><img src=' + settings.prevButtonSrc + ' title="' + settings.strPreviousToolTip + '" style="border-style:none"></a>');
                            $navBarDiv.append('<a style="cursor:pointer;"><img src=' + settings.playButtonSrc + ' title="' + settings.strPlayToolTip + '" style="border-style:none"></a>');
                            $navBarDiv.append('<a style="cursor:pointer;"><img src=' + settings.nextButtonSrc + ' title="' + settings.strNextToolTip + '" style="border-style:none"></a>');
                        }
                    
                        $previousButton = $navBarDiv.find('img:eq(0)');
                        $playButton = $navBarDiv.find('img:eq(1)');
                        $nextButton = $navBarDiv.find('img:eq(2)');
                    }
                }
                
                switch( settings.nControlBarStyle )
                {
                    case eControlBarStyle.InternalTop:
                        $controlDiv.css({ visibility:'visible' });             
                    break;

                    case eControlBarStyle.InternalTopAnimated:
                        $controlDiv.css({ top:(-$controlDiv.height()) });             
                    break;
                
                    case eControlBarStyle.InternalBottom:
                        $controlDiv.css({ visibility:'visible', top:( settings.nImageDivHeight - $controlDiv.height()) });             
                    break;
                }
            }              
 
            if( settings.bShowThumbnails )
            {
                if( settings.nThumbPosition == eThumbPosition.Horizontal )
                {
                    // Append thumbnail 1 div
                    var nNestedThumbDivTop = ( settings.nThumbStyle == eThumbStyle.Resize || settings.nThumbStyle == eThumbStyle.ResizeHover ) ? settings.nThumbSize : 0;
                    $thumbDiv.append('<div style="position:absolute; top:' + nNestedThumbDivTop + '; left:0; width:' + nThumbDivWidth + '; height:' + settings.nThumbSize + '"></div>');
                    $thumb1Div = $thumbDiv.find('div:first');
           
                    // Append thumbnail 2 div
                    $thumbDiv.append('<div style="position:absolute; top:' + nNestedThumbDivTop + '; left:' + settings.nGalleryWidth + '; width:' + nThumbDivWidth + '; height:' + settings.nThumbSize + '"></div>');
                    $thumb2Div = $thumbDiv.find('div:last');
                }
                else
                {
                    // Append thumbnail 1 div
                    $thumbDiv.append('<div style="position:absolute; top:0; left:0; width:' + nThumbDivWidth + '; height:' + nThumbDivHeight + '"></div>');
                    $thumb1Div = $thumbDiv.find('div:first');
           
                    // Append thumbnail 2 div
                    $thumbDiv.append('<div style="position:absolute; top:' + settings.nGalleryHeight + '; left:0; width:' + nThumbDivWidth + '; height:' + settings.nThumbDivHeight + '"></div>');
                    $thumb2Div = $thumbDiv.find('div:last');
                }
       
                // Load the thumbnails 
                for (var i = 0; i < settings.nTotalThumbs; ++i) 
                {
                    var nImgOpacity = ( settings.nThumbStyle == eThumbStyle.Opacity || settings.nThumbStyle == eThumbStyle.OpacityActive || settings.nThumbStyle == eThumbStyle.OpacityHover ) ? settings.nThumbOpacity : 1.0;
                    var strBorderStyle = ( settings.bThumbBorder ? 'solid' : 'none' );
 
                    if( settings.nThumbPosition == eThumbPosition.Horizontal )
                    {
                        var nImgLeft = (i * (settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );

                        // Append first thumb div
                        if( i < settings.nTotalImages )
                        {
                            $thumb1Div.append('<a style="cursor:pointer;"><img style="position:absolute; left:' + nImgLeft + '; height:' + settings.nThumbSize + '; width:' + settings.nThumbSize + '; border-style:' + strBorderStyle + '; border-color:' + settings.strThumbBorderColour + '; border-width:' + settings.nColBorderWidth + '; filter:alpha(opacity=' + ( nImgOpacity * 100 ) + '); opacity:' + nImgOpacity + '; -moz-opacity:' + nImgOpacity + '; visibility:visible" src=' + settings.loadingButtonSrc + ' title="' + getImageData( i, eImageData.ImageCaption ) + '"/></a>');
                            loadImage( $thumb1Div.find('a:eq('+ i +')').find('img:first'), getImageData( i, eImageData.ThumbSrc ), i, true );
                        }
   
                        // Append Second thumb div
                        if( settings.nTotalThumbs + i < settings.nTotalImages )
                        {
                            $thumb2Div.append('<a style="cursor:pointer;"><img style="position:absolute; left:' + nImgLeft + '; height:' + settings.nThumbSize + '; width:' + settings.nThumbSize + '; border-style:' + strBorderStyle + '; border-color:' + settings.strThumbBorderColour + '; border-width:' + settings.nColBorderWidth + '; filter:alpha(opacity=' + ( nImgOpacity * 100 ) + '); opacity:' + nImgOpacity + '; -moz-opacity:' + nImgOpacity + '; visibility:visible" src=' + settings.loadingButtonSrc + ' title="' + getImageData( settings.nTotalThumbs + i, eImageData.ImageCaption ) + '"/></a>');
                            loadImage( $thumb2Div.find('a:eq('+ i +')').find('img:first'), getImageData( settings.nTotalThumbs + i, eImageData.ThumbSrc ), i, true );
                        }
                    }
                    else
                    {
                        var nImgTop = (i * (settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );
                        
                        // Append first thumb div
                        if( i < settings.nTotalImages )
                        {
                            $thumb1Div.append('<a style="cursor:pointer;"><img style="position:absolute; left:0; top:' + nImgTop + '; height:' + settings.nThumbSize + '; width:' + settings.nThumbSize + '; border-style:' + strBorderStyle + '; border-color:' + settings.strThumbBorderColour + '; border-width:' + settings.nColBorderWidth + '; filter:alpha(opacity=' + ( nImgOpacity * 100 ) + '); opacity:' + nImgOpacity + '; -moz-opacity:' + nImgOpacity + '; visibility:visible" src=' + getImageData( i, eImageData.ThumbSrc ) + ' title="' + getImageData( i, eImageData.ImageCaption ) + '"/></a>');
                            loadImage( $thumb1Div.find('a:eq('+ i +')').find('img:first'), getImageData( i, eImageData.ThumbSrc ), i, true );
                        }
                       
                        // Append second thumb div
                        if( settings.nTotalThumbs + i < settings.nTotalImages )
                        {
                            $thumb2Div.append('<a style="cursor:pointer;"><img style="position:absolute; left:0; top:' + nImgTop + '; height:' + settings.nThumbSize + '; width:' + settings.nThumbSize + '; border-style:' + strBorderStyle + '; border-color:' + settings.strThumbBorderColour + '; border-width:' + settings.nColBorderWidth + '; filter:alpha(opacity=' + ( nImgOpacity * 100 ) + '); opacity:' + nImgOpacity + '; -moz-opacity:' + nImgOpacity + '; visibility:visible" src=' + getImageData( settings.nTotalThumbs + i, eImageData.ThumbSrc ) + ' title="' + getImageData( settings.nTotalThumbs + i, eImageData.ImageCaption ) + '"/></a>');
                            loadImage( $thumb2Div.find('a:eq('+ i +')').find('img:first'), getImageData( i, eImageData.ThumbSrc ), i, true );
                        }
                    }

                    if( i < settings.nTotalImages )
                    {
                        $thumb1Div.find('img:eq('+ i +')').click( function( nThumb ) { return function() { goToImage(nThumb, false); } }(i));                
                        if( settings.bThumbBorder )
                            $thumb1Div.find('img:eq('+ i +')').hover( function() { $(this).css({ 'border-color':settings.strThumbBorderHoverColour }); }, function( nThumb ) { return function() { var bHighlight = ((nCurrentImage-nThumbFirstImg) == nThumb); $(this).css({ 'border-color':(bHighlight?settings.strThumbBorderActiveColour:settings.strThumbBorderColour) }); } }(i));
                        if( settings.nThumbStyle == eThumbStyle.Opacity ) 
                            $thumb1Div.find('img:eq('+ i +')').hover( function(){ $(this).animate({ opacity:1.0 }, 200 ); }, function( nThumb ){ return function(){ var bHighlight = ((nCurrentImage-nThumbFirstImg) == nThumb); $(this).animate({ opacity:(bHighlight?1.0:settings.nThumbOpacity) }, 20 ); } }(i)); 
                        else if( settings.nThumbStyle == eThumbStyle.OpacityHover ) 
                            $thumb1Div.find('img:eq('+ i +')').hover( function(){ $(this).animate({ opacity:1.0 }, 200 ); }, function(){ $(this).animate({ opacity:settings.nThumbOpacity }, 20 ); }); 
                    }
                    
                    if( settings.nTotalThumbs + i < settings.nTotalImages )
                    {
                        $thumb2Div.find('img:eq('+ i +')').click( function( nThumb ) { return function() { goToImage(nThumb, false); } }(i));
                        if( settings.bThumbBorder )
                            $thumb2Div.find('img:eq('+ i +')').hover( function() { $(this).css({ 'border-color':settings.strThumbBorderHoverColour }); }, function( nThumb ) { return function() { var bHighlight = ((nCurrentImage-nThumbFirstImg) == nThumb); $(this).css({ 'border-color':(bHighlight?settings.strThumbBorderActiveColour:settings.strThumbBorderColour) }); } }(i));
                        if( settings.nThumbStyle == eThumbStyle.Opacity ) 
                            $thumb2Div.find('img:eq('+ i +')').hover( function(){ $(this).animate({ opacity:1.0 }, 200 ); }, function( nThumb ){ return function(){ var bHighlight = ((nCurrentImage-nThumbFirstImg) == nThumb); $(this).animate({ opacity:(bHighlight?1.0:settings.nThumbOpacity) }, 20 ); } }(i)); 
                        else if( settings.nThumbStyle == eThumbStyle.OpacityHover ) 
                            $thumb2Div.find('img:eq('+ i +')').hover( function(){ $(this).animate({ opacity:1.0 }, 200 ); }, function(){ $(this).animate({ opacity:settings.nThumbOpacity }, 20 ); }); 
                    }
                }
            
                if( settings.bThumbBorder )
                    $thumb1Div.find('img:eq(0)').css({ 'border-color':settings.strThumbBorderActiveColour });
                if( settings.nThumbStyle == eThumbStyle.Opacity || settings.nThumbStyle == eThumbStyle.OpacityActive )
                    $thumb1Div.find('img:eq(0)').css({ opacity:1.0 });
                else if( settings.nThumbStyle == eThumbStyle.Resize || settings.nThumbStyle == eThumbStyle.ResizeActive )
                {
                    if( settings.nThumbPosition == eThumbPosition.Horizontal )
                        $thumb1Div.find('img:eq(0)').css({ 'left':(( nThumbDivBoundary / 2 ) - ( nThumbActiveResize / 2 )), 'top':-nThumbActiveResize, width:settings.nThumbSize + nThumbActiveResize, height:settings.nThumbSize + nThumbActiveResize });
                    else
                        $thumb1Div.find('img:eq(0)').css({ 'top':(( nThumbDivBoundary / 2 ) - ( nThumbActiveResize / 2 )), width:settings.nThumbSize + nThumbActiveResize, height:settings.nThumbSize + nThumbActiveResize });
                }
                
                if( settings.bShowThumbnailArrows )
                {
                    if( settings.nThumbPosition == eThumbPosition.Horizontal )
                    {
                        var nThumbTop = settings.nThumbTop + ( ( settings.nThumbSize - settings.nThumbButtonSize ) / 2 ) + (( settings.nThumbStyle == eThumbStyle.Resize ||  settings.nThumbStyle == eThumbStyle.ResizeActive ||  settings.nThumbStyle == eThumbStyle.ResizeHover ) ? settings.nThumbSize : 0 );
                        var nThumbLeft = settings.nThumbButtonIndent;
                        var nThumbRight = settings.nGalleryWidth - ( settings.nThumbButtonIndent + settings.nThumbButtonSize );
                        
                        if( bPngHack )
                        {
                            $mainDiv.append('<map id="' + strThumbRewindMapId + '" name="' + strThumbRewindMapId + '" style="position:absolute; left:' + nThumbLeft + 'px; top:' + nThumbTop + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px;"><area shape="rect" coords="0,0,' + settings.nThumbButtonSize + ',' + settings.nThumbButtonSize + '"></map><img src="' + settings.blankSrc + '" border="0" title="' + settings.strThumbRewindToolTip + '" usemap="#' + strThumbRewindMapId + '" style="position:absolute; left:' + nThumbLeft + 'px; top:' + nThumbTop + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px; z-index:' + ( settings.nZIndex + 6 ) + '; cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumbRewindButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $thumbRewindMap = $mainDiv.find('map:last');
                            $thumbRewindButton = $mainDiv.find(('img:last'));
                            
                            $mainDiv.append('<map id="' + strThumbForwardMapId + '" name="' + strThumbForwardMapId + '" style="position:absolute; left:' + nThumbRight + 'px; top:' + nThumbTop + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px;"><area shape="rect" coords="0,0,' + settings.nThumbButtonSize + ',' + settings.nThumbButtonSize + '"></map><img src="' + settings.blankSrc + '" border="0" title="' + settings.strThumbForwardToolTip + '" usemap="#' + strThumbForwardMapId + '" style="position:absolute; left:' + nThumbRight + 'px; top:' + nThumbTop + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px; z-index:' + ( settings.nZIndex + 6 ) + '; cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumbForwardButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $thumbForwardMap = $mainDiv.find('map:last');
                            $thumbForwardButton = $mainDiv.find(('img:last'));
                        }
                        else
                        {
                            $mainDiv.append('<a style="cursor:pointer;"><img src=' + settings.thumbRewindButtonSrc + ' title="' + settings.strThumbRewindToolTip + '" style="position:absolute; top:' + nThumbTop + '; left:' + nThumbLeft + '; z-index:' + ( settings.nZIndex + 6 ) + '; border-style:none;"></a>');
                            $thumbRewindButton = $mainDiv.find('a:last').find(('img:eq(0)'));
                            
                            $mainDiv.append('<a style="cursor:pointer;"><img src=' + settings.thumbForwardButtonSrc + ' title="' + settings.strThumbForwardToolTip + '" style="position:absolute; top:' + nThumbTop + '; left:' + nThumbRight + '; z-index:' + ( settings.nZIndex + 6 ) + '; border-style:none;"></a>');
                            $thumbForwardButton = $mainDiv.find('a:last').find(('img:eq(0)'));
                        }
                    }
                    else
                    {
                        var nThumbLeft = settings.nThumbLeft + ( ( settings.nThumbSize - settings.nThumbButtonSize ) / 2 );
                        var nThumbTop = settings.nThumbButtonIndent;
                        var nThumbBottom = settings.nGalleryHeight - ( settings.nThumbButtonIndent + settings.nThumbButtonSize );
               
                        if( bPngHack )
                        {
                            $mainDiv.append('<map id="' + strThumbRewindMapId + '" name="' + strThumbRewindMapId + '" style="position:absolute; left:' + nThumbLeft + 'px; top:' + nThumbTop + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px;"><area shape="rect" coords="0,0,' + settings.nThumbButtonSize + ',' + settings.nThumbButtonSize + '"></map><img src="' + settings.blankSrc + '" border="0" title="' + settings.strThumbRewindToolTip + '" usemap="#' + strThumbRewindMapId + '" style="position:absolute; left:' + nThumbLeft + 'px; top:' + nThumbTop + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px; z-index:' + ( settings.nZIndex + 6 ) + '; cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumbRewindButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $thumbRewindMap = $mainDiv.find('map:last');
                            $thumbRewindButton = $mainDiv.find(('img:last'));
                            
                            $mainDiv.append('<map id="' + strThumbForwardMapId + '" name="' + strThumbForwardMapId + '" style="position:absolute; left:' + nThumbLeft + 'px; top:' + nThumbBottom + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px;"><area shape="rect" coords="0,0,' + settings.nThumbButtonSize + ',' + settings.nThumbButtonSize + '"></map><img src="' + settings.blankSrc + '" border="0" title="' + settings.strThumbForwardToolTip + '" usemap="#' + strThumbForwardMapId + '" style="position:absolute; left:' + nThumbLeft + 'px; top:' + nThumbBottom + 'px; width:' + settings.nThumbButtonSize + 'px; height:' + settings.nThumbButtonSize + 'px; z-index:' + ( settings.nZIndex + 6 ) + '; cursor:pointer; border-style:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.thumbForwardButtonSrc + '\', sizingMethod=\'scale\');">');                        
                            $thumbForwardMap = $mainDiv.find('map:last');
                            $thumbForwardButton = $mainDiv.find(('img:last'));
                        }
                        else
                        {
                            $mainDiv.append('<a style="cursor:pointer;"><img src=' + settings.thumbRewindButtonSrc + ' title="' + settings.strThumbRewindToolTip + '" style="position:absolute; top:' + nThumbTop + '; left:' + nThumbLeft + '; z-index:' + ( settings.nZIndex + 6 ) + '; border-style:none;"></a>');
                            $thumbRewindButton = $mainDiv.find('a:last').find(('img:eq(0)'));
                       
                            $mainDiv.append('<a style="cursor:pointer;"><img src=' + settings.thumbForwardButtonSrc + ' title="' + settings.strThumbForwardToolTip + '" style="position:absolute; top:' + nThumbBottom + '; left:' + nThumbLeft + '; z-index:' + ( settings.nZIndex + 6 ) + '; border-style:none;"></a>');
                            $thumbForwardButton = $mainDiv.find('a:last').find(('img:eq(0)'));
                        }
                    }
                }
            }

            // Load the images into the gallery div
            for (var i = 1; i < settings.nTotalImages; ++i) 
            {
                $imageDiv.append('<img src=' + settings.loadingButtonSrc + ' style="position:absolute; top:' + nImageTop + '; left:' + nImageLeft + '; width:' + nImageWidth + '; height:' + nImageHeight + '; z-index:' + ( settings.nZIndex + 1 ) + '; opacity:0.0; visibility:hidden;" title="' + getImageData( i, eImageData.ImageCaption ) + '"/>');
            }
  
            // Preload images in the current and next screens
            nTotalNextImages = Math.min( ( settings.nTotalThumbs * 2 ), settings.nTotalImages );
            for (var i = 0; i < nTotalNextImages; ++i) 
            {
                loadImage( $imageDiv.find('img:eq('+ i +')'), getImageData( i, eImageData.ImageSrc ), i, false );
            }
            
            // Preload images and thumbs in previous screen
            if( settings.nTotalImages > ( settings.nTotalThumbs * 2 ) )
            {
                nStartOfPrevImgages = ( settings.nTotalImages - settings.nTotalThumbs );
            
                for (var i = nStartOfPrevImgages; i < settings.nTotalImages; ++i)
                {
                    loadImage( $imageDiv.find('img:eq('+ i +')'), getImageData( i, eImageData.ImageSrc ), i, false );
                    
                    var thumb = new Image();
                    thumb.src = getImageData( i, eImageData.ThumbSrc );
                }            
            }
        };
 
        function loadImage( div, strImageSrc, nPos, bThumb )
        {
            var image = new Image();
            
            image.onload = function() 
            { 
                if( bThumb )  
                {
                    $(div).attr({ 'src':strImageSrc });
                }
                else
                {
                    var nWidth = Math.min( settings.nImageDivWidth, getImageData( nPos, eImageData.ImageWidth ) );
                    var nHeight = Math.min( settings.nImageDivHeight, getImageData( nPos, eImageData.ImageHeight ) );
                    var nLeft = ( settings.nImageDivWidth - nWidth ) / 2;
                    var nTop = ( settings.nImageDivHeight - nHeight ) / 2;
           
                    $(div).attr({ 'src':strImageSrc });
                    $(div).css({ 'left':nLeft, 'top':nTop, 'width':nWidth, 'height':nHeight });
                }
            };
            
            image.src = strImageSrc;
        }; 

        function stopTimer() 
        {
            $imageDiv.stopTime();

            if( bPngHack )
                { if( settings.bShowNavBar ){ $playButton.attr({ 'title':settings.strPlayToolTip }); $playButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.playButtonSrc + '\', sizingMethod=\'scale\')' }); } }
            else
                { if( settings.bShowNavBar ){ $playButton.attr({ 'src':settings.playButtonSrc, 'title':settings.strPlayToolTip }); } }
            bPlaying = false;
        };

        function startTimer() 
        {
            if (!bPlaying) 
            {
                bPlaying = true;

                if( bPngHack )
                    { if( settings.bShowNavBar ){ $playButton.attr({ 'title':settings.strPauseToolTip }); $playButton.css({ 'filter':'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + settings.pauseButtonSrc + '\', sizingMethod=\'scale\')' }); } }
                else
                    { if( settings.bShowNavBar ){ $playButton.attr({ 'src':settings.pauseButtonSrc, 'title':settings.strPauseToolTip }); } }

                $imageDiv.everyTime((settings.nStaticTime + settings.nTransitTime), "GalleryTimer", function() { switchSlide(); });
            }
        };

        function showCaptionCount() 
        {
            if( settings.bCaptionCount )
                return (' ' + (nCurrentImage + 1) + '/' + settings.nTotalImages + ' ');
            else
                return ('');
        };

        function goToImage(nThumb, bJump) 
        {
            if( bScrollingThumbs )
                return;
            
            if( bJump )
            {
                nImage = nThumb;
                bScrollingThumbs = true;
            }
            else
            {
                nImage = nThumbFirstImg + nThumb;
            }
            
            if (nImage != nCurrentImage) 
            {
                stopTimer();
                nPreviousImage = nCurrentImage;
                nCurrentImage = nImage;
                bJump ? bJumpToImage = true : bGoToImage = true; 
                switchSlide();
                bJump ? bJumpToImage = false : bGoToImage = false; 
            }
        }

        function resetThumbSize( bFrontDiv ) 
        {
            var $thumbDiv;
            
            if( bFrontDiv )
                var $thumbDiv = bFirstThumbDiv ? $thumb1Div : $thumb2Div;
            else
                var $thumbDiv = bFirstThumbDiv ? $thumb2Div : $thumb1Div;

            if( settings.nThumbPosition == eThumbPosition.Horizontal )
            {
                for (var i = 0; i < settings.nTotalThumbs; ++i) 
                {
                    var nImgLeft = (i * (settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );
                    $thumbDiv.find('img:eq('+ i +')').css({ 'top':0, 'left': nImgLeft, 'width':settings.nThumbSize, 'height': settings.nThumbSize });
                }
            }
            else
            {
                for (var i = 0; i < settings.nTotalThumbs; ++i) 
                {
                    var nImgTop = (i * (settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );
                    $thumbDiv.find('img:eq('+ i +')').css({ 'top':nImgTop, 'width':settings.nThumbSize, 'height': settings.nThumbSize });
                }
            }
        }
        
        function getZoom() 
        {
            switch( nBrowser )
            {
                case eBrowser.Msie:
                    return ( document.documentElement.offsetHeight / $(window).height() );
            
                case eBrowser.Chrome: 
                    var rcWnd = document.body.getBoundingClientRect(); // ( This function also works for Msie ) 
                    return ( ( Math.round((rcWnd.right-rcWnd.left)/document.body.clientWidth * 100) ) / 100 );
            
                case eBrowser.Safari:
                    return ( $(window).height() / document.getElementById( strZoomId ).offsetHeight );

                case eBrowser.Opera:
                    return ( window.innerHeight / document.getElementById( strZoomId ).offsetHeight );
            }
            
            return 1;
        }

        function getImageData( nImage, nData ) 
        {
            var bValidImage = ( settings.imageArray[ nImage ] != null && settings.imageArray[ nImage ].wp_image != null );    

            switch( nData )
            {
                case eImageData.ImageSrc:
                {
                    if( bValidImage )
                        return settings.imageArray[ nImage ].wp_image.imgsrc;
                    else
                        return "";
                }
    
                case eImageData.ImageWidth:
                {
                    if( bValidImage )
                        return settings.imageArray[ nImage ].wp_image.width;
                    else
                        return 200;
                }

                case eImageData.ImageHeight:
                {
                    if( bValidImage )
                        return settings.imageArray[ nImage ].wp_image.height;
                    else
                        return 200;
                }

                case eImageData.ImageCaption:
                {
                    if( bValidImage )
                        return settings.imageArray[ nImage ].wp_image.caption;
                    else
                        return "";
                }

                case eImageData.ThumbSrc:
                {
                    if( bValidImage )
                        return settings.imageArray[ nImage ].wp_image.thumbSrc;
                    else
                        return "";
                }
            }
        }

        function scrollThumbs( bForward ) 
        {
            if( settings.bShowThumbnails && bShowNavFwrdNReverse )
            {
                bScrollingThumbs = true;
                
                var nDirection = bForward ? 1 : -1;
                var $frontThumbDiv = bFirstThumbDiv ? $thumb1Div : $thumb2Div;
                var $backThumbDiv = bFirstThumbDiv ? $thumb2Div : $thumb1Div;
                
                nThumbFirstImg += nDirection * settings.nTotalThumbs;
                if( nThumbFirstImg >= settings.nTotalImages )
                    nThumbFirstImg = 0;
                else if( nThumbFirstImg < 0 )
                    nThumbFirstImg = settings.nTotalImages - ( settings.nTotalImages % settings.nTotalThumbs > 0 ? settings.nTotalImages % settings.nTotalThumbs : settings.nTotalThumbs )
                    
                if( settings.nThumbPosition == eThumbPosition.Horizontal )
                    $backThumbDiv.css({ left: ( nDirection * settings.nGalleryWidth ) });
                else
                    $backThumbDiv.css({ top: ( nDirection * settings.nGalleryHeight ) });
                
                resetThumbSize( false );
                bFirstThumbDiv = !bFirstThumbDiv;
          
                var nValidThumbs = Math.min( settings.nTotalImages - nThumbFirstImg, settings.nTotalThumbs );
                for (var i = 0; i < settings.nTotalThumbs; ++i) 
                {
                   if( i < nValidThumbs )
                   {
                        $backThumbDiv.find('img:eq('+ i +')').attr({ 'src': settings.loadingButtonSrc, 'title': getImageData( nThumbFirstImg + i, eImageData.ImageCaption ) });
                        $backThumbDiv.find('img:eq('+ i +')').css({ 'visibility': 'visible' });
                        loadImage( $backThumbDiv.find('img:eq('+ i +')'), getImageData( nThumbFirstImg + i, eImageData.ThumbSrc ), i, true );
                   }    
                   else
                   {
                        $backThumbDiv.find('img:eq('+ i +')').css({ 'visibility': 'hidden' });
                   }    
                }

                if( settings.nThumbPosition == eThumbPosition.Horizontal )
                {
                    $backThumbDiv.animate({ left: 0 }, settings.nTransitTime);
                    $frontThumbDiv.animate({ left: ( nDirection * -settings.nGalleryWidth ) }, settings.nTransitTime, function() { preloadDivImages( bForward ); bScrollingThumbs = false; } );
                }
                else
                {
                    $backThumbDiv.animate({ top: 0 }, settings.nTransitTime);
                    $frontThumbDiv.animate({ top: ( nDirection * -settings.nGalleryHeight ) }, settings.nTransitTime, function() { preloadDivImages( bForward ); bScrollingThumbs = false; } );
                }
            
            }
        }
        
        function preloadDivImages( bForward )
        {
            // Pre-load the next set of thumbs and images
            if( bForward )
            {
                // Preload the thumbs and images in the next div
                var nFirstThumbInNextDiv = nThumbFirstImg + settings.nTotalThumbs;               
                var nLastThumbInNextDiv = Math.min( nFirstThumbInNextDiv + settings.nTotalThumbs, settings.nTotalImages );               
                if( nFirstThumbInNextDiv < settings.nTotalImages )
                {
                    for (var i = nFirstThumbInNextDiv; i < nLastThumbInNextDiv; ++i)
                    {
                        loadImage( $imageDiv.find('img:eq('+ i +')'), getImageData( i, eImageData.ImageSrc ), i, false );
                        
                        var thumb = new Image();
                        thumb.src = getImageData( i, eImageData.ThumbSrc );
                    } 
                }
            }
            else
            {
                // Preload the thumbs and images in the previous div
                var nFirstThumbInPrevDiv = ( nThumbFirstImg - settings.nTotalThumbs < 0 ) ? ( settings.nTotalImages - settings.nTotalThumbs ) : ( nThumbFirstImg - settings.nTotalThumbs );                 
                var nLastThumbInPrevDiv = Math.min( nFirstThumbInPrevDiv + settings.nTotalThumbs, settings.nTotalImages );               
                if( nFirstThumbInPrevDiv > 0 )
                {
                    for (var i = nFirstThumbInPrevDiv; i < nLastThumbInPrevDiv; ++i)
                    {
                        loadImage( $imageDiv.find('img:eq('+ i +')'), getImageData( i, eImageData.ImageSrc ), i, false );

                        var thumb = new Image();
                        thumb.src = getImageData( i, eImageData.ThumbSrc );
                    }
                }
            }
        }; 
                
        function switchSlide() 
        {
            var $nextImg;
            var $activeImg

            if (bJumpToImage)
            {
                $activeImg = $imageDiv.find('img:eq(' + nPreviousImage + ')');
                $nextImg = $imageDiv.find('img:eq(' + nCurrentImage + ')');
                scrollThumbs( bJumpForward );
            }            
            else if (bGoToImage) 
            {
                $activeImg = $imageDiv.find('img:eq(' + nPreviousImage + ')');
                $nextImg = $imageDiv.find('img:eq(' + nCurrentImage + ')');
                if ($nextImg.length == 0) 
                {
                    $next = $imageDiv.find('img:first');
                    nCurrentImage = 0;
                }
            }
            else if (bPrevious) 
            {
                $activeImg = $imageDiv.find('img:eq(' + nCurrentImage + ')');
                $nextImg = $activeImg.prev('img');
                nPreviousImage = nCurrentImage--;

                if (nCurrentImage < 0 || $nextImg.length == 0) 
                {
                    $nextImg = $imageDiv.find('img:last');
                    nCurrentImage = settings.nTotalImages - 1;
                    scrollThumbs( false );
                }
                else
                {
                    if ((nCurrentImage + 1) % settings.nTotalThumbs == 0)
                        scrollThumbs( false );
                }                
            }
            else 
            {
                $activeImg = $imageDiv.find('img:eq(' + nCurrentImage + ')');
                $nextImg = $activeImg.next('img');
                nPreviousImage = nCurrentImage++;

                if (nCurrentImage < 0 || $nextImg.length == 0) 
                {
                    $nextImg = $imageDiv.find('img:first');
                    nCurrentImage = 0;
                    scrollThumbs( true );
                }
                else
                {
                    if (nCurrentImage % settings.nTotalThumbs == 0)
                        scrollThumbs( true );
                }
            }
            
            // Ensure an active image has been assigned
            if( $activeImg.length == 0 )
                $activeImg = $imageDiv.find('img:last');

            // Ensure the next image visibility is hidden and opacity 1.0
            $nextImg.css({ visibility:'hidden', opacity:1.0 });

            // Dynamically load the image - just in case it hasn't yet been loaded
            loadImage( $nextImg, getImageData( nCurrentImage, eImageData.ImageSrc ), nCurrentImage, false );

            // Update the image caption
            if( settings.bShowCaption )
            {
                var strCaption = showCaptionCount() + $nextImg.attr('title');
                $captionDiv.text( strCaption );
            } 
                
            // Determine switch direction for left-to-right/top-to-bottom transition styles
            var bForceNormalTransit = false;
            if( nCurrentImage == 0 && nPreviousImage == ( settings.nTotalImages - 1 ) )
                bForceNormalTransit = true;
            else if( bJumpToImage && bJumpForward )
                 bForceNormalTransit = true;
 
            // Perform transition animation on main image
            switch( settings.nTransitionStyle )
            {
                case eTransitStyle.Basic:
                    $nextImg.css({ opacity:1.0, 'z-index':( settings.nZIndex + 2 ), visibility:'visible' });
                    $activeImg.css({ opacity:1.0, 'z-index':( settings.nZIndex + 1 ), visibility:'hidden' });
                break;
              
                case eTransitStyle.OpaqueFade:
                    $activeImg.animate({ opacity: 0.0 }, settings.nTransitTime);
                    $nextImg.css({ opacity:0.0, 'z-index':( settings.nZIndex + 2 ), visibility:'visible' });
                    $nextImg.animate({ opacity: 1.0 }, settings.nTransitTime, function() { $activeImg.css({ opacity:0.0, 'z-index':( settings.nZIndex + 1 ), visibility:'hidden' }); });
                break;
            
                case eTransitStyle.LeftToRight:
                    var nActiveImgLeft = ( settings.nImageDivWidth - Math.min( settings.nImageDivWidth, getImageData( nPreviousImage, eImageData.ImageWidth ) ) ) / 2;
                    var nNextImgLeft = ( settings.nImageDivWidth - Math.min( settings.nImageDivWidth, getImageData( nCurrentImage, eImageData.ImageWidth ) ) ) / 2;

                    if( !bForceNormalTransit && ( bPrevious || nPreviousImage > nCurrentImage || ( bJumpToImage && !bJumpForward && nCurrentImage == ( settings.nTotalImages - 1 ) ) ) )
                    {
                        // Shift left to right
                        $nextImg.animate({ left: ( -settings.nImageDivWidth + nNextImgLeft ) }, 1, function(){ $nextImg.css({ visibility:'visible' }); } );
                        $activeImg.animate({ left:( settings.nImageDivWidth + nActiveImgLeft ) }, settings.nTransitTime);
                        $nextImg.animate({ left: nNextImgLeft }, settings.nTransitTime, function() { $activeImg.css({ opacity:1.0, 'z-index':( settings.nZIndex + 1 ), visibility:'hidden' }); });
                    }
                    else
                    {
                        // Shift right to left
                        $nextImg.animate({ left: ( settings.nImageDivWidth + nNextImgLeft ) }, 1, function(){ $nextImg.css({ visibility:'visible' }); } );
                        $activeImg.animate({ left: ( -settings.nImageDivWidth + nActiveImgLeft ) }, settings.nTransitTime);
                        $nextImg.animate({ left: nNextImgLeft }, settings.nTransitTime, function() { $activeImg.css({ opacity:1.0, 'z-index':( settings.nZIndex + 1 ), visibility:'hidden' }); });
                    }
                break;
            
                case eTransitStyle.TopToBottom:
                    var nActiveImgTop = ( settings.nImageDivHeight - Math.min( settings.nImageDivHeight, getImageData( nPreviousImage, eImageData.ImageHeight ) ) ) / 2;
                    var nNextImgTop = ( settings.nImageDivHeight - Math.min( settings.nImageDivHeight, getImageData( nCurrentImage, eImageData.ImageHeight ) ) ) / 2;

                    if( !bForceNormalTransit && ( bPrevious || nPreviousImage > nCurrentImage || ( bJumpToImage && !bJumpForward && nCurrentImage == ( settings.nTotalImages - 1 ) ) ) )
                    {
                        // Shift top to bottom
                        $nextImg.animate({ top: -settings.nImageDivHeight + nNextImgTop } , 1, function(){ $nextImg.css({ visibility:'visible' }); } );
                        $activeImg.animate({ top: ( settings.nImageDivHeight + nActiveImgTop ) }, settings.nTransitTime);
                        $nextImg.animate({ top: nNextImgTop }, settings.nTransitTime, function() { $activeImg.css({ opacity:1.0, 'z-index':( settings.nZIndex + 1 ), visibility:'hidden' }); });
                    }
                    else
                    {
                        // Shift bottom to top
                        $nextImg.animate({ top: settings.nImageDivHeight + nNextImgTop }, 1, function(){ $nextImg.css({ visibility:'visible' }); }  );
                        $activeImg.animate({ top: ( -settings.nImageDivHeight + nActiveImgTop ) }, settings.nTransitTime);
                        $nextImg.animate({ top: nNextImgTop }, settings.nTransitTime, function() { $activeImg.css({ opacity:1.0, 'z-index':( settings.nZIndex + 1 ), visibility:'hidden' }); });
                    }
                break;
            
                case eTransitStyle.SquareFade:
                    var nNextImgWidth = Math.min( settings.nImageDivWidth, getImageData( nCurrentImage, eImageData.ImageWidth ) );
                    var nNextImgHeight = Math.min( settings.nImageDivHeight, getImageData( nCurrentImage, eImageData.ImageHeight ) );
                    var nNextImgLeft = ( ( settings.nImageDivWidth - nNextImgWidth ) / 2 );
                    var nNextImgTop = ( ( settings.nImageDivHeight - nNextImgHeight ) / 2 );
                    
                    $nextImg.animate({ width: '0', height: '0', left: (settings.nImageDivWidth/2), top: (settings.nImageDivHeight/2) }, 1 );
                    $activeImg.animate({ width: '0', height: '0', left: (settings.nImageDivWidth/2), top: (settings.nImageDivHeight/2) }, (settings.nTransitTime/2), function(){ $nextImg.css({ visibility:'visible' }); $activeImg.css({ visibility:'hidden' }); $nextImg.animate({ width: nNextImgWidth, height: nNextImgHeight, left: nNextImgLeft, top: nNextImgTop }, (settings.nTransitTime/2)); } );
                break;
            
                case eTransitStyle.VerticalFlip:
                    var nNextImgWidth = Math.min( settings.nImageDivWidth, getImageData( nCurrentImage, eImageData.ImageWidth ) );
                    var nNextImgLeft = ( ( settings.nImageDivWidth - nNextImgWidth ) / 2 );

                    $nextImg.animate({ width: '0', left: (settings.nImageDivWidth/2) }, 1 );
                    $activeImg.animate({ width: '0', left: (settings.nImageDivWidth/2) }, (settings.nTransitTime/2), function(){ $nextImg.css({ visibility:'visible' }); $activeImg.css({ visibility:'hidden' }); $nextImg.animate({ width: nNextImgWidth, left: nNextImgLeft }, (settings.nTransitTime/2)); } );
                break;
            
                case eTransitStyle.HorizontalFlip:
                    var nNextImgHeight = Math.min( settings.nImageDivHeight, getImageData( nCurrentImage, eImageData.ImageHeight ) );
                    var nNextImgTop = ( ( settings.nImageDivHeight - nNextImgHeight ) / 2 );

                    $nextImg.animate({ height: '0', top: (settings.nImageDivHeight/2) }, 1 );
                    $activeImg.animate({ height: '0', top: (settings.nImageDivHeight/2) }, (settings.nTransitTime/2), function(){ $nextImg.css({ visibility:'visible' }); $activeImg.css({ visibility:'hidden' }); $nextImg.animate({ height: nNextImgHeight, top: nNextImgTop }, (settings.nTransitTime/2)); } );
                break;
            }
 
            if( settings.bShowThumbnails )
            {
                // Perform thumbnail animation
                if( settings.bThumbBorder 
                || settings.nThumbStyle == eThumbStyle.Resize 
                || settings.nThumbStyle == eThumbStyle.ResizeActive 
                || settings.nThumbStyle == eThumbStyle.Opacity 
                || settings.nThumbStyle == eThumbStyle.OpacityActive )
                {
                    // Find the active thumbnail and highlight it
                    var $frontThumbDiv = bFirstThumbDiv ? $thumb1Div : $thumb2Div;
                    
                    var $thumbDiv = $frontThumbDiv.find('img:eq('+ ( nCurrentImage - nThumbFirstImg ) +')');
                    
                    var nThumbOffset = ( (nCurrentImage % settings.nTotalThumbs) * ( settings.nThumbSize + settings.nThumbSpacing)) + ( nThumbDivBoundary / 2 );

                    if( settings.bThumbBorder )
                        $thumbDiv.css({ 'border-color':settings.strThumbBorderActiveColour });
                    
                    if( ( settings.nThumbStyle == eThumbStyle.Resize || settings.nThumbStyle == eThumbStyle.ResizeActive ) && !bMouseOverThumbs )
                    {
                        if( settings.nThumbPosition == eThumbPosition.Horizontal )
                        {
                            if( nBrowser == eBrowser.Chrome || nBrowser == eBrowser.Safari ) // Account for zoom factor in chrome and safari
                                $thumbDiv.css({ 'left':( nThumbOffset / getZoom() ) });

                            $thumbDiv.animate({ 'left':(nThumbOffset - (nThumbActiveResize/2)), 'top':-nThumbActiveResize, 'width':settings.nThumbSize + nThumbActiveResize, 'height':settings.nThumbSize + nThumbActiveResize }, 100);
                        }
                        else
                        {
                            if( nBrowser == eBrowser.Chrome || nBrowser == eBrowser.Safari ) // Account for zoom factor in chrome and safari
                                $thumbDiv.css({ 'top':( nThumbOffset / getZoom() ) });

                            $thumbDiv.animate({ 'top':(nThumbOffset - (nThumbActiveResize/2)), 'width':settings.nThumbSize + nThumbActiveResize, 'height':settings.nThumbSize + nThumbActiveResize }, 100);
                        }
                    
                    }
                    else if( settings.nThumbStyle == eThumbStyle.Opacity || settings.nThumbStyle == eThumbStyle.OpacityActive )
                    {
                        $thumbDiv.animate({ 'opacity':1.0, '-moz-opacity':1.0, 'filter:alpha:opacity':100 }, 200);
                    }
             
                    // Find the previous thumbnail and remove the highlighting
                    if( nPreviousImage < nThumbFirstImg || nPreviousImage >= nThumbFirstImg + settings.nTotalThumbs ) // If image resides on back thumb div
                        $frontThumbDiv = bFirstThumbDiv ? $thumb2Div : $thumb1Div; 
                    
                    $thumbDiv = $frontThumbDiv.find('img:eq('+ ( nPreviousImage % settings.nTotalThumbs ) +')');
 
                    if( settings.bThumbBorder )
                        $thumbDiv.css({ 'border-color':settings.strThumbBorderColour });
 
                    nThumbOffset = ( (nPreviousImage % settings.nTotalThumbs) * (settings.nThumbSize + settings.nThumbSpacing)  ) + ( nThumbDivBoundary / 2 );
                    
                    if( ( settings.nThumbStyle == eThumbStyle.Resize || settings.nThumbStyle == eThumbStyle.ResizeActive ) && !bMouseOverThumbs )
                    {
                        if( settings.nThumbPosition == eThumbPosition.Horizontal )
                        {
                            if( nBrowser == eBrowser.Chrome || nBrowser == eBrowser.Safari ) // Account for zoom factor in chrome and safari
                                $thumbDiv.css({ 'left':( nThumbOffset / getZoom() ) });
                            
                            $thumbDiv.animate({ 'left':nThumbOffset, 'top':0, 'width':settings.nThumbSize, 'height':settings.nThumbSize }, 100 );
                        }
                        else
                        {
                            if( nBrowser == eBrowser.Chrome || nBrowser == eBrowser.Safari ) // Account for zoom factor in chrome and safari
                                $thumbDiv.css({ 'top':( nThumbOffset / getZoom() ) });
                            
                            $thumbDiv.animate({ 'left':0, 'top':nThumbOffset, 'width':settings.nThumbSize, 'height':settings.nThumbSize }, 100 );
                        }
                    }
                    else if( settings.nThumbStyle == eThumbStyle.Opacity || settings.nThumbStyle == eThumbStyle.OpacityActive )
                    {
                        $thumbDiv.animate({ 'opacity':settings.nThumbOpacity, '-moz-opacity':settings.nThumbOpacity, 'filter:alpha:opacity':(settings.nThumbOpacity*100) }, 200);
                    }
                }
            }
        };
    };
})(jQuery);

//-----------------------------------
// Global Functions
//-----------------------------------

function wp_galleryimage(imgsrc, width, height, thumbSrc, caption) 
{
    this.wp_image = new Image();
    this.wp_image.imgsrc = imgsrc;
    this.wp_image.width = width;
    this.wp_image.height = height;
    this.wp_image.thumbSrc = thumbSrc;
    this.wp_image.caption = caption;
}
