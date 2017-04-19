export function createBitmap(queRes, opts) {
	var bm = new createjs.Bitmap(queRes); // eslint-disable-line no-undef
	const options = opts || {};
	bm.x = options.x || 0;
	bm.y = options.y || 0;
	bm.scaleX = options.scaleX || 1;
	bm.scaleY = options.scaleY || 1;
	bm.regX = options.regX || 0;
	bm.regY = options.regY || 0;
	if (typeof options.alpha !== 'undefined')
		bm.alpha = options.alpha;
	if (typeof options.sourceRect !== 'undefined')
		bm.sourceRect = options.sourceRect;
	return bm;
}

export function createSprite(data, anim, opts) {
	var sData = new createjs.SpriteSheet(data); // eslint-disable-line no-undef
	var spr = new createjs.Sprite(sData, anim); // eslint-disable-line no-undef
	var options = opts || {};
	spr.x = options.x || 0;
	spr.y = options.y || 0;
	spr.scaleX = options.scaleX || 1;
	spr.scaleY = options.scaleY || 1;
	spr.regX = options.regX || spr.regX;
	spr.regY = options.regY || spr.regY;
	spr.rotation = options.rotation || 0;
	spr.currentAnimationFrame = options.currentAnimationFrame || 0;
	if (typeof options.alpha !== 'undefined')
		spr.alpha = options.alpha;
	return spr;
}

export function createCircle(r, color, opts) {
	var circle = new createjs.Shape(); // eslint-disable-line no-undef
	var options = opts || {};
	var x = options.x || 0;
	var y = options.y || 0;
	circle.graphics.beginFill(color).drawCircle(x,y,r);
	circle.scaleX = options.scaleX || 1;
	circle.scaleY = options.scaleY || 1;
	circle.regX = options.regX || circle.regX;
	circle.regY = options.regY || circle.regY;
	if (typeof options.alpha !== 'undefined')
		circle.alpha = options.alpha;
	return circle;
}

export function createSquare(w,color,options) {
	return createRectangle(w, w, color, options);
}

export function createRectangle(w,h,color,opts) {
	var rect = new createjs.Shape(); // eslint-disable-line no-undef
	var options = opts || {};
	var x = options.x || 0;
	var y = options.y || 0;
	rect.graphics.beginFill(color).drawRect(x,y,w,h);
	rect.scaleX = options.scaleX || 1;
	rect.scaleY = options.scaleY || 1;
	rect.regX = options.regX || 0;
	rect.regY = options.regY || 0;
	rect.rotation = options.rotation || 0;
	if (typeof options.alpha !== 'undefined')
		rect.alpha = options.alpha;
	return rect;
}

export function createText(msg, font, color, opts) {
	var text = new createjs.Text(msg, font, color); // eslint-disable-line no-undef
	var options = opts || {};
	text.x = options.x || 0;
	text.y = options.y || 0;
	if (typeof options.alpha !== 'undefined')
		text.alpha = options.alpha;
	return text;
}

//determines if number is in range without knowing which is greater
export function between(number, first, last) {
	return (first < last ? number >= first
		&& number <= last : number >= last && number <= first);
}

export function isInRectangle(x, y, rect) {
	return (between(x, rect.x, rect.x + rect.width)
		&& between(y, rect.y, rect.y + rect.height));
}
