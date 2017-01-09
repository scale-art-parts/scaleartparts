function WPImagePopup( title, target, imagesrc, look )
{
	popwin = window.open("",target,look);
	popwin.document.open();
	popwin.document.write('<html><head><title>'+title+'</title></head><body style="margin:0;padding:0;"><a href="" onclick="javascript:window.close()"><img src="'+imagesrc+'" border="0"><a/></body></html>');
	popwin.document.close();
	popwin.focus();
}

