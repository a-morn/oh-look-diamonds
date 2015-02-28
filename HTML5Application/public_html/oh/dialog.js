var dialogJSON = {"hoboCat": 
{   
"goodEvening":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Good evening", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Whatcha lookin' at\n\
there, kitten?", "Sound": "hoboCatSound2", "Choice" :false, "NextID":3, "End":false},
        {"Who":"Catz", "What": "diamonds!", "Sound":"catzSound1", "Choice" :false, "NextID":4, "End":false},
        {"Who": "Hobo-Cat", "What": "Heh, kitten what you got\n\
up there is none but \n\
big blobs of gas and fire", "Sound": "hoboCatSound1", "Choice" :false, "NextID":5, "End":true}            
            ], "idle":{"what":"*cough*"}},
"aDiamond":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Well I be damned - a diamond!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "For me? \n\
Much obliged, kitten!\n\
Hey, with  20 of these I could\n\
 build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":true, "Triggers": [{Stat:"score", Value: -1}]}                
    ], "idle":{"what":"*cough* better times ahead"}},

"20Diamonds":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "Well I be damned - look at all those diamonds!", "Sound": "HoboCatSound1", "Choice" :false, "NextID":1, "End":false},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "For me? \n\
Much obliged, kitten!\n\
With these I can\n\
 build myself a house", "Sound": "HoboCatSound1", "Choice" :false, "NextID":3, "End":true, "Triggers": [{Stat:"built", 
Value: "hoboCatHouse"}, {Stat:"score", Value: -21}]}                
    ], "idle":{"what":"homeowners association \n\
here I come!"}},

"hoboCatHouseBuilt":
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "All done!", "Sound": "HoboCatSound1", 
            "Choice" :false, "NextID":1, "Triggers":[{Stat:"built", 
                    Value: "hoboCatHouse"}, {Stat:"score", Value: -20}], "End":true}                
    ], "idle":{"what":"homeowners association \n\
here I come!"}},
        
