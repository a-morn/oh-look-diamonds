export default {"hoboCat": 
    [
		//0
		{"Conditions":[{"ConditionType": "Score","Score": -1, "OperatorType": "LargerThan"}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "goodEvening"
        },
	
		//1
        {"Conditions":[{"ConditionType": "Score","Score": 20, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "20Diamonds"
        },
        //2
        {"Conditions":[{"ConditionType": "Score","Score": 0, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "aDiamond"
        },                
        //3
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
                {"ConditionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],                
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": "hoboCatHouseBuilt"
        },
		//4
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},           
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":false},            
            {"ConditionType": "buildingState", "state": "built", "building":"hoboCatHouse", "on":true}],               
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": "orphanage"
        },
        //4
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":false},            
            {"ConditionType": "buildingState", "state": "built", "building":"hoboCatHouse", "on":true}],                
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": "rehab"
        },                
        //5
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":false},
                {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true}],                
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": "school"
        },                
        //6
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built","building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"rehab", "on":2},
            {"ConditionType": "buildingState", "state": "hospital", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "monastery", "building":"rehab", "on":false}],                
        "ShouldReoccur":false,
        "Chance":0.3,
        "ConversationNumber": "hospital"
        },
        //7
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built","building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"rehab", "on":4},
            {"ConditionType": "buildingState", "state": "phychiatricWing", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "hopspital", "building":"rehab", "on":true}],                
        "ShouldReoccur":false,
        "Chance":0.3,
        "ConversationNumber": "psyciatricWing"
        }
    ],
    "timmy": [
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":2},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":false}],                    
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "youthCenter"
    },
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":4},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "summerCamp", "building":"orphanage","on":false}],        
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "summerCamp"
        },
    
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"university", "on":5}],        
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "rocketUniversity"
        }
    ],
    "priest": [
        {"Conditions":[
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":true},            
            {"ConditionType": "buildingState", "state": "hospital", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "monastery", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"university", "on":5}],        
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": "monastary"
        }
    ]
};
