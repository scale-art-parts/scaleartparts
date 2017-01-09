wp_menus.prototype.m_type = 0;
wp_menus.prototype.m_delay = 500;
wp_menus.prototype.m_bordersize = 1;
wp_menus.prototype.m_fontsize = 12;
wp_menus.prototype.m_filterOpacity = 100;
wp_menus.prototype.m_mozOpacity = 1;
wp_menus.prototype.m_width = 0;
wp_menus.prototype.m_padding = '3px 10px 3px 10px';
wp_menus.prototype.m_fontfamily = 'sans-serif';
wp_menus.prototype.m_bordercolor = '#000000';
wp_menus.prototype.m_bkgndcolor = 'transparent';
wp_menus.prototype.m_textcolor = '#000000';
wp_menus.prototype.m_bkgndcolorhl = 'transparent';
wp_menus.prototype.m_textcolorhl = '#ccccff';
wp_menus.prototype.m_imagearrow = 'arrow.gif';
wp_menus.prototype.m_imagearrowhl = 'arrowhl.gif';
wp_menus.prototype.m_itemlines = false;
wp_menus.prototype.m_timeout = null;
wp_menus.prototype.m_active = null;
wp_menus.prototype.m_txtalign = 'left';
wp_menus.prototype.m_txtnbclr = '';
wp_menus.prototype.m_txtnbclrinv = '';
wp_menus.prototype.m_txtnbbkgndclr = '';
wp_menus.prototype.m_txtnbbkgndclrinv = '';
wp_menus.prototype.m_fontbold = false;
wp_menus.prototype.m_fontitalic = false;
wp_menus.prototype.m_fontunderline = false;
wp_menus.isIE = function() { return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent); };

function wp_menus() {this.m_acStack = new wp_activestack();}
wp_menus.prototype.InitElement = function(id_name,normal,over)
{ var e = document.getElementById(id_name); e.p_root = this; if(normal!='') {e.m_imgNormal = new Image(); e.m_imgOver = new Image(); e.m_imgNormal.src = normal; e.m_imgOver.src = over; }}
wp_menus.prototype.BeginMenu = function(id_name) { this.m_active = id_name; document.write('<div id="'+id_name+'" style="z-index:100;position:absolute;visibility:hidden;border-style:solid;border-color:'+this.m_bordercolor+';');
if(this.m_itemlines) document.write('border-width:'+this.m_bordersize+'px '+this.m_bordersize+'px 0px '+this.m_bordersize+'px;');
else document.write('border-width:'+this.m_bordersize+'px;');
if(wp_menus.isIE()) document.write('filter:alpha( opacity='+this.m_filterOpacity+' );'); else document.write('-moz-opacity:'+this.m_mozOpacity+';');
document.write('"><table cellpadding="0" cellspacing="0">'); }
wp_menus.prototype.EndMenu = function() { document.write('</table></div>'); this.m_active = null; }
wp_menus.prototype.AddLink = function(id_name,title,url,id_submenu,targetframe) {
  document.write('<tr><td><');
  if(url=='') document.write('div'); else document.write('a href="'+url+'" target="'+targetframe+'"');
  document.write(' id="'+id_name+'" style="display:block;color:'+this.m_textcolor+';font-size:'+this.m_fontsize+'px;font-family:'+this.m_fontfamily+';');
  if(this.m_fontbold) document.write('font-weight:bold;');if(this.m_fontitalic) document.write('font-style:italic;');document.write('text-decoration:' + (this.m_fontunderline?'underline;':'none;'));
  if(url=='') document.write('cursor:default;');
  if(this.m_bkgndcolor) document.write('background-color:'+this.m_bkgndcolor+';');
  if(this.m_width > 0) document.write('width:'+this.m_width+'px;'); else if(wp_menus.isIE()) document.write('width:100%;');
  if(this.m_itemlines) document.write('border-bottom:'+this.m_bordersize+'px solid '+this.m_bordercolor+';');
  if(this.m_acStack.m_showright) document.write('padding:'+this.m_padding+';'); else document.write('text-align:right;padding:'+this.m_padding+';');
  if(this.m_txtalign) document.write('text-align:'+this.m_txtalign+';');
  if(id_submenu) {document.write('background-image:url('+this.m_imagearrow+');background-repeat:no-repeat;background-position:'); if(this.m_acStack.m_showright) document.write('right;'); else document.write('left;'); }
  document.write('" onmouseover="wp_SubMenuOver(\''+id_name+'\');');
  document.write('" onmouseout="wp_SubMenuOut(\''+id_name+'\');" onclick="wp_ForceClose(\''+id_name+'\');">');
  document.writeln(title+'</' + (url=='' ? 'div' : 'a') + '></td></tr>');
  var e = document.getElementById(id_name); e.m_root = this; e.m_idchild = id_submenu; e.m_menu = this.m_active;
}
function wp_ImageRoll(action,id_name){
  var e = document.getElementById(id_name);
  if(e.m_root.m_txtnbclr.length > 0){if(action == 0){e.style.backgroundColor=e.m_root.m_txtnbbkgndclr;e.style.color=e.m_root.m_txtnbclr;}
	else{e.style.backgroundColor=e.m_root.m_txtnbbkgndclrinv;e.style.color=e.m_root.m_txtnbclrinv;}}
  if(e.m_imgNormal){if(action == 0){e.src = e.m_imgNormal.src;}else{e.src = e.m_imgOver.src;}}
}
function wp_MenuItemOver(id_name,p_root,id_sub){document.getElementById(id_name).m_root = p_root;clearInterval(p_root.m_timeout);if(id_sub)document.getElementById(id_sub).m_depth = 1;p_root.m_active = id_name;p_root.m_acStack.push(0,id_name,id_sub);}
function wp_SubMenuOver(id_name) { var e = document.getElementById(id_name); var pm = document.getElementById(e.m_menu); if(e.m_idchild) document.getElementById(e.m_idchild).m_depth = pm.m_depth+1; clearInterval(e.m_root.m_timeout); e.m_root.m_acStack.push(pm.m_depth,id_name,e.m_idchild); }
function wp_SubMenuOut(id_name) { var e = document.getElementById(id_name); if(e.m_root.m_active) {e.m_root.m_timeout = setInterval("wp_Timeout('"+e.m_root.m_active+"')",e.m_root.m_delay); }}
function wp_MenuItemOut(id_name,p_menu) { p_menu.m_timeout = setInterval("wp_Timeout('"+id_name+"')",p_menu.m_delay); }
function wp_Timeout(id_name) { var e = document.getElementById(id_name); e.p_root.m_acStack.clear(); e.p_root.m_active = null; }
function wp_ForceClose(id_name) { var e = document.getElementById(id_name); clearInterval(e.m_root.m_timeout); e.m_root.m_acStack.clear(); e.m_root.m_active = null; }

