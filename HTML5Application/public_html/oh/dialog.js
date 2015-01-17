var dialogJSON = {"hoboCat": 
[   
//0
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Good evening", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Whatcha lookin' at\n\
there, kitten?", "Sound": "hoboCatSound2", "Choice" :false, "NextID":3, "End":false},
        {"Who":"Catz", "What": "diamonds!", "Sound":"catzSound1", "Choice" :false, "NextID":4, "End":false},
        {"Who": "Hobo-Cat", "What": "Heh, kitten what you got\n\
up there is none but \n\
big balls of gas and fire", "Sound": "hoboCatSound1", "Choice" :false, "NextID":5, "End":true}            
            ], "idle":{"what":"*cough*"}},
//1
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Well I be damned - a diamond!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "For me? \n\
Much obliged, kitten!\n\
I'll go ahead and build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":true, "Triggers": [{Stat:"score", Value: -1}]}                
    ], "idle":{"what":"cough"}},
   //2 
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", 
            "Choice" :false, "NextID":1, "Triggers":[{Stat:"built", 
                    Value: "hoboCatHouse"}, {Stat:"score", Value: -19}], "End":true}                
    ], "idle":{"what":"hum hum"}},
//3
{"dialog":[
        {"Who": "Hobo-Cat", "What": "Say there's plenty of\n\
stray kitties in Katholm.\n\
Why don't we build 'em a home?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}]},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":4, "Triggers":[{Stat:"isBuilding", Value: "orphanage"},
            {Stat:"CurrentlyBuilding", Value: true}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5,"End":true}        
    ], "idle":{"what":"hum hum"}},

//4
{"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :false, "NextID":1,"End":true, 
            "Triggers":[{Stat:"built", Value: "orphanage"}, {Stat:"score", Value: -20}]}        
    ], "idle":{"what":"hum hum"}}

,
//5
{"dialog":[
        {"Who": "Hobo-Cat", "What": "There's some old friends\n\
of mine back in Katholm.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "They're still\n\
stuck in the hole I've dug myself out of.\n\
Why don't we build a place\n\
for them out here?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":2},{"text":"klol", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"isBuilding", Value: "rehab"},
            {Stat:"CurrentlyBuilding", Value: true}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}
    ], "idle":{"what":"hum hum"}},

//6
{"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :false, "End":true, "NextID":1,"Triggers":[{Stat:"built", Value: "rehab"},{Stat:"BuildRehab", Value: false}, {Stat:"score", Value: -20}, {Stat:"CurrentlyBuilding", Value: false}]}        
    ], "idle":{"what":"hum hum"}},

//7
{"dialog":[
        {"Who": "Hobo-Cat", "What": "kittens need schoolin'\n\
but tuition fees at \n\
Cat King Collage\n\
are too high for most.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "why don't we\n\
found a university.\n\
funny hats and \n\
titles for all!", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":2},{"text":"klol", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"isBuilding", Value: "university"}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}        
    ], "idle":{"what":"hum hum"}}
],
"timmy": [
    //0
    {"dialog":[{"Who": "Timmy", "What": "can haz summer camp?", "Choice":true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage",Value: "summerCamp"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": ":D", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can haz some more?"}},
    //1
    {"dialog":[{"Who": "Timmy", "What": "can haz youth center?", "Choice":true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage", Value: "youthCenter"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": ":D", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can haz some more?"}}]
};