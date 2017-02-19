const co ={};
const	hsCookieName = "ohld-highscore";
const	sgCookieName = "ohld-save-game";
	
export function saveAndSetHS(score, cb){
	var hs = readCookie(hsCookieName);				
	var hsc = $('#hs');				
	if(hsc.attr("aria-valuenow")==-1 && hs){			
		hsc.attr("aria-valuenow", hs);								
		cb(hs);			
	}			
		
	if(!hs || hs < score){		
		hsc.attr("aria-valuenow", hs);						
		cb(score);
		createCookie(hsCookieName, score);			
	}							
};
export function load(){		
	return JSON.parse(readCookie(sgCookieName));
}

export function save(gs){		
	createCookie(sgCookieName, JSON.stringify(gs));
}
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

