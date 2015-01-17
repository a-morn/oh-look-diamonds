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
            {"ConditionType": "buildingState", "state": "built", "building":"rehab", "on":false},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":false},
            {"ConditionType": "state", "state": "CurrentlyBuilding", "on":false}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 7
        }
    ],
    "timmy": [
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":6},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "summerCamp", "building":"orphanage","on":false}],
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":1,//0.2,
        "ConversationNumber": 0
    },
    {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "buildingState", "state": "built", "building":"orphanage", "on":true},
            {"ConditionType": "buildingState", "state": "builtOnRound", "building":"orphanage", "on":1},
            {"ConditionType": "buildingState", "state": "youthCenter", "building":"orphanage", "on":false}],            
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":1,//0.2,
        "ConversationNumber": 1
    }
    ]
};