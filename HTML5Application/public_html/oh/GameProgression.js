var gameProgressionJSON = {"HoboCatz": 
    [
        {"Conditions":[{"ConditionType": "Score","Score": 0, "OperatorType": "LargerThan"}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 1
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
                {"CondtitionType": "State", "State": "HoboCatHouseBuilt", "On":false}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 2
        },

        
        {"Conditions":[{"ConditionType": "State", "State": "BuildOrphanage", "On":false},
            {"ConditionType": "State", "State": "OrphanageBuilt", "On":false},
            {"ConditionType": "State", "State": "CurrentlyBuilding", "On":false},
            {"ConditionType": "State", "State": "HoboCatHouseBuilt", "On":true}],
        
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": 3
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "State", "State": "BuildOrphanage", "On":true}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 4
        },
        
        {"Conditions":[{"ConditionType": "State", "State": "BuildRehab", "On":false},
            {"ConditionType": "State", "State": "RehabBuilt", "On":false},
            {"ConditionType": "State", "State": "CurrentlyBuilding", "On":false},
            {"ConditionType": "State", "State": "HoboCatHouseBuilt", "On":true}],
        
        "HasHappend":false,
        "ShouldReoccur":true,
        "Chance":0.2,
        "ConversationNumber": 5
        },
        
        {"Conditions":[{"ConditionType": "Score", "Score": 19, "OperatorType": "LargerThan"},
            {"ConditionType": "State", "State": "BuildRehab", "On":true}],        
        "HasHappend":false,
        "ShouldReoccur":false,
        "Chance":1,
        "ConversationNumber": 6
        }
        
    ]
};