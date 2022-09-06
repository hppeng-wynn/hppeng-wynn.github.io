const atrees = {
    "Archer": [
        {
            "display_name": "Arrow Shield",
            "desc": "Create a shield around you that deal damage and knockback mobs when triggered. (2 Charges)",
            "parents": [
                "Power Shots",
                "Cheaper Escape"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 6,
                "icon": "node_archer"
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
                            "multipliers": [
                                90,
                                0,
                                0,
                                0,
                                0,
                                10
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Shield Damage": "Arrow Shield.charges"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Escape",
            "desc": "Throw yourself backward to avoid danger. (Hold shift while escaping to cancel)",
            "parents": [
                "Heart Shatter"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 4,
                "icon": "node_archer"
            },
            "properties": {
                "aoe": 0,
                "range": 0
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Escape",
                    "cost": 20,
                    "base_spell": 2,
                    "display": "",
                    "parts": []
                }
            ]
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
                "icon": "node_archer"
            },
            "properties": {
                "aoe": 4.5,
                "range": 26
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Arrow Bomb",
                    "cost": 50,
                    "base_spell": 3,
                    "spell_type": "damage",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Arrow Bomb",
                            "type": "damage",
                            "multipliers": [
                                160,
                                0,
                                0,
                                0,
                                20,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Arrow Bomb": 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Heart Shatter",
            "desc": "If you hit a mob directly with Arrow Bomb, shatter its heart and deal bonus damage.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "Bow Proficiency I"
            ],
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
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "hits": {
                        "Heart Shatter": 1
                    }
                }
            ]
        },
        {
            "display_name": "Fire Creep",
            "desc": "Arrow Bomb will leak a trail of fire for 6s, Damaging enemies that walk into it every 0.4s.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "Phantom Ray",
                "Fire Mastery",
                "Bryophyte Roots"
            ],
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
                    "multipliers": [
                        30,
                        0,
                        0,
                        0,
                        20,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Burn Damage",
                    "hits": {
                        "Fire Creep": 15
                    }
                }
            ]
        },
        {
            "display_name": "Bryophyte Roots",
            "desc": "When you hit an enemy with Arrow Storm, create an area that slows them down and deals damage every 0.4s.",
            "base_abil": "Arrow Storm",
            "archetype": "Trapper",
            "archetype_req": 1,
            "parents": [
                "Fire Creep",
                "Earth Mastery"
            ],
            "dependencies": [
                "Arrow Storm"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 8,
                "icon": "node_1"
            },
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
                    "multipliers": [
                        40,
                        20,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Roots Damage",
                    "hits": {
                        "Bryophyte Roots": 12
                    }
                }
            ]
        },
        {
            "display_name": "Nimble String",
            "desc": "Arrow Storm throw out +6 arrows per stream and shoot twice as fast.",
            "base_abil": "Arrow Storm",
            "parents": [
                "Thunder Mastery",
                "Arrow Rain"
            ],
            "dependencies": [
                "Arrow Storm"
            ],
            "blockers": [
                "Phantom Ray"
            ],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Arrow",
                    "multipliers": [
                        -10,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Stream",
                    "hits": {
                        "Single Arrow": 6
                    }
                }
            ]
        },
        {
            "display_name": "Arrow Storm",
            "desc": "Shoot a stream of 8 arrows, dealing significant damage to close mobs and pushing them back.",
            "parents": [
                "Double Shots",
                "Cheaper Escape"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 2,
                "icon": "node_archer"
            },
            "properties": {
                "range": 16
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Arrow Storm",
                    "cost": 40,
                    "base_spell": 1,
                    "spell_type": "damage",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Single Arrow",
                            "multipliers": [
                                30,
                                0,
                                10,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "Single Stream",
                            "hits": {
                                "Single Arrow": 8
                            }
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "Single Stream": 1
                            }
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
            "parents": [
                "Triple Shots",
                "Frenzy"
            ],
            "dependencies": [
                "Arrow Shield"
            ],
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
                "shots": 8
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Guardian Angels",
                    "base_spell": 4,
                    "display": "DPS",
                    "parts": [
                        {
                            "name": "Single Shot",
                            "type": "damage",
                            "multipliers": [
                                30,
                                0,
                                0,
                                0,
                                0,
                                10
                            ]
                        },
                        {
                            "name": "Single Bow",
                            "type": "total",
                            "hits": { "Single Shot": "Arrow Shield.shots" },
                            "display": false
                        },
                        {
                            "name": "Single Volley",
                            "type": "total",
                            "hits": { "Single Shot": "Arrow Shield.charges" },
                            "display": false
                        },
                        {
                            "name": "DPS",
                            "type": "total",
                            "hits": { "Single Volley": 2 }
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Single Bow": "Arrow Shield.charges"
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
            "parents": [
                "Arrow Storm"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 8,
                "duration": 120
            },
            "effects": []
        },
        {
            "display_name": "Basaltic Trap",
            "desc": "When you hit the ground with Arrow Bomb, leave a Trap that damages enemies. (Max 2 Traps)",
            "archetype": "Trapper",
            "archetype_req": 2,
            "parents": [
                "Bryophyte Roots"
            ],
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
                            "multipliers": [
                                140,
                                30,
                                0,
                                0,
                                30,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Windstorm",
            "desc": "Arrow Storm shoot +1 stream of arrows, and each stream shoots +2 arrows, effectively doubling its damage.",
            "base_abil": "Arrow Storm",
            "parents": [
                "Guardian Angels",
                "Cheaper Arrow Storm"
            ],
            "dependencies": [],
            "blockers": [
                "Phantom Ray"
            ],
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
                    "multipliers": [
                        -10,
                        0,
                        -2,
                        0,
                        0,
                        2
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "hits": {
                        "Single Stream": 1
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Stream",
                    "cost": 0,
                    "hits": {
                        "Single Arrow": 2
                    }
                }
            ]
        },
        {
            "display_name": "Grappling Hook",
            "base_abil": "Escape",
            "desc": "When casting Escape, throw a hook that pulls you when hitting a block. If you hit an enemy, pull them towards you instead. (Escape will not throw you backward anymore)",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                "Focus",
                "More Shields",
                "Cheaper Arrow Storm"
            ],
            "dependencies": [],
            "blockers": [
                "Escape Artist"
            ],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 5,
                "icon": "node_2"
            },
            "properties": { "range": 26 },
            "effects": []
        },
        {
            "display_name": "Implosion",
            "desc": "Arrow bomb will pull enemies towards you. If a trap is nearby, it will pull them towards it instead. Increase Heart Shatter's damage.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Arrow Bomb",
            "parents": [
                "Grappling Hook",
                "More Shields"
            ],
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
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Twain's Arc",
            "desc": "When you have 2+ Focus, holding shift will summon the Twain's Arc. Charge it up to shoot a destructive long-range beam. (Damage is dealt as Main Attack Damage)",
            "archetype": "Sharpshooter",
            "archetype_req": 4,
            "parents": [
                "More Focus",
                "Traveler"
            ],
            "dependencies": [
                "Focus"
            ],
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
                            "multipliers": [
                                200,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
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
            "parents": [
                "Refined Gunpowder",
                "Traveler"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
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
                    "target_part": "Fierce Stomp",
                    "cost": 0,
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Fierce Stomp": 1
                    },
                    "display": "Total Damage"
                }
            ]
        },
        {
            "display_name": "Scorched Earth",
            "desc": "Fire Creep become much stronger.",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                "Twain's Arc"
            ],
            "dependencies": [
                "Fire Creep"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 26,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {
                "duration": 2,
                "aoe": 0.4
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Fire Creep",
                    "multipliers": [
                        10,
                        0,
                        0,
                        0,
                        5,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Leap",
            "desc": "When you double tap jump, leap foward. (2s Cooldown)",
            "archetype": "Boltslinger",
            "archetype_req": 5,
            "parents": [
                "Refined Gunpowder",
                "Homing Shots"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 0,
                "icon": "node_1"
            },
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
            "parents": [
                "Twain's Arc",
                "Better Arrow Shield",
                "Homing Shots"
            ],
            "dependencies": [
                "Arrow Bomb"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "gravity": 0
            },
            "effects": [
                {
                    "type": "convert_spell_conv",
                    "target_part": "all",
                    "base_spell": 3,
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
            "parents": [
                "More Traps",
                "Better Arrow Shield"
            ],
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
            "base_abil": "Escape",
            "parents": [
                "Better Guardian Angels",
                "Leap"
            ],
            "dependencies": [],
            "blockers": [
                "Grappling Hook"
            ],
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
                    "target_part": "Escape Artist Arrow",
                    "multipliers": [
                        70,
                        0,
                        30,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Total Damage",
                    "hits": {
                        "Escape Artist Arrow": 1
                    },
                    "display": "Total Damage"
                }
            ]
        },
        {
            "display_name": "Initiator",
            "desc": "If you do not damage an enemy for 5s or more, your next sucessful hit will deal +50% damage and add +1 Focus.",
            "archetype": "Sharpshooter",
            "archetype_req": 5,
            "parents": [
                "Shocking Bomb",
                "Better Arrow Shield",
                "Cheaper Arrow Storm (2)"
            ],
            "dependencies": [
                "Focus"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 31,
                "col": 5,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Call of the Hound",
            "desc": "Arrow Shield summon a Hound that will attack and drag aggressive enemies towards your traps.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Arrow Shield",
            "parents": [
                "Initiator",
                "Cheaper Arrow Storm (2)"
            ],
            "dependencies": [
                "Arrow Shield"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 7,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Call of the Hound",
                    "base_spell": 8,
                    "display": "DPS",
                    "parts": [
                        {
                            "name": "Single Hit",
                            "multipliers": [
                                40,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "DPS",
                            "hits": {
                                "Single Hit": 3.3333333333333
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Arrow Hurricane",
            "desc": "Arrow Storm will shoot +2 stream of arrows.",
            "archetype": "Boltslinger",
            "archetype_req": 8,
            "base_abil": "Arrow Storm",
            "parents": [
                "Precise Shot",
                "Escape Artist"
            ],
            "dependencies": [],
            "blockers": [
                "Phantom Ray"
            ],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 0,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "hits": {
                        "Single Stream": 2
                    }
                }
            ]
        },
        {
            "display_name": "Geyser Stomp",
            "desc": "Fierce Stomp will create geysers, dealing more damage and vertical knockback.",
            "base_abil": "Escape",
            "parents": [
                "Shrapnel Bomb"
            ],
            "dependencies": [
                "Fierce Stomp"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Geyser Stomp",
                    "multipliers": [
                        0,
                        0,
                        0,
                        50,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Total Damage",
                    "hits": {
                        "Geyser Stomp": 1
                    }
                },
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Escape",
                            "name": "aoe",
                            "value": 1
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Crepuscular Ray",
            "desc": "If you have 5 Focus, casting Arrow Storm will make you levitate and shoot 20 homing arrows per second until you run out of Focus. While in that state, you will lose 1 Focus per second.",
            "archetype": "Sharpshooter",
            "archetype_req": 10,
            "parents": [
                "Cheaper Arrow Shield"
            ],
            "dependencies": [
                "Arrow Storm"
            ],
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
                            "multipliers": [
                                20,
                                0,
                                0,
                                5,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "DPS",
                            "hits": {
                                "Single Arrow": 20
                            }
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "DPS": 7
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Grape Bomb",
            "desc": "Arrow bomb will throw 3 additional smaller bombs when exploding.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "Cheaper Escape (2)"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 7,
                "icon": "node_2"
            },
            "properties": {
                "aoe": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Grape Bomb",
                    "multipliers": [
                        30,
                        0,
                        0,
                        0,
                        10,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "hits": {
                        "Grape Bomb": 3
                    }
                }
            ]
        },
        {
            "display_name": "Tangled Traps",
            "desc": "Your Traps will be connected by a rope that deals damage to enemies every 0.2s.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Basaltic Trap",
            "parents": [
                "Grape Bomb"
            ],
            "dependencies": [
                "Basaltic Trap"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 38,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {
                "attackSpeed": 0.2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 7,
                    "target_part": "Line Damage Tick",
                    "multipliers": [
                        20,
                        0,
                        0,
                        0,
                        0,
                        20
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 7,
                    "target_part": "DPS",
                    "hits": {
                        "Line Damage Tick": 5
                    }
                }
            ]
        },
        {
            "display_name": "Snow Storm",
            "desc": "Enemies near you will be slowed down.",
            "parents": [
                "Geyser Stomp",
                "More Focus (2)"
            ],
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
            "parents": [
                "Snow Storm"
            ],
            "dependencies": [
                "Guardian Angels"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 40,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "range": 8,
                "shots": 5
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Single Shot",
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        10,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Minefield",
            "desc": "Allow you to place +6 Traps, but with reduced damage and range.",
            "archetype": "Trapper",
            "archetype_req": 10,
            "base_abil": "Basaltic Trap",
            "parents": [
                "Grape Bomb",
                "Cheaper Arrow Bomb (2)"
            ],
            "dependencies": [
                "Basaltic Trap"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 40,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 7,
                    "target_part": "Trap Damage",
                    "cost": 0,
                    "multipliers": [
                        -80,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
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
            "parents": [
                "Arrow Bomb"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Single Shot",
                    "multipliers": [
                        5,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Arrow Bomb",
            "desc": "Reduce the Mana cost of Arrow Bomb.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "Bow Proficiency I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 6,
                "icon": "node_0"
            },
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
            "parents": [
                "Grappling Hook",
                "Windstorm",
                "Focus"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 21,
                "col": 3,
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
            "display_name": "Cheaper Escape",
            "desc": "Reduce the Mana cost of Escape.",
            "base_abil": "Escape",
            "parents": [
                "Arrow Storm",
                "Arrow Shield"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Earth Mastery",
            "base_abil": 998,
            "desc": "Increases your base damage from all Earth attacks",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                "Arrow Shield"
            ],
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
            "base_abil": 998,
            "desc": "Increases your base damage from all Thunder attacks",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                "Arrow Storm",
                "Fire Mastery",
                "Cheaper Escape"
            ],
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
            "base_abil": 998,
            "desc": "Increases your base damage from all Water attacks",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                "Cheaper Escape",
                "Thunder Mastery",
                "Fire Mastery"
            ],
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
            "base_abil": 998,
            "desc": "Increases base damage from all Air attacks",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                "Arrow Storm"
            ],
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
            "base_abil": 998,
            "desc": "Increases base damage from all Fire attacks",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                "Thunder Mastery",
                "Arrow Shield",
                "Cheaper Escape"
            ],
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
            "parents": [
                "Grappling Hook",
                "Basaltic Trap"
            ],
            "dependencies": [
                "Arrow Shield"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 21,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {
                "charges": 2
            },
            "effects": []
        },
        {
            "display_name": "Stormy Feet",
            "desc": "Windy Feet will last longer and add more speed.",
            "archetype": "Boltslinger",
            "base_abil": "Escape",
            "parents": [
                "Windstorm"
            ],
            "dependencies": [
                "Windy Feet"
            ],
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
            "effects": []
        },
        {
            "display_name": "Refined Gunpowder",
            "desc": "Increase the damage of Arrow Bomb.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "Windstorm",
                "Traveler"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Arrow Bomb",
                    "multipliers": [
                        50,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "More Traps",
            "desc": "Increase the maximum amount of active Traps you can have by +2.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Basaltic Trap",
            "parents": [
                "Bouncing Bomb"
            ],
            "dependencies": [
                "Basaltic Trap"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 26,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Basaltic Trap",
                            "name": "traps",
                            "value": 2
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Better Arrow Shield",
            "desc": "Arrow Shield will gain additional area of effect, knockback and damage.",
            "base_abil": "Arrow Shield",
            "parents": [
                "Mana Trap",
                "Shocking Bomb",
                "Twain's Arc"
            ],
            "dependencies": [
                "Arrow Shield"
            ],
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
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Arrow Shield",
                            "behavior": "modify",
                            "name": "aoe",
                            "value": 1
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Better Leap",
            "desc": "Reduce leap's cooldown by 1s.",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "base_abil": "Leap",
            "parents": [
                "Leap",
                "Homing Shots"
            ],
            "dependencies": [
                "Leap"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 29,
                "col": 1,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Leap",
                            "name": "cooldown",
                            "value": -1
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Better Guardian Angels",
            "desc": "Your Guardian Angels can shoot +4 arrows before disappearing.",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "base_abil": "Arrow Shield",
            "parents": [
                "Escape Artist",
                "Homing Shots"
            ],
            "dependencies": [
                "Guardian Angels"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Single Bow",
                    "hits": {
                        "Single Shot": 4
                    }
                }
            ]
        },
        {
            "display_name": "Cheaper Arrow Storm (2)",
            "desc": "Reduce the Mana cost of Arrow Storm.",
            "base_abil": "Arrow Storm",
            "parents": [
                "Initiator",
                "Mana Trap"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 8,
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
            "display_name": "Precise Shot",
            "desc": "+30% Critical Hit Damage",
            "parents": [
                "Better Guardian Angels",
                "Cheaper Arrow Shield",
                "Arrow Hurricane"
            ],
            "archetype": "Sharpshooter",
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
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
                            "name": "critDamPct",
                            "value": 30
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Arrow Shield",
            "desc": "Reduce the Mana cost of Arrow Shield.",
            "base_abil": "Arrow Shield",
            "parents": [
                "Precise Shot",
                "Initiator"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
                "col": 4,
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
            "display_name": "Rocket Jump",
            "desc": "Arrow Bomb's self-damage will knockback you farther away.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "Cheaper Arrow Storm (2)",
                "Initiator"
            ],
            "dependencies": [
                "Arrow Bomb"
            ],
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
            "parents": [
                "Call of the Hound",
                "Decimator"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Stronger Hook",
            "desc": "Increase your Grappling Hook's range, speed and strength.",
            "archetype": "Trapper",
            "archetype_req": 5,
            "base_abil": "Escape",
            "parents": [
                "Cheaper Escape (2)"
            ],
            "dependencies": [
                "Grappling Hook"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 35,
                "col": 8,
                "icon": "node_0"
            },
            "properties": { "range": 8 },
            "effects": []
        },
        {
            "display_name": "Cheaper Arrow Bomb (2)",
            "desc": "Reduce the Mana cost of Arrow Bomb.",
            "base_abil": "Arrow Bomb",
            "parents": [
                "More Focus (2)",
                "Minefield"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 40,
                "col": 5,
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
            "display_name": "Bouncing Bomb",
            "desc": "Arrow Bomb will bounce once when hitting a block or enemy",
            "base_abil": "Arrow Bomb",
            "parents": [
                "More Shields"
            ],
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
            "archetype_req": 2,
            "base_abil": 999,
            "parents": [
                "Leap",
                "Shocking Bomb"
            ],
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
            "parents": [
                "Arrow Hurricane",
                "Precise Shot"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Shrapnel Bomblet",
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        20,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Elusive",
            "desc": "If you do not get hit for 5+ seconds, become immune to self-damage and remove Arrow Storm's recoil. (Dodging counts as not getting hit)",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                "Geyser Stomp"
            ],
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
            "parents": [
                "Escape"
            ],
            "dependencies": [],
            "blockers": [
                "Power Shots"
            ],
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
                    "multipliers": [
                        -30,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Total Damage",
                    "hits": {
                        "Single Shot": 2
                    },
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
            "parents": [
                "Arrow Rain",
                "Frenzy"
            ],
            "dependencies": [
                "Double Shots"
            ],
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
                    "multipliers": [
                        -20,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Total Damage",
                    "hits": {
                        "Single Shot": 1
                    },
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
            "parents": [
                "Escape"
            ],
            "dependencies": [],
            "blockers": [
                "Double Shots"
            ],
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
            "parents": [
                "Phantom Ray"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Focus",
                    "output": {
                        "type": "stat",
                        "name": "damMult.Focus"
                    },
                    "scaling": [
                        40
                    ],
                    "slider_max": 3
                }
            ]
        },
        {
            "display_name": "More Focus",
            "desc": "Add +2 max Focus",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "base_abil": "Focus",
            "parents": [
                "Cheaper Arrow Storm",
                "Grappling Hook"
            ],
            "dependencies": [
                "Focus"
            ],
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
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Focus",
                    "slider_max": 2,
                    "output": {
                        "type": "stat",
                        "name": "damMult.Focus"
                    },
                    "scaling": [
                        -5
                    ]
                }
            ]
        },
        {
            "display_name": "More Focus (2)",
            "desc": "Add +2 max Focus",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "base_abil": "Focus",
            "parents": [
                "Crepuscular Ray",
                "Snow Storm"
            ],
            "dependencies": [
                "Focus"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 39,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Focus",
                    "slider_max": 2,
                    "output": {
                        "type": "stat",
                        "name": "damMult.Focus"
                    },
                    "scaling": [
                        -5
                    ]
                }
            ]
        },
        {
            "display_name": "Traveler",
            "desc": "For every 1% Walk Speed you have from items, gain +1 Raw Spell Damage (Max 100)",
            "parents": [
                "Refined Gunpowder",
                "Twain's Arc"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "spd"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "sdRaw"
                    },
                    "scaling": [
                        1
                    ],
                    "max": 100
                }
            ]
        },
        {
            "display_name": "Patient Hunter",
            "desc": "Your Traps will deal +20% more damage for every second they are active (Max +80%)",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Basaltic Trap",
            "parents": [
                "More Shields"
            ],
            "dependencies": [
                "Basaltic Trap"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 8,
                "icon": "node_1"
            },
            "properties": { "max": 80 },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Trap Wait Time",
                    "slider_max": 4,
                    "output": {
                        "type": "stat",
                        "name": "damMult.Basaltic:7.Trap Damage"
                    },
                    "slider_step": 1,
                    "scaling": [
                        20
                    ]
                }
            ]
        },
        {
            "display_name": "Stronger Patient Hunter",
            "desc": "Add +80% Max Damage to Patient Hunter",
            "archetype": "Trapper",
            "archetype_req": 0,
            "base_abil": "Basaltic Trap",
            "parents": [
                "Grape Bomb"
            ],
            "dependencies": [
                "Patient Hunter"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 38,
                "col": 8,
                "icon": "node_0"
            },
            "properties": { "max": 80 },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Trap Wait Time",
                    "slider_max": 4
                }
            ]
        },
        {
            "display_name": "Frenzy",
            "desc": "Every time you hit an enemy, briefly gain +6% Walk Speed (Max 200%). Decay -40% of the bonus every second",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                "Triple Shots",
                "Nimble String"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Hits dealt",
                    "output": {
                        "type": "stat",
                        "name": "spd"
                    },
                    "scaling": [
                        6
                    ],
                    "max": 160
                }
            ]
        },
        {
            "display_name": "Phantom Ray",
            "desc": "Condense Arrow Storm into a single ray that damages enemies 10 times per second",
            "base_abil": "Arrow Storm",
            "parents": [
                "Water Mastery",
                "Fire Creep"
            ],
            "dependencies": [
                "Arrow Storm"
            ],
            "blockers": [
                "Windstorm",
                "Nimble String",
                "Arrow Hurricane"
            ],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {"range": 16},
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
                            "multipliers": [
                                25,
                                0,
                                5,
                                0,
                                0,
                                0
                            ]
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
            "parents": [
                "Nimble String",
                "Air Mastery"
            ],
            "dependencies": [
                "Arrow Shield"
            ],
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
                    "target_part": "Arrow Rain",
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        0,
                        50
                    ]
                }
            ]
        },
        {
            "display_name": "Decimator",
            "desc": "Phantom Ray will increase its damage by 10% everytime you do not miss with it (Max 70%)",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "base_abil": "Arrow Storm",
            "parents": [
                "Cheaper Arrow Shield",
                "Cheaper Escape (2)"
            ],
            "dependencies": [
                "Phantom Ray"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Phantom Ray hits",
                    "slider_max": 7,
                    "output": {
                        "type": "stat",
                        "name": "damMult.Decimator:1.Single Arrow"
                    },
                    "scaling": [
                        10
                    ]
                }
            ]
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
                "icon": "node_warrior"
            },
            "properties": {
                "aoe": 4,
                "range": 3,
                "hits": 1
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
                            "multipliers": [
                                130,
                                20,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Single Hit": "Bash.hits"
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
            "parents": [
                "Bash"
            ],
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
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Melee",
                    "multipliers": [ 5, 0, 0, 0, 0, 0 ]
                }
            ]
        },
        {
            "display_name": "Cheaper Bash",
            "desc": "Reduce the Mana cost of Bash",
            "base_abil": "Bash",
            "parents": [
                "Spear Proficiency 1"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
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
            "parents": [
                "Spear Proficiency 1"
            ],
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
                "range": 3,
                "hits": 1
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "cost": 0,
                    "multipliers": [ -50, 0, 0, 0, 0, 0 ]
                }
            ]
        },
        {
            "display_name": "Charge",
            "desc": "Charge forward at high speed (hold shift to cancel)",
            "parents": [
                "Double Bash"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 4,
                "icon": "node_warrior"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Charge",
                    "cost": 25,
                    "base_spell": 2,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "",
                    "parts": []
                }
            ]
        },
        {
            "display_name": "Heavy Impact",
            "desc": "After using Charge, violently crash down into the ground and deal damage",
            "base_abil": "Charge",
            "parents": [
                "Uppercut"
            ],
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
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Contact Damage",
                    "display": "Contact Damage",
                    "hits": {
                        "Heavy Impact": 1
                    }
                }
            ]
        },
        {
            "display_name": "Vehement",
            "desc": "For every 1% or 1 Raw Main Attack Damage you have from items, gain +2% Walk Speed (Max 20%)",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                "Charge"
            ],
            "dependencies": [],
            "blockers": [
                "Tougher Skin"
            ],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
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
                    "scaling": [
                        2,
                        2
                    ],
                    "max": 20
                },
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damRaw",
                            "value": 5
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Tougher Skin",
            "desc": "Harden your skin and become permanently +5% more resistant. For every 1% or 1 Raw Heath Regen you have from items, gain +10 Health (Max 100)",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                "Charge"
            ],
            "dependencies": [],
            "blockers": [
                "Vehement"
            ],
            "cost": 1,
            "display": {
                "row": 6,
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
                            "name": "defMult.Base",
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
                    "scaling": [
                        10,
                        10
                    ],
                    "max": 100
                }
            ]
        },
        {
            "display_name": "Uppercut",
            "desc": "Rocket enemies in the air and deal massive damage",
            "parents": [
                "Vehement",
                "Cheaper Charge"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 2,
                "icon": "node_warrior"
            },
            "properties": {
                "aoe": 3,
                "range": 5.5
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
                            "multipliers": [
                                200,
                                40,
                                40,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "Uppercut": 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Charge",
            "desc": "Reduce the Mana cost of Charge",
            "base_abil": "Charge",
            "parents": [
                "Uppercut",
                "War Scream"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
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
            "parents": [
                "Tougher Skin",
                "Cheaper Charge"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 6,
                "icon": "node_warrior"
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
                            "multipliers": [
                                50,
                                0,
                                0,
                                0,
                                50,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "War Scream": 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Earth Mastery",
            "base_abil": 998,
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
            "base_abil": 998,
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
            "base_abil": 998,
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
            "base_abil": 998,
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
            "base_abil": 998,
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
                "range": 6,
                "hits": 2
            },
            "effects": [
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
            "desc": "Uppercut will deal a footsweep attack at a longer and wider angle.",
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
                "range": 3
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
                    "type": "replace_spell",
                    "name": "Flaming Uppercut",
                    "base_spell": 8,
                    "display": "DPS",
                    "parts": [
                        {
                            "name": "Damage Tick",
                            "multipliers": [0, 0, 0, 0, 50, 0]
                        },
                        {
                            "name": "DPS",
                            "hits": {
                                "Damage Tick": 1.66666666666666666666666666666
                            }
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "Damage Tick": 5
                            }
                        }
                    ]
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
            "desc": "When casting War Scream, create a holy shield around you that reduces all incoming damage by 70% for 3 hits. (20s cooldown)",
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
                "duration": 0.5,
                "charges": 3
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Mantle",
                    "bonuses": [{ "type": "stat", "name": "defMult.Mantle", "value": 70}]
                }
            ]
        },

        {
            "display_name": "Bak'al's Grasp",
            "desc": "After casting War Scream, become Corrupted (15s Cooldown). You cannot heal while in that state. While Corrupted, every 2% of Health you lose will add +4 Raw Damage to your attacks (Max 120)",
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
                    "slider_max": 100,
                    "slider_step": 1,
                    "output": {
                        "type": "stat",
                        "name": "damRaw" 
                    },
                    "max": 120,
                    "scaling": [2]
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
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 0,
                "target_part": "Melee",
                "multipliers": [5, 0, 0, 0, 0, 0]
            }]
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
            "desc": "Mobs damaged by War Scream will target only you for at least 5s. Reduce the Mana cost of War Scream",
            "base_abil": "War Scream",
            "parents": ["Aerodynamics", "Mantle of the Bovemists"], 
            "dependencies": [], 
            "blockers": [],
            "cost": 2, 
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
            "desc": "While Corrupted, every 1% of Health you lose will increase your damage by +2.2% (Max 220%)",
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
                    "slider_name": "Corrupted",
                    "slider": true,
                    "output": {
                        "type": "stat",
                        "name": "damMult.Enraged" 
                    },
                    "scaling": [2.2]
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
            "desc": "War Scream become deafening, increasing its duration and giving damage bonus to players",
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
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "cost": 10
                },
                {
                    "type": "raw_stat",
                    "bonuses": [ {"type": "prop", "abil": "War Scream", "name": "duration", "value": 90} ]
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
                    "scaling": [0.02],
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
            "desc": "After leaving Corrupted, gain 5% of the health lost back for each enemy killed while Corrupted",
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
                    "scaling": [0.5]
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
                "range": 1
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
                            "name": "defMult.Base",
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
                "duration": 8
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Armor Breaker",
                    "bonuses": [ {"type": "stat", "name": "damMult.ArmorBreaker", "value": 30} ]
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
                    "base_spell": 7,
                    "display": "Damage Tick",
                    "parts": [
                        {
                            "name": "Damage Tick",
                            "multipliers": [20, 0, 10, 0, 0, 0]
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
            "base_abil": "Bak'al's Grasp",
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
            "desc": "While Corrupted, if your effective attack speed is Slow or lower, hitting an enemy with your Main Attack will add +4% to your Corrupted bar",
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
            "properties": {
                "cooldown": 2
            },
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
            "desc": "Every time you hit an enemy, briefly increase your elemental damage dealt to them by +3 (Additive, Max +80). This bonus decays -5 every second",
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
                    "slider_max": 27,
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
                    "base_spell": 1,
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
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Brink",
                    "bonuses": [{ "type": "stat", "name": "defMult.Brink", "value": 40}]
                }
            ]
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
        },
        {
            "display_name": "Haemorrhage",
            "desc": "Reduce Blood Pact's health cost. (0.3% health per mana)",
            "archetype": "Fallen",
            "archetype_req": 0,
            "base_abil": "Blood Pact",
            "parents": [
                "Blood Pact"
            ],
            "dependencies": [
                "Blood Pact"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 35,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Blood Pact",
                            "name": "health_cost",
                            "value": -0.3
                        }
                    ]
                }
            ]
        }
    ],
    "Mage": [
        {
            "display_name": "Meteor",
            "desc": "Summon a slow but powerful meteor from the sky, dealing massive damage in a large area",
            "parents": [],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 0,
                "col": 4,
                "icon": "node_mage"
            },
            "properties": {
                "aoe": 5,
                "range": 18
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Meteor",
                    "cost": 55,
                    "base_spell": 3,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Meteor Damage",
                            "multipliers": [
                                300,
                                100,
                                0,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "Meteor Damage": 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Teleport",
            "desc": "Instantly teleport in the direction you're facing",
            "parents": [
                "Shooting Star"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 4,
                "icon": "node_mage"
            },
            "properties": {
                "range": 12
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Teleport",
                    "cost": 25,
                    "base_spell": 2,
                    "display": "",
                    "parts": []
                }
            ]
        },
        {
            "display_name": "Heal",
            "desc": "Heal yourself and nearby allies in a large area around you. (When healing an ally, you cannot heal more than 30% of their max health)",
            "parents": [
                "Wand Proficiency II",
                "Cheaper Teleport"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 2,
                "icon": "node_mage"
            },
            "properties": {
                "aoe": 5
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Heal",
                    "cost": 35,
                    "base_spell": 1,
                    "display": "Heal",
                    "parts": [
                        {
                            "name": "Heal",
                            "power": 0.15
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Ice Snake",
            "desc": "Summon a fast-moving ice snake that reduces your enemies' speed and damage them.",
            "parents": [
                "Wisdom",
                "Cheaper Teleport"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 6,
                "icon": "node_mage"
            },
            "properties": {
                "range": 18,
                "effects": 40,
                "duration": 3
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Ice Snake",
                    "cost": 35,
                    "base_spell": 4,
                    "display": "Ice Snake Damage",
                    "parts": [
                        {
                            "name": "Ice Snake Damage",
                            "multipliers": [
                                70,
                                0,
                                0,
                                30,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Shooting Star",
            "desc": "Drastically increase the speed of your Meteor ability.",
            "base_abil": 3,
            "parents": [
                "Wand Proficiency I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 4,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Wand Proficiency I",
            "desc": "Improve your Main Attack's damage and range when using a wand.",
            "base_abil": 999,
            "parents": [
                "Meteor"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
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
                            "name": "mdPct",
                            "value": 5
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Meteor",
            "desc": "Reduce the Mana cost of Meteor.",
            "base_abil": "Meteor",
            "parents": [
                "Wand Proficiency I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 6,
                "icon": "node_0"
            },
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
            "display_name": "Earth Mastery",
            "base_abil": 998,
            "desc": "Increases your base damage from all Earth attacks",
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Ice Snake"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "base_abil": 998,
            "desc": "Increases your base damage from all Thunder attacks",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "parents": [
                "Heal",
                "Cheaper Teleport"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "base_abil": 998,
            "desc": "Increases your base damage from all Water attacks",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "parents": [
                "Cheaper Teleport",
                "Thunder Mastery"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 11,
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
            "base_abil": 998,
            "desc": "Increases base damage from all Air attacks",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "parents": [
                "Heal"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "base_abil": 998,
            "desc": "Increases base damage from all Fire attacks",
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Ice Snake"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "display_name": "Cheaper Teleport",
            "desc": "Reduce the Mana cost of Teleport.",
            "base_abil": "Teleport",
            "parents": [
                "Heal",
                "Ice Snake"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Wisdom",
            "desc": "For every 2% or 2 Raw Spell Damage you have from items, gain +1/5s mana regen (Max 5/5s)",
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Teleport"
            ],
            "dependencies": [],
            "blockers": [
                "Wand Proficiency II"
            ],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "sdPct"
                        },
                        {
                            "type": "stat",
                            "name": "sdRaw"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "mr"
                    },
                    "scaling": [
                        0.5,
                        0.5
                    ],
                    "max": 5
                }
            ]
        },
        {
            "display_name": "Wand Proficiency II",
            "desc": "Improve your Main Attack's damage and range when using a wand.",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "base_abil": 999,
            "parents": [
                "Teleport"
            ],
            "dependencies": [],
            "blockers": [
                "Wisdom"
            ],
            "cost": 1,
            "display": {
                "row": 6,
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
                            "name": "mdPct",
                            "value": 5
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Wind Slash",
            "desc": "When using Teleport, slash through the air and deal damage to enemies you pierce.",
            "archetype": "Riftwalker",
            "base_abil": "Teleport",
            "parents": [
                "Air Mastery",
                "Thunderstorm"
            ],
            "dependencies": [
                "Teleport"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 12,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Wind Slash",
                    "base_spell": 2,
                    "multipliers": [
                        50,
                        0,
                        0,
                        0,
                        0,
                        50
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "target_part": "Total Damage",
                    "base_spell": 2,
                    "display": "Total Damage",
                    "hits": {
                        "Wind Slash": 1
                    }
                }
            ]
        },
        {
            "display_name": "Thunderstorm",
            "desc": "After casting Meteor, summon 4 lightning strikes and deal additional damage",
            "base_abil": "Meteor",
            "parents": [
                "Wind Slash",
                "Thunder Mastery"
            ],
            "dependencies": [
                "Meteor"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 12,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Lightning Damage",
                    "base_spell": 3,
                    "multipliers": [
                        25,
                        0,
                        10,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "target_part": "Total Damage",
                    "base_spell": 3,
                    "hits": {
                        "Lightning Damage": 4
                    }
                }
            ]
        },
        {
            "display_name": "Stronger Meteor",
            "desc": "Increase the damage of Meteor.",
            "base_abil": "Meteor",
            "archetype": "Arcanist",
            "archetype_req": 2,
            "parents": [
                "Burning Sigil"
            ],
            "dependencies": [
                "Meteor"
            ],
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
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Meteor Damage",
                    "behavior": "modify",
                    "multipliers": [
                        30,
                        90,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Burning Sigil",
            "desc": "Meteor will leave a sigil that damages enemies every 0.4s.",
            "base_abil": "Meteor",
            "parents": [
                "Fire Mastery",
                "Earth Mastery"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 12,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 7,
                "duration": 8
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Burning Sigil",
                    "base_spell": 6,
                    "display": "DPS",
                    "parts": [
                        {
                            "name": "Tick Damage",
                            "multipliers": [
                                15,
                                0,
                                0,
                                0,
                                25,
                                0
                            ]
                        },
                        {
                            "name": "DPS",
                            "hits": {
                                "Tick Damage": 2.5
                            }
                        },
                        {
                            "name": "Total Burn Damage",
                            "hits": {
                                "Tick Damage": 20
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Sunshower",
            "desc": "Heal emit a strong light, damaging nearby enemies.",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "base_abil": "Heal",
            "parents": [
                "Water Mastery"
            ],
            "dependencies": [
                "Heal"
            ],
            "blockers": [
                "Arcane Transfer"
            ],
            "cost": 2,
            "display": {
                "row": 13,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Sunshower Damage",
                    "multipliers": [
                        70,
                        0,
                        0,
                        30,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Windsweeper",
            "desc": "Your Main Attack will add +1 Winded to enemies you hit. (Max 5, 0.5s cooldown) Ice Snake will deal additional damage to enemies for every Winded they have",
            "archetype": "Riftwalker",
            "archetype_req": 3,
            "parents": [
                "Wind Slash",
                "Thunderstorm"
            ],
            "dependencies": [
                "Ice Snake"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "max": 5
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "output": {
                        "type": "stat",
                        "name": "nConvBase:4.Ice Snake Damage"
                    },
                    "scaling": [
                        20
                    ],
                    "slider_step": 1,
                    "slider_max": 5
                },
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "output": {
                        "type": "stat",
                        "name": "wConvBase:4.Ice Snake Damage"
                    },
                    "scaling": [
                        10
                    ]
                }
            ]
        },
        {
            "display_name": "Ophanim",
            "desc": "When casting Meteor, instead summon 2 orbs of light with 200 Health that will attack when you use your Main Attack. When they damage an enemy, they lose 20% of their Health. They can be healed back.",
            "archetype": "Light Bender",
            "archetype_req": 2,
            "parents": [
                "Sunshower"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {
                "health": 200
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Ophanim",
                    "base_spell": 3,
                    "display": "Per Melee (max)",
                    "parts": [
                        {
                            "name": "Per Orb",
                            "multipliers": [
                                50,
                                0,
                                30,
                                20,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "Per Melee (max)",
                            "hits": {
                                "Per Orb": 2
                            }
                        }
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": 30
                }
            ]
        },
        {
            "display_name": "Arcane Transfer",
            "desc": "Meteor and Ice Snake will add +5 Mana to a Mana Bank for every aggressive enemy you hit. Heal will now transfer the content of your Mana Bank into usable Mana instead of healing.",
            "archetype": "Arcanist",
            "archetype_req": 2,
            "parents": [
                "Burning Sigil"
            ],
            "dependencies": [],
            "blockers": [
                "Sunshower",
                "Larger Heal",
                "Orphion's Pulse"
            ],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {
                "bank": 90
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Arcane Transfer",
                    "base_spell": 1,
                    "parts": [],
                    "display": ""
                }
            ]
        },
        {
            "display_name": "Cheaper Heal",
            "desc": "Reduce the Mana cost of Heal.",
            "base_abil": "Heal",
            "parents": [
                "Windsweeper",
                "Purification"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 17,
                "col": 1,
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
            "display_name": "Purification",
            "desc": "Heal and Arcane Transfer will purify you of all negative effects and fire. (3s Cooldown)",
            "base_abil": "Heal",
            "parents": [
                "Ophanim",
                "Cheaper Heal",
                "Sentient Snake"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Sentient Snake",
            "desc": "Ice Snake will follow the direction you're facing, allowing you to control it.",
            "base_abil": "Ice Snake",
            "parents": [
                "Arcane Transfer",
                "Purification"
            ],
            "dependencies": [
                "Ice Snake"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Eye Piercer",
            "desc": "Teleport will blind enemies, confusing them for a short amount of time.",
            "base_abil": "Teleport",
            "parents": [
                "Cheaper Heal"
            ],
            "dependencies": [
                "Teleport"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 18,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Breathless",
            "desc": "Meteor will deal additional damage to enemies for every Winded they have.",
            "base_abil": "Windsweeper",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "parents": [
                "Cheaper Heal",
                "Purification"
            ],
            "dependencies": [
                "Windsweeper"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 18,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                    {
                        "type": "stat_scaling",
                        "slider": true,
                        "slider_name": "Winded",
                        "output": [
                            {
                                "type": "stat",
                                "name": "nConvBase:3.Meteor Damage"
                            },
                            {
                                "type": "stat",
                                "name": "nConvBase:3.Per Orb"
                            },
                            {
                                "type": "stat",
                                "name": "nConvBase:3.Lightning Damage"
                            }
                        ],
                        "scaling": [10]
                    },
                    {
                        "type": "stat_scaling",
                        "slider": true,
                        "slider_name": "Winded",
                        "output": [
                            {
                                "type": "stat",
                                "name": "eConvBase:3.Meteor Damage"
                            },
                            {
                                "type": "stat",
                                "name": "eConvBase:3.Per Orb"
                            },
                            {
                                "type": "stat",
                                "name": "eConvBase:3.Lightning Damage"
                            }
                        ],
                    "scaling": [8]
                }
            ]
        },
        {
            "display_name": "Larger Heal",
            "desc": "Increase your Heal's range.",
            "base_abil": 1,
            "archetype": "Light Bender",
            "archetype_req": 0,
            "parents": [
                "Purification",
                "Sentient Snake"
            ],
            "dependencies": [
                "Heal"
            ],
            "blockers": [
                "Arcane Transfer"
            ],
            "cost": 1,
            "display": {
                "row": 18,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Heal",
                            "name": "aoe",
                            "value": 2
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Larger Mana Bank",
            "desc": "Increase your maximum Mana Bank by +30.",
            "base_abil": 1,
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Sentient Snake"
            ],
            "dependencies": [
                "Arcane Transfer"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 18,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Arcane Transfer",
                            "name": "bank",
                            "value": 30
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Ice Snake",
            "desc": "Reduce the Mana cost of Ice Snake.",
            "base_abil": "Ice Snake",
            "parents": [
                "Eye Piercer",
                "Fortitude"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 20,
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
            "display_name": "Cheaper Teleport II",
            "desc": "Reduce the Mana cost of Teleport.",
            "base_abil": "Teleport",
            "parents": [
                "Fortitude",
                "Purification"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 20,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Fortitude",
            "desc": "After healing 120% of your max health within 10s, apply a damage bonus to each player you've healed. (15s Cooldown)",
            "base_abil": "Heal",
            "archetype": "Light Bender",
            "archetype_req": 2,
            "parents": [
                "Cheaper Ice Snake",
                "Cheaper Teleport II"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {
                "duration": 5
            },
            "effects": []
        },
        {
            "display_name": "Pyrokinesis",
            "desc": "When your Mana Bank reaches 30, your Main Attack will stop and explode when it hits an enemy. (Damage is dealt as Main Attack Damage)",
            "base_abil": 4,
            "archetype": "Arcanist",
            "archetype_req": 4,
            "parents": [
                "Sentient Snake"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 7,
                "icon": "node_2"
            },
            "properties": {},
            "__TODO": "replace_spell pyrokinesis damage",
            "effects": []
        },
        {
            "display_name": "Seance",
            "desc": "For every 5/3s Lifesteal you have from items, gain 1% Spell Damage (Max 50%)",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                "Pyrokinesis",
                "Snake Nest"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "ls"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "sdPct"
                    },
                    "scaling": [
                        0.2
                    ],
                    "max": 50
                }
            ]
        },
        {
            "display_name": "Blink",
            "desc": "Teleport will trigger 2 times in quick successions",
            "base_abil": "Teleport",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "parents": [
                "Fortitude",
                "Cheaper Ice Snake"
            ],
            "dependencies": [
                "Teleport"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Teleport",
                            "name": "range",
                            "value": -4
                        }
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "behavior": "modify",
                    "target_part": "Total Damage",
                    "base_spell": 2,
                    "hits": {
                        "Wind Slash": 1,
                        "Explosion Damage": 1
                    }
                }
            ]
        },
        {
            "display_name": "Snake Nest",
            "desc": "Ice Snake will summon 3 snakes.",
            "base_abil": "Ice Snake",
            "parents": [
                "Seance",
                "Cheaper Teleport II",
                "Healthier Ophanim I"
            ],
            "dependencies": [
                "Ice Snake"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Arcane Restoration",
            "desc": "Pyrokinesis will add +1 Mana every 1s to your Mana Bank when hitting an aggressive enemy.",
            "base_abil": 999,
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Seance",
                "Snake Nest"
            ],
            "dependencies": [
                "Pyrokinesis"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {
                "duration": 4
            },
            "effects": []
        },
        {
            "display_name": "Fluid Healing",
            "desc": "For every 1% Water Damage Bonus you have, buff Heal's healing power by +0.3%.",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "base_abil": "Heal",
            "parents": [
                "Healthier Ophanim I",
                "Transonic Warp"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "round": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "wDamPct"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "healPct"
                    },
                    "scaling": [
                        0.3
                    ]
                }
            ]
        },
        {
            "display_name": "Transonic Warp",
            "desc": "Teleport will deal additional damage to enemies for every Winded they have.",
            "base_abil": "Windsweeper",
            "archetype": "Riftwalker",
            "archetype_req": 5,
            "parents": [
                "Cheaper Ice Snake",
                "Fluid Healing"
            ],
            "dependencies": [
                "Ice Snake",
                "Windsweeper"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 0,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "output": [
                        {
                            "type": "stat",
                            "name": "nConvBase:2.Wind Slash"
                        },
                        {
                            "type": "stat",
                            "name": "nConvBase:2.Explosion Damage"
                        }
                    ],
                    "scaling": [20]
                },
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "output": [
                        {
                            "type": "stat",
                            "name": "tConvBase:2.Wind Slash"
                        },
                        {
                            "type": "stat",
                            "name": "tConvBase:2.Explosion Damage"
                        }
                    ],
                    "scaling": [5]
                },
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "output": [
                        {
                            "type": "stat",
                            "name": "aConvBase:2.Wind Slash"
                        },
                        {
                            "type": "stat",
                            "name": "aConvBase:2.Explosion Damage"
                        }
                    ],
                    "scaling": [
                        5
                    ]
                }
            ]
        },
        {
            "display_name": "Healthier Ophanim I",
            "desc": "Increase the health of your orbs from Ophanim by +800 and reduce the damage they take when hitting an enemy by -5%.",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "base_abil": "Ophanim",
            "parents": [
                "Fortitude",
                "Cheaper Teleport II"
            ],
            "dependencies": [
                "Ophanim"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 3,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Orphion's Pulse",
            "desc": "Heal will trigger 2 more times, increasing the overall healing.",
            "archetype": "Light Bender",
            "archetype_req": 5,
            "base_abil": "Heal",
            "parents": [
                "Healthier Ophanim I",
                "Snake Nest"
            ],
            "dependencies": [
                "Heal"
            ],
            "blockers": [
                "Arcane Transfer"
            ],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 5
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Second and Third Pulses",
                    "power": 0.20
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "display": "Total Heal",
                    "target_part": "Total Heal",
                    "hits": {
                        "Heal": 1,
                        "Second and Third Pulses": 2
                    }
                }
            ]
        },
        {
            "display_name": "Diffusion",
            "desc": "If you kill an enemy with Winded on them, the leftover Winded will spread to nearby enemies.",
            "archetype": "Riftwalker",
            "archetype_req": 6,
            "base_abil": "Windsweeper",
            "parents": [
                "Transonic Warp",
                "Fluid Healing"
            ],
            "dependencies": [
                "Windsweeper"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "aoe": 5
            },
            "effects": []
        },
        {
            "display_name": "Lightweaver",
            "desc": "After healing 50% of your max health within 10s, summon a rotating orb that damages all enemies it touches for 20s. (Max 3 Orbs)",
            "archetype": "Light Bender",
            "archetype_req": 7,
            "parents": [
                "Orphion's Pulse"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {
                "range": 7
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Lightweaver",
                    "base_spell": 5,
                    "display": "Orb Damage",
                    "parts": [
                        {
                            "name": "Single Orb",
                            "type": "damage",
                            "multipliers": [
                                70,
                                0,
                                0,
                                0,
                                30,
                                0
                            ]
                        },
                        {
                            "name": "Orb Damage",
                            "type": "total",
                            "hits": {
                                "Single Orb": 3
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Arcane Speed",
            "desc": "After casting Heal or Arcane Transfer, gain +80% speed for 3s. (8s Cooldown)",
            "base_abil": "Heal",
            "parents": [
                "Lightweaver",
                "Larger Mana Bank II"
            ],
            "dependencies": [
                "Heal"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Larger Mana Bank II",
            "desc": "Increase your maximum Mana Bank by +30.",
            "base_abil": 1,
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Seance",
                "Arcane Speed"
            ],
            "dependencies": [
                "Arcane Transfer"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Psychokinesis",
            "desc": "Meteor will launch directly from you as a slow projectile.",
            "base_abil": 3,
            "archetype": "Arcanist",
            "archetype_req": 5,
            "parents": [
                "Larger Mana Bank II",
                "Arcane Speed"
            ],
            "dependencies": [
                "Meteor"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {"range": 20},
            "effects": []
        },
        {
            "display_name": "More Winded",
            "desc": "Increase your maximum Winded by +5.",
            "base_abil": "Windsweeper",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "parents": [
                "Diffusion"
            ],
            "dependencies": [
                "Windsweeper"
            ],
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
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Windsweeper",
                            "name": "max",
                            "value": 5
                        }
                    ]
                },
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "slider_max": 5
                }
            ]
        },
        {
            "display_name": "Cheaper Ice Snake II",
            "desc": "Reduce the Mana cost of Ice Snake.",
            "base_abil": "Ice Snake",
            "parents": [
                "Diffusion",
                "Explosive Entrance"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 27,
                "col": 1,
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
            "display_name": "Cheaper Meteor II",
            "desc": "Reduce the Mana cost of Meteor.",
            "base_abil": "Meteor",
            "parents": [
                "Explosive Entrance",
                "Lightweaver",
                "Arcane Speed"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 27,
                "col": 5,
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
            "display_name": "Chaos Explosion",
            "desc": "When your Mana Bank reaches 120, casting Arcane Transfer will rapidly unleash the last 3 spells you've cast in order.",
            "base_abil": "Arcane Transfer",
            "archetype": "Arcanist",
            "archetype_req": 8,
            "parents": [
                "Larger Mana Bank II"
            ],
            "dependencies": [
                "Arcane Transfer"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 27,
                "col": 8,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Arcane Power",
            "desc": "Meteor and Ice Snake will add +2 Mana to your Mana Bank for each aggressive mob you hit.",
            "base_abil": "Arcane Transfer",
            "archetype": "Arcanist",
            "archetype_req": 0,
            "parents": [
                "Arctic Snake"
            ],
            "dependencies": [
                "Arcane Transfer"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 29,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Explosive Entrance",
            "desc": "Deal Damage in an area on the location you Teleport to.",
            "base_abil": "Teleport",
            "parents": [
                "Cheaper Ice Snake II",
                "Cheaper Meteor II"
            ],
            "dependencies": [
                "Teleport"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 27,
                "col": 3,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 3
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Explosion Damage",
                    "base_spell": 2,
                    "multipliers": [
                        50,
                        0,
                        0,
                        0,
                        30,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "behavior": "modify",
                    "target_part": "Total Damage",
                    "base_spell": 2,
                    "hits": {
                        "Explosion Damage": 1
                    }
                }
            ]
        },
        {
            "display_name": "Gust",
            "desc": "Ice Snake will add +1 Winded to enemies and deal more damage.",
            "base_abil": "Ice Snake",
            "archetype": "Riftwalker",
            "archetype_req": 7,
            "parents": [
                "Cheaper Ice Snake II",
                "Explosive Entrance"
            ],
            "dependencies": [
                "Ice Snake"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Ice Snake Damage",
                    "base_spell": 4,
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        20
                    ]
                }
            ]
        },
        {
            "display_name": "Time Dilation",
            "desc": "When sprinting, create an area that increases the speed of all allies the longer they run in it. (Step out or stop running to cancel)",
            "archetype": "Riftwalker",
            "archetype_req": 7,
            "parents": [
                "Cheaper Ice Snake II"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 0,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Better Ophanim",
            "desc": "Increase your maximum orbs from Ophanim by +1.",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "base_abil": "Ophanim",
            "parents": [
                "Explosive Entrance",
                "Cheaper Meteor II"
            ],
            "dependencies": [
                "Ophanim"
            ],
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
                    "base_spell": 3,
                    "target_part": "Per Melee (max)",
                    "hits": {
                        "Per Orb": 1
                    }
                }
            ]
        },
        {
            "display_name": "Arctic Snake",
            "desc": "Ice Snake will freeze enemies completely for 2s.",
            "base_abil": "Ice Snake",
            "parents": [
                "Chaos Explosion"
            ],
            "dependencies": [
                "Ice Snake"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Devitalize",
            "desc": "Enemies will deal -2% damage for every Winded they have.",
            "base_abil": "Windsweeper",
            "archetype": "Riftwalker",
            "archetype_req": 5,
            "parents": [
                "More Winded II",
                "Dynamic Faith"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "More Winded II",
            "desc": "Increase your maximum Winded by +5.",
            "base_abil": "Windsweeper",
            "archetype": "Riftwalker",
            "archetype_req": 0,
            "parents": [
                "Time Dilation",
                "Dynamic Faith"
            ],
            "dependencies": [
                "Windsweeper"
            ],
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
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Windsweeper",
                            "name": "max",
                            "value": 5
                        }
                    ]
                },
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Winded",
                    "slider_max": 5
                }
            ]
        },
        {
            "display_name": "Dynamic Faith",
            "desc": "For every 2% Sprint you have from items, gain +1% Thunder Damage (Max 100%)",
            "parents": [
                "More Winded II",
                "Healthier Ophanim II"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "sprint"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "tDamPct"
                    },
                    "scaling": [
                        0.5
                    ],
                    "max": 100
                }
            ]
        },
        {
            "display_name": "Divination",
            "desc": "Increase your maximum orbs from Ophanim by +3 and reduce their damage.",
            "base_abil": "Ophanim",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "parents": [
                "Dynamic Faith",
                "Healthier Ophanim II"
            ],
            "dependencies": [
                "Ophanim"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 3,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Per Orb", 
                    "multipliers": [-30, 0, -10, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Per Melee (max)",
                    "hits": {
                        "Per Orb": 3
                    }
                }
            ]
        },
        {
            "display_name": "Healthier Ophanim II",
            "desc": "Increase the health of your orbs from Ophanim by +3000.",
            "base_abil": "Ophanim",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "parents": [
                "Better Ophanim",
                "Dynamic Faith"
            ],
            "dependencies": [
                "Healthier Ophanim I"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Sunflare",
            "desc": "After healing 300% of your max health within 10s, your next Heal will make every nearby ally temporarily immune. Cooldown: 20s",
            "archetype": "Light Bender",
            "archetype_req": 12,
            "base_abil": "Heal",
            "parents": [
                "Healthier Ophanim II"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 5,
                "icon": "node_3"
            },
            "properties": {
                "aoe": 12,
                "duration": 5
            },
            "effects": []
        },
        {
            "display_name": "Larger Mana Bank III",
            "desc": "Increase your maximum Mana Bank by +30.",
            "archetype": "Arcanist",
            "archetype_req": 0,
            "base_abil": "Arcane Transfer",
            "parents": [
                "Arctic Snake"
            ],
            "dependencies": [
                "Arcane Transfer"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Arcane Overflow",
            "desc": "Arcane Transfer will allow you to overflow your mana over its maximum limits.",
            "archetype": "Arcanist",
            "archetype_req": 12,
            "base_abil": "Arcane Transfer",
            "parents": [
                "Larger Mana Bank III"
            ],
            "dependencies": [
                "Arcane Transfer"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Memory Recollection",
            "desc": "Chaos Explosion will cast +2 spells.",
            "archetype": "Arcanist",
            "archetype_req": 0,
            "base_abil": "Arcane Transfer",
            "parents": [
                "Arcane Overflow"
            ],
            "dependencies": [
                "Chaos Explosion"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Manastorm",
            "desc": "If you have more than 100 Mana, casting a spell will give you +10 mana over 5s.",
            "archetype": "Arcanist",
            "archetype_req": 1,
            "parents": [
                "Cheaper Heal II",
                "Arcane Overflow",
                "Sunflare"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Better Lightweaver",
            "desc": "Increase your Max Orbs by +2.",
            "archetype": "Light Bender",
            "archetype_req": 0,
            "base_abil": "Lightweaver",
            "parents": [
                "Cheaper Heal II",
                "Manastorm"
            ],
            "dependencies": [
                "Lightweaver"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 35,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Orb Damage",
                    "base_spell": 5,
                    "hits": {
                        "Single Orb": 2
                    }
                }
            ]
        },
        {
            "display_name": "Timelock",
            "desc": "Holding shift and casting Heal will absorb all Winded on nearby enemies and make you Timelocked. While Timelocked, your mana will not be depleted and you become immovable from outside forces. Enemies will recieve Winded damage from all absorbed stacks. (Max 30)",
            "archetype": "Riftwalker",
            "archetype_req": 12,
            "parents": [
                "More Winded II"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 0,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Heal II",
            "desc": "Reduce the Mana cost of Heal.",
            "base_abil": "Heal",
            "parents": [
                "Timelock",
                "Manastorm"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 2,
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
        }
    ],
    "Assassin": [
        {
            "display_name": "Spin Attack",
            "desc": "Slash rapidly around you, damaging enemies in a large area.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 0,
                "col": 4,
                "icon": "node_assassin"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Spin Attack",
                    "cost": 45,
                    "base_spell": 1,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "use_atkspd": true,
                    "display": "Spin Attack",
                    "parts": [
                        {
                            "name": "Spin Attack",
                            "type": "damage",
                            "multipliers": [
                                120,
                                0,
                                30,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Dagger Proficiency I",
            "desc": "Increase your speed by +5% and improve your Main Attack's damage when using a dagger.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                "Spin Attack"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
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
                            "name": "spd",
                            "value": 5
                        }
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Melee",
                    "multipliers": [ 5, 0, 0, 0, 0, 0 ]
                }
            ]
        },
        {
            "display_name": "Cheaper Spin Attack",
            "desc": "Reduce the Mana cost of Spin Attack.",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Spin Attack",
            "parents": [
                "Dagger Proficiency I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -10
                }
            ]
        },
        {
            "display_name": "Double Spin",
            "desc": "Spin Attack will activate a second time with a larger area of effect.",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Spin Attack",
            "parents": [
                "Dagger Proficiency I"
            ],
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
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "hits": {
                        "Spin Attack": 2
                    },
                    "display": "Total Damage"
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Spin Attack",
                    "behavior": "modify",
                    "multipliers": [-40, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            "display_name": "Poisoned Blade",
            "desc": "For every 2% or 2 Raw Main Attack Damage you have from items, gain +5/3s Poison Damage (Max 50/3s). Your Main Attack gains additional range (+1 Block).",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "parents": [
                "Dash"
            ],
            "dependencies": [],
            "blockers": [
                "Double Slice"
            ],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
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
                    "output": [
                        {
                            "type": "stat",
                            "name": "poison"
                        }
                    ],
                    "scaling": [
                        2.5,
                        2.5
                    ],
                    "max": 50
                }
            ]
        },
        {
            "display_name": "Dash",
            "desc": "Dash in the direction you're facing.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                "Double Spin"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 4,
                "icon": "node_assassin"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Dash",
                    "cost": 20,
                    "base_spell": 2,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "None",
                            "type": "damage",
                            "multipliers": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Double Slice",
            "desc": "Your Main Attack will attack twice, but deal -40% damage per hit.",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": 999,
            "parents": [
                "Dash"
            ],
            "dependencies": [],
            "blockers": [
                "Poisoned Blade"
            ],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Melee",
                    "multipliers": [
                        -40,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "display": "Total Damage",
                    "target_part": "Total Damage",
                    "hits": {"Melee": 2}
                }
            ]
        },
        {
            "display_name": "Smoke Bomb",
            "desc": "Throw a bomb that slowly emits smoke, damaging all enemies in it every 0.5s.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                "Poisoned Blade",
                "Cheaper Dash"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 2,
                "icon": "node_assassin"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Smoke Bomb",
                    "cost": 40,
                    "base_spell": 4,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Per Tick",
                            "type": "damage",
                            "multipliers": [
                                25,
                                5,
                                0,
                                0,
                                0,
                                5
                            ]
                        },
                        {
                            "name": "Per Bomb",
                            "type": "total",
                            "hits": {
                                "Per Tick": 10
                            }
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Per Bomb": 1
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Dash",
            "desc": "Reduce the Mana cost of Dash",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Smoke Bomb",
                "Multihit"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Multihit",
            "desc": "Unleash a rapid flurry of 8 hits to enemies facing you, dealing overwhelming damage",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                "Double Slice",
                "Cheaper Dash"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 6,
                "icon": "node_assassin"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Multihit",
                    "cost": 45,
                    "base_spell": 3,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Per Hit",
                            "multipliers": [ 30, 0, 0, 10, 0, 0 ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Per Hit": 8
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Earth Mastery",
            "desc": "Increases base damage from all Earth attacks",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "base_abil": 998,
            "parents": [
                "Smoke Bomb",
                "Thunder Mastery"
            ],
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
            "desc": "Increases base damage from all Thunder attacks",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "base_abil": 998,
            "parents": [
                "Earth Mastery",
                "Smoke Bomb"
            ],
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
            "display_name": "Fire Mastery",
            "desc": "Increases base damage from all Fire attacks",
            "archetype": "Trickster",
            "archetype_req": 0,
            "base_abil": 998,
            "parents": [
                "Cheaper Dash",
                "Water Mastery"
            ],
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
            "display_name": "Water Mastery",
            "desc": "Increases base damage from all Water attacks",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": 998,
            "parents": [
                "Cheaper Dash",
                "Multihit",
                "Air Mastery"
            ],
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
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": 998,
            "parents": [
                "Water Mastery",
                "Multihit"
            ],
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
            "display_name": "Backstab",
            "desc": "Multihit will deal a single devastating hit. If you strike the enemy from behind, deal double damage",
            "archetype": "Shadestepper",
            "archetype_req": 2,
            "base_abil": "Multihit",
            "parents": [
                "Earth Mastery",
                "Thunder Mastery"
            ],
            "dependencies": [
                "Multihit"
            ],
            "blockers": [
                "Stronger Multihit",
                "Fatality"
            ],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Backstab",
                    "base_spell": 3,
                    "display": "Backstab Damage",
                    "parts": [
                        {
                            "name": "Backstab Damage",
                            "type": "damage",
                            "multipliers": [
                                200, 50, 0, 0, 0, 0
                            ]
                        }
                    ]
                },
                {
                    "type": "raw_stat",
                    "toggle": "Activate Backstab",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Backstab:3.Backstab Damage",
                            "value": 100
                        }
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Fatality",
            "desc": "Multihit will deal an additional final slash",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Multihit",
            "parents": [
                "Water Mastery",
                "Air Mastery"
            ],
            "dependencies": [
                "Multihit"
            ],
            "blockers": ["Backstab"],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Fatality",
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        0,
                        50
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "hits": {
                        "Fatality": 1
                    }
                }
            ]
        },
        {
            "display_name": "Vanish",
            "desc": "Dash will vanish you into the shadows and make you invisible to enemies (5s Cooldown). You cannot heal or gain mana while in that state (Attack or get hit to cancel)",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Backstab",
                "Sticky Bomb"
            ],
            "dependencies": [
                "Dash"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {
                "duration": 5,
                "cooldown": 5
            },
            "effects": []
        },
        {
            "display_name": "Sticky Bomb",
            "desc": "Smoke Bomb will stick to enemies and deal additional damage",
            "archetype": "Trickster",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Vanish",
                "Fire Mastery"
            ],
            "dependencies": [
                "Smoke Bomb"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Per Tick",
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        10,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Righting Reflex",
            "desc": "When you hold shift while airborne, slowly glide and become immune to fall damage (Max 5s)",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "parents": [
                "Fatality"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Surprise Strike",
            "desc": "While using Vanish, your next attack will deal +60% more damage for a single hit only",
            "archetype": "Shadestepper",
            "archetype_req": 3,
            "base_abil": "Dash",
            "parents": [
                "Vanish"
            ],
            "dependencies": [
                "Vanish"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 2,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Surprise Strike",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.SurpriseStrike",
                            "value": 60
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Mirror Image",
            "desc": "After leaving Vanish, summon 3 Clones that will follow you and protect you (20s Cooldown). When hit, gain a chance to take 80% less damage and lose 1 Clone.",
            "archetype": "Trickster",
            "archetype_req": 2,
            "base_abil": "Dash",
            "parents": [
                "Sticky Bomb"
            ],
            "dependencies": [
                "Vanish"
            ],
            "blockers": [
                "Lacerate"
            ],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {
                "clone": 3
            },
            "effects": [

                    {
                        "type": "raw_stat",
                        "toggle": "Activate Clones",
                        "bonuses": [{ "type": "stat", "name": "defMult.Clone", "value": 80}]
                    }
            ]
        },
        {
            "display_name": "Lacerate",
            "desc": "Spin Attack will lunge you forward, deal 3 strikes and lunge you forward again.",
            "archetype": "Acrobat",
            "archetype_req": 2,
            "base_abil": "Spin Attack",
            "parents": [
                "Fatality"
            ],
            "dependencies": [],
            "blockers": [
                "Mirror Image"
            ],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Lacerate",
                    "base_spell": 1,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Per Hit",
                            "type": "damage",
                            "multipliers": [
                                60,
                                0,
                                0,
                                10,
                                0,
                                20
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Per Hit": 3
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Silent Killer",
            "desc": "After killing an enemy, reset Vanish's cooldown",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Surprise Strike"
            ],
            "dependencies": [
                "Vanish"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 1,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Shenanigans",
            "desc": "For every 2% Stealing you have from items, gain +1/3s Mana Steal (Max 8/3s)",
            "archetype": "Trickster",
            "archetype_req": 0,
            "parents": [
                "Mirror Image"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 20,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "eSteal"
                        }
                    ],
                    "output": [
                        {
                            "type": "stat",
                            "name": "ms"
                        }
                    ],
                    "scaling": [
                        0.5
                    ],
                    "max": 8
                }
            ]
        },
        {
            "display_name": "Wall of Smoke",
            "desc": "Smoke Bomb will throw +2 bombs, damaging more often in a larger area",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Lacerate"
            ],
            "dependencies": [
                "Smoke Bomb"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Total Damage",
                    "hits": {
                        "Per Bomb": 2
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Per Tick",
                    "multipliers": [
                        -20,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Better Smoke Bomb",
            "desc": "Increase the range and area of effect of Smoke Bomb",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Silent Killer",
                "Shadow Travel"
            ],
            "dependencies": [
                "Smoke Bomb"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Shadow Travel",
            "desc": "Vanish will increase your speed by +100%",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Better Smoke Bomb",
                "Silent Killer",
                "Cheaper Multihit"
            ],
            "dependencies": [
                "Vanish"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Multihit",
            "desc": "Reduce the Mana cost of Multihit",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Multihit",
            "parents": [
                "Shenanigans",
                "Shadow Travel",
                "Dagger Proficiency II"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 5,
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
            "display_name": "Dagger Proficiency II",
            "desc": "Increase your Main Attack's range and add +5 raw damage to all attacks",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": 999,
            "parents": [
                "Cheaper Multihit",
                "Wall of Smoke"
            ],
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
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damRaw",
                            "value": 5
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Last Laugh",
            "desc": "When losing a Clone, it will cast Spin Attack before dying",
            "archetype": "Trickster",
            "archetype_req": 3,
            "base_abil": "Dash",
            "parents": [
                "Shadow Travel",
                "Cheaper Multihit"
            ],
            "dependencies": [
                "Mirror Image"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Smoke Bomb",
            "desc": "Reduce the Mana cost of Smoke Bomb",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Better Smoke Bomb",
                "Blazing Powder"
            ],
            "dependencies": [
                "Smoke Bomb"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
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
            "display_name": "Blazing Powder",
            "desc": "Spin Attack will blind enemies and deal additional damage",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Spin Attack",
            "parents": [
                "Cheaper Smoke Bomb",
                "Shadow Travel",
                "Cheaper Multihit"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 3,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Per Hit",
                    "behavior": "modify",
                    "multipliers": [0, 0, 0, 0, 20, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Spin Attack",
                    "behavior": "modify",
                    "multipliers": [0, 0, 0, 0, 20, 0]
                }
            ]
        },
        {
            "display_name": "Weightless",
            "desc": "When you hit an enemy while airborne, gain +0.7 Mana (1.25+ blocks off the ground to be airborne)",
            "archetype": "Acrobat",
            "archetype_req": 4,
            "parents": [
                "Cheaper Multihit",
                "Dagger Proficiency II"
            ],
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
            "display_name": "Black Hole",
            "desc": "Smoke Bomb will pull nearby enemies",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Cheaper Smoke Bomb",
                "Blazing Powder"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Sandbagging",
            "desc": "Anytime you get hit for less than 5% of your max hp, reduce your abilities cooldown by -2s. (1s Cooldown)",
            "archetype": "Trickster",
            "archetype_req": 0,
            "parents": [
                "Blazing Powder",
                "Hop"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Hop",
            "desc": "When you double tap jump, leap forward. (2s Cooldown)",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "parents": [
                "Sandbagging",
                "Weightless"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {
                "cooldown": 2
            },
            "effects": []
        },
        {
            "display_name": "Dancing Blade",
            "desc": "Deal damage to mobs you Dash through",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Weightless"
            ],
            "dependencies": [
                "Dash"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Dancing Blade",
                    "multipliers": [
                        80,
                        0,
                        0,
                        0,
                        0,
                        20
                    ],
                    "display": "Dancing Blade"
                }
            ]
        },
        {
            "display_name": "Violent Vortex",
            "desc": "If you deal more damage than 2x of your max health in a single hit, deal 20% of the damage to other nearby enemies",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "parents": [
                "Cheaper Smoke Bomb"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 27,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {
                "range": 8
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Violent Vortex",
                    "base_spell": 5,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Total Damage",
                            "type": "damage",
                            "multipliers": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Delirious Gas",
            "desc": "While inside Smoke Bomb, increase your damage by +40% and gain Lure for 20s",
            "archetype": "Trickster",
            "archetype_req": 4,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Sandbagging"
            ],
            "dependencies": [
                "Smoke Bomb"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 27,
                "col": 3,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Delirious Gas",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.DeliriousGas",
                            "value": 40
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Marked",
            "desc": "Smoke Bomb will add +1 Mark to enemies it hits. (Max 4, 0.4s Cooldown) Marked enemies will take +8% damage for each mark they have.",
            "archetype": "Shadestepper",
            "archetype_req": 5,
            "parents": [
                "Violent Vortex"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Marked",
                    "slider_step": 1,
                    "slider_max": 4,
                    "output": [
                        {
                            "type": "stat",
                            "name": "damMult.Marked"
                        }
                    ],
                    "scaling": [
                        8
                    ]
                }
            ]
        },
        {
            "display_name": "Echo",
            "desc": "Your Clones will mimic your spells and abilities. While they are active, deal -60% damage.",
            "archetype": "Trickster",
            "archetype_req": 6,
            "base_abil": "Dash",
            "parents": [
                "Sandbagging",
                "Shurikens"
            ],
            "dependencies": [
                "Mirror Image"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Clones",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Echo",
                            "value": -60
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Shurikens",
            "desc": "After using Dash, your next Main Attack will throw 3 shurikens",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Echo",
                "Far Reach"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 6,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Shurikens",
                    "base_spell": 6,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Per Shuriken",
                            "type": "damage",
                            "multipliers": [
                                90,
                                0,
                                0,
                                0,
                                10,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Per Shuriken": 3
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Far Reach",
            "desc": "Increase the range of Multihit",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Multihit",
            "parents": [
                "Dancing Blade",
                "Shurikens"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 28,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Stronger Multihit",
            "desc": "Increases Multihit's amount of hits by +3",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Multihit",
            "parents": [
                "Echo",
                "Shurikens"
            ],
            "dependencies": [],
            "blockers": [
                "Backstab"
            ],
            "cost": 1,
            "display": {
                "row": 29,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "hits": {
                        "Per Hit": 3
                    }
                }
            ]
        },
        {
            "display_name": "Psithurism",
            "desc": "Increase your Walk Speed by +20% and your Jump Height by +1",
            "archetype": "Acrobat",
            "archetype_req": 5,
            "parents": [
                "Shurikens",
                "Far Reach"
            ],
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
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "spd",
                            "value": 20
                        },
                        {
                            "type": "stat",
                            "name": "jh",
                            "value": 1
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Ambush",
            "desc": "Increase Surprise Strike's damage by +40%",
            "archetype": "Shadestepper",
            "archetype_req": 4,
            "base_abil": "Dash",
            "parents": [
                "Marked"
            ],
            "dependencies": [
                "Surprise Strike"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 1,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Surprise Strike",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.SurpriseStrike",
                            "value": 40
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Dash 2",
            "desc": "Reduce the Mana cost of Dash",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Echo"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ]
        },
        {
            "display_name": "Parry",
            "desc": "After dodging damage, if you cast a spell within 1.5s, it will be free. (3s Cooldown)",
            "archetype": "Acrobat",
            "archetype_req": 5,
            "parents": [
                "Cheaper Spin Attack 2"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 31,
                "col": 6,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Spin Attack 2",
            "desc": "Reduce the Mana cost of Spin Attack",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Spin Attack",
            "parents": [
                "Far Reach",
                "Parry"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 8,
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
            "display_name": "Death Magnet",
            "desc": "After leaving Vanish, pull all nearby Marked mobs towards you",
            "archetype": "Shadestepper",
            "archetype_req": 5,
            "base_abil": "Dash",
            "parents": [
                "Cheaper Multihit 2",
                "Ambush"
            ],
            "dependencies": [
                "Vanish"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Multihit 2",
            "desc": "Reduce the Mana cost of Multihit",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Multihit",
            "parents": [
                "Death Magnet",
                "Ambush",
                "Hoodwink"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
                "col": 2,
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
            "display_name": "Hoodwink",
            "desc": "When hitting enemies with Spin Attack, shorten the duration of your negative effects by 30% and transfer it onto enemies Lure can be transferred to the feeble minded. (Bosses and special enemies are immune)",
            "archetype": "Trickster",
            "archetype_req": 1,
            "base_abil": "Spin Attack",
            "parents": [
                "Cheaper Multihit 2",
                "Cheaper Dash 2",
                "Choke Bomb"
            ],
            "dependencies": [
                "Spin Attack"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Choke Bomb",
            "desc": "Smoke Bomb will slow down enemies while in the smoke",
            "archetype": "Trickster",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Hoodwink",
                "Wall Jump",
                "Parry"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Wall Jump",
            "desc": "Reduce Hop's cooldown by 1s. When you Hop into a wall, bounce backward. (Hold shift to cancel)",
            "archetype": "Acrobat",
            "archetype_req": 5,
            "parents": [
                "Choke Bomb",
                "Cheaper Spin Attack 2"
            ],
            "dependencies": [
                "Hop"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Fatal Spin",
            "desc": "Spin Attack will add +1 Mark to all enemies it hits and gain additional area of effect",
            "archetype": "Shadestepper",
            "archetype_req": 8,
            "base_abil": "Spin Attack",
            "parents": [
                "Death Magnet",
                "Cheaper Multihit 2"
            ],
            "dependencies": [
                "Marked"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Stronger Lacerate",
            "desc": "Lacerate will deal +1 slash",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": "Spin Attack",
            "parents": [
                "Choke Bomb",
                "Wall Jump"
            ],
            "dependencies": [
                "Lacerate"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "hits": {
                        "Per Hit": 1
                    }
                }
            ]
        },
        {
            "display_name": "Stronger Vortex",
            "desc": "If you deal more damage than 3.5x of your max health in a single hit, deal 60% of the damage to other nearby enemies",
            "archetype": "Shadestepper",
            "archetype_req": 4,
            "parents": [
                "Fatal Spin"
            ],
            "dependencies": [
                "Violent Vortex"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 35,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Violent Vortex",
                    "base_spell": 5,
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Total Damage",
                            "type": "damage",
                            "multipliers": [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Harvester",
            "desc": "After killing an enemy, gain +5 Mana for each leftover Marks it had",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "parents": [
                "Fatal Spin",
                "Cheaper Smoke Bomb 2"
            ],
            "dependencies": [
                "Marked"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 1,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Smoke Bomb 2",
            "desc": "Reduce the Mana cost of Smoke Bomb",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Harvester",
                "Hoodwink",
                "Blade Fury"
            ],
            "dependencies": [
                "Smoke Bomb"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 37,
                "col": 4,
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
            "display_name": "Blade Fury",
            "desc": "Multihit will be easier to aim and enemies hit will stay locked in front of you",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": "Multihit",
            "parents": [
                "Stronger Lacerate",
                "Cheaper Smoke Bomb 2"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 7,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 3,
                "target_part": "Per Hit",
                "multipliers": [ 0, 0, 10, 0, 0, 0 ]
            }]
        },
        {
            "display_name": "More Marks",
            "desc": "Add +2 max Marks",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "base_abil": "Marked",
            "parents": [
                "Harvester",
                "Cheaper Smoke Bomb 2"
            ],
            "dependencies": [
                "Marked"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 38,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Marked",
                    "slider_max": 2
                }
            ]
        },
        {
            "display_name": "Stronger Clones",
            "desc": "Improve your damage while your Clones are active by +20%",
            "archetype": "Trickster",
            "archetype_req": 7,
            "base_abil": "Dash",
            "parents": [
                "Cheaper Smoke Bomb 2",
                "Blade Fury"
            ],
            "dependencies": [
                "Mirror Image"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 38,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Clones",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Echo",
                            "value": 20
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Ricochets",
            "desc": "When hitting an enemy with your Shurikens, they will bounce to the nearest enemy",
            "archetype": "Acrobat",
            "archetype_req": 6,
            "base_abil": "Dash",
            "parents": [
                "Blade Fury"
            ],
            "dependencies": [
                "Shurikens"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 38,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Satsujin",
            "desc": "If an enemy has 3 Marks and 70% of their health or more, your next Multihit or Main Attack will deal triple damage. (30s Cooldown, per enemy)",
            "archetype": "Shadestepper",
            "archetype_req": 12,
            "parents": [
                "Harvester"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 39,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Satsujin",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Satsujin:3.Backstab Damage",
                            "value": 150
                        },
                        {
                            "type": "stat",
                            "name": "damMult.Satsujin:3.Per Hit",
                            "value": 150
                        },
                        {
                            "type": "stat",
                            "name": "damMult.Satsujin:3.Fatality",
                            "value": 150
                        },
                        {
                            "type": "stat",
                            "name": "damMult.Satsujin:0.Melee",
                            "value": 150
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Forbidden Art",
            "desc": "Summon +3 additional Clones. (+20s Cooldown)",
            "archetype": "Trickster",
            "archetype_req": 8,
            "base_abil": "Dash",
            "parents": [
                "Cheaper Smoke Bomb 2"
            ],
            "dependencies": [
                "Mirror Image"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 39,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Diversion",
            "desc": "Anytime a Lured enemy gets killed, every nearby ally gets +40% health as extra overflowing health. (3s Cooldown). Decay -4% of the bonus every second.",
            "archetype": "Trickster",
            "archetype_req": 11,
            "base_abil": "Smoke Bomb",
            "parents": [
                "Forbidden Art"
            ],
            "dependencies": [
                "Delirious Gas"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 40,
                "col": 5,
                "icon": "node_3"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Jasmine Bloom",
            "desc": "After spending 40 Mana, bloom an area under you that damages enemies below it every 0.3s. After every bloom, reset the duration and increase the radius (Max 10 Blocks)",
            "archetype": "Acrobat",
            "archetype_req": 12,
            "parents": [
                "Blade Fury"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 39,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Jasmine Bloom",
                    "base_spell": 7,
                    "display": "DPS",
                    "parts": [
                        {
                            "name": "Per Hit",
                            "multipliers": [ 60, 5, 0, 15, 0, 0 ]
                        },
                        {
                            "name": "DPS",
                            "hits": { "Per Hit": 3.333333333 }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Better Ricochets",
            "desc": "Add +1 Max Bounce to Ricochets",
            "archetype": "Acrobat",
            "archetype_req": 0,
            "base_abil": "Dash",
            "parents": [
                "Jasmine Bloom"
            ],
            "dependencies": [
                "Ricochets"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 40,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Devour",
            "desc": "Harvester will give +5 Mana",
            "archetype": "Shadestepper",
            "archetype_req": 0,
            "parents": [
                "Satsujin"
            ],
            "dependencies": [
                "Harvester"
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 41,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Better Marked",
            "desc": "Increase Marked's damage bonus by +4%",
            "archetype": "",
            "archetype_req": 0,
            "base_abil": "Marked",
            "parents": [
                "Satsujin"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 41,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Marked",
                    "output": [
                        {
                            "type": "stat",
                            "name": "damMult.Marked"
                        }
                    ],
                    "scaling": [
                        4
                    ]
                }
            ]
        }
    ],
    "Shaman": [
        {
            "display_name": "Totem",
            "desc": "Summon a totem that damages enemies around it every 0.4s.",
            "parents": [],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 0,
                "col": 4,
                "icon": "node_shaman"
            },
            "properties": {
                "duration": 20,
                "rate": 0.4,
                "aoe": 8,
                "totem_mul": 2.5
            },
            "effects": [{
                "type": "replace_spell",
                "name": "Totem",
                "cost": 35,
                "base_spell": 1,
                "display": "Tick DPS",
                "parts": [
                    {
                        "name": "Tick Damage",
                        "multipliers": [5, 0, 0, 0, 0, 5]
                    },
                    {
                        "name": "Tick DPS",
                        "hits": { "Tick Damage": "Totem.totem_mul" }
                    },
                    {
                        "name": "Heal Rate",
                        "hits": { "Heal Tick": "Totem.totem_mul" }
                    }
                ]
            }]
        },
        {
            "display_name": "Relik Proficiency 1",
            "desc": "Double your Main Attack's beam speed and increase your damage when using a reik.",
            "base_abil": 999,
            "parents": ["Totem"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "replace_spell",
                "name": "Relik Melee",
                "base_spell": 0,
                "spell_type": "damage",
                "scaling": "melee", "use_atkspd": false,
                "display": "Total",
                "parts": [
                    { "name": "Single Beam", "multipliers": [35, 0, 0, 0, 0, 0] },
                    { "name": "Total", "hits": { "Single Beam": 3 } }
                ]
            }]
        },
        {
            "display_name": "Cheaper Totem I",
            "desc": "Reduce the Mana cost of Totem.",
            "base_abil": "Totem",
            "parents": ["Relik Proficiency 1"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 1,
                "cost": -10
            }]
        },
        {
            "display_name": "Totemic Smash",
            "desc": "Your Totem will deal damage where it lands.",
            "base_abil": "Totem",
            "parents": ["Relik Proficiency 1"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 4,
                "col": 4,
                "icon": "node_1"
            },
            "properties": { "aoe": 3.5 },
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 1,
                "target_part": "Smash Damage",
                "multipliers": [
                    100,
                    0,
                    0,
                    0,
                    30,
                    0
                ]
            }]
        },
        {
            "display_name": "Distant Grasp",
            "desc": "Reduce your Main Attack's spread, and increase its beam speed by +33%.",
            "base_abil": 999,
            "archetype": "Summoner",
            "parents": ["Haul"],
            "dependencies": [],
            "blockers": ["Hand of the Shaman"],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Haul",
            "desc": "Leap towards your Totem.",
            "parents": ["Totemic Smash"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 4,
                "icon": "node_shaman"
            },
            "properties": {},
            "effects": [{
                "type": "replace_spell",
                "name": "Haul",
                "cost": 15,
                "base_spell": 2,
                "display": "",
                "parts": []
            }]
        },
        {
            "display_name": "Hand of the Shaman",
            "desc": "Your Main Attack will throw +2 beams.",
            "base_abil": 999,
            "archetype": "Acolyte",
            "parents": ["Haul"],
            "dependencies": [],
            "blockers": ["Distant Grasp"],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "replace_spell",
                "name": "Relik Melee",
                "base_spell": 0,
                "spell_type": "damage",
                "scaling": "melee", "use_atkspd": false,
                "display": "Total",
                "parts": [
                    { "name": "Single Beam", "multipliers": [34, 0, 0, 0, 0, 0] },
                    { "name": "Total", "hits": { "Single Beam": 5 } }
                ]
            }]
        },
        {
            "display_name": "Uproot",
            "desc": "Throw a rapid projectile that will explode and knock enemies away. (Hold shift to pull instead)",
            "parents": [
                "Distant Grasp",
                "Cheaper Haul I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 2,
                "icon": "node_shaman"
            },
            "properties": {
                "range": 18,
                "aoe": 5
            },
            "effects": [{
                "type": "replace_spell",
                "name": "Uproot",
                "cost": 30,
                "base_spell": 4,
                "display": "Total Damage",
                "parts": [
                     {
                         "name": "Single Hit",
                         "multipliers": [
                             80,
                             30,
                             20,
                             0,
                             0,
                             0
                         ]
                     },
                     {
                         "name": "Total Damage",
                         "hits": {
                             "Single Hit": 1
                         }
                     }
                ]
            }]
        },
        {
            "display_name": "Cheaper Haul I",
            "desc": "Reduce the Mana cost of Haul.",
            "base_abil": "Haul",
            "parents": [
                "Uproot",
                "Aura"
            ],
            "dependencies": ["Haul"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 4,
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
            "display_name": "Aura",
            "desc": "Emit an aura from your Totem that damages enemies.",
            "parents": [
                "Hand of the Shaman",
                "Cheaper Haul I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 8,
                "col": 6,
                "icon": "node_shaman"
            },
            "properties": {
                "range": 16,
                "num_totems": 1
            },
            "effects": [{
                "type": "replace_spell",
                "name": "Aura",
                "cost": 40,
                "base_spell": 3,
                "display": "First Wave",
                "parts": [
                    {
                        "name": "Single Wave",
                        "multipliers": [150, 0, 0, 30, 0, 0]
                    },
                    {
                        "name": "First Wave",
                        "hits": { "Single Wave": "Aura.num_totems" }
                    },
                    {
                        "name": "First Wave Heal",
                        "hits": { "Heal Amount": "Aura.num_totems" }
                    }
                ]
            }]
        },
        {
            "display_name": "Earth Mastery",
            "base_abil": 998,
            "desc": "Increases your base damage from all Earth attacks.",
            "archetype": "Summoner",
            "parents": [
                "Uproot"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "display_name": "Air Mastery",
            "base_abil": 998,
            "desc": "Increases your base damage from all Air attacks.",
            "archetype": "Summoner",
            "parents": [
                "Earth Mastery",
                "Uproot",
                "Cheaper Haul I",
                "Thunder Mastery"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "display_name": "Water Mastery",
            "base_abil": 998,
            "desc": "Increases your base damage from all Water attacks.",
            "archetype": "Ritualist",
            "parents": [
                "Cheaper Haul I",
                "Air Mastery",
                "Thunder Mastery"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 11,
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
            "display_name": "Thunder Mastery",
            "base_abil": 998,
            "desc": "Increases base damage from all Thunder attacks.",
            "archetype": "Acolyte",
            "parents": [
                "Air Mastery",
                "Cheaper Haul I",
                "Aura"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "display_name": "Fire Mastery",
            "base_abil": 998,
            "desc": "Increases base damage from all Fire attacks.",
            "archetype": "Acolyte",
            "parents": ["Aura"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
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
            "display_name": "Nature's Jolt",
            "desc": "When hitting the ground after using Haul, deal damage around you.",
            "base_abil": "Haul",
            "parents": [
                "Air Mastery",
                "Earth Mastery"
            ],
            "dependencies": ["Haul"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 11,
                "col": 1,
                "icon": "node_1"
            },
            "properties": { "aoe": 3.5 },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Nature's Jolt",
                    "base_spell": 2,
                    "multipliers": [90, 30, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "target_part": "Total Damage",
                    "base_spell": 2,
                    "display": "Total Damage",
                    "hits": {
                        "Nature's Jolt": 1
                    }
                }
            ]
        },
        {
            "display_name": "Overseer",
            "desc": "Increase Uproot's range, and if you hit your Totem with it, reset its duration.",
            "base_abil": "Uproot",
            "archetype": "Summoner",
            "parents": ["Nature's Jolt"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 13,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Uproot",
                            "name": "range",
                            "value": 6
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Rain Dance",
            "desc": "While mid-air, your Totem will leave a streak of rain that damages enemies under it every 0.4s.",
            "archetype": "Ritualist",
            "base_abil": "Totem",
            "parents": ["Water Mastery"],
            "dependencies": [
                "Totem"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 13,
                "col": 4,
                "icon": "node_1"
            },
            "properties": { 
                "aoe": 2,
                "duration": 6,
                "rate": 0.4
            },
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 1,
                "target_part": "Rain Dance",
                "multipliers": [ 30, 0, 0, 30, 0, 0 ]
            }]
        },
        {
            "display_name": "Shocking Aura",
            "desc": "Aura will travel at a much greater speed and deal additional damage.",
            "base_abil": "Aura",
            "archetype": "Acolyte",
            "parents": [
                "Thunder Mastery",
                "Flaming Tongue"
            ],
            "dependencies": [
                "Aura"
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 12,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Single Wave",
                    "multipliers": [
                        0,
                        0,
                        20,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "display_name": "Flaming Tongue",
            "desc": "Uproot will not explode or knockback enemies, but will deal damage 3 times. All elemental conversions become Fire.",
            "base_abil": "Uproot",
            "archetype": "Acolyte",
            "parents": [
                "Fire Mastery",
                "Shocking Aura"
            ],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 12,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Single Hit",
                    "multipliers": [
                        -50,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Total Damage",
                    "hits": {
                        "Single Hit": 2
                    }
                },
                {
                    "type": "convert_spell_conv",
                    "target_part": "all",
                    "base_spell": 4,
                    "conversion": "Fire"
                }
            ]
        },
        {
            "display_name": "Puppet Master",
            "desc": "Your Totem will summon 1 Puppet every 3s (Max 2). They throw knives at nearby enemies every 0.5s.",
            "archetype": "Summoner",
            "archetype_req": 3,
            "parents": ["Overseer"],
            "dependencies": ["Totem"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "duration": 30,
                "range": 16,
                "max_puppets": 2,
                "attack_frequency": 2
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Puppet Damage",
                    "base_spell": 5,
                    "scaling": "spell",
                    "display": "Max Puppet DPS",
                    "parts": [
                        {
                            "name": "Puppet Hit",
                            "multipliers": [ 5, 10, 0, 0, 0, 10 ]
                        },
                        {
                            "name": "Puppet DPS",
                            "hits": { "Puppet Hit": "Puppet Master.attack_frequency" }
                        },
                        {
                            "name": "Max Puppet DPS",
                            "hits": { "Puppet DPS": "Puppet Master.max_puppets" }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Mask of the Lunatic",
            "desc": "When casting Uproot, instead wear the Mask of the Lunatic. While wearing this mask, gain damage bonus at the cost of less walk speed, and reduce the mana cost of Aura.",
            "base_abil": "Uproot",
            "archetype": "Ritualist",
            "archetype_req": 2,
            "parents": ["Rain Dance"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 4,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Switch Masks",
                    "base_spell": 4,
                    "parts": [],
                    "display": ""
                },
                {
                    "type": "raw_stat",
                    "toggle": "Mask of the Lunatic",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Mask",
                            "value": 50
                        },
                        {
                            "type": "stat",
                            "name": "spd",
                            "value": -35
                        },
                        {
                            "type": "stat",
                            "name": "spPct3Final",
                            "value": -30
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Sacrificial Shrine",
            "desc": "Your Totem will siphon 2% of your health every 0.4s and transfer it into a Blood Pool. Aura will use 15% of your Blood Pool to deal +50% damage and heal all allies.",
            "archetype": "Acolyte",
            "archetype_req": 3,
            "parents": [
                "Shocking Aura",
                "Flaming Tongue"
            ],
            "dependencies": ["Totem"],
            "blockers": [ "Regeneration" ],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 7,
                "icon": "node_3"
            },
            "properties": { "blood_pool": 30 },
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Activate Boosted Aura",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.BloodPool:3.Single Wave",
                            "value": 50
                        }
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Heal Amount",
                    "power": 0.15
                }
            ]
        },
        {
            "display_name": "More Puppets I",
            "desc": "Increase your Max Puppets by +1 and reduce their damage.",
            "base_abil": "Puppet Master",
            "archetype": "Summoner",
            "parents": ["Puppet Master"],
            "dependencies": ["Puppet Master"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 16,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {
                "max_puppets": 1
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 5,
                    "target_part": "Puppet Hit",
                    "multipliers": [0, 0, 0, 0, 0, -5]
                }
            ]
        },
        {
            "display_name": "Cheaper Uproot I",
            "desc": "Reduce the Mana cost of Uproot.",
            "base_abil": "Uproot",
            "parents": ["Mask of the Lunatic", "Rebound"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 17,
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
            "display_name": "Rebound",
            "desc": "Once Aura reaches its maximum range, it will bounce back and deal its effects a second time.",
            "base_abil": "Aura",
            "parents": ["Sacrificial Shrine", "Cheaper Uproot I"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 7,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Rebound Total Damage",
                    "hits": { "First Wave": 2 }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Rebound Total Heal",
                    "hits": { "First Wave Heal": 2 }
                }
            ]
        },
        {
            "display_name": "Stagnation",
            "desc": "Enemies hit by Nature's Jolt will be slowed down.",
            "base_abil": "Uproot",
            "parents": ["More Puppets I", "Cheaper Aura I"],
            "dependencies": ["Nature's Jolt"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 18,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Cheaper Aura I",
            "desc": "Reduce the Mana cost of Aura.",
            "base_abil": "Aura",
            "parents": ["Stagnation", "Cheaper Uproot I"],
            "dependencies": ["Aura"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 18,
                "col": 2,
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
            "display_name": "Better Totem",
            "desc": "Increase your Totem's area of effect.",
            "base_abil": "Totem",
            "parents": [
                "Cheaper Uproot I",
                "Rebound"
            ],
            "dependencies": ["Totem"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 18,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "raw_stat",
                "bonuses": [
                    {
                        "type": "prop",
                        "abil": "Totem",
                        "name": "aoe",
                        "value": 4
                    }
                ]
            }]
        },
        {
            "display_name": "Blood Connection",
            "desc": "If you are outside your Totem's range, Haul will teleport you to it.",
            "base_abil": "Haul",
            "archetype": "Acolyte",
            "parents": ["Rebound"],
            "dependencies": ["Haul"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 18,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Exploding Puppets",
            "desc": "When your Puppets have 3s duration left, they will run towards enemies at high speed to explode and deal damage.",
            "base_abil": "Puppet Master",
            "archetype": "Summoner",
            "parents": ["Stagnation", "Cheaper Aura I"],
            "dependencies": ["Puppet Master"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {
                "aoe": 3
            },
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 5,
                "target_part": "Puppet Explosion",
                "multipliers": [100, 0, 0, 0, 100, 0]
            }]
        },
        {
            "display_name": "Hymn of Hate",
            "desc": "When wearing the Mask of the Lunatic, killing an enemy with Aura will cast a new Aura dealing -70% damage at its location.",
            "base_abil": "Aura",
            "archetype": "Ritualist",
            "parents": ["Cheaper Uproot I", "More Blood Pool I"],
            "dependencies": ["Mask of the Lunatic"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 3,
                "target_part": "Hymn of Hate",
                "hits": { "Single Wave": 0.5 }
            }]
        },
        {
            "display_name": "More Blood Pool I",
            "desc": "Increase your maximum Blood pool by +30%.",
            "archetype": "Acolyte",
            "base_abil": "Sacrificial Shrine",
            "parents": ["Rebound", "Hymn of Hate"],
            "dependencies": ["Sacrificial Shrine"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 20,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {"blood_pool": 30},
            "effects": []
        },
        {
            "display_name": "Bullwhip",
            "desc": "Hitting enemies with Uproot will make your Summons focus them and deal additional damage.",
            "archetype": "Summoner",
            "parents": ["Exploding Puppets"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 0,
                "icon": "node_2"
            },
            "properties": {
                "duration": 10
            },
            "effects": [{
                "type": "raw_stat",
                "toggle": "Activate Bullwhip",
                "bonuses": [
                    {
                        "type": "stat",
                        "name": "damMult.Bullwhip:5.Puppet Hit",
                        "value": 20
                    },
                    {
                        "type": "stat",
                        "name": "damMult.Bullwhip:7.Effigy Hit",
                        "value": 20
                    }
                ]
            }]
        },
        {
            "display_name": "More Puppets II",
            "desc": "Increase your Max Puppets by +2 and reduce their damage.",
            "base_abil": "Puppet Master",
            "archetype": "Summoner",
            "parents": ["Exploding Puppets"],
            "dependencies": ["More Puppets I"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 21,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {
                "max_puppets": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 5,
                    "target_part": "Puppet Hit",
                    "multipliers": [0, -5, 0, 0, 0, 0]
                }
            ]
        },
        {
            "display_name": "Mask of the Fanatic",
            "desc": "When casting Uproot, instead wear the Mask of the Fanatic. While wearing this mask, gain resistance at the cost of less damage bonus, and reduce the mana cost of Totem.",
            "base_abil": "Uproot",
            "archetype": "Ritualist",
            "archetype_req": 3,
            "parents": [
                "Hymn of Hate",
                "More Blood Pool I"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 5,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Switch Masks",
                    "base_spell": 4,
                    "parts": [],
                    "display": ""
                },
                {
                    "type": "raw_stat",
                    "toggle": "Mask of the Fanatic",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Mask",
                            "value": -20
                        },
                        {
                            "type": "stat",
                            "name": "defMult.Mask",
                            "value": 50
                        },
                        {
                            "type": "stat",
                            "name": "spPct1Final",
                            "value": -65
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Vengeful Spirit",
            "desc": "Your Totem will give damage bonus to yourself and allies standing inside its range.",
            "base_abil": "Totem",
            "archetype": "Acolyte",
            "parents": ["More Blood Pool I"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 8,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Masquerade",
            "desc": "After switching from a Mask to another 2 times, gain 30 mana.",
            "base_abil": "Uproot",
            "archetype": "Ritualist",
            "parents": ["Mask of the Fanatic"],
            "dependencies": ["Mask of the Lunatic"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {
                "switch_count": 2,
                "mana_gain": 30
            },
            "effects": []
        },
        {
            "display_name": "Double Totem",
            "desc": "Increase your maximum Totem by +1 and reduce Totem and Aura's damage.",
            "base_abil": "Totem",
            "archetype": "Summoner",
            "archetype_req": 2,
            "parents": ["Bullwhip", "Cheaper Totem II"],
            "dependencies": ["Aura"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 0,
                "icon": "node_1"
            },
            "properties": { "totem_mul": 2.5 },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Tick Damage",
                    "multipliers": [-3, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Single Wave",
                    "multipliers": [-60, 0, 0, 0, 0, 0]
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "prop",
                        "abil": "Aura",
                        "name": "num_totems",
                        "value": 1
                    }]
                }
            ]
        },
        {
            "display_name": "Cheaper Totem II",
            "desc": "Reduce the Mana cost of Totem.",
            "base_abil": "Totem",
            "parents": ["More Puppets II", "Double Totem", "Storm Dance"],
            "dependencies": ["Totem"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 23,
                "col": 2,
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
            "display_name": "Storm Dance",
            "desc": "Enemies hit by Aura will be pulled towards your totem.",
            "base_abil": "Aura",
            "archetype": "Ritualist",
            "parents": ["Cheaper Totem II", "Mask of the Fanatic", "Blood Moon"],
            "dependencies": ["Aura"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                "type": "add_spell_prop",
                "base_spell": 3,
                "target_part": "Single Wave",
                "multipliers": [0, 0, 0, 0, 0, 30]
                }
            ]
        },
        {
            "display_name": "Blood Moon",
            "desc": "For every 1% Soul Point Regen you have from items, gain +5/3s Lifesteal (Max 1000/3s)",
            "parents": ["Vengeful Spirit", "Storm Dance"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 23,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "spRegen"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "ls"
                    },
                    "scaling": [ 5 ],
                    "max": 1000
                }
            ]
        },
        {
            "display_name": "Cheaper Haul II",
            "desc": "Reduce the Mana cost of Haul.",
            "base_abil": "Haul",
            "parents": [
                "Storm Dance",
                "Blood Moon"
            ],
            "dependencies": ["Haul"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 24,
                "col": 6,
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
            "display_name": "Cheaper Aura II",
            "desc": "Reduce the Mana cost of Aura.",
            "base_abil": "Aura",
            "parents": [
                "Double Totem",
                "Cheaper Totem II",
                "Seeking Totem"
            ],
            "dependencies": ["Aura"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 26,
                "col": 1,
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
            "display_name": "Seeking Totem",
            "desc": "When wearing the Mask of the Fanatic, your Totem will move towards the nearest enemy outside of its range.",
            "base_abil": "Totem",
            "archetype": "Ritualist",
            "parents": [
                "Storm Dance",
                "Cheaper Totem II"
            ],
            "dependencies": ["Mask of the Fanatic"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 4,
                "icon": "node_1"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Twisted Tether",
            "desc": "When hitting an enemy with your Main Attack, use 1% from your Blood Pool and add Tether to them. Tethered enemies will take damage for every 2% Health you lose. (Max 10%)",
            "archetype": "Acolyte",
            "archetype_req": 7,
            "parents": [
                "Storm Dance",
                "Blood Moon"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Twisted Tether",
                    "base_spell": 6,
                    "scaling": "spell",
                    "display": "Tether Tick",
                    "parts": [
                        {
                            "name": "Tether Tick",
                            "multipliers": [ 15, 0, 0, 0, 0, 10 ]
                        },
                        {
                            "name": "Max Tether Damage",
                            "hits": { "Tether Tick": 5 }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Stronger Totem",
            "desc": "Increase Totem's damage.",
            "base_abil": "Totem",
            "parents": [
                "Cheaper Aura II",
                "Seeking Totem"
            ],
            "dependencies": ["Totem"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 27,
                "col": 2,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Tick Damage",
                    "multipliers": [4, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            "display_name": "Depersonalization",
            "desc": "Masquerade will need -1 Mask switch to trigger. Reduce the mana given by -10.",
            "archetype": "Ritualist",
            "archetype_req": 6,
            "base_abil": "Uproot",
            "parents": ["Seeking Totem"],
            "dependencies": ["Masquerade"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 27,
                "col": 5,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil": "Uproot",
                            "name": "switch_count",
                            "value": -1
                        },
                        {
                            "type": "prop",
                            "abil": "Uproot",
                            "name": "mana_gain",
                            "value": -10
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Crimson Effigy",
            "desc": "Hitting your Totem with Uproot will summon an Effigy that will attack enemies and push them towards your totem.",
            "archetype": "Summoner",
            "archetype_req": 8,
            "parents": ["Cheaper Aura II", "Mask of the Coward"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {
                "duration": 60,
                "max_effigy": 1,
                "attack_frequency": 4
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Crimson Effigy",
                    "base_spell": 7,
                    "display": "Total Effigy DPS",
                    "parts": [
                        {
                            "name": "Effigy Hit",
                            "multipliers": [ 40, 0, 0, 40, 0, 0 ]
                        },
                        {
                            "name": "Single Effigy DPS",
                            "hits": { "Effigy Hit": "Crimson Effigy.attack_frequency" }
                        },
                        {
                            "name": "Total Effigy DPS",
                            "hits": { "Single Effigy DPS": "Crimson Effigy.max_effigy" }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Mask of the Coward",
            "desc": "When casting Uproot, instead wear the Mask of the Coward. While wearing this mask, gain walk speed at the cost of less resistance, and reduce the mana cost of Haul.",
            "base_abil": "Uproot",
            "archetype": "Ritualist",
            "archetype_req": 7,
            "parents": [
                "Seeking Totem",
                "Crimson Effigy",
                "Fluid Healing"
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Switch Masks",
                    "base_spell": 4,
                    "parts": [],
                    "display": ""
                },
                {
                    "type": "raw_stat",
                    "toggle": "Mask of the Coward",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "spd",
                            "value": 80
                        },
                        {
                            "type": "stat",
                            "name": "defMult.Mask",
                            "value": -20
                        },
                        {
                            "type": "stat",
                            "name": "spPct2Final",
                            "value": -50
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Fluid Healing",
            "desc": "For every 1% Water Damage you have from items, buff Aura's healing power by +0.3%.",
            "parents": ["Twisted Tether", "Mask of the Coward", "More Blood Pool II"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "wDamPct"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "healPct:3.Heal Amount"
                    },
                    "scaling": [ 0.3 ]
                }
            ]
        },
        {
            "display_name": "More Blood Pool II",
            "desc": "Increase your maximum Blood pool by +30%.",
            "archetype": "Acolyte",
            "base_abil": "Sacrificial Shrine",
            "parents": ["Twisted Tether", "Fluid Healing"],
            "dependencies": ["Sacrificial Shrine"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 28,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {"blood_pool": 30},
            "effects": []
        },
        {
            "display_name": "Maddening Roots",
            "desc": "Uproot will slow down enemies.",
            "base_abil": "Uproot",
            "archetype": "Summoner",
            "parents": ["Crimson Effigy"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 29,
                "col": 0,
                "icon": "node_1"
            },
            "properties": {
                "effects": 40,
                "duration": 3
            },
            "effects": []
        },
        {
            "display_name": "Regeneration",
            "desc": "Your Totem will heal yourself and allies standing in its range every 0.4s.",
            "base_abil": "Totem",
            "parents": [
                "Crimson Effigy",
                "Mask of the Coward"
            ],
            "dependencies": [],
            "blockers": ["Sacrificial Shrine"],
            "cost": 2,
            "display": {
                "row": 29,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Heal Tick",
                    "power": 0.005,
                    "display": "Heal Rate"
                }
            ]
        },
        {
            "display_name": "Chant of the Coward",
            "desc": "When switching to the Mask of the Coward, damage and knockback nearby enemies.",
            "archetype": "Ritualist",
            "archetype_req": 7,
            "parents": ["Fluid Healing", "Mask of the Coward"],
            "dependencies": ["Mask of the Coward"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 29,
                "col": 5,
                "icon": "node_1"
            },
            "properties": { "aoe": 8 },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "target_part": "Chant of the Coward",
                    "base_spell": 4,
                    "multipliers": [200, 0, 0, 0, 0, 0],
                    "display": "Chant of the Coward"
                }
            ]
        },     
        {
            "display_name": "Blood Rite",
            "desc": "When yourself or an ally gets hit while standing in your Totem's range, add 35% of the damage taken into your Blood Pool. (Max 10%)",
            "archetype": "Acolyte",
            "archetype_req": 9,
            "parents": ["Fluid Healing", "More Blood Pool II"],
            "dependencies": ["Sacrificial Shrine"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 29,
                "col": 7,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "More Effigies",
            "desc": "Increase your Max Effigies by +1.",
            "archetype": "Summoner",
            "archetype_req": 8,
            "base_abil": "Crimson Effigy",
            "parents": ["Maddening Roots"],
            "dependencies": ["Crimson Effigy"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 1,
                "icon": "node_0"
            },
            "properties": {
                "max_effigy": 1
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 7,
                    "name": "Effigy Hit",
                    "multipliers": [ -10, 0, 0, -10, 0, 0 ]
                }
            ]
        },
        {
            "display_name": "Chant of the Fanatic",
            "desc": "When switching to Mask of the Fanatic, temporarily give massive resistance to yourself and allies (8s cooldown).",
            "base_abil": "Uproot",
            "archetype": "Ritualist",
            "archetype_req": 10,
            "parents": ["Chant of the Coward", "Stronger Tether"],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 31,
                "col": 5,
                "icon": "node_2"
            },
            "properties": {},
            "effects": []
        },
        {
            "display_name": "Stronger Tether",
            "desc": "Increase Twisted Tether's damage.",
            "archetype": "Acolyte",
            "parents": ["Blood Rite"],
            "dependencies": ["Twisted Tether"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 7,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 6,
                    "target_part": "Tether Tick",
                    "multipliers": [10, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            "display_name": "Triple Totem",
            "desc": "Increase your maximum Totem by +1 and reduce Totem and Aura's damage.",
            "base_abil": "Totem",
            "archetype": "Summoner",
            "archetype_req": 2,
            "parents": ["More Effigies", "Invigorating Wave"],
            "dependencies": ["Double Totem"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 0,
                "icon": "node_1"
            },
            "properties": { "totem_mul": 2.5 },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Tick Damage",
                    "multipliers": [-2, 0, 0, 0, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Single Wave",
                    "multipliers": [-40, 0, 0, 0, 0, 0]
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "prop",
                        "abil": "Aura",
                        "name": "num_totems",
                        "value": 1
                    }]
                }
            ]
        },
        {
            "display_name": "Invigorating Wave",
            "desc": "Aura will temporarily +50% your Summon's attack speed. Players hit will gain +3 mana.",
            "archetype": "Summoner", 
            "archetype_req": 3, 
            "parents": ["More Effigies", "Triple Totem", "Mengdu"], 
            "dependencies": ["Aura"], 
            "blockers": [],
            "cost": 2, 
            "display": {
                "row": 32,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {
                "TODO": "Make this not multiply base damage...",
                "duration": 3
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "toggle": "Invigorate Puppets",
                    "bonuses": [
                        { "type": "prop", "abil": "Puppet Master", "name": "attack_frequency", "value": 1 },
                        { "type": "prop", "abil": "Crimson Effigy", "name": "attack_frequency", "value": 2 }
                    ]
                }
            ]
        },
        {
            "display_name": "Mengdu",
            "desc": "For every 1% Thorns you have from item IDs, gain +1% Water Damage. (Max 40%)",
            "parents": ["Chant of the Fanatic", "Invigorating Wave"],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 32,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": false,
                    "inputs": [
                        {
                            "type": "stat",
                            "name": "thorns"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "wDamPct"
                    },
                    "scaling": [ 1 ],
                    "max": 40
                }
            ]
        },
        {
            "display_name": "Frog Dance",
            "desc": "When wearing the Mask of the Coward, Haul will make you bounce off the ground 3 times at increasing speed and deal damage to nearby enemies.",
            "archetype": "Ritualist",
            "base_abil": "Haul",
            "parents": ["Chant of the Fanatic"],
            "dependencies": ["Mask of the Coward"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Hop Damage",
                    "multipliers": [90, 0, 0, 30, 0, 0]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Total Damage",
                    "hits": { "Hop Damage": 3 },
                    "display": "Total Damage"
                },
                {
                    "type": "raw_stat",
                    "bonuses": [{
                        "type": "stat",
                        "name": "damMult.Frog:2.Hop Damage",
                        "value": -100
                    }]
                },
                {
                    "type": "raw_stat",
                    "toggle": "Mask of the Coward",
                    "bonuses": [{
                        "type": "stat",
                        "name": "damMult.Frog:2.Hop Damage",
                        "value": 100
                    }]
                }
            ]
        },
        {
            "display_name": "More Blood Pool III",
            "desc": "Increase your maximum Blood pool by +30%.",
            "archetype": "Acolyte",
            "base_abil": "Sacrificial Shrine",
            "parents": ["Stronger Tether"],
            "dependencies": ["Sacrificial Shrine"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
                "col": 8,
                "icon": "node_0"
            },
            "properties": {"blood_pool": 30},
            "effects": []
        },
        {
            "display_name": "Shepherd",
            "desc": "When you or your Summons kill an enemy, gain +1 Max Puppets for 15s. (Max +8)",
            "archetype": "Summoner",
            "archetype_req": 12,
            "base_abil": "Puppet Master",
            "parents": ["Triple Totem", "Invigorating Wave"],
            "dependencies": ["Puppet Master"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Shepherd Kills",
                    "output": {
                        "type": "prop",
                        "abil": "Puppet Master",
                        "name": "max_puppets"
                    },
                    "scaling": [1],
                    "slider_max": 8
                }
            ]
        },
        {
            "display_name": "Mask of the Awakened",
            "desc": "After saving 200 Mana from your Masks' mana reductions, casting Uproot will make you wear the Mask of the Awakened for 20s, giving the power of all Masks at once.",
            "base_abil": "Uproot",
            "archetype": "Ritualist",
            "archetype_req": 12,
            "parents": ["Frog Dance", "Cheaper Uproot II"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 35,
                "col": 5,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Switch Masks",
                    "base_spell": 4,
                    "parts": [],
                    "display": ""
                },
                {
                    "type": "raw_stat",
                    "toggle": "Mask of the Awakened",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "damMult.Mask",
                            "value": 30
                        },
                        {
                            "type": "stat",
                            "name": "defMult.Mask",
                            "value": 30
                        },
                        {
                            "type": "stat",
                            "name": "spd",
                            "value": 25
                        },
                        {
                            "type": "stat",
                            "name": "spPct1Final",
                            "value": -70
                        },
                        {
                            "type": "stat",
                            "name": "spPct2Final",
                            "value": -50
                        },
                        {
                            "type": "stat",
                            "name": "spPct3Final",
                            "value": -30
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Blood Sorrow",
            "desc": "Uproot will use 70% of your Blood Pool to cast a destructive beam that damages enemies every 0.2s. You cannot attack while in that state. Yourself and allies will receive +3% health as extra overflowing health instead. Decay -1.5% of the bonus health every second.",
            "base_abil": "Uproot",
            "archetype": "Acolyte",
            "archetype_req": 13,
            "parents": ["More Blood Pool III"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Blood Sorrow",
                    "base_spell": 8,
                    "display": "Beam DPS",
                    "parts": [
                        {
                            "name": "Beam Tick Damage",
                            "multipliers": [70, 0, 0, 20, 0, 0]
                        },
                        {
                            "name": "Beam DPS",
                            "hits": {
                                "Beam Tick Damage": 5
                            }
                        },
                        {
                            "name": "Total Damage",
                            "hits": {
                                "Beam DPS": 4
                            }
                        }
                    ]
                }
            ]
        },
        {
            "display_name": "Cheaper Uproot II",
            "desc": "Reduce the Mana cost of Uproot.",
            "base_abil": "Uproot",
            "parents": ["Shepherd", "Mask of the Awakened"],
            "dependencies": ["Uproot"],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 35,
                "col": 3,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [{
                "type": "add_spell_prop",
                "base_spell": 4,
                "cost": -5
            }]
        }
    ]
}
