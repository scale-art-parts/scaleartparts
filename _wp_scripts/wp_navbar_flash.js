//Generic script for Flash navbars
function wp_navbar_flash(menubarid, navtree, options, styleOptions) 
{
	var me = this;

	me.options = {
		"m_bNoScript" : false,
		"m_bStaticScript" : false,
		"DivId" : menubarid
	};
	if( options )
	{	me.options = WpNavBar.mergeOptions( me.options, options );}
	me.styleOptions = {
		'sFlashFile':''
	};
	if( styleOptions )
	{	me.styleOptions = WpNavBar.mergeOptions( me.styleOptions, styleOptions ); }

	me.write = function(s) 
	{
		if( this.options.m_bNoScript || this.options.m_bStaticScript )
		{	external.NavNoScriptWrite(s); }
		else
		{	document.write(s); }
	};
	
	if( navtree !== null && navtree.childArray !== null && navtree.childArray.length > 0 )
	{	//Only create if non-empty
		var div = document.getElementById(menubarid);
		var iHeight = div.style.height;
		var iWidth = div.style.width;
		var sParams = me.styleOptions.sFlashFile;
		var sOptionsJSON = wp_navbar_flash.encodeObject( me.options );
		var sStyleOptionsJSON = wp_navbar_flash.encodeObject( me.styleOptions );
		var sNavTreeJSON = wp_navbar_flash.encodeObject( navtree );
		
		//Set background colour
		var bkgrndCol = '#000000';
		if( this.styleOptions.NBkCol && this.styleOptions.NBkCol.search('trans') > -1 )
			bkgrndCol = this.styleOptions.NBkCol;
		else if( this.options.pageCol )
			bkgrndCol = this.options.pageCol;
	
		var sFlashVars = "options=" + sOptionsJSON + "&styleOptions=" + sStyleOptionsJSON + "&navtree=" + sNavTreeJSON;
		me.write( '<object id="' + menubarid + '_object" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width='+iWidth+' height=' + iHeight + '>\r\n' );
		me.write( '<param name=movie value="' + sParams + '">\r\n' );
		me.write( '<param name=FlashVars value="'+sFlashVars+'">\r\n' );
		me.write( '<param name=swLiveConnect value=true>\r\n' );
		me.write( '<param name=allowScriptAccess value=always>\r\n' );
		me.write( '<param name=loop value=false>\r\n' );
		me.write( '<param name=menu value=false>\r\n' );
		me.write( '<param name=quality value=high>\r\n' );
		me.write( '<param name=scale value=noscale>\r\n' );
		me.write( '<param name=salign value=LT>\r\n' );
		me.write( '<param name=wmode value=transparent>\r\n' );
		me.write( '<param name=bgcolor value=' + bkgrndCol + '>\r\n' );
		me.write( '<embed id="' + menubarid + '_embed" src="' + sParams + '" FlashVars=' + sFlashVars + ' swLiveConnect=true allowScriptAccess=always loop=false menu=false quality=high scale=noscale salign=LT wmode=transparent bgcolor=' + bkgrndCol + ' width='+iWidth+' height=' + iHeight + ' type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></embed>\r\n' );
		me.write( '</object>\r\n' );
	}
	else
	{
		me.write( '&nbsp;' );
		if( me.options.m_bMakePreview )
		{	MakePreview(); }
	}

	if( me.options.m_bNoScript || me.options.m_bStaticScript )
	{	external.NavNoScriptComplete(); }
}

wp_navbar_flash.encodeObject = function( obj )
{
	var s = JSON.stringify( obj );
	s = encodeURI( s );
	s = s.replace( /\=/g, "%3D" );
	s = s.replace( /&/g,  "%26" );
	s = s.replace( /\+/g, "%2B" );
	s = s.replace( /\//g, "%2F" );
	return s;
};

function wp_navbar_flash_zindex( zIndex, divId ) 
{
	var div = document.getElementById( divId );
	if( div )
		div.style.zIndex = zIndex;	
}
