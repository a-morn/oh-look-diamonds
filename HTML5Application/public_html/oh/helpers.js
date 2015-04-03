var helpers = (function(){
	var halp = {};
	halp.createBitmap = function(queRes, options){
		var bm = new createjs.Bitmap(queRes);
		var options = options || {};		
		bm.x = options.x || 0;		
		bm.y = options.y || 0;				
		bm.scaleX = options.scaleX || 1;		
		bm.scaleY = options.scaleY || 1;				
		bm.regX = options.regX || 0;		
		bm.regY = options.regY || 0;	
		if(typeof options.alpha !== "undefined")
			bm.alpha = options.alpha;        		
		if(typeof options.sourceRect !== "undefined")
			bm.sourceRect = options.sourceRect;        		
		return bm;
	};
	halp.createSprite = function(data, anim, options){		
		var sData = new createjs.SpriteSheet(data);		
        var spr = new createjs.Sprite(sData, anim);
		var options = options || {};	
        spr.x = options.x || 0;		
		spr.y = options.y || 0;		
		spr.scaleX = options.scaleX || 1;		
		spr.scaleY = options.scaleY || 1;			
		spr.regX = options.regX || spr.regX;		
		spr.regY = options.regY || spr.regY;	
		spr.rotation = options.rotation || 0;	
		spr.currentAnimationFrame = options.currentAnimationFrame || 0;	
		if(typeof options.alpha !== "undefined")
			spr.alpha = options.alpha;        		
		return spr;
	};
	return halp;
}());