var dialogJSON = {"HoboCatz": 
[   
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

    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Well I be damned - a diamond!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "For me? \n\
Much obliged, kitten!\n\
I'll go ahead and build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":false, "Triggers": [{Stat:"score", Value: -1}]},
                {"End":true}
    ], "idle":{"what":"cough"}},
    
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", 
            "Choice" :false, "NextID":1, "Triggers":[{Stat:"built", 
                    Value: "hoboCatHouse"}, {Stat:"score", Value: -19}], "End":false},        
        {"End":true}
    ], "idle":{"what":"hum hum"}},

{"dialog":[
        {"Who": "Hobo-Cat", "What": "Say there's plenty of\n\
stray kitties in Katholm.\n\
Why don't we build 'em a home?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}]},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":4, "Triggers":[{Stat:"isBuiding", Value: "orphanage"}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5,"End":false},
        {"End":true}
    ], "idle":{"what":"hum hum"}},


{"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :false, "NextID":1,"End":false, 
            "Triggers":[{Stat:"built", Value: "orphanage"}, {Stat:"score", Value: -20}]},
        {"End":true}
    ], "idle":{"what":"hum hum"}}

,

{"dialog":[
        {"Who": "Hobo-Cat", "What": "There's some old friends\n\
of mine back in Katholm.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "They're still\n\
stuck in the hole I've dug myself out of.\n\
Why don't we build a place\n\
for them out here?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":2},{"text":"klol", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"isBuilding", Value: "rehab"}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":false},
        {"End":true}
    ], "idle":{"what":"hum hum"}},


{"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :false, "End":false, "NextID":1,"Triggers":[{Stat:"built", Value: "rehab"},{Stat:"BuildRehab", Value: false}, {Stat:"score", Value: -20}, {Stat:"CurrentlyBuilding", Value: false}]},
        {"End":true}
    ], "idle":{"what":"hum hum"}}
]
};