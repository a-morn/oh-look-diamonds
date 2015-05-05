var helpers = (function() {
	var halp = {};
	halp.createBitmap = function(queRes, options) {
		var bm = new createjs.Bitmap(queRes);
		var options = options || {};
		bm.x = options.x || 0;
		bm.y = options.y || 0;
		bm.scaleX = options.scaleX || 1;
		bm.scaleY = options.scaleY || 1;
		bm.regX = options.regX || 0;
		bm.regY = options.regY || 0;
		if (typeof options.alpha !== "undefined")
			bm.alpha = options.alpha;
		if (typeof options.sourceRect !== "undefined")
			bm.sourceRect = options.sourceRect;
		return bm;
	};
	halp.createSprite = function(data, anim, options) {
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
		if (typeof options.alpha !== "undefined")
			spr.alpha = options.alpha;
		return spr;
	};

	halp.createCircle = function(r,color,options)
	{
		var circle = new createjs.Shape();
		var options = options || {};
		var x = options.x || 0;
		var y = options.y || 0;
		circle.graphics.beginFill(color).drawCircle(x,y,r);
		circle.scaleX = options.scaleX || 1;
		circle.scaleY = options.scaleY || 1;
		circle.regX = options.regX || spr.regX;
		circle.regY = options.regY || spr.regY;
		if (typeof options.alpha !== "undefined")
			circle.alpha = options.alpha;
		return circle;
	}

	halp.createSquare = function(w,color,options){
		return halp.createRectangle(w, w, color, options);
	}

	halp.createRectangle = function(w,h,color,options)
	{
		var rect = new createjs.Shape();
		var options = options || {};
		var x = options.x || 0;
		var y = options.y || 0;
		rect.graphics.beginFill(color).drawRect(x,y,w,h);
		rect.scaleX = options.scaleX || 1;
		rect.scaleY = options.scaleY || 1;
		rect.regX = options.regX || 0;
		rect.regY = options.regY || 0;
		rect.rotation = options.rotation || 0;
		if (typeof options.alpha !== "undefined")
			rect.alpha = options.alpha;
		return rect;
	}

	halp.createText = function(msg, font, color, options) {
		var text = new createjs.Text(msg, font, color);
		var options = options || {};
		text.x = options.x || 0;
		text.y = options.y || 0;
		if (typeof options.alpha !== "undefined")
			text.alpha = options.alpha;
		return text;
	};

	//determines if number is in range without knowing which is greater
	halp.between = function(number, first, last) {
		return (first < last ? number >= first && number <= last : number >= last && number <= first);
	}

	halp.isInRectangle = function(x, y, rect) {
		return (halp.between(x, rect.x, rect.x + rect.width) && halp.between(y, rect.y, rect.y + rect.height))
	}

	return halp;
}());