"orphanage":
{"dialog":[
        {"Who": "Hobo-Cat", "What": "Say there's plenty of\n\
stray kitties in Katholm.\n\
Why don't we build 'em a home?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}]},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":2, "End":false},
        {"Who": "Hobo-Cat", "What": "Guess those kittes \n\
gotta fend for themselves", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":4, "Triggers":[{Stat:"built", Value: "orphanage"}, {Stat:"score", Value: -20}], "End":false},
        {"Who": "Hobo-Cat", "What": "We can start\n\
housing kittens straight away", "Sound": "HoboCatSound1", "Choice" :false, "NextID":5,"End":true},
                {"Who": "Hobo-Cat", "What": "Add as many\n\
bunks as you see fit.\n\
Be aware though,\n\
we gotta afford to pay\n\
the bills", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6,"End":true}
    ], "idle":{"what":"♫ ain't no love \n\
in the heart of the city ♫"}},
        
"rehab":
{"dialog":[
        {"Who": "Hobo-Cat", "What": "There's some old friends\n\
of mine back in Katholm.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "They're still\n\
stuck in the hole I've dug myself out of.\n\
Why don't we build a place\n\
for them out here?", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"no", "ChoiceID":2},{"text":"yes", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "They're on their \n\
own then", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"built", Value: "rehab"}, {Stat:"score", Value: -20}], "End":false},
        {"Who": "Hobo-Cat", "What": "Add some beds\n\
and I'll lead them through\n\
all twelve steps to\n\
a better life", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}
    ], "idle":{"what":"♫ I've seen the catnip\n\
and the damage done ♫"}},


"school":
{"dialog":[
        {"Who": "Hobo-Cat", "What": "Kittens need schoolin'\n\
but tuition fees at \n\
Cat King Collage\n\
are too high for most.", "Sound": "HoboCatSound1", "Choice" :false, "NextID": 1, "End":false},
        {"Who": "Hobo-Cat", "What": "Why don't we \n\
found a university. \n\
funny hats and \n\
titles for all!", "Sound": "HoboCatSound1", "Choice" :true, "Choices":[{"text":"no", "ChoiceID":2},{"text":"yes", "ChoiceID":4}], "End":false},
        {"Who": "Catz", "What": "meow...", "Sound": "catzSound1", "Choice" :false, "NextID":3, "End":false},
        {"Who": "Hobo-Cat", "What": "How they gonna get\n\
schooled now?", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "Choice" :false, "NextID":5, "Triggers":[{Stat:"built", Value: "university"}, {Stat:"score", Value: -20}], "End":false},
        {"Who": "Hobo-Cat", "What": "Choose how many\n\
cats that can enroll.\n\
You got some time to\n\
teach in between those\n\
rocket rides, right kitten?", "Sound": "HoboCatSound1", "Choice" :false, "NextID":6, "End":true}        
    ], "idle":{"what":"vetenskap och konst"}},

"catnipCenter":
{"dialog":[{"Who": "Hobo-Cat", "What": "Let's make the catnip rehab center\n\
a full blown hospital!", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Hobo-Cat", "What": "better stay healthy\n\
then...", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"rehab",Value: "hospital"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Hobo-Cat", "What": "medical care for all cats!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"I feel healthier already"}},

"psyciatricWing":
{"dialog":[{"Who": "Hobo-Cat", "What": "We should add better\n\
support for care for\n\
the mentally ill \n\
at the hospital.", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Hobo-Cat", "What": "better stay sane\n\
then...", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"rehab",Value: "phychiatricWing"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Hobo-Cat", "What": "A new wing has been added\n\
to the hospital", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"Gonna take a stroll in \n\
that fancy new garden"}},
        
"insufficientFunds":
{"dialog":[{"Who": "Hobo-Cat", "What": "Can't make rent", "Choice":false, "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false}
                ],                 
            "idle":{"what":"harsh times"}}
    },
"timmy": {
   
    "youthCenter":
    {"dialog":[{"Who": "Timmy", "What": "can haz youth center for stray kitties?", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": "oh no", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage", Value: "youthCenter"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": "yay!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can i have some more?"}},
    
    "summerCamp":
    {"dialog":[{"Who": "Timmy", "What": "can haz summer camp for stray kitties?", "Choice":true, "Choices":[{"text":"no", "ChoiceID":1},{"text":"yes", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": "oh no", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"orphanage",Value: "summerCamp"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": "hurray!", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"can i please some more?"}},
    
    "rocketUniversity":
    {"dialog":[{"Who": "Timmy", "What": "i can be rocketeer too?", "Choice":true, "Choices":[{"text":"there can be only one", "ChoiceID":1},{"text":"i'll teach you all I know", "ChoiceID":3}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":2, "End":false},
                {"Who": "Timmy", "What": "oh no", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":4, "Triggers":[{"Stat":"addOn", "Building":"university",Value: "rocketUniversity"}, {Stat:"score", Value: -20}], "End":false},
                {"Who": "Timmy", "What": "i'll enroll to the Catz Rocket Institute Rocketeer Program asap", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"the final frontier"}}},

"priest": {
   
    "monastary":
    {"dialog":[{"Who": "Priest", "What": "I see you have a home for\n\
cats a stray from the flock.", "Choice":false, "NextID":1, "End":false},
                {"Who": "Priest", "What": "When they turned to katnip\n\
they turned away from the cat God.", "Choice":false, "NextID":2, "End":false},
                {"Who": "Catz", "What": "meow?", "Choice":false, "NextID":3, "End":false},
                {"Who": "Priest", "What": "With the help of my congregation\n\
we can lead them back to the\n\
rightous path.", "Choice":true, "Choices":[{"text":"no", "ChoiceID":4},{"text":"yes", "ChoiceID":6}], "NextID":1, "End":false},
                {"Who": "Catz", "What": "meow...", "Choice":false, "NextID":5, "End":false},
                {"Who": "Priest", "What": "may the Cat God forgive you", "Choice":false, "NextID":10, "End":true},
                {"Who": "Catz", "What": "meow!", "Choice":false, "NextID":7, "Triggers":[{"Stat":"addOn", "Building":"rehab", Value: "monastery"}, {Stat:"score", Value: 20}], "End":false},
                {"Who": "Priest", "What": "Excellent! Please take this\n\
small gift as a token\n\
of the Lords apprication.", "Choice":false, "NextID":10, "End":true}],                 
            "idle":{"what":"blessings upon ye, child of the cat God"}}}
};

