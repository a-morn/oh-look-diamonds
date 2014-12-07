var gameProgressionJSON = {"HoboCatz": 
    [
        {"Conditions":[{"ConditionType": "Score","Score": 0, "OperatorType": "LargerThan"}],        
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
        }
                
        
    ]
};