//----------------------------------------------------------
// WebPlus LightBox
//----------------------------------------------------------

(function($) {

    jQuery.fn.wplightbox = function(settings) {

        //-----------------------------------
        // Extend jQuery settings to include arguments
        //-----------------------------------
        settings = jQuery.extend(
        {
            loadingButtonSrc: ( settings.strImageDir + 'lightbox_load.gif' ),
            closeButtonSrc: ( settings.strImageDir + 'lightbox_close.gif' ),
            closeOverButtonSrc: ( settings.strImageDir + 'lightbox_close_over.gif' ),
            nextButtonSrc: ( settings.strImageDir + 'lightbox_next.gif' ),
            nextOverButtonSrc: ( settings.strImageDir + 'lightbox_next_over.gif' ),
            previousButtonSrc: ( settings.strImageDir + 'lightbox_prev.gif' ),
            previousOverButtonSrc: ( settings.strImageDir + 'lightbox_prev_over.gif' ),
            closeToolTip: 'Close',
            loadingToolTip: 'Loading',
            previousToolTip: 'Previous',
            nextToolTip: 'Next',
			strBkrgrndColour: '#000000',
			nBkgrndTransparency: 0.8
            
        }, settings);
        
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
        // Declare member variables
        //-----------------------------------
        var $hyperLink = this;
        
        var array = new Array();
        var nArrayPos = 0;
        var nArraySize = 0;
        
        var nSumOfBorders = 6;
        
        var nImageWidth = 200;
        var nImageHeight = 200;
        var nLoadImageSize = 50;
        
        var bChangingImage = false;

        var nBrowser = eBrowser.Opera;
        if( jQuery.browser.mozilla )
            nBrowser = eBrowser.Mozilla;
        if( jQuery.browser.msie )
            nBrowser = eBrowser.Msie;
        else if( /chrome/.test( navigator.userAgent.toLowerCase() ) )
            nBrowser = eBrowser.Chrome;
        else if( jQuery.browser.safari )
            nBrowser = eBrowser.Safari;
            
        var bInitialised = false;
        var strZoomId = settings.imageArray + 'wplightbox_zoom';   

        //-----------------------------------
        // Initialise gallery
        //-----------------------------------
        
        $hyperLink.click(function() 
        {
           initialise( this );
           return false;
        });       
 
        //-----------------------------------
        // Function Declarations
        //-----------------------------------

        function initialise( anchor ) 
        {
	        // Preload loading image
	        imgLoad = new Image();
	        imgLoad.src = settings.loadingButtonSrc;

            // Append div for calculting zoom
            if( nBrowser == eBrowser.Safari )
                $('body').append('<div id="' + strZoomId + '" style="position:fixed; top:0px; left:-100px; width:1px; height:100%;"></div>');

            // Add transparent background Div
            $('body').append('<div id="wplightbox_bkgrnd" style="position:absolute; top:0; left:0; width:' + getPageWidth() + '; height:' + getPageHeight() + '; background-color:' + settings.strBkrgrndColour + '; z-index:150; filter:alpha(opacity=' + ( 100 * settings.nBkgrndTransparency ) + '); opacity:' + settings.nBkgrndTransparency + '; -moz-opacity:' + settings.nBkgrndTransparency + ';"></div>');

            // Add main table
            $('body').append('<table id="wplightbox_main" cellpadding="0" cellspacing="0" style="margin: auto 0px; text-align:center; align:center; vertical-align:middle; position:absolute; top:' + getImageTop() + '; left:' + getImageLeft() + '; width:'+ nImageWidth +'; height:'+ nImageHeight +'; z-index:151; background-color:white;">\
                                    <tr">\
                                        <td colspan="2" style="padding:6px 6px 1px 6px;">\
                                            <img id="wplightbox_image" src="' + settings.loadingButtonSrc + '" title="' + settings.loadingToolTip + '" style="border:1px #000000 none; style="display:none;"/>\
                                        </td>\
                                    </tr>\
                                    <tr id="wplightbox_controlsrow" style="display:none; text-align:left; opacity:0.0; -moz-opacity:0.0; filter:alpha(opacity=0);">\
                                        <td style="padding-left:7; padding-top:4px; padding-bottom:2;">\
                                            <table id="wplightbox_controls" cellpadding="0" cellspacing="0" style="display:none;"> \
                                                <tr> \
                                                    <td><a style="cursor:pointer;"><img id="wplightbox_prev" style="border-style:none;" src="' + settings.previousButtonSrc + '" title="' + settings.previousToolTip + '"/></a></td> \
                                                    <td style="padding:0px 7px 0px 7px;"><span id="wplightbox_count" style="font-family:Arial,serif; color:#303030; font-size:11; font-weight:normal;">1/1</span></td> \
                                                    <td><a style="cursor:pointer;"><img id="wplightbox_next" style="border-style:none;" src="' + settings.nextButtonSrc + '" title="' + settings.nextToolTip + '"/></a></td>\
                                                 </tr>\
                                            </table>\
                                        </td>\
                                        <td align="right" style="padding:4px 7px 2px 0px;>\
                                            <a style="cursor:pointer;"><img id="wplightbox_close" style="border-style:none;" src="' + settings.closeButtonSrc + '" title="' + settings.closeToolTip + '"/></a>\
                                        </td>\
                                    </tr>\
                                    <tr id="wplightbox_captionrow" style="display:none; opacity:0.0; -moz-opacity:0.0; filter:alpha(opacity=0);">\
                                        <td colspan="2" style="text-align:center; padding:4px 8px 8px 8px; height=10;">\
                                            <span id="wplightbox_caption" style="font-family:Verdana,serif; color:#606060; font-size:12; font-weight:normal;"></span>\
                                        </td>\
                                    </tr>\
                                </table>');

            // Register mouse click
            $('#wplightbox_bkgrnd').click(function()
            {
               closeImage();
               return false;
            }); 
     
            // Register resize event 
            $(window).bind('resize', function() 
            {
                $('#wplightbox_bkgrnd').css({ 'width':getPageWidth(), 'height':getPageHeight() });   
                $('#wplightbox_main').css({ 'left':getImageLeft(), 'top':getImageTop() });
            });
            
            // Load single anchor image
            if(anchor.rel == 'wplightbox')
            { 
                registerEvents( false );
                loadImage( anchor.href, anchor.title, false, false );
            }  
            else // Load multiple anchor images
            {
                // Reset the array
                if( nArraySize > 0 ) 
                    array = [];
                
                nArrayPos = 0;
                var nCount = 0;

                // Populate the array
                $('a[rel*=' + anchor.rel + ']').each( function(i) 
                { 
                    array[ nCount ] = this;
                    ++nCount; 
                });
                
                nArraySize = nCount;
                
                // Find current anchor position
                for( nCount = 0; nCount < nArraySize; ++nCount )
                {
                    if( array[ nCount ].href == anchor.href )
                        nArrayPos = nCount;
                }
                
                registerEvents( true );
                loadImage( array[ nArrayPos ].href, array[ nArrayPos ].title, false, true );
            }
        };

        // Performs the image load process
        function loadImage( strImageSrc, strImageCaption, bShowLoading, bMulti ) 
        {
            var bImageLoaded = false;

            $('#wplightbox_controlsrow').hide();
            $('#wplightbox_controls').hide();
            $('#wplightbox_captionrow').hide();

            $('#wplightbox_controlsrow').css({ 'opacity':0.0, '-moz-opacity':0.0, 'filter:alpha:opacity':0 });
            $('#wplightbox_captionrow').css({ 'opacity':0.0, '-moz-opacity':0.0, 'filter:alpha:opacity':0 });

            if( bShowLoading )
            {
                $('#wplightbox_image').hide();
                $('#wplightbox_image').attr({ src:settings.loadingButtonSrc, title:settings.loadingToolTip });
                $('#wplightbox_image').css({ 'border-style':'none' });
            }
            
            var image = new Image();
            image.onload = function() 
            { 
                bImageLoaded = true;
                bShowLoading = false;
                
                image.onload = null;
                $('#wplightbox_image').hide();

                var nImageLeft = 0;
                var nImageTop = 0;
                
                var nOldImageWidth = nImageWidth;
                var nOldImageHeight = nImageHeight;

                // Account for zooming issues with chrome
                if( nBrowser == eBrowser.Chrome )
                {
                    $('#wplightbox_main').css({ 'left':getImageLeft(), 'top':getImageTop() });

                    fZoom = getZoom();
                    
                    nImageWidth = image.width / fZoom;
                    nImageHeight = image.height / fZoom + 25 + ( ( strImageCaption.length > 0 ) ? 30 : 0 );
                    nImageLeft = getImageLeft() * fZoom;
                    nImageTop = getImageTop() * fZoom;
                }
                else if( nBrowser == eBrowser.Safari )
                {
                    $('#wplightbox_main').css({ 'left':getImageLeft(), 'top':getImageTop() });

                    fZoom = getZoom();
                    
                    nImageWidth = image.width / fZoom;
                    nImageHeight = image.height / fZoom + 25 + ( ( strImageCaption.length > 0 ) ? 30 : 0 );
                    nImageLeft = getImageLeft() * fZoom;
                    nImageTop = getImageTop() * fZoom;
                }               
                else
                {
                    nImageWidth = image.width;
                    nImageHeight = image.height + 25 + ( ( strImageCaption.length > 0 ) ? 30 : 0 );
                    nImageLeft = getImageLeft();
                    nImageTop = getImageTop();
                }

                $('#wplightbox_bkgrnd').css({ 'width':getPageWidth(), 'height':getPageHeight() });  
                
                // If image sizes are quite close (e.g. within 20 pixels) - do not perform an animate resize
                var bAnimateResize = ( nOldImageWidth > ( nImageWidth + 20 ) || nOldImageWidth < ( nImageWidth - 20 ) || nOldImageHeight > ( nImageHeight + 20 ) || nOldImageHeight < ( nImageHeight - 20 ) );
 
                if( !bAnimateResize )
                {
                    nImageWidth = nOldImageWidth;
                    nImageHeight = nOldImageHeight;
                }

                $('#wplightbox_main').animate({ 'left':nImageLeft, 'top':nImageTop, 'width':((nImageWidth) + (nSumOfBorders * 2) + 2), 'height':((nImageHeight) + (nSumOfBorders * 2)) }, ( bAnimateResize ? 700 : 1 ), function() 
                { 
                    $('#wplightbox_image').css({ 'border-style':'solid', 'opacity':0.0, '-moz-opacity':0.0, 'filter:alpha:opacity':0 });
                    $('#wplightbox_image').attr({ src:image.src, title:strImageCaption });
                    $('#wplightbox_image').show();
                    
                    if( bMulti )
                    {
                        $('#wplightbox_count').html( ( nArrayPos + 1 ) + ' / ' + nArraySize );
                        $('#wplightbox_controls').show();
                    }
                    
                    if( strImageCaption.length > 0 )
                    {
                        $('#wplightbox_captionrow').show();
                    }

                    $('#wplightbox_caption').html( strImageCaption );
                    $('#wplightbox_controlsrow').show();
                    
                    $('#wplightbox_image').animate( { opacity:1.0 }, ( bAnimateResize ? 250 : 500 ), function()
                    {
                        $('#wplightbox_controlsrow').animate( { opacity:1.0 }, 50 );

                        if( strImageCaption.length > 0 )
                            $('#wplightbox_captionrow').animate( { opacity:1.0 }, 50 );
                      
                        bChangingImage = false;
                    });
                });
            };
            image.src = strImageSrc;

            if( bShowLoading )
            {
                $('#wplightbox_image').animate({ borderWidth: "1px" }, 50, function()
                { 
                    if( !bImageLoaded )
                    {
                        $('#wplightbox_image').show();
                    }
                });
            } 
        };
        
        // Close wp lightbox
        function closeImage() 
        {
            $(document).unbind('keyup');
            $(window).unbind('resize');
            
            $("#wplightbox_bkgrnd").unbind("click");
            $("#wplightbox_close").unbind("click");
            $("#wplightbox_prev").unbind("click");
            $("#wplightbox_next").unbind("click");

            $('#wplightbox_main').remove();
            $('#wplightbox_bkgrnd').animate({ 'opacity':0.0, '-moz-opacity':0.0, 'filter:alpha:opacity':0 }, 300, function() { $('#wplightbox_bkgrnd').remove(); nImageWidth = 200; nImageHeight = 200; });

	        bInitialised = false;
        };
        
        // Move to next image
        function nextImage() 
        {
            if( !bChangingImage )
            {
                bChangingImage = true;
                ++nArrayPos;
                
                if( nArrayPos >= nArraySize )
                    nArrayPos = 0;
                    
                loadImage( array[ nArrayPos ].href, array[ nArrayPos ].title, true, true );     
            }
        };

        // Move to previous image
        function prevImage() 
        {
            if( !bChangingImage )
            {
                bChangingImage = true;
                --nArrayPos;
                
                if( nArrayPos < 0 )
                    nArrayPos = nArraySize - 1;
      
                loadImage( array[ nArrayPos ].href, array[ nArrayPos ].title, true, true );   
            }  
        };
        
        // Register keyboard, mouse hover and mouse click events
        function registerEvents( bMulti )
        {
            $(document).bind('keyup', function(e) 
            { 
		        if(e == null) keycode = event.keyCode; // IE			        
                else keycode = e.which;  // Mozilla
			        
			    if( bMulti )
			    {
			        switch( keycode )   
			        {
			             case 27:   
			                 closeImage();   
			                 break;
			             
			             case 190: 
			             case 39:   
			                 nextImage();    
			                 break; 
			             
			             case 188: 
			             case 37:   
			                 prevImage();    
			                 break;
			        } 
			    }
			    else
			    {
				    if( keycode == 27 )
			             closeImage(); 
			    }
            });
            
            $('#wplightbox_close').click( function(){ closeImage(); } );
            $('#wplightbox_close').hover(function() { $(this).attr('src', settings.closeOverButtonSrc); }, function() { $(this).attr('src', settings.closeButtonSrc); });
            
            if( bMulti )
            {
                $('#wplightbox_prev').click( function(){ prevImage(); } );
                $('#wplightbox_next').click( function(){ nextImage(); } );
 
                $('#wplightbox_prev').hover(function() { $(this).attr('src', settings.previousOverButtonSrc); }, function() { $(this).attr('src', settings.previousButtonSrc); });
                $('#wplightbox_next').hover(function() { $(this).attr('src', settings.nextOverButtonSrc); }, function() { $(this).attr('src', settings.nextButtonSrc); });
            }
        };
                
        // Gets image left position
        function getImageLeft() 
        {
            switch( nBrowser )
            {
                case eBrowser.Msie:
                    {
                        var fZoom = getZoom();
                        if( fZoom > 1.0 )
                            return Math.max( 0, ( ( $(window).width() * fZoom ) - ( nImageWidth + nSumOfBorders ) ) /2 ); 
                        else  
                            return Math.max( 0, ( $(window).width() - ( nImageWidth + nSumOfBorders ) ) /2 );
                    }
                    break;

                case eBrowser.Safari:
                    {
                        return Math.max( 0, ( ( $(window).width() - ( nImageWidth + ( nSumOfBorders * 2 ) ) ) ) / ( 2 * getZoom() ) );
                    }
                    break;

                case eBrowser.Chrome:
                    {
                        var fZoom = getZoom();
                        if( fZoom < 1.0 )
                            return Math.max( 0, fZoom * ( ( $(window).width() - ( nImageWidth + nSumOfBorders ) ) /2 ) );
                        else  
                            return Math.max( 0, ( $(window).width() - ( nImageWidth + nSumOfBorders ) ) /2 );
                    }
                    break;

                default:
                    return Math.max( 0, ( $(window).width() - ( nImageWidth + nSumOfBorders ) ) / 2 );
            }
        };   

        // Gets image top position
        function getImageTop() 
        {
            return Math.max( 0, ( getPageScrollY() + ( Math.min( ( $(window).height() / 10 ), ( ( $(window).height() - ( nImageHeight + 20 ) ) / 2 ) ) ) ) );
        };

        // Gets page width
        function getPageWidth() 
        {
            var nPageWidth = ( nBrowser == eBrowser.Msie ) ? $(document).width() - ( 21 / getZoom() ) : Math.max( $(window).width(), $(document).width() ); 
            nPageWidth = Math.max( nPageWidth, ( nImageWidth + 40 ) );

            return nPageWidth;
        };

        // Gets page height
        function getPageHeight() 
        {
            var nPageHeight = ( nBrowser == eBrowser.Msie ) ? $(document).height() - ( 5 / getZoom() ) : Math.max( $(window).height(), $(document).height() ); 
            nPageHeight = Math.max( nPageHeight, ( getImageTop() + nImageHeight + 100 ) );

            return nPageHeight;
        };

        // Gets page scroll values
        function getPageScrollY() 
        {
            var yScroll = 0;

            if( window.pageYOffset )
                yScroll = window.pageYOffset;
            else if( document.body && document.body.scrollTop )
                yScroll = document.body.scrollTop;
            else if( document.documentElement && document.documentElement.scrollTop )
                yScroll = document.documentElement.scrollTop;
            else if( window.scrollY )
                yScroll = window.scrollY;

			return yScroll;
        };

        // Returns the current zoom level
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
            }
            return 1;
        }
    };
})(jQuery);