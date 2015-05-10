var Cookie = (function (){
	var co ={},
	hsCookieName = "ohld-highscore",
	sgCookieName = "ohld-save-game";
	function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
	
	co.saveAndSetHS = function (score){
		var hs = readCookie(hsCookieName);		
		var hsc = $('.score');		
		if(!hsc.html() && hs)
			hsc.html(hs);					
			
		if(!hs || hs < score){
			hsc.html(score);
			createCookie(hsCookieName, score);			
		}						
	};
	co.load = function(){
		return JSON.parse(readCookie(sgCookieName));
	}
	
	co.save = function(gs){
		createCookie(sgCookieName, JSON.stringify(gs));
	}
	return co;
}());