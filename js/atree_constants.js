const atrees = {
    "Archer": [
        {
            "display_name": "Arrow Shield",
            "desc": "Create a shield around you that deal damage and knockback mobs when triggered. (2 Charges)",
            "parents": ["Power Shots", "Cheaper Escape"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 6,
                "icon": "node_4"
            },
            "properties": {
                "charges": 2,
                "duration": 60,
                "aoe": 5000
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Arrow Shield",
                    "cost": 30,
                    "base_spell": 4,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Shield Damage",
                            "type": "damage",
                            "multipliers": [90, 0, 0, 0, 0, 10]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Shield Damage": 2
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Escape",
            "desc": "Throw yourself backward to avoid danger. (Hold shift while escaping to cancel)",
            "parents": ["Heart Shatter"], 
            "dependencies": [],
            "blockers": [],
            "cost": 1, 
            "display": {
            "row": 7,
            "col": 4,
            "icon": "node_4"
            },
            "properties": {
                "aoe": 0,
                "range": 0
            },
            "effects": [{ 
                "type": "replace_spell",
                "name": "Escape",
                "cost": 25,
                "base_spell": 2, 
                "display": "", 
                "parts": []
            }]
        },
        {
            "display_name": "Arrow Bomb",
            "desc": "Throw a long-range arrow that explodes and deal high damage in a large area. (Self-damage for 25% of your DPS)",
            "parents": [], 
            "dependencies": [],
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 0,
                "col": 4,
                "icon": "node_4"
            },
            "properties": {
                "aoe": 4.5,
                "range": 26
            },
            "effects": [{ 
                "type": "replace_spell",
                "name": "Arrow Bomb",
                "cost": 50,
                "base_spell": 3, 
                "spell_type": "damage", 
                "scaling": "spell",
                "display": "Total Damage", 
                "parts": [
                    {  
                        "name": "Arrow Bomb",
                        "type": "damage",
                        "multipliers": [160, 0, 0, 0, 20, 0]
                    },
                    {
                        "name": "Total Damage",
                        "type": "total",
                        "hits": { "Arrow Bomb": 1 }
                    }
                ]
            }]
        },
        {
            "display_name": "Heart Shatter",
            "desc": "If you hit a mob directly with Arrow Bomb, shatter its heart and deal bonus damage.",
            "base_abil": "Arrow Bomb",
            "parents": ["Bow Proficiency I"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 4,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Heart Shatter", 
                    "multipliers": [100, 0, 0, 0, 0, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Total Damage", 
                    "hits": { "Heart Shatter": 1 }
                }
            ]
        },
        {
            "display_name": "Fire Creep",
            "desc": "Arrow Bomb will leak a trail of fire for 6s, Damaging enemies that walk into it every 0.4s.",
            "base_abil": "Arrow Bomb",
            "parents": ["Phantom Ray", "Fire Mastery", "Bryophyte Roots"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
            "row": 16,
            "col": 6,
            "icon": "node_1"
            },
            "properties": { 
                "aoe": 0.8,
                "duration": 6
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Fire Creep", 
                    "multipliers": [30, 0, 0, 0, 20, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Total Burn Damage", 
                    "hits": { "Fire Creep": 15 }
                }
            ]
        },
        {
            "display_name": "Bryophyte Roots",
            "desc": "When you hit an enemy with Arrow Storm, create an area that slows them down and deals damage every 0.4s.",
            "base_abil": "Arrow Storm",
            "archetype": "Trapper", 
            "archetype_req": 1, 
            "parents": ["Fire Creep", "Earth Mastery"], 
            "dependencies": ["Arrow Storm"], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 16, "col": 8, "icon": "node_1"},
            "properties": {
                "aoe": 2,
                "duration": 5
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Bryophyte Roots", 
                    "cost": 0,
                    "multipliers": [40, 20, 0, 0, 0, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Total Roots Damage", 
                    "hits": { "Bryophyte Roots": 12 }
                }
            ]
        },
        {
            "display_name": "Nimble String",
            "desc": "Arrow Storm throw out +6 arrows per stream and shoot twice as fast.",
            "base_abil": "Arrow Storm",
            "parents": ["Thunder Mastery", "Arrow Rain"], 
            "dependencies": ["Arrow Storm"], 
            "blockers": ["Phantom Ray"],
            "cost": 2, 
            "display": { "row": 15, "col": 2, "icon": "node_1"},
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Single Arrow", 
                    "multipliers": [-15, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Single Stream", 
                    "hits": { "Single Arrow": 6 }
                }
            ]
        },
        {
            "display_name": "Arrow Storm",
            "desc": "Shoot a stream of 8 arrows, dealing significant damage to close mobs and pushing them back.",
            "parents": ["Double Shots", "Cheaper Escape"], 
            "dependencies": [],
            "blockers": [],
            "cost": 1, 
            "display": { "row": 9, "col": 2, "icon": "node_4"},
            "properties": { "range": 16 },
            "effects": [
                { 
                    "type": "replace_spell",
                    "name": "Arrow Storm",
                    "cost": 40,
                    "base_spell": 1, 
                    "spell_type": "damage", 
                    "scaling": "spell",
                    "display": "Total Damage", 
                    "parts": [
                        {  
                            "name": "Single Arrow",
                            "multipliers": [30, 0, 10, 0, 0, 0]
                        },
                        {  
                            "name": "Single Stream",
                            "hits": { "Single Arrow": 8 }
                        },
                        {  
                            "name": "Total Damage",
                            "hits": { "Single Stream": 1 }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Guardian Angels",
            "desc": "Your protective arrows from Arrow Shield will become sentient bows, dealing damage up to 8 times each to nearby enemies. (Arrow Shield will no longer push nearby enemies)",
            "archetype": "Boltslinger",
            "archetype_req": 3, 
            "base_abil": "Arrow Shield",
            "parents": ["Triple Shots", "Frenzy"], 
            "dependencies": ["Arrow Shield"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 19,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "range": 4,
                "duration": 60,
                "shots": 8,
                "charges": 2
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Guardian Angels",
                    "base_spell": 4,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Single Arrow",
                            "type": "damage",
                            "multipliers": [30, 0, 0, 0, 0, 10]
                        },
                        {
                            "name": "Single Bow",
                            "type": "total",
                            "hits": {
                                "Single Arrow": 8
                            }
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Single Bow": 2
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Windy Feet",
            "desc": "When casting Escape, give speed to yourself and nearby allies.",
            "base_abil": "Escape",
            "parents": ["Arrow Storm"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
            "row": 10,
            "col": 1,
            "icon": "node_0"
            },
            "properties": {
                "aoe": 8,
                "duration": 120
            },
            "effects": [{
                "type": "stat_bonus",
                "toggle": "Windy Feet",
                "bonuses": [
                    { 
                        "type": "stat",
                        "name": "spd",
                        "value": 20
                    }
                ]
            }]
        },
        {
            "display_name": "Basaltic Trap",
            "desc": "When you hit the ground with Arrow Bomb, leave a Trap that damages enemies. (Max 2 Traps)",
            "archetype": "Trapper",
            "archetype_req": 2, 
            "parents": ["Bryophyte Roots"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
            "row": 19,
            "col": 8,
            "icon": "node_3"
            },
            "properties": {
                "aoe": 7,
                "traps": 2
            },
            "effects": [
                { 
                    "type": "replace_spell",
                    "name": "Basaltic Trap",
                    "base_spell": 7,
                    "display": "Trap Damage",
                    "parts": [
                        {
                            "name": "Trap Damage",
                            "type": "damage",
                            "multipliers": [140, 30, 0, 0, 30, 0]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Windstorm",
            "desc": "Arrow Storm shoot +1 stream of arrows, and each stream shoots +2 arrows, effectively doubling its damage.",
            "base_abil": "Arrow Storm",
            "parents": ["Guardian Angels", "Cheaper Arrow Storm"], 
            "dependencies": [], 
            "blockers": ["Phantom Ray"],
            "cost": 2, 
            "display": {
                "row": 21,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Single Arrow", 
                    "multipliers": [-10, 0, -2, 0, 0, 2]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Total Damage", 
                    "hits": { "Single Stream": 1 }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Single Stream", 
                    "cost": 0,
                    "hits": { "Single Arrow": 2 }
                }
            ]
        },
        {
            "display_name": "Grappling Hook",
            "base_abil": "Escape",
            "desc": "When casting Escape, throw a hook that pulls you when hitting a block. If you hit an enemy, pull them towards you instead. (Escape will not throw you backward anymore)",
            "archetype": "Trapper", 
            "archetype_req": 0, 
            "base_abil": "Escape",
            "parents": ["Focus", "More Shields", "Cheaper Arrow Storm"], 
            "dependencies": [], 
            "blockers": ["Escape Artist"],
            "cost": 2, 
            "display": {
                "row": 21,
                "col": 5,
                "icon": "node_2"
                },
            "properties": {
                "range": 26
            },
            "effects": []
        },
        {
            "display_name": "Implosion",
            "desc": "Arrow bomb will pull enemies towards you. If a trap is nearby, it will pull them towards it instead. Increase Heart Shatter's damage.",
            "archetype": "Trapper", 
            "archetype_req": 0, 
            "base_abil": "Arrow Bomb",
            "parents": ["Grappling Hook", "More Shields"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 22,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Heart Shatter", 
                    "multipliers": [40, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            "display_name": "Twain's Arc",
            "desc": "When you have 2+ Focus, holding shift will summon the Twain's Arc. Charge it up to shoot a destructive long-range beam. (Damage is dealt as Main Attack Damage)",
            "archetype": "Sharpshooter", 
            "archetype_req": 4, 
            "parents": ["More Focus", "Traveler"], 
            "dependencies": ["Focus"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 25,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {
                "range": 64,
                "focusReq": 2
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Twain's Arc",
                    "base_spell": 5,
                    "scaling": "melee",
                    "use_atkspd": false,
                    "display": "Single Shot",
                    "parts": [
                        {
                            "name": "Single Shot",
                            "type": "damage",
                            "multipliers": [200, 0, 0, 0, 0, 0]
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Fierce Stomp",
            "desc": "When using Escape, hold shift to quickly drop down and deal damage.",
            "archetype": "Boltslinger", 
            "archetype_req": 0, 
            "base_abil": "Escape",
            "parents": ["Refined Gunpowder", "Traveler"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 26, "col": 1, "icon": "node_1"},
            "properties": {
                "aoe": 4
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 2, 
                    "target_part": "Fierce Stomp", 
                    "cost": 0,
                    "multipliers": [100, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Stomp Damage",
                    "cost": 0,
                    "hits": {
                        "Fierce Stomp": 1
                    },
                    "display": "Stomp Damage"
                }
            ]
        },
        {
            "display_name": "Scorched Earth",
            "desc": "Fire Creep become much stronger.",
            "archetype": "Sharpshooter", 
            "archetype_req": 0, 
            "parents": ["Twain's Arc"], 
            "dependencies": ["Fire Creep"], 
            "blockers": [],
            "cost": 1, 
            "display": { "row": 26, "col": 5, "icon": "node_1"},
            "properties": {
                "duration": 2,
                "aoe": 0.4
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Fire Creep",
                    "multipliers": [10, 0, 0, 0, 5, 0]
                }
            ]
        },
        {
            "display_name": "Leap",
            "desc": "When you double tap jump, leap foward. (2s Cooldown)",
            "archetype": "Boltslinger", 
            "archetype_req": 5, 
            "parents": ["Refined Gunpowder", "Homing Shots"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 28, "col": 0, "icon": "node_1"},
            "properties": {
                "cooldown": 2
            },
            "effects": []
        },
        {
            "display_name": "Shocking Bomb",
            "desc": "Arrow Bomb will not be affected by gravity, and all damage conversions become Thunder.",
            "archetype": "Sharpshooter", 
            "archetype_req": 5, 
            "base_abil": "Arrow Bomb",
            "parents": ["Twain's Arc", "Better Arrow Shield", "Homing Shots"], 
            "dependencies": ["Arrow Bomb"], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 28, "col": 4, "icon": "node_1"},
            "properties": {
                "gravity": 0
            },
            "effects": [
                {
                    "type": "convert_spell_conv",
                    "target_part": "all",
                    "conversion": "Thunder"
                }
            ]
        },
        {
            "display_name": "Mana Trap",
            "desc": "Your Traps will give you 2.85 Mana per second when you stay close to them.",
            "archetype": "Trapper", 
            "archetype_req": 5, 
            "base_abil": "Basaltic Trap",
            "parents": ["More Traps", "Better Arrow Shield"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
            "row": 28,
            "col": 8,
            "icon": "node_3"
            },
            "properties": {
                "range": 16,
                "manaRegen": 2.85
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "cost": 10
                }
            ]
        },
        {
            "display_name": "Escape Artist",
            "desc": "When casting Escape, release 120 arrows towards the ground.",
            "archetype": "Boltslinger", 
            "archetype_req": 0, 
            "base_abil": "Escape",
            "parents": ["Better Guardian Angels", "Leap"], 
            "dependencies": [], 
            "blockers": ["Grappling Hook"],
            "cost": 2, 
            "display": {
            "row": 31,
            "col": 0,
            "icon": "node_1"
            },
            "properties": {},
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 2, 
                    "target_part": "Per Arrow", 
                    "multipliers": [20, 0, 10, 0, 0, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 2, 
                    "target_part": "Max Damage (Escape Artist)", 
                    "hits": { "Per Arrow": 120 },
                    "display": "Max Damage (Escape Artist)"
                }
            ]
        },
        {
            "display_name": "Initiator",
            "desc": "If you do not damage an enemy for 5s or more, your next sucessful hit will deal +50% damage and add +1 Focus.",
            "archetype": "Sharpshooter",
            "archetype_req": 5, 
            "parents": ["Shocking Bomb", "Better Arrow Shield", "Cheaper Arrow Storm (2)"], 
            "dependencies": ["Focus"], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 31, "col": 5, "icon": "node_2"},
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Call of the Hound",
            "desc": "Arrow Shield summon a Hound that will attack and drag aggressive enemies towards your traps.",
            "archetype": "Trapper",
            "archetype_req": 0, 
            "base_abil": "Arrow Shield",
            "parents": ["Initiator", "Cheaper Arrow Storm (2)"], 
            "dependencies": ["Arrow Shield"], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 32, "col": 7, "icon": "node_2"},
            "properties": {},
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 4, 
                    "target_part": "Hound Damage", 
                    "multipliers": [40, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            "display_name": "Arrow Hurricane",
            "desc": "Arrow Storm will shoot +2 stream of arrows.",
            "archetype": "Boltslinger", 
            "archetype_req": 8, 
            "base_abil": "Arrow Storm",
            "parents": ["Precise Shot", "Escape Artist"], 
            "dependencies": [], 
            "blockers": ["Phantom Ray"],
            "cost": 2, 
            "display": { "row": 33, "col": 0, "icon": "node_3"},
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1, 
                    "target_part": "Total Damage", 
                    "hits": { "Single Stream": 2 }
                }
            ]
        },
        {
            "display_name": "Geyser Stomp",
            "desc": "Fierce Stomp will create geysers, dealing more damage and vertical knockback.",
            "base_abil": "Escape",
            "parents": ["Shrapnel Bomb"], 
            "dependencies": ["Fierce Stomp"], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 37, "col": 1, "icon": "node_1"},
            "properties": {},
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 2, 
                    "target_part": "Geyser Stomp",
                    "multipliers": [0, 0, 0, 50, 0, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 2, 
                    "target_part": "Stomp Damage",
                    "hits": { "Geyser Stomp": 1 }
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "prop",
                        "abil": "Fierce Stomp",
                        "name": "aoe",
                        "value": 1
                    }]
                }
            ]
        },
        {
            "display_name": "Crepuscular Ray",
            "desc": "If you have 5 Focus, casting Arrow Storm will make you levitate and shoot 20 homing arrows per second until you run out of Focus. While in that state, you will lose 1 Focus per second.",
            "archetype": "Sharpshooter", 
            "archetype_req": 10, 
            "parents": ["Cheaper Arrow Shield"], 
            "dependencies": ["Arrow Storm"], 
            "blockers": [],
            "cost": 2, 
            "display": {
            "row": 37,
            "col": 4,
            "icon": "node_3"
            },
            "properties": {},
            "effects": [
                { 
                    "type": "replace_spell",
                    "name": "Crepuscular Ray",
                    "base_spell": 6,
                    "display": "DPS",
                    "parts": [
                        {  
                            "name": "Single Arrow",
                            "multipliers": [20, 0, 0, 5, 0, 0]
                        },
                        {
                            "name": "DPS",
                            "hits": { "Single Arrow": 20 }
                        },
                        {  
                            "name": "Total Damage",
                            "hits": { "DPS": 7 }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Grape Bomb",
            "desc": "Arrow bomb will throw 3 additional smaller bombs when exploding.",
            "base_abil": "Arrow Bomb",
            "parents": ["Cheaper Escape (2)"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 37, "col": 7, "icon": "node_2"},
            "properties": {
                "aoe": 2
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Grape Bomb", 
                    "multipliers": [30, 0, 0, 0, 10, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Total Damage", 
                    "hits": { "Grape Bomb": 3 }
                }
            ]
        },
        {
            "display_name": "Tangled Traps",
            "desc": "Your Traps will be connected by a rope that deals damage to enemies every 0.2s.",
            "archetype": "Trapper", 
            "archetype_req": 0, 
            "base_abil": "Basaltic Trap",
            "parents": ["Grape Bomb"], 
            "dependencies": ["Basaltic Trap"], 
            "blockers": [],
            "cost": 2, 
            "display": {"row": 38, "col": 6, "icon": "node_1"},
            "properties": {
                "attackSpeed": 0.2
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 7, 
                    "target_part": "Line Damage Tick", 
                    "multipliers": [20, 0, 0, 0, 0, 20]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 7, 
                    "target_part": "DPS", 
                    "hits": { "Line Damage Tick": 5 }
                }
            ]
        },
        {
            "display_name": "Snow Storm",
            "desc": "Enemies near you will be slowed down.",
            "parents": ["Geyser Stomp", "More Focus (2)"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 39,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {
                "range": 2.5,
                "slowness": 0.3
            },
            "effects": []
        },
        {
            "display_name": "All-Seeing Panoptes",
            "desc": "Your bows from Guardian Angels become all-seeing, increasing their range, damage and letting them shoot up to +5 times each.",
            "archetype": "Boltslinger",
            "archetype_req": 11, 
            "base_abil": "Arrow Shield",
            "parents": ["Snow Storm"], 
            "dependencies": ["Guardian Angels"], 
            "blockers": [],
            "cost": 2, 
            "display": { "row": 40, "col": 1, "icon": "node_3"},
            "properties": {
                "range": 8,
                "shots": 5
            },
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 4, 
                    "target_part": "Single Arrow", 
                    "multipliers": [0, 0, 0, 0, 10, 0]
                },
                { 
                    "type": "add_spell_prop",
                    "base_spell": 4, 
                    "target_part": "Single Bow", 
                    "hits": { "Single Arrow": 5 }
                }
            ]
        },
        {
            "display_name": "Minefield",
            "desc": "Allow you to place +6 Traps, but with reduced damage and range.",
            "archetype": "Trapper",
            "archetype_req": 10, 
            "base_abil": "Basaltic Trap",
            "parents": ["Grape Bomb", "Cheaper Arrow Bomb (2)"], 
            "dependencies": ["Basaltic Trap"], 
            "blockers": [],
            "cost": 2, 
            "display": {"row": 40, "col": 7, "icon": "node_3"},
            "properties": {},
            "effects": [
                { 
                    "type": "add_spell_prop",
                    "base_spell": 8, 
                    "target_part": "Trap Damage", 
                    "cost": 0,
                    "multipliers": [-80, 0, 0, 0, 0, 0]
                },
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Basaltic Trap",
                            "name": "aoe",
                            "value": -2
                        },
                        {
                            "type": "prop",
                            "abil": "Basaltic Trap",
                            "name": "traps",
                            "value": 6
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Bow Proficiency I",
            "desc": "Improve your Main Attack's damage and range when using a bow.",
            "base_abil": 999,
            "parents": ["Arrow Bomb"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": { "row": 2, "col": 4, "icon": "node_0"},
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "mdPct",
                            "value": 5
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Cheaper Arrow Bomb",
            "desc": "Reduce the Mana cost of Arrow Bomb.",
            "base_abil": "Arrow Bomb",
            "parents": ["Bow Proficiency I"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {"row": 2, "col": 6, "icon": "node_0"},
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -10
                }
            ]  
        },
        {
            "display_name": "Cheaper Arrow Storm",
            "desc": "Reduce the Mana cost of Arrow Storm.",
            "base_abil": "Arrow Storm",
            "parents": ["Grappling Hook", "Windstorm", "Focus"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {"row": 21, "col": 3, "icon": "node_0"},
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -5
                }
            ]  
        },
        {
            "display_name": "Cheaper Escape",
            "desc": "Reduce the Mana cost of Escape.",
            "base_abil": "Escape",
            "parents": ["Arrow Storm", "Arrow Shield"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": { "row": 9, "col": 4, "icon": "node_0"},
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 2,
                "cost": -5
            }]  
        },
        {
            "display_name": "Earth Mastery",
            "desc": "Increases your base damage from all Earth attacks",
            "archetype": "Trapper", 
            "archetype_req": 0, 
            "parents": ["Arrow Shield"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 13,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "eDamPct",
                            "value": 20
                        },
                        {
                            "type": "stat",
                            "name": "eDamAddMin",
                            "value": 2
                        },
                        {
                            "type": "stat",
                            "name": "eDamAddMax",
                            "value": 4
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Thunder Mastery",
            "desc": "Increases your base damage from all Thunder attacks",
            "archetype": "Boltslinger", 
            "archetype_req": 0, 
            "parents": ["Arrow Storm", "Fire Mastery", "Cheaper Escape"],
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 13,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "tDamPct",
                            "value": 10
                        },
                        {
                            "type": "stat",
                            "name": "tDamAddMin",
                            "value": 1
                        },
                        {
                            "type": "stat",
                            "name": "tDamAddMax",
                            "value": 8
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Water Mastery",
            "desc": "Increases your base damage from all Water attacks",
            "archetype": "Sharpshooter", 
            "archetype_req": 0, 
            "parents": ["Cheaper Escape", "Thunder Mastery", "Fire Mastery"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 14,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "wDamPct",
                            "value": 15
                        },
                        {
                            "type": "stat",
                            "name": "wDamAddMin",
                            "value": 2
                        },
                        {
                            "type": "stat",
                            "name": "wDamAddMax",
                            "value": 4
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Air Mastery",
            "desc": "Increases base damage from all Air attacks",
            "archetype": "Boltslinger", 
            "archetype_req": 0, 
            "parents": ["Arrow Storm"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 13,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "aDamPct",
                            "value": 15
                        },
                        {
                            "type": "stat",
                            "name": "aDamAddMin",
                            "value": 3
                        },
                        {
                            "type": "stat",
                            "name": "aDamAddMax",
                            "value": 4
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Fire Mastery",
            "desc": "Increases base damage from all Fire attacks",
            "archetype": "Sharpshooter", 
            "archetype_req": 0, 
            "parents": ["Thunder Mastery", "Arrow Shield", "Cheaper Escape"],
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 13,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "fDamPct",
                            "value": 15
                        },
                        {
                            "type": "stat",
                            "name": "fDamAddMin",
                            "value": 3
                        },
                        {
                            "type": "stat",
                            "name": "fDamAddMax",
                            "value": 5
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "More Shields",
            "desc": "Give +2 charges to Arrow Shield.",
            "base_abil": "Arrow Shield",
            "parents": ["Grappling Hook", "Basaltic Trap"], 
            "dependencies": ["Arrow Shield"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 21,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Total Damage",
                    "hits": { "Shield Damage": 2, "Single Bow": 2 }
                },
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Arrow Shield",
                            "name": "charges",
                            "value": 2
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Stormy Feet",
            "desc": "Windy Feet will last longer and add more speed.",
            "archetype": "Boltslinger", 
            "base_abil": "Escape",
            "parents": ["Windstorm"], 
            "dependencies": ["Windy Feet"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 23,
                "col": 1,
                "icon": "node_0"
            },
            "properties": {
                "duration": 60
            },
            "effects": [{ 
                "type": "stat_bonus",
                "toggle": "Windy Feet",
                "bonuses": [
                    { 
                        "type": "stat",
                        "name": "spdPct",
                        "value": 20
                    }
                ]
            }]
        },
        {
            "display_name": "Refined Gunpowder",
            "desc": "Increase the damage of Arrow Bomb.",
            "base_abil": "Arrow Bomb",
            "parents": ["Windstorm", "Traveler"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 25,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{ 
                "type": "add_spell_prop",
                "base_spell": 3, 
                "target_part": "Arrow Bomb", 
                "multipliers": [50, 0, 0, 0, 0, 0]
            }]
        },
        {
            "display_name": "More Traps",
            "desc": "Increase the maximum amount of active Traps you can have by +2.",
            "archetype": "Trapper",
            "archetype_req": 0, 
            "base_abil": "Basaltic Trap",
            "parents": ["Bouncing Bomb"], 
            "dependencies": ["Basaltic Trap"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 26,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "raw_stat",
                "bonuses": [{
                    "type": "prop",
                    "abil": "Basaltic Trap",
                    "name": "traps",
                    "value": 2
                }]
            }]
        },
        {
            "display_name": "Better Arrow Shield",
            "desc": "Arrow Shield will gain additional area of effect, knockback and damage.",
            "archetype": "Sharpshooter", 
            "archetype_req": 0, 
            "base_abil": "Arrow Shield",
            "parents": ["Mana Trap", "Shocking Bomb", "Twain's Arc"], 
            "dependencies": ["Arrow Shield"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 28,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3, 
                    "target_part": "Arrow Shield",
                    "behavior": "modify",
                    "multipliers": [40, 0, 0, 0, 0, 0]
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "prop",
                        "abil": "Arrow Shield",
                        "behavior": "modify",
                        "name": "aoe",
                        "value": 1
                    }]
                }
            ]
        },
        {
            "display_name": "Better Leap",
            "desc": "Reduce leap's cooldown by 1s.",
            "archetype": "Boltslinger",
            "archetype_req": 0, 
            "base_abil": "Leap",
            "parents": ["Leap", "Homing Shots"], 
            "dependencies": ["Leap"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 29,
                "col": 1,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "raw_stat",
                "bonuses": [{
                    "type": "prop",
                    "abil": "Leap",
                    "name": "cooldown",
                    "value": -1
                }]
            }]
        },
        {
            "display_name": "Better Guardian Angels",
            "desc": "Your Guardian Angels can shoot +4 arrows before disappearing.",
            "archetype": "Boltslinger",
            "archetype_req": 0, 
            "base_abil": "Arrow Shield",
            "parents": ["Escape Artist", "Homing Shots"], 
            "dependencies": ["Guardian Angels"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 31,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 4,
                "target_part": "Single Bow",
                "hits": { "Single Arrow": 4 }
            }]
        },
        {
            "display_name": "Cheaper Arrow Storm (2)",
            "desc": "Reduce the Mana cost of Arrow Storm.",
            "base_abil": "Arrow Storm",
            "parents": ["Initiator", "Mana Trap"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 31,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 1,
                "cost": -5
            }]  
        },
        {
            "display_name": "Precise Shot",
            "desc": "+30% Critical Hit Damage",
            "parents": ["Better Guardian Angels", "Cheaper Arrow Shield", "Arrow Hurricane"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 33,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "raw_stat",
                "bonuses": [{
                    "type": "stat",
                    "name": "mdCritPct",
                    "value": 30
                }]
            }]  
        },
        {
            "display_name": "Cheaper Arrow Shield",
            "desc": "Reduce the Mana cost of Arrow Shield.",
            "base_abil": "Arrow Shield",
            "parents": ["Precise Shot", "Initiator"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 33,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 4,
                "cost": -5
            }]
        },
        {
            "display_name": "Rocket Jump",
            "desc": "Arrow Bomb's self-damage will knockback you farther away.",
            "base_abil": "Arrow Bomb",
            "parents": ["Cheaper Arrow Storm (2)", "Initiator"], 
            "dependencies": ["Arrow Bomb"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 33,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Escape (2)",
            "desc": "Reduce the Mana cost of Escape.",
            "base_abil": "Escape",
            "parents": ["Call of the Hound", "Decimator"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 34,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 2,
                "cost": -5
            }]
        },
        {
            "display_name": "Stronger Hook",
            "desc": "Increase your Grappling Hook's range, speed and strength.",
            "archetype": "Trapper", 
            "archetype_req": 5, 
            "base_abil": "Escape",
            "parents": ["Cheaper Escape (2)"], 
            "dependencies": ["Grappling Hook"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 35,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "raw_stat",
                "bonuses": [{
                    "type": "prop",
                    "abil": "Grappling Hook",
                    "name": "range",
                    "value": 8
                }]
            }]
        },
        {
            "display_name": "Cheaper Arrow Bomb (2)",
            "desc": "Reduce the Mana cost of Arrow Bomb.",
            "base_abil": "Arrow Bomb",
            "parents": ["More Focus (2)", "Minefield"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 40,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 3,
                "cost": -5
            }]  
        },
        {
            "display_name": "Bouncing Bomb",
            "desc": "Arrow Bomb will bounce once when hitting a block or enemy",
            "base_abil": "Arrow Bomb",
            "parents": ["More Shields"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 7,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Homing Shots",
            "desc": "Your Main Attack arrows will follow nearby enemies and not be affected by gravity",
            "archetype": "Sharpshooter", 
            "base_abil": 999,
            "parents": ["Leap", "Shocking Bomb"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Shrapnel Bomb",
            "desc": "Arrow Bomb's explosion will fling 15 shrapnel, dealing damage in a large area",
            "archetype": "Boltslinger",
            "archetype_req": 8,
            "base_abil": "Arrow Bomb",
            "parents": ["Arrow Hurricane", "Precise Shot"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 3,
                "target_part": "Shrapnel Bomblet",
                "multipliers": [40, 0, 0, 0, 20, 0]
            }]
        },
        {
            "display_name": "Elusive",
            "desc": "If you do not get hit for 8+ seconds, become immune to self-damage and remove Arrow Storm's recoil. (Dodging counts as not getting hit)",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": ["Geyser Stomp"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 38,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Double Shots",
            "desc": "Double Main Attack arrows, but they deal -30% damage per arrow (harder to hit far enemies)",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "base_abil": 999,
            "parents": ["Escape"],
            "dependencies": [],
            "blockers": ["Power Shots"],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Single Shot",
                    "multipliers": [-30, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Total Damage",
                    "hits": { "Single Shot": 2 },
                    "display": "Total Damage"
                }
            ]
        },
        {
            "display_name": "Triple Shots",
            "desc": "Triple Main Attack arrows, but they deal -20% damage per arrow",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "base_abil": 999,
            "parents": ["Arrow Rain", "Frenzy"],
            "dependencies": ["Double Shots"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 17,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Single Shot",
                    "multipliers": [-20, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Total Damage",
                    "hits": { "Single Shot": 1 },
                    "display": "Total Damage"
                }
            ]
        },
        {
            "display_name": "Power Shots",
            "desc": "Main Attack arrows have increased speed and knockback",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "base_abil": 999,
            "parents": ["Escape"],
            "dependencies": [],
            "blockers": ["Double Shots"],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Focus",
            "desc": "When hitting an aggressive mob 5+ blocks away, gain +1 Focus (Max 3). Resets if you miss once",
            "archetype": "Sharpshooter",
            "archetype_req": 2,
            "parents": ["Phantom Ray"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [{
                "type": "stat_scaling",
                "slider": true,
                "slider_name": "Focus",
                "output": {
                    "type": "stat",
                    "name": "damMult"
                },
                "scaling": [40],
                "max": 3
            }]
        },
        {
            "display_name": "More Focus",
            "desc": "Add +2 max Focus",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": ["Cheaper Arrow Storm", "Grappling Hook"],
            "dependencies": ["Focus"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "stat_scaling",
                "slider": true,
                "slider_name": "Focus",
                "output": {
                    "type": "stat",
                    "name": "damMult"
                },
                "scaling": [30],
                "max": 5
            }]
        },
        {
            "display_name": "More Focus (2)",
            "desc": "Add +2 max Focus",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": ["Crepuscular Ray", "Snow Storm"],
            "dependencies": ["Focus"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 39,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "stat_scaling",
                "slider": true,
                "slider_name": "Focus",
                "output": {
                    "type": "stat",
                    "name": "damMult"
                },
                "scaling": [25],
                "max": 7
            }]
        },
        {
            "display_name": "Traveler",
            "desc": "For every 1% Walk Speed you have from items, gain +1 Raw Spell Damage (Max 100)",
            "parents": ["Refined Gunpowder", "Twain's Arc"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "stat_scaling",
                "slider": false,
                "inputs": [{
                    "type": "stat",
                    "name": "spd"
                }],
                "output": {
                    "type": "stat",
                    "name": "sdRaw"
                },
                "scaling": [1],
                "max": 100
            }]
        },
        {
            "display_name": "Patient Hunter",
            "desc": "Your Traps will deal +20% more damage for every second they are active (Max +80%)",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Basaltic Trap",
            "parents": ["More Shields"],
            "dependencies": ["Basaltic Trap"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {
                "max": 80
            },
            "effects": [{
                "type": "stat_scaling",
                "slider": true,
                "slider_name": "Trap Wait Time",
                "output": {
                    "type": "stat",
                    "name": "damMult:Basaltic Trap"
                },
                "slider_step": 1,
                "scaling": [20],
                "max": 80
            }]
        },
        {
            "display_name": "Stronger Patient Hunter",
            "desc": "Add +80% Max Damage to Patient Hunter",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Basaltic Trap",
            "parents": ["Grape Bomb"],
            "dependencies": ["Patient Hunter"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 38,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Trap Wait Time",
                    "output": {
                        "type": "stat",
                        "name": "damMult:Basaltic Trap"
                    },
                    "scaling": [20],
                    "max": 80
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "prop",
                        "abil": "Patient Hunter",
                        "name": "max",
                        "value": 80
                    }]
                }
            ]
        },
        {
            "display_name": "Frenzy",
            "desc": "Every time you hit an enemy, briefly gain +6% Walk Speed (Max 200%). Decay -40% of the bonus every second",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": ["Triple Shots", "Nimble String"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [{
                "type": "stat_scaling",
                "slider": true,
                "slider_name": "Hits dealt",
                "output": {
                    "type": "stat",
                    "name": "spd"
                },
                "scaling": [6],
                "max": 160
            }]
        },
        {
            "display_name": "Phantom Ray",
            "desc": "Condense Arrow Storm into a single ray that damages enemies 10 times per second",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": ["Water Mastery", "Fire Creep"],
            "dependencies": ["Arrow Storm"],
            "blockers": ["Windstorm", "Nimble String", "Arrow Hurricane"],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                { 
                    "type": "replace_spell",
                    "name": "Phantom Ray",
                    "base_spell": 1, 
                    "spell_type": "damage", 
                    "scaling": "spell",
                    "display": "Total Damage", 
                    "parts": [
                        {  
                            "name": "Single Arrow",
                            "type": "damage",
                            "multipliers": [25, 0, 5, 0, 0, 0]
                        },
                        {  
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                            "Single Arrow": 16
                            }
                        }
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -10
                }
            ]
        },
        {
            "display_name": "Arrow Rain",
            "desc": "When Arrow Shield loses its last charge, unleash 150 arrows raining down on enemies",
            "base_abil": "Arrow Shield",
            "parents": ["Nimble String", "Air Mastery"],
            "dependencies": ["Arrow Shield"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Arrow Rain (Per Arrow)",
                    "multipliers": [80, 0, 0, 0, 0, 60]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Arrow Rain (Total)",
                    "hits": { "Arrow Rain (Per Arrow)": 150 }
                }
            ]
        },
        {
            "display_name": "Decimator",
            "desc": "Phantom Ray will increase its damage by 10% everytime you do not miss with it (Max 70%)",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": ["Cheaper Arrow Shield", "Cheaper Escape (2)"],
            "dependencies": ["Phantom Ray"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [{
                "type": "stat_scaling",
                "slider": true,
                "slider_name": "Phantom Ray hits",
                "output": {
                    "type": "stat",
                    "name": "damMult:Single Arrow"
                },
                "scaling": 10,
                "max": 70
            }]
        }
    ],
    "Warrior": [
        {
            "display_name": "Bash",
            "desc": "Violently bash the ground, dealing high damage in a large area",
            "parents": [], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 0,
                "col": 4,
                "icon": "node_4"
            },
            "properties": {
                "aoe": 4,
                "range": 3
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Bash",
                    "cost": 45,
                    "base_spell": 1,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Single Hit",
                            "type": "damage",
                            "multipliers": [130, 20, 0, 0, 0, 0]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Single Hit": 1
                            }
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Spear Proficiency 1",
            "desc": "Improve your Main Attack's damage and range w/ spear",
            "base_abil": 999,
            "parents": ["Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 2,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {
                "melee_range": 1
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "mdPct",
                            "value": 5
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Cheaper Bash",
            "desc": "Reduce the Mana cost of Bash",
            "base_abil": "Bash",
            "parents": ["Spear Proficiency 1"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 2,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {
                
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -10
                }
            ]  
        },
        {
            "display_name": "Double Bash",
            "desc": "Bash will hit a second time at a farther range",
            "parents": ["Spear Proficiency 1"], 
            "base_abil": "Bash",
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 4,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "range": 3
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Single Hit": 1
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "cost": 0,
                    "multipliers": [-50, 0, 0, 0, 0, 0]
                }
            ]  
        },

        {
            "display_name": "Charge",
            "desc": "Charge forward at high speed (hold shift to cancel)",
            "parents": ["Double Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 6,
                "col": 4,
                "icon": "node_4"
            },
            "properties": {},
            "effects": [{
                "type": "replace_spell",
                "name": "Charge",
                "cost": 25,
                "base_spell": 2,
                "spell_type": "damage",
                "scaling": "spell",
                "display": "",
                "parts": []
            }]  
        },

        {
            "display_name": "Heavy Impact",
            "desc": "After using Charge, violently crash down into the ground and deal damage",
            "base_abil": "Charge",
            "parents": ["Uppercut"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 9,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 4
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Heavy Impact",
                    "cost": 0,
                    "multipliers": [100, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Contact Damage",
                    "display": "Contact Damage",
                    "hits": { "Heavy Impact": 1 }
                }
            ]  
        },

        {
            "display_name": "Vehement",
            "desc": "For every 1% or 1 Raw Main Attack Damage you have from items, gain +2% Walk Speed (Max 20%)",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "parents": ["Charge"], 
            "dependencies": [], 
            "blockers": ["Tougher Skin"],
            "cost": 1, 
            "display": {
                "row": 6,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "mdPct"
                        },
                        {
                            "type": "stat",
                            "name": "mdRaw"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "spd"
                    },
                    "scaling": [2, 2],
                    "max": 20
                }
            ]  
        },

        {
            "display_name": "Tougher Skin",
            "desc": "Harden your skin and become permanently +5% more resistant\nFor every 1% or 1 Raw Heath Regen you have from items, gain +10 Health (Max 100)",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "parents": ["Charge"], 
            "dependencies": [], 
            "blockers": ["Vehement"],
            "cost": 1, 
            "display": {
                "row": 6,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "baseResist",
                            "value": 5
                        }
                    ]
                },
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "hprRaw"
                        },
                        {
                            "type": "stat",
                            "name": "hprPct"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "hpBonus"
                    },
                    "scaling": [10, 10],
                    "max": 100
                }
            ]  
        },

        {
            "display_name": "Uppercut",
            "desc": "Rocket enemies in the air and deal massive damage",
            "parents": ["Vehement", "Cheaper Charge"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 8,
                "col": 2,
                "icon": "node_4"
            },
            "properties": {
                "aoe": 3,
                "range": 5
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Uppercut",
                    "cost": 45,
                    "base_spell": 3,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Uppercut",
                            "multipliers": [200, 40, 40, 0, 0, 0]
                        },
                        {
                            "name": "Total Damage",
                            "hits": { "Uppercut": 1 }
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Cheaper Charge",
            "desc": "Reduce the Mana cost of Charge",
            "base_abil": "Charge",
            "parents": ["Uppercut", "War Scream"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 8,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]  
        },

        {
            "display_name": "War Scream",
            "desc": "Emit a terrorizing roar that deals damage, pull nearby enemies, and add damage resistance to yourself and allies",
            "parents": ["Tougher Skin", "Cheaper Charge"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 8,
                "col": 6,
                "icon": "node_4"
            },
            "properties": {
                "duration": 30,
                "aoe": 12,
                "defense_bonus": 10
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "War Scream",
                    "cost": 35,
                    "base_spell": 4,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "War Scream",
                            "multipliers": [50, 0, 0, 0, 50, 0]
                        },
                        {
                            "name": "Total Damage",
                            "hits": { "War Scream": 1 }
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Earth Mastery",
            "desc": "Increases base damage from all Earth attacks",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "parents": ["Uppercut"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 10,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        { "type": "stat", "name": "eDamPct", "value": 20 },
                        { "type": "stat", "name": "eDamAddMin", "value": 2 },
                        { "type": "stat", "name": "eDamAddMax", "value": 4 }
                    ]
                }
            ]  
        },

        {
            "display_name": "Thunder Mastery",
            "desc": "Increases base damage from all Thunder attacks",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "parents": ["Uppercut", "Air Mastery", "Cheaper Charge"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 10,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        { "type": "stat", "name": "tDamPct", "value": 10 },
                        { "type": "stat", "name": "tDamAddMin", "value": 1 },
                        { "type": "stat", "name": "tDamAddMax", "value": 8 }
                    ]
                }
            ]  
        },

        {
            "display_name": "Water Mastery",
            "desc": "Increases base damage from all Water attacks",
            "archetype": "Battle Monk", 
            "archetype_req": 0, 
            "parents": ["Cheaper Charge", "Thunder Mastery", "Air Mastery"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 11,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        { "type": "stat", "name": "wDamPct", "value": 15 },
                        { "type": "stat", "name": "wDamAddMin", "value": 2 },
                        { "type": "stat", "name": "wDamAddMax", "value": 4 }
                    ]
                }
            ]  
        },

        {
            "display_name": "Air Mastery",
            "desc": "Increases base damage from all Air attacks",
            "archetype": "Battle Monk", 
            "archetype_req": 0, 
            "parents": ["War Scream", "Thunder Mastery", "Cheaper Charge"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 10,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        { "type": "stat", "name": "aDamPct", "value": 15 },
                        { "type": "stat", "name": "aDamAddMin", "value": 3 },
                        { "type": "stat", "name": "aDamAddMax", "value": 4 }
                    ]
                }
            ]  
        },

        {
            "display_name": "Fire Mastery",
            "desc": "Increases base damage from all Fire attacks",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "parents": ["War Scream"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 10,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        { "type": "stat", "name": "fDamPct", "value": 15 },
                        { "type": "stat", "name": "fDamAddMin", "value": 3 },
                        { "type": "stat", "name": "fDamAddMax", "value": 5 }
                    ]
                }
            ]  
        },

        {
            "display_name": "Quadruple Bash",
            "desc": "Bash will hit 4 times at an even larger range",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "Bash",
            "parents": ["Earth Mastery", "Fireworks"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 12,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {
                "range": 6
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "hits": {
                        "Single Hit": 2
                    }         
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "multipliers": [-20, 0, 0, 0, 0, 0] 
                }
            ]  
        },

        {
            "display_name": "Fireworks",
            "desc": "Mobs hit by Uppercut will explode mid-air and receive additional damage",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "Uppercut",
            "parents": ["Thunder Mastery", "Quadruple Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 12,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Fireworks",
                    "multipliers": [80, 0, 20, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "hits": {
                        "Fireworks": 1
                    }
                }
            ]  
        },

        {
            "display_name": "Half-Moon Swipe",
            "desc": "Uppercut will deal a footsweep attack at a longer and wider angle. All elemental conversions become Water",
            "archetype": "Battle Monk", 
            "archetype_req": 1, 
            "base_abil": "Uppercut",
            "parents": ["Water Mastery"], 
            "dependencies": ["Uppercut"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 13,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "range": 4
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Uppercut",
                    "cost": -10,
                    "multipliers": [-70, 0, 0, 30, 0, 0]
                }
            ]  
        },

        {
            "display_name": "Flyby Jab",
            "desc": "Damage enemies in your way when using Charge",
            "base_abil": "Charge",
            "parents": ["Air Mastery", "Flaming Uppercut"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 12,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Flyby Jab",
                    "multipliers": [20, 0, 0, 0, 0, 40]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Contact Damage",
                    "display": "Contact Damage",
                    "hits": { "Flyby Jab": 1 }
                }
            ]  
        },

        {
            "display_name": "Flaming Uppercut",
            "desc": "Uppercut will light mobs on fire, dealing damage every 0.6 seconds",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "base_abil": "Uppercut",
            "parents": ["Fire Mastery", "Flyby Jab"], 
            "dependencies": ["Uppercut"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 12,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {
                "duration": 3,
                "tick": 0.6
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Flaming Uppercut",
                    "multipliers": [0, 0, 0, 0, 50, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Flaming Uppercut Total Damage",
                    "hits": {
                        "Flaming Uppercut": 5
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "hits": {
                        "Flaming Uppercut": 5
                    }
                }
            ]  
        },

        {
            "display_name": "Iron Lungs",
            "desc": "War Scream deals more damage",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "base_abil": "War Scream",
            "parents": ["Flyby Jab", "Flaming Uppercut"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 13,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "War Scream",
                    "cost": 0,
                    "multipliers": [30, 0, 0, 0, 0, 30]
                }
            ]  
        },

        {
            "display_name": "Generalist",
            "desc": "After casting 3 different spells in a row, your next spell will cost 5 mana",
            "archetype": "Battle Monk", 
            "archetype_req": 3, 
            "parents": ["Counter"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 15,
                "col": 2,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []  
        },

        {
            "display_name": "Counter",
            "desc": "When dodging a nearby enemy attack, get 30% chance to instantly attack back",
            "archetype": "Battle Monk", 
            "archetype_req": 0, 
            "parents": ["Half-Moon Swipe"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 15,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "chance": 30
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Counter",
                    "base_spell": 5,
                    "display": "Counter Damage",
                    "parts": [
                        {
                            "name": "Counter Damage",
                            "multipliers": [60, 0, 20, 0, 0, 20]
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Mantle of the Bovemists",
            "desc": "When casting War Scream, create a holy shield around you that reduces all incoming damage by 70% for 3 hits (20s cooldown)",
            "archetype": "Paladin", 
            "archetype_req": 3, 
            "parents": ["Iron Lungs"], 
            "dependencies": ["War Scream"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 15,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {
                "mantle_charge": 3
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": true,
                    "bonuses": [{ "type": "stat", "name": "defPct", "value": 70}]
                }
            ]
        },

        {
            "display_name": "Bak'al's Grasp",
            "desc": "After casting War Scream, become Corrupted (15s Cooldown). You cannot heal while in that state\n\nWhile Corrupted, every 2% of Health you lose will add +4 Raw Damage to your attacks (Max 120)",
            "archetype": "Fallen", 
            "archetype_req": 2, 
            "parents": ["Quadruple Bash", "Fireworks"], 
            "dependencies": ["War Scream"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 16,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "cooldown": 15
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Corrupted",
                    "output": {
                        "type": "stat",
                        "name": "damRaw" 
                    },
                    "scaling": [4],
                    "slider_step": 1,
                    "max": 120
                }
            ]  
        },

        {
            "display_name": "Spear Proficiency 2",
            "desc": "Improve your Main Attack's damage and range w/ spear",
            "base_abil": 999,
            "parents": ["Bak'al's Grasp", "Cheaper Uppercut"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 17,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {
                "melee_range": 1
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "mdPct",
                            "value": 5
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Cheaper Uppercut",
            "desc": "Reduce the Mana Cost of Uppercut",
            "base_abil": "Uppercut",
            "parents": ["Spear Proficiency 2", "Aerodynamics", "Counter"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 17,
                "col": 3,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -5
                }
            ]  
        },

        {
            "display_name": "Aerodynamics",
            "desc": "During Charge, you can steer and change direction",
            "archetype": "Battle Monk", 
            "archetype_req": 0, 
            "base_abil": "Charge",
            "parents": ["Cheaper Uppercut", "Provoke"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 17,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []  
        },

        {
            "display_name": "Provoke",
            "desc": "Mobs damaged by War Scream will target only you for at least 5s \n\nReduce the Mana cost of War Scream",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "base_abil": "War Scream",
            "parents": ["Aerodynamics", "Mantle of the Bovemists"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 17,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "cost": -5
                }
            ]  
        },

        {
            "display_name": "Precise Strikes",
            "desc": "+30% Critical Hit Damage",
            "parents": ["Cheaper Uppercut", "Spear Proficiency 2"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 18,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "critDamPct",
                            "value": 30
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Air Shout",
            "desc": "War Scream will fire a projectile that can go through walls and deal damage multiple times",
            "base_abil": "War Scream",
            "parents": ["Aerodynamics", "Provoke"], 
            "dependencies": ["War Scream"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 18,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {"attackRate": 2},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Air Shout",
                    "multipliers": [40, 0, 0, 0, 0, 10]
                }
            ]  
        },

        {
            "display_name": "Enraged Blow",
            "desc": "While Corriupted, every 1% of Health you lose will increase your damage by +3% (Max 300%)",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "Bak'al's Grasp",
            "parents": ["Spear Proficiency 2"], 
            "dependencies": ["Bak'al's Grasp"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 20,
                "col": 0,
                "icon": "node_2"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "hpBonus"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "damMult" 
                    },
                    "scaling": [3],
                    "max": 300
                }
            ]  
        },

        {
            "display_name": "Flying Kick",
            "desc": "When using Charge, mobs hit will halt your momentum and get knocked back",
            "archetype": "Battle Monk", 
            "archetype_req": 1, 
            "base_abil": "Charge",
            "parents": ["Cheaper Uppercut", "Stronger Mantle"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 20,
                "col": 3,
                "icon": "node_1"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Flying Kick",
                    "multipliers": [150, 0, 0, 20, 0, 30]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Flying Kick Max Damage",
                    "hits": { "Flying Kick": 1 },
                    "display": "Flying Kick Max Damage"
                }
            ]  
        },

        {
            "display_name": "Stronger Mantle",
            "desc": "Add +2 additional charges to Mantle of the Bovemists",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "base_abil": "Mantle of the Bovemists",
            "parents": ["Manachism", "Flying Kick"], 
            "dependencies": ["Mantle of the Bovemists"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 20,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Mantle of the Bovemists",
                            "name": "mantle_charge",
                            "value": 2
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Manachism",
            "desc": "If you receive a hit that's less than 5% of your max HP, gain 10 Mana (1s Cooldown)",
            "archetype": "Paladin", 
            "archetype_req": 3, 
            "parents": ["Stronger Mantle", "Provoke"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 20,
                "col": 8,
                "icon": "node_2"
            },
            "properties": {
                "cooldown": 1
            },
            "effects": []  
        },

        {
            "display_name": "Boiling Blood",
            "desc": "Bash leaves a trail of boiling blood behind its first explosion, slowing down and damaging enemies above it every 0.4 seconds",
            "base_abil": "Bash",
            "parents": ["Enraged Blow", "Ragnarokkr"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 22,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Boiling Blood",
                    "cost": 0,
                    "multipliers": [25, 0, 0, 0, 5, 0]
                }
            ]  
        },

        {
            "display_name": "Ragnarokkr",
            "desc": "War Scream become deafening, increasing its range and giving damage bonus to players",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "War Scream",
            "parents": ["Boiling Blood", "Flying Kick"], 
            "dependencies": ["War Scream"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 22,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {
                "aoe": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "cost": 10
                },
                {
                    "type": "raw_stat",
                    "toggle": true,
                    "bonuses": [ {"type": "stat", "name": "damMult", "value": 30} ]
                }
            ]  
        },
        {
            "display_name": "Ambidextrous",
            "desc": "Increase your chance to attack with Counter by +30%",
            "base_abil": "Counter",
            "parents": ["Flying Kick", "Stronger Mantle", "Burning Heart"], 
            "dependencies": ["Counter"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 22,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [ {"type": "prop", "abil": "Counter", "name": "chance", "value": 30} ]
                }
            ]  
        },

        {
            "display_name": "Burning Heart",
            "desc": "For every 100 Health Bonus you have from item IDs, gain +2% Fire Damage (Max 100%)",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "parents": ["Ambidextrous", "Stronger Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 22,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "hpBonus"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "fDamPct"
                    },
                    "scaling": [2],
                    "max": 100
                }
            ]  
        },

        {
            "display_name": "Stronger Bash",
            "desc": "Increase the damage of Bash",
            "base_abil": "Bash",
            "parents": ["Burning Heart", "Manachism"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 22,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "multipliers": [30, 0, 0, 0, 0, 0]
                }
            ]  
        },

        {
            "display_name": "Intoxicating Blood",
            "desc": "After leaving Corrupted, gain 2% of the health lost back for each enemy killed while Corrupted",
            "archetype": "Fallen", 
            "archetype_req": 5, 
            "base_abil": "Bak'al's Grasp",
            "parents": ["Ragnarokkr", "Boiling Blood"], 
            "dependencies": ["Bak'al's Grasp"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 23,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []  
        },

        {
            "display_name": "Comet",
            "desc": "After being hit by Fireworks, enemies will crash into the ground and receive more damage",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "Uppercut",
            "parents": ["Ragnarokkr"], 
            "dependencies": ["Fireworks"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 24,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Comet",
                    "cost": 0,
                    "multipliers": [80, 20, 0, 0, 0, 0]
                },
                {
                    "type":"add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "cost": 0, 
                    "hits": {
                        "Comet": 1
                    }
                }
            ]  
        },

        {
            "display_name": "Collide",
            "desc": "Mobs thrown into walls from Flying Kick will explode and receive additonal damage",
            "archetype": "Battle Monk", 
            "archetype_req": 4, 
            "base_abil": "Charge",
            "parents": ["Ambidextrous", "Burning Heart"], 
            "dependencies": ["Flying Kick"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 23,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 4
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Collide",
                    "cost": 0,
                    "multipliers": [150, 0, 0, 0, 50, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Flying Kick Max Damage",
                    "hits": { "Collide": 1 }
                }
            ]  
        },

        {
            "display_name": "Rejuvenating Skin",
            "desc": "Regain back 30% of the damage you take as healing over 30s",
            "archetype": "Paladin", 
            "archetype_req": 5, 
            "parents": ["Burning Heart", "Stronger Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 23,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []  
        },
        {
            "display_name": "Uncontainable Corruption",
            "desc": "Reduce the cooldown of Bak'al's Grasp by -5s, and increase the raw damage gained for every 2% of health lost by +1",
            "base_abil": "Bak'al's Grasp",
            "parents": ["Boiling Blood", "Radiant Devotee"], 
            "dependencies": ["Bak'al's Grasp"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 26,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Corrupted",
                    "output": {
                        "type": "stat",
                        "name": "damRaw" 
                    },
                    "scaling": [0.5],
                    "max": 50
                },
                {
                    "type": "raw_stat",
                    "bonuses": [ {"type": "prop", "abil": "Bak'al's Grasp", "name": "cooldown", "value": -5} ]
                }
            ]  
        },

        {
            "display_name": "Radiant Devotee",
            "desc": "For every 4% Reflection you have from items, gain +1/5s Mana Regen (Max 10/5s)",
            "archetype": "Battle Monk", 
            "archetype_req": 1, 
            "parents": ["Whirlwind Strike", "Uncontainable Corruption"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 26,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "ref"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "mr"
                    },
                    "scaling": [0.25],
                    "max": 10
                }
            ]  
        },

        {
            "display_name": "Whirlwind Strike",
            "desc": "Uppercut will create a strong gust of air, launching you upward with enemies (Hold shift to stay grounded)",
            "archetype": "Battle Monk", 
            "archetype_req": 5, 
            "base_abil": "Uppercut",
            "parents": ["Ambidextrous", "Radiant Devotee"], 
            "dependencies": ["Uppercut"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 26,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "range": 2 
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Uppercut",
                    "multipliers": [0, 0, 0, 0, 0, 50]
                }
            ]  
        },

        {
            "display_name": "Mythril Skin",
            "desc": "Gain +5% Base Resistance and become immune to knockback",
            "archetype": "Paladin", 
            "archetype_req": 6, 
            "parents": ["Rejuvenating Skin"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 26,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "baseResist",
                            "value": 5
                        }
                    ]
                }
            ]  
        },

        {
            "display_name": "Armour Breaker",
            "desc": "While Corrupted, losing 30% Health will make your next Uppercut destroy enemies' defense, rendering them weaker to damage",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "Uppercut",
            "parents": ["Uncontainable Corruption", "Radiant Devotee"], 
            "dependencies": ["Bak'al's Grasp"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 27,
                "col": 1,
                "icon": "node_2"
            },
            "properties": {
                "duration": 5
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": true,
                    "bonuses": [ {"type": "stat", "name": "damMult", "value": 30} ]
                }
            ]  
        },
        {
            "display_name": "Shield Strike",
            "desc": "When your Mantle of the Bovemist loses all charges, deal damage around you for each Mantle individually lost",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "base_abil": "Mantle of the Bovemists",
            "parents": ["Mythril Skin", "Sparkling Hope"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 27,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Shield Strike",
                    "base_spell": 6,
                    "display": "Damage per Shield",
                    "parts": [
                        {
                            "name": "Damage per Shield",
                            "multipliers": [60, 0, 20, 0, 0, 0]
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Sparkling Hope",
            "desc": "Everytime you heal 5% of your max health, deal damage to all nearby enemies",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "parents": ["Mythril Skin"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 27,
                "col": 8,
                "icon": "node_2"
            },
            "properties": {
                "aoe": 6
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Sparkling Hope",
                    "base_spell": 6,
                    "display": "Damage Tick",
                    "parts": [
                        {
                            "name": "Damage Tick",
                            "multipliers": [10, 0, 5, 0, 0, 0]
                        }
                    ]
                }
            ]  
        },
        {
            "display_name": "Massive Bash",
            "desc": "While Corrupted, every 3% Health you lose will add +1 AoE to Bash (Max 10)",
            "archetype": "Fallen", 
            "archetype_req": 8, 
            "base_abil": "Bash",
            "parents": ["Tempest", "Uncontainable Corruption"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 28,
                "col": 0,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Corrupted",
                    "output": {
                        "type": "prop",
                        "abil": "Bash",
                        "name": "aoe"
                    },
                    "scaling": [0.3333333333333333],
                    "max": 10
                }
            ]  
        },{
            "display_name": "Tempest",
            "desc": "War Scream will ripple the ground and deal damage 3 times in a large area",
            "archetype": "Battle Monk", 
            "archetype_req": 0, 
            "base_abil": "War Scream",
            "parents": ["Massive Bash", "Spirit of the Rabbit"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 28,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 16
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Tempest",
                    "multipliers": [30, 10, 0, 0, 0, 10]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Tempest Total Damage",
                    "hits": {
                        "Tempest": 3
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Total Damage",
                    "hits": { "Tempest": 3 }
                }
            ]  
        },
        {
            "display_name": "Spirit of the Rabbit",
            "desc": "Reduce the Mana cost of Charge and increase your Walk Speed by +20%",
            "archetype": "Battle Monk", 
            "archetype_req": 5, 
            "base_abil": "Charge",
            "parents": ["Tempest", "Whirlwind Strike"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 28,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{ "type": "stat", "name": "spd", "value": 20 }]
                }
            ]  
        },{
            "display_name": "Massacre",
            "desc": "While Corrupted, if your effective attack speed is Slow or lower, hitting an enemy with your Main Attack will add +1% to your Corrupted bar",
            "archetype": "Fallen", 
            "archetype_req": 5, 
            "base_abil": 999,
            "parents": ["Tempest", "Massive Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 29,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []  
        },
        {
            "display_name": "Axe Kick",
            "desc": "Increase the damage of Uppercut, but also increase its mana cost",
            "base_abil": "Uppercut",
            "parents": ["Tempest", "Spirit of the Rabbit"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 29,
                "col": 3,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Uppercut",
                    "cost": 10,
                    "multipliers": [100, 0, 0, 0, 0, 0]
                }
            ]  
        },
        {
            "display_name": "Radiance",
            "desc": "Bash will buff your allies' positive IDs. (15s Cooldown)",
            "archetype": "Paladin", 
            "archetype_req": 2, 
            "base_abil": "Bash",
            "parents": ["Spirit of the Rabbit", "Cheaper Bash 2"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 29,
                "col": 5,
                "icon": "node_2"
            },
            "properties": {
                "cooldown": 15
            },
            "effects": []  
        },

        {
            "display_name": "Cheaper Bash 2",
            "desc": "Reduce the Mana cost of Bash",
            "base_abil": "Bash",
            "parents": ["Radiance", "Shield Strike", "Sparkling Hope"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 29,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -5
                }
            ]  
        },

        {
            "display_name": "Cheaper War Scream",
            "desc": "Reduce the Mana cost of War Scream",
            "base_abil": "War Scream",
            "parents": ["Massive Bash"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 31,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "cost": -5
                }
            ]  
        },

        {
            "display_name": "Discombobulate",
            "desc": "Every time you hit an enemy, briefly increase your elemental damage dealt to them by +2 (Additive, Max +50). This bonus decays -5 every second",
            "archetype": "Battle Monk", 
            "archetype_req": 11, 
            "parents": ["Cyclone"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 31,
                "col": 2,
                "icon": "node_3"
            },
            "properties": {
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Hits dealt",
                    "output": [
                        { "type": "stat", "name": "eDamAddMin" }, { "type": "stat", "name": "eDamAddMax" },
                        { "type": "stat", "name": "tDamAddMin" }, { "type": "stat", "name": "tDamAddMax" },
                        { "type": "stat", "name": "wDamAddMin" }, { "type": "stat", "name": "wDamAddMax" },
                        { "type": "stat", "name": "fDamAddMin" }, { "type": "stat", "name": "fDamAddMax" },
                        { "type": "stat", "name": "aDamAddMin" }, { "type": "stat", "name": "aDamAddMax" }
                    ],
                    "scaling": [3],
                    "max": 80
                }
            ]  
        },

        {
            "display_name": "Thunderclap",
            "desc": "Bash will cast at the player's position and gain additional AoE.\n\n All elemental conversions become Thunder",
            "archetype": "Battle Monk", 
            "archetype_req": 8, 
            "parents": ["Cyclone"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 32,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "convert_spell_conv",
                    "target_part": "all",
                    "conversion": "Thunder"
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "prop",
                        "abil": "Bash",
                        "name": "aoe",
                        "value": 3
                    }]
                }
            ]  
        },

        {
            "display_name": "Cyclone",
            "desc": "After casting War Scream, envelop yourself with a vortex that damages nearby enemies every 0.5s",
            "archetype": "Battle Monk", 
            "archetype_req": 0, 
            "parents": ["Spirit of the Rabbit"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 31,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 4,
                "duration": 20
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Cyclone",
                    "multipliers": [10, 0, 0, 0, 5, 10]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Cyclone Total Damage",
                    "hits": {
                        "Cyclone": 40
                    }
                    
                }
            ]  
        },

        {
            "display_name": "Second Chance",
            "desc": "When you receive a fatal blow, survive and regain 30% of your Health (10m Cooldown)",
            "archetype": "Paladin", 
            "archetype_req": 12, 
            "parents": ["Cheaper Bash 2"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 32,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []  
        },

        {
            "display_name": "Blood Pact",
            "desc": "If you do not have enough mana to cast a spell, spend health instead (0.6% health per mana)",
            "archetype": "Fallen", 
            "archetype_req": 10, 
            "parents": ["Cheaper War Scream"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 34,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "health_cost": 0.6
            },
            "effects": []  
        },

        {
            "display_name": "Haemorrhage",
            "desc": "Reduce Blood Pact's health cost. (0.3% health per mana)",
            "archetype": "Fallen", 
            "archetype_req": 0, 
            "base_abil": "Blood Pact",
            "parents": ["Blood Pact"], 
            "dependencies": ["Blood Pact"], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 35,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [{
                "type": "raw_stat",
                "bonuses": [{ "type": "prop", "abil": "Blood Pact", "name": "health_cost", "value": -0.3}]
            }]
        },

        {
            "display_name": "Brink of Madness",
            "desc": "If your health is 25% full or less, gain +40% Resistance",
            "parents": ["Blood Pact", "Cheaper Uppercut 2"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 35,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []  
        },

        {
            "display_name": "Cheaper Uppercut 2",
            "desc": "Reduce the Mana cost of Uppercut",
            "base_abil": "Uppercut",
            "parents": ["Second Chance", "Brink of Madness"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 1, 
            "display": {
                "row": 35,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -5
                }
            ]  
        },

        {
            "display_name": "Martyr",
            "desc": "When you receive a fatal blow, all nearby allies become invincible",
            "archetype": "Paladin", 
            "archetype_req": 0, 
            "parents": ["Second Chance"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 35,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {
                "duration": 3,
                "aoe": 12
            },
            "effects": []  
        }
    ]
}
