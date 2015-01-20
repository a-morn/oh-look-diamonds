var gameProgressionJSON = {"hoboCat": 
    [
        {"Conditions":[{"ConditionType": "Score","Score": 12, "OperatorType": "LargerThan"}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 1
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
                {"CondtitionType": "buildingState", "state": "built", "building": "hoboCatHouse", "on":false}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 2
        },

        
        {"Conditions":[{"ConditionType": "buildingState", "building":"orphanage","state": "isBuilding", "on":false},           
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":false},
            {"ConditionType": "state", "state": "CurrentlyBuilding", "on":false},
            {"ConditionType": "buildingState", "state": "built", "building":"hoboCatHouse", "on":true}],
        
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": 3
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "isBuilding", "building":"orphanage", "on":true}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 4
        },
        
        {"Conditions":[{"ConditionType": "buildingState", "state": "isBuilding", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":false},
            {"ConditionType": "state", "state": "CurrentlyBuilding", "on":false},
            {"ConditionType": "buildingState", "state": "built", "building":"hoboCatHouse", "on":true}],
        
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": 5
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "isBuilding","building":"rehab", "on":true}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 6
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":false},
                {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "state", "state": "CurrentlyBuilding", "on":false}],        
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": 7
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":false},
            {"ConditionType": "buildingState", "state": "isBuilding","building":"university", "on":true}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 8
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built","building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"rehab", "on":2},
            {"ConditionType": "buildingState", "state": "hospital", "building":"rehab", "on":false}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":0.3,
        "ConversationNumber": 9
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built","building":"rehab", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"rehab", "on":4},
            {"ConditionType": "buildingState", "state": "phychiatricWing", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "hopspital", "building":"rehab", "on":true}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":0.3,
        "ConversationNumber": 10
        }
    ],
    "timmy": [
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":2},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":false}],            
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": 0
    },
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":4},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "summerCamp", "building":"orphanage","on":false}],
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": 1
        },
    
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"university", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"university", "on":5}],
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": 2
        }
    ],
    "priest": [
        {"Conditions":[
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":true},            
            {"ConditionType": "buildingState", "state": "hospital", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "monastery", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"university", "on":5}],
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.3,
        "ConversationNumber": 0
        }
    ]
};