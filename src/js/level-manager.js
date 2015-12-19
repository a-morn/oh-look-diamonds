var LevelManager = (function (){
    var levelSchema = [
	{ x: 30.98, y: 40.13, type: "a type of type"},
	{ x: 320.98, y: 2550.13, type: "another type of type"}
    ],
    levelManager = {};

    levelManager.SetCurrent = function(schema){
	levelSchema = schema;
    };

    levelManager.GetCurrent = function(){
	return levelSchema;
    };

    levelManager.LayDownSomeTrackBreh = function(){
    };
    
    return levelManager;
}());
