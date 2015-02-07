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
Hey, with  20 of these I could\n\
 build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":true, "Triggers": [{Stat:"score", Value: -1}]}                
    ], "idle":{"what":"cough"}},

//2 
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", 
            "Choice" :false, "NextID":1, "Triggers":[{Stat:"built", 
                    Value: "hoboCatHouse"}, {Stat:"score", Value: -19}], "End":true}                
    ], "idle":{"what":"homeowners association \n\
here I come!"}},
//3
{"dialog":[
        {"Who": "Hobo-Cat", "What": "Say there's plenty of\n\
stray kitties in Katholm.\n\
Why don't we build 'em a home?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}]},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":4, "Triggers":[{Stat:"built", Value: "orphanage"}, {Stat:"score", Value: -20}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5,"End":true}        
    ], "idle":{"what":"♫ ain't no love \n\
in the heart of the city ♫"}},
        
//4
{"dialog":[
        {"Who": "Hobo-Cat", "What": "There's some old friends\n\
of mine back in Katholm.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "They're still\n\
stuck in the hole I've dug myself out of.\n\
Why don't we build a place\n\
for them out here?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"nopez", "ChoiceID":2},{"text":"klol", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "Alrighty then :/", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"built", Value: "rehab"}, {Stat:"score", Value: -20}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}
    ], "idle":{"what":"♫ I've seen the catnip\n\
and the damage done ♫"}},


//5
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
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"built", Value: "university"}, {Stat:"score", Value: -20}], "End":false},
        {"Who": "Hobo-Cat", "What": "Great!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}        
    ], "idle":{"what":"vetenskap och konst"}},

//6
{"dialog":[{"Who": "Hobo-Cat", "What": "let's make the catnip rehab center\n\
a full blown hospital!", "Choice":true, "Choices":[{"text":"meow...", "ChoiceID":1},{"text":"meow!", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Hobo-Cat", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"rehab",Value: "hospital"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Hobo-Cat", "What": "medical care for all cats!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"i feel healthier already"}},

//7
{"dialog":[{"Who": "Hobo-Cat", "What": "we should add better\n\
support for care for\n\
the mentally ill \n\
at the hospital.", "Choice":true, "Choices":[{"text":"there can be only one", "ChoiceID":1},{"text":"i'll teach you all I know", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Hobo-Cat", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"rehab",Value: "phychiatricWing"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Hobo-Cat", "What": "a new wing has been added", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"gonna take a stroll in \n\
that fancy new garden"}},
        
//8
{"dialog":[{"Who": "Hobo-Cat", "What": "can't make rent", "Choice":false, "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false}
                ],                 
            "idle":{"what":"harsh times"}}
],
"timmy": [
   
    //0
    {"dialog":[{"Who": "Timmy", "What": "can haz youth center for stray kitties?", "Choice":true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage", Value: "youthCenter"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": ":D", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can haz some more?"}},
    //1
    {"dialog":[{"Who": "Timmy", "What": "can haz summer camp for stray kitties?", "Choice":true, "Choices":[{"text":"nopez", "ChoiceID":1},{"text":"klol", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage",Value: "summerCamp"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": ":D", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can haz some more?"}},
    //2
    {"dialog":[{"Who": "Timmy", "What": "i can be rocketeer too?", "Choice":true, "Choices":[{"text":"there can be only one", "ChoiceID":1},{"text":"i'll teach you all I know", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": ":'/", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"university",Value: "rocketUniversity"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": "i'll enroll to the Catz University Rocketeer Program asap", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"the final frontier"}}],

"priest": [
   
    //0
    {"dialog":[{"Who": "Priest", "What": "I see you have a home for\n\
cats a stray from the flock.", "Choice":false, "NextID":1, "End":false},
                {"Who": "Priest", "What": "When they turned to katnip\n\
they turned away from the cat God.", "Choice":false, "NextID":2, "End":false},
                {"Who": "Catz", "What": "meow?", "Choice":false, "NextID":3, "End":false},
                {"Who": "Priest", "What": "With the help of my congregation\n\
we can lead them back to the\n\
rightous path.", "Choice":true, "Choices":[{"text":"nopez", "ChoiceID":4},{"text":"klol", "ChoiceID":6}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":5, "End":false},
                {"Who": "Priest", "What": "may the Cat God forgive you", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":7, "Triggers":[{"Stat":"addOn", "Building":"rehab", Value: "monastery"}, {Stat:"score", Value: 20}], "End":false},
                {"Who": "Priest", "What": "Excellent! Please take this\n\
small gift as a token\n\
of the Lords apprication.", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"blessings upon ye, child of the cat God"}}]
};

