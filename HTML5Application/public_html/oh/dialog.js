var dialogJSON = {"HoboCatz": 
[   
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "good evening", "Sound": "HoboCatSound1", "ID":0, "Choice" :"no", "NextID":1},
        {"Who": "Catz", "What": "meow", "Sound": "catzSound1", "ID":1, "Choice" :"no", "NextID":2},
        {"Who": "Hobo-Cat", "What": "whatcha lookin' at\n\
there, kitten?", "Sound": "hoboCatSound2", "ID":2, "Choice" :"no", "NextID":3},
        {"Who":"Catz", "What": "diamonds!", "Sound":"catzSound1", "ID":3, "Choice" :"no", "NextID":4},
        {"Who": "Hobo-Cat", "What": "Heh, kitten what you got\n\
up there is none but \n\
big balls of gas and fire", "Sound": "hoboCatSound1", "ID":4, "Choice" :"no", "NextID":5},
            {"Who": "Hobo-Cat", "What": "Wish I had me some \n\
diamonds though\n\
Then I could build myself \n\
a house", "Sound": "hoboCatSound2", "ID":5, "Choice" :"no", "NextID":6},
            {"Who": "Hobo-Cat", "What": "Been awhile since \n\
I built something \n\
Been awhile since \n\
I had a house", "Sound": "hoboCatSound2", "ID":6, "Choice" :"no", "End":"yes"}
            ], "idle":{"what":"cough"}},

    {"dialog":[
        {"Who": "Hobo-Cat", "What": "well I be damned - a diamond!", "Sound": "HoboCatSound1", "ID":0, "Choice" :"no", "NextID":1},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "ID":1, "Choice" :"no", "NextID":2},
        {"Who": "Hobo-Cat", "What": "for me? \n\
much obliged, kitten!", "Sound": "HoboCatSound1", "ID":2, "Choice" :"no", "End":"yes"}        
    ], "idle":{"what":"cough"}},
    
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "well look at that\n\
guess I'mma build myself a house!", "Sound": "HoboCatSound1", "ID":0, "Choice" :"no", "NextID":1},
        {"Who": "Catz", "What": "meow!", "Sound": "catzSound1", "ID":1, "Choice" :"no", "NextID":2},
        {"Who": "Hobo-Cat", "What": "you keep 'em commin', kitten!", "Sound": "HoboCatSound1", "ID":2, "Choice" :"no", "End":"yes"}        
    ], "idle":{"what":"hum hum"}},
    
    {"dialog":[
        {"Who": "Hobo-Cat", "What": "all done!", "Sound": "HoboCatSound1", "ID":0, "Choice" :"no", "NextID":1, "Trigger":"HoboCatHouse"},
        {"Who": "Hobo-Cat", "What": "say I happen to know\n\
about some stray inner-city kitties\n\
why don't we build 'em a home?", "Sound": "HoboCatSound1", "ID":1, "Choice" :"yes", "Choices":[{"text":"nopez", "ChoiceID":3},{"text":"klol", "ChoiceID":4}]},
        {"Who": "Catz", "What": "meow...", "Sound": "HoboCatSound1", "ID":2, "Choice" :"no", "NextID":3},
        {"Who": "Hobo-Cat", "What": "alrighty then :/", "Sound": "HoboCatSound1", "ID":3, "Choice" :"no", "End":"yes"},
        {"Who": "Catz", "What": "meow!", "Sound": "HoboCatSound1", "ID":4, "Choice" :"no", "NextID":5, "Trigger":"BuildOrphan"},
        {"Who": "Hobo-Cat", "What": "great!", "Sound": "HoboCatSound1", "ID":5, "Choice" :"no", "End":"yes"}
    ], "idle":{"what":"hum hum"}}
]
};