wp_activestack.prototype.count = 0;
wp_activestack.prototype.type = 0;
wp_activestack.prototype.gap = 1;
wp_activestack.prototype.bordergap = 1;
wp_activestack.prototype.m_firstpopup = 0;
wp_activestack.prototype.m_showbelow = true;
wp_activestack.prototype.m_showright = true;
wp_activestack.prototype.m_padding = 20;

function wp_activestack() {this.depth = new Array(); this.element = new Array();}
wp_activestack.prototype.push = function(depth,idelem,idchild) {
  while(( this.count>0 )&&( depth<=this.depth[this.count-1] )) { this.pop(); }
  if(idelem) {
    this.depth[this.count] = depth; this.element[this.count] = idelem; this.count++;
    document.getElementById(idelem).m_idchild = idchild;
    if(depth==0) { wp_ImageRoll(1,idelem); if(idchild) this.ShowMenu(idchild,idelem,true);
    } else {
      var e = document.getElementById(idelem);
      e.style.backgroundColor = e.m_root.m_bkgndcolorhl;
      e.style.color = e.m_root.m_textcolorhl;
      if(e.style.backgroundImage) e.style.backgroundImage = 'url('+e.m_root.m_imagearrowhl+')';
      if(idchild) this.ShowMenu(idchild,idelem,false);
    }
  }
}

wp_activestack.prototype.pop = function() {
  with( this ) {
    if(count>0) { count--;
      if(depth[count]==0) { wp_ImageRoll(0,element[count]); }
      else {
        var e = document.getElementById(element[count]);
        e.style.backgroundColor = e.m_root.m_bkgndcolor;
        e.style.color = e.m_root.m_textcolor;
        if( e.style.backgroundImage ) e.style.backgroundImage = 'url('+e.m_root.m_imagearrow+')';
      }
      var idchild = document.getElementById(element[count]).m_idchild;
      if(idchild) document.getElementById(idchild).style.visibility = "hidden";
      depth[count] = element[count] = null;
    }
  }
}

wp_activestack.prototype.clear = function() { while(this.count>0) { this.pop(); }}
wp_activestack.prototype.ShowMenu = function(id_name,id_parent,down) {
  var p = document.getElementById(id_parent); var e = document.getElementById(id_name); var top = 0; var left = 0; var c = p;
  while(c) { top += c.offsetTop; left += c.offsetLeft; c = c.offsetParent; }
  if(this.type==1 || !down){var k = e.m_depth == 1 ? this.gap : p.m_root.m_bordersize; if(this.m_showright) left += p.offsetWidth + k; else left -= e.offsetWidth - k; if(!this.m_showbelow) top -= (e.offsetHeight - p.offsetHeight - (p.m_root.m_bordersize*2));}
  else{if(e.m_depth == 1){if(this.m_showbelow) top += p.offsetHeight + this.gap; else top -= (e.offsetHeight + this.gap);}}
  if(top+e.offsetHeight > document.body.scrollTop+document.body.clientHeight) top-= ((top+e.offsetHeight)-(document.body.scrollTop+document.body.clientHeight));
  if(e.m_depth == 1) { if(this.type==0){if(this.m_firstpopup == 1) left = left + (p.offsetWidth - e.offsetWidth) / 2; else if(this.m_firstpopup == 2) left = (left + p.offsetWidth) - e.offsetWidth; else if(this.m_firstpopup == 3) { var iWidth = p.offsetWidth - (wp_menus.isIE() ? 0 : this.m_padding) - 1; var vAnchors = e.getElementsByTagName(wp_menus.isIE() ? 'td' : 'a'); for(var n = 0; n < vAnchors.length; ++n) vAnchors[n].style.width = iWidth; }}
  else { if(this.m_firstpopup == 1) top = top + (p.offsetHeight - e.offsetHeight) / 2; else if(this.m_firstpopup == 2) top = (top + p.offsetHeight) - e.offsetHeight; }}
  e.style.top = top+"px"; e.style.left = left+"px"; e.style.visibility = "visible";
}