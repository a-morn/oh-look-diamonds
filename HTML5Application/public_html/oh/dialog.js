var dialogJSON = {"HoboCatz": 
[   
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "good evening", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "whatcha lookin' at\n\
there, kitten?", "Sound": "hoboCatSound2", "Choice" :false, "NextID":3, "End":false},
        {"Who":"Catz", "What": "diamonds!", "Sound":"catzSound1", "Choice" :false, "NextID":4, "End":false},
        {"Who": "Hobo-Cat", "What": "Heh, kitten what you got\n\
up there is none but \n\
big balls of gas and fire", "Sound": "hoboCatSound1", "Choice" :false, "NextID":5, "End":false},
            {"Who": "Hobo-Cat", "What": "Wish I had me some \n\
diamonds though\n\
Then I could build myself \n\
a house", "Sound": "hoboCatSound2", "Choice" :false, "NextID":6, "End":false},
            {"Who": "Hobo-Cat", "What": "Been awhile since \n\
I built something \n\
Been awhile since \n\
I had a house", "Sound": "hoboCatSound2", "Choice" :false, "NextID":7, "End":false},
                {"End":true}
            ], "idle":{"what":"cough"}},

    {"dialog":[
        {"Who": "Hobo-Cat", "What": "well I be damned - a diamond!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "for me? \n\
much obliged, kitten!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":false, "Triggers": [{Stat:"score", Value: -1}]},
                {"End":true}
    ], "idle":{"what":"cough"}},
    
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "well look at that\n\
guess I'mma build myself a house!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "you keep 'em commin', kitten!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3,"End":false, "Triggers":[{Stat:"score", Value: -5}]},
        {"End":true}
    ], "idle":{"what":"hum hum"}},
    
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "all done!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "Triggers":[{Stat:"HoboCatHouseBuilt", Value: true}, {Stat:"score", Value: -5}], "End":false},        
        {"End":true}
    ], "idle":{"what":"hum hum"}},

{"dialog":[
        {"Who": "Hobo-Cat", "What": "say there's plenty of\n\
stray kitties in Katholm\n\
why don't we build 'em a home?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}]},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":4, "Triggers":[{Stat:"BuildOrphanage", Value: true}, {Stat:"CurrentlyBuilding", Value: true}], "End":false},
        {"Who": "Hobo-Cat", "What": "great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5,"End":false},
        {"End":true}
    ], "idle":{"what":"hum hum"}},


{"dialog":[
        {"Who": "Hobo-Cat", "What": "all done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :false, "NextID":1,"End":false, 
            "Triggers":[{Stat:"OrphanageBuilt", Value: true},{Stat:"BuildOrphanage", Value: false}, {Stat:"score", Value: -20}, {Stat:"CurrentlyBuilding", Value: false}]},
        {"End":true}
    ], "idle":{"what":"hum hum"}}

,

{"dialog":[
        {"Who": "Hobo-Cat", "What": "there's some old friends\n\
of mine back in Katholm.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "they're still\n\
stuck in the hole I've dug myself out of\n\
why don't we build a place\n\
for them out here?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":2},{"text":"klol", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"BuildRehab", Value: true}, {Stat:"CurrentlyBuilding", Value: true}], "End":false},
        {"Who": "Hobo-Cat", "What": "great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":false},
        {"End":true}
    ], "idle":{"what":"hum hum"}},


{"dialog":[
        {"Who": "Hobo-Cat", "What": "all done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :false, "End":false, "NextID":1,"Triggers":[{Stat:"OrphanageBuilt", Value: true},{Stat:"BuildOrphanage", Value: false}, {Stat:"score", Value: -20}, {Stat:"CurrentlyBuilding", Value: false}]},
        {"End":true}
    ], "idle":{"what":"hum hum"}}
]
};