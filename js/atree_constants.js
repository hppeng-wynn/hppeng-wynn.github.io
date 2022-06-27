const atrees = {
    "Archer": [
        {
            "display_name": "Arrow Shield",
            "desc": "Create a shield around you that deal damage and knockback mobs when triggered. (2 Charges)",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                60,
                34
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 6
            },
            "properties": {
                "duration": 60
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Arrow Shield",
                    "cost": 30,
                    "display_text": "Max Damage",
                    "base_spell": 4,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "",
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
                                "Shield Damage": 2
                            }
                        }
                    ]
                }
            ],
            "id": 0
        },
        {
            "display_name": "Escape",
            "desc": "Throw yourself backward to avoid danger. (Hold shift while escaping to cancel)",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                3
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 4
            },
            "properties": {
                "aoe": 0,
                "range": 0
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Escape",
                    "cost": 25,
                    "display_text": "Max Damage",
                    "base_spell": 2,
                    "spell_type": "damage",
                    "scaling": "spell",
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
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "None": 0
                            }
                        }
                    ]
                }
            ],
            "id": 1
        },
        {
            "display_name": "Arrow Bomb",
            "desc": "Throw a long-range arrow that explodes and deal high damage in a large area. (Self-damage for 25% of your DPS)",
            "archetype": "",
            "archetype_req": 0,
            "parents": [],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 0,
                "col": 4
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
                    "display_text": "Average Damage",
                    "base_spell": 3,
                    "spell_type": "damage",
                    "scaling": "spell",
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
            ],
            "id": 2
        },
        {
            "display_name": "Heart Shatter",
            "desc": "If you hit a mob directly with Arrow Bomb, shatter its heart and deal bonus damage.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                31
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 4,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Arrow Bomb",
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
                {}
            ],
            "id": 3
        },
        {
            "display_name": "Fire Creep",
            "desc": "Arrow Bomb will leak a trail of fire for 6s, Damaging enemies that walk into it every 0.4s.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                68,
                86,
                5
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 6
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
                    "cost": 0,
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
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Fire Creep": 15
                    }
                }
            ],
            "id": 4
        },
        {
            "display_name": "Bryophyte Roots",
            "desc": "When you hit an enemy with Arrow Storm, create an area that slows them down and deals damage every 0.4s.",
            "archetype": "Trapper",
            "archetype_req": 1,
            "parents": [
                4,
                82
            ],
            "dependencies": [
                7
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 8
            },
            "properties": {
                "aoe": 2,
                "duration": 5,
                "slowness": 0.4
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
                }
            ],
            "id": 5
        },
        {
            "display_name": "Nimble String",
            "desc": "Arrow Storm throw out +8 arrows per stream and shoot twice as fast.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                83,
                69
            ],
            "dependencies": [
                7
            ],
            "blockers": [
                68
            ],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 2
            },
            "properties": {
                "shootspeed": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Arrow",
                    "cost": 0,
                    "multipliers": [
                        -15,
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
                    "cost": 0,
                    "hits": {
                        "Single Arrow": 8
                    }
                }
            ],
            "id": 6
        },
        {
            "display_name": "Arrow Storm",
            "desc": "Shoot two stream of 8 arrows, dealing significant damage to close mobs and pushing them back.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                58,
                34
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 2
            },
            "properties": {
                "aoe": 0,
                "range": 16
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Arrow Storm",
                    "cost": 40,
                    "display_text": "Max Damage",
                    "base_spell": 1,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Single Arrow",
                            "type": "damage",
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
                            "type": "total",
                            "hits": {
                                "Single Arrow": 8
                            }
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Single Stream": 2
                            }
                        }
                    ]
                }
            ],
            "id": 7
        },
        {
            "display_name": "Guardian Angels",
            "desc": "Your protective arrows from Arrow Shield will become sentient bows, dealing damage up to 8 times each to nearby enemies. (Arrow Shield will no longer push nearby enemies)",
            "archetype": "Boltslinger",
            "archetype_req": 3,
            "parents": [
                59,
                67
            ],
            "dependencies": [
                0
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 1
            },
            "properties": {
                "range": 4,
                "duration": 60,
                "shots": 8,
                "count": 2
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Guardian Angels",
                    "cost": 30,
                    "display_text": "Total Damage Average",
                    "base_spell": 4,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "Total Damage",
                    "parts": [
                        {
                            "name": "Single Arrow",
                            "type": "damage",
                            "multipliers": [
                                40,
                                0,
                                0,
                                0,
                                0,
                                20
                            ]
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
            ],
            "id": 8
        },
        {
            "display_name": "Windy Feet",
            "base_abil": "Escape",
            "desc": "When casting Escape, give speed to yourself and nearby allies.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                7
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 10,
                "col": 1
            },
            "properties": {
                "aoe": 8,
                "duration": 120
            },
            "type": "stat_bonus",
            "bonuses": [
                {
                    "type": "stat",
                    "name": "spd",
                    "value": 20
                }
            ],
            "id": 9
        },
        {
            "display_name": "Basaltic Trap",
            "desc": "When you hit the ground with Arrow Bomb, leave a Trap that damages enemies. (Max 2 Traps)",
            "archetype": "Trapper",
            "archetype_req": 2,
            "parents": [
                5
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 8
            },
            "properties": {
                "aoe": 7,
                "traps": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Basaltic Trap",
                    "cost": 0,
                    "multipliers": [
                        140,
                        30,
                        0,
                        0,
                        30,
                        0
                    ]
                }
            ],
            "id": 10
        },
        {
            "display_name": "Windstorm",
            "desc": "Arrow Storm shoot +1 stream of arrows, effectively doubling its damage.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                8,
                33
            ],
            "dependencies": [],
            "blockers": [
                68
            ],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 1
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Arrow",
                    "cost": 0,
                    "multipliers": [
                        -11,
                        0,
                        -7,
                        0,
                        0,
                        3
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Single Stream": 1
                    }
                }
            ],
            "id": 11
        },
        {
            "display_name": "Grappling Hook",
            "base_abil": "Escape",
            "desc": "When casting Escape, throw a hook that pulls you when hitting a block. If you hit an enemy, pull them towards you instead. (Escape will not throw you backward anymore)",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                61,
                40,
                33
            ],
            "dependencies": [],
            "blockers": [
                20
            ],
            "cost": 2,
            "display": {
                "row": 21,
                "col": 5
            },
            "properties": {
                "range": 20
            },
            "effects": [],
            "id": 12
        },
        {
            "display_name": "Implosion",
            "desc": "Arrow bomb will pull enemies towards you. If a trap is nearby, it will pull them towards it instead. Increase Heart Shatter's damage.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                12,
                40
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 6
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Arrow Bomb",
                    "cost": 0,
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 13
        },
        {
            "display_name": "Twain's Arc",
            "desc": "When you have 2+ Focus, holding shift will summon the Twain's Arc. Charge it up to shoot a destructive long-range beam. (Damage is dealt as Main Attack Damage)",
            "archetype": "Sharpshooter",
            "archetype_req": 4,
            "parents": [
                62,
                64
            ],
            "dependencies": [
                61
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 4
            },
            "properties": {
                "range": 64,
                "focusReq": 2
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Twain's Arc",
                    "cost": 0,
                    "display_text": "Twain's Arc",
                    "base_spell": 5,
                    "spell_type": "damage",
                    "scaling": "melee",
                    "display": "Twain's Arc Damage",
                    "parts": [
                        {
                            "name": "Twain's Arc Damage",
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
            ],
            "id": 14
        },
        {
            "display_name": "Fierce Stomp",
            "desc": "When using Escape, hold shift to quickly drop down and deal damage.",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                42,
                64
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 26,
                "col": 1
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
                    }
                }
            ],
            "id": 15
        },
        {
            "display_name": "Scorched Earth",
            "desc": "Fire Creep become much stronger.",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                14
            ],
            "dependencies": [
                4
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 26,
                "col": 5
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
                    "cost": 0,
                    "multipliers": [
                        10,
                        0,
                        0,
                        0,
                        5,
                        0
                    ]
                }
            ],
            "id": 16
        },
        {
            "display_name": "Leap",
            "desc": "When you double tap jump, leap foward. (2s Cooldown)",
            "archetype": "Boltslinger",
            "archetype_req": 5,
            "parents": [
                42,
                55
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 0
            },
            "properties": {
                "cooldown": 2
            },
            "effects": [],
            "id": 17
        },
        {
            "display_name": "Shocking Bomb",
            "desc": "Arrow Bomb will not be affected by gravity, and all damage conversions become Thunder.",
            "archetype": "Sharpshooter",
            "archetype_req": 5,
            "parents": [
                14,
                44,
                55
            ],
            "dependencies": [
                2
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 4
            },
            "properties": {
                "gravity": 0
            },
            "effects": [
                {
                    "type": "convert_spell_conv",
                    "target_part": "all",
                    "conversion": "thunder"
                }
            ],
            "id": 18
        },
        {
            "display_name": "Mana Trap",
            "desc": "Your Traps will give you 4 Mana per second when you stay close to them.",
            "archetype": "Trapper",
            "archetype_req": 5,
            "parents": [
                43,
                44
            ],
            "dependencies": [
                4
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 8
            },
            "properties": {
                "range": 12,
                "manaRegen": 4
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Basaltic Trap",
                    "cost": 10,
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 19
        },
        {
            "display_name": "Escape Artist",
            "desc": "When casting Escape, release 100 arrows towards the ground.",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                46,
                17
            ],
            "dependencies": [],
            "blockers": [
                12
            ],
            "cost": 2,
            "display": {
                "row": 31,
                "col": 0
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Escape Artist",
                    "cost": 0,
                    "multipliers": [
                        30,
                        0,
                        10,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 20
        },
        {
            "display_name": "Initiator",
            "desc": "If you do not damage an enemy for 5s or more, your next sucessful hit will deal +50% damage and add +1 Focus.",
            "archetype": "Sharpshooter",
            "archetype_req": 5,
            "parents": [
                18,
                44,
                47
            ],
            "dependencies": [
                61
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 31,
                "col": 5
            },
            "properties": {
                "focus": 1,
                "timer": 5
            },
            "type": "stat_bonus",
            "bonuses": [
                {
                    "type": "stat",
                    "name": "damPct",
                    "value": 50
                }
            ],
            "id": 21
        },
        {
            "display_name": "Call of the Hound",
            "desc": "Arrow Shield summon a Hound that will attack and drag aggressive enemies towards your traps.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                21,
                47
            ],
            "dependencies": [
                0
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 7
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Call of the Hound",
                    "cost": 0,
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 22
        },
        {
            "display_name": "Arrow Hurricane",
            "desc": "Arrow Storm will shoot +2 stream of arrows.",
            "archetype": "Boltslinger",
            "archetype_req": 8,
            "parents": [
                48,
                20
            ],
            "dependencies": [],
            "blockers": [
                68
            ],
            "cost": 2,
            "display": {
                "row": 33,
                "col": 0
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Single Stream": 2
                    }
                }
            ],
            "id": 23
        },
        {
            "display_name": "Geyser Stomp",
            "desc": "Fierce Stomp will create geysers, dealing more damage and vertical knockback.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                56
            ],
            "dependencies": [
                15
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 1
            },
            "properties": {
                "aoe": 1
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Fierce Stomp",
                    "cost": 0,
                    "multipliers": [
                        0,
                        0,
                        0,
                        50,
                        0,
                        0
                    ]
                }
            ],
            "id": 24
        },
        {
            "display_name": "Crepuscular Ray",
            "desc": "If you have 5 Focus, casting Arrow Storm will make you levitate and shoot 20 homing arrows per second until you run out of Focus. While in that state, you will lose 1 Focus per second.",
            "archetype": "Sharpshooter",
            "archetype_req": 10,
            "parents": [
                49
            ],
            "dependencies": [
                7
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 4
            },
            "properties": {
                "focusReq": 5,
                "focusRegen": -1
            },
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Crepuscular Ray",
                    "base_spell": 5,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "One Focus",
                    "cost": 0,
                    "parts": [
                        {
                            "name": "Single Arrow",
                            "type": "damage",
                            "multipliers": [
                                10,
                                0,
                                0,
                                5,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "One Focus",
                            "type": "total",
                            "hits": {
                                "Single Arrow": 20
                            }
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "One Focus": 7
                            }
                        }
                    ]
                }
            ],
            "id": 25
        },
        {
            "display_name": "Grape Bomb",
            "desc": "Arrow bomb will throw 3 additional smaller bombs when exploding.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                51
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 37,
                "col": 7
            },
            "properties": {
                "miniBombs": 3,
                "aoe": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Grape Bomb",
                    "cost": 0,
                    "multipliers": [
                        30,
                        0,
                        0,
                        0,
                        10,
                        0
                    ]
                }
            ],
            "id": 26
        },
        {
            "display_name": "Tangled Traps",
            "desc": "Your Traps will be connected by a rope that deals damage to enemies every 0.2s.",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                26
            ],
            "dependencies": [
                10
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 38,
                "col": 6
            },
            "properties": {
                "attackSpeed": 0.2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Tangled Traps",
                    "cost": 0,
                    "multipliers": [
                        20,
                        0,
                        0,
                        0,
                        0,
                        20
                    ]
                }
            ],
            "id": 27
        },
        {
            "display_name": "Snow Storm",
            "desc": "Enemies near you will be slowed down.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                24,
                63
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 39,
                "col": 2
            },
            "properties": {
                "range": 2.5,
                "slowness": 0.3
            },
            "id": 28
        },
        {
            "display_name": "All-Seeing Panoptes",
            "desc": "Your bows from Guardian Angels become all-seeing, increasing their range, damage and letting them shoot up to +5 times each.",
            "archetype": "Boltslinger",
            "archetype_req": 11,
            "parents": [
                28
            ],
            "dependencies": [
                8
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 40,
                "col": 1
            },
            "properties": {
                "range": 10,
                "shots": 5
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Single Arrow",
                    "cost": 0,
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        20,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Single Bow",
                    "cost": 0,
                    "hits": {
                        "Single Arrow": 5
                    }
                }
            ],
            "id": 29
        },
        {
            "display_name": "Minefield",
            "desc": "Allow you to place +6 Traps, but with reduced damage and range.",
            "archetype": "Trapper",
            "archetype_req": 10,
            "parents": [
                26,
                53
            ],
            "dependencies": [
                10
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 40,
                "col": 7
            },
            "properties": {
                "aoe": -2,
                "traps": 6
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Basaltic Trap",
                    "cost": 0,
                    "multipliers": [
                        -80,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 30
        },
        {
            "display_name": "Bow Proficiency I",
            "desc": "Improve your Main Attack's damage and range when using a bow.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                2
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 4
            },
            "properties": {
                "mainAtk_range": 6
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
            ],
            "id": 31
        },
        {
            "display_name": "Cheaper Arrow Bomb",
            "desc": "Reduce the Mana cost of Arrow Bomb.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                31
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 2,
                "col": 6
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -10
                }
            ],
            "id": 32
        },
        {
            "display_name": "Cheaper Arrow Storm",
            "desc": "Reduce the Mana cost of Arrow Storm.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                12,
                11,
                61
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 21,
                "col": 3
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -5
                }
            ],
            "id": 33
        },
        {
            "display_name": "Cheaper Escape",
            "desc": "Reduce the Mana cost of Escape.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                7,
                0
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 9,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ],
            "id": 34
        },
        {
            "display_name": "Earth Mastery",
            "desc": "Increases your base damage from all Earth attacks",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                0
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 13,
                "col": 8
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
                            "name": "eDam",
                            "value": [
                                2,
                                4
                            ]
                        }
                    ]
                }
            ],
            "id": 82
        },
        {
            "display_name": "Thunder Mastery",
            "desc": "Increases your base damage from all Thunder attacks",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                7,
                86,
                34
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 13,
                "col": 2
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
                            "name": "tDam",
                            "value": [
                                1,
                                8
                            ]
                        }
                    ]
                }
            ],
            "id": 83
        },
        {
            "display_name": "Water Mastery",
            "desc": "Increases your base damage from all Water attacks",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                34,
                83,
                86
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 14,
                "col": 4
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
                            "name": "wDam",
                            "value": [
                                2,
                                4
                            ]
                        }
                    ]
                }
            ],
            "id": 84
        },
        {
            "display_name": "Air Mastery",
            "desc": "Increases base damage from all Air attacks",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                7
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 13,
                "col": 0
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
                            "name": "aDam",
                            "value": [
                                3,
                                4
                            ]
                        }
                    ]
                }
            ],
            "id": 85
        },
        {
            "display_name": "Fire Mastery",
            "desc": "Increases base damage from all Earth attacks",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                83,
                0,
                34
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 13,
                "col": 6
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
                            "name": "fDam",
                            "value": [
                                3,
                                5
                            ]
                        }
                    ]
                }
            ],
            "id": 86
        },
        {
            "display_name": "More Shields",
            "desc": "Give +2 charges to Arrow Shield.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                12,
                10
            ],
            "dependencies": [
                0
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 21,
                "col": 7
            },
            "properties": {
                "shieldCharges": 2
            },
            "id": 40
        },
        {
            "display_name": "Stormy Feet",
            "desc": "Windy Feet will last longer and add more speed.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                11
            ],
            "dependencies": [
                9
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 23,
                "col": 1
            },
            "properties": {
                "duration": 60
            },
            "effects": [
                {
                    "type": "stat_bonus",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "spdPct",
                            "value": 20
                        }
                    ]
                }
            ],
            "id": 41
        },
        {
            "display_name": "Refined Gunpowder",
            "desc": "Increase the damage of Arrow Bomb.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                11
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
                "col": 0
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Arrow Bomb",
                    "cost": 0,
                    "multipliers": [
                        50,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 42
        },
        {
            "display_name": "More Traps",
            "desc": "Increase the maximum amount of active Traps you can have by +2.",
            "archetype": "Trapper",
            "archetype_req": 10,
            "parents": [
                54
            ],
            "dependencies": [
                10
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 26,
                "col": 8
            },
            "properties": {
                "traps": 2
            },
            "id": 43
        },
        {
            "display_name": "Better Arrow Shield",
            "desc": "Arrow Shield will gain additional area of effect, knockback and damage.",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                19,
                18,
                14
            ],
            "dependencies": [
                0
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 28,
                "col": 6
            },
            "properties": {
                "aoe": 1
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Arrow Shield",
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 44
        },
        {
            "display_name": "Better Leap",
            "desc": "Reduce leap's cooldown by 1s.",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                17,
                55
            ],
            "dependencies": [
                17
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 29,
                "col": 1
            },
            "properties": {
                "cooldown": -1
            },
            "id": 45
        },
        {
            "display_name": "Better Guardian Angels",
            "desc": "Your Guardian Angels can shoot +4 arrows before disappearing.",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                20,
                55
            ],
            "dependencies": [
                8
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 2
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Single Bow",
                    "cost": 0,
                    "hits": {
                        "Single Arrow": 4
                    }
                }
            ],
            "id": 46
        },
        {
            "display_name": "Cheaper Arrow Storm (2)",
            "desc": "Reduce the Mana cost of Arrow Storm.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                21,
                19
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 31,
                "col": 8
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -5
                }
            ],
            "id": 47
        },
        {
            "display_name": "Precise Shot",
            "desc": "+30% Critical Hit Damage",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                46,
                49,
                23
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
                "col": 2
            },
            "properties": {
                "mainAtk_range": 6
            },
            "effects": [
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "mdCritPct",
                            "value": 30
                        }
                    ]
                }
            ],
            "id": 48
        },
        {
            "display_name": "Cheaper Arrow Shield",
            "desc": "Reduce the Mana cost of Arrow Shield.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                48,
                21
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "cost": -5
                }
            ],
            "id": 49
        },
        {
            "display_name": "Rocket Jump",
            "desc": "Arrow Bomb's self-damage will knockback you farther away.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                47,
                21
            ],
            "dependencies": [
                2
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 33,
                "col": 6
            },
            "properties": {},
            "id": 50
        },
        {
            "display_name": "Cheaper Escape (2)",
            "desc": "Reduce the Mana cost of Escape.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                22,
                70
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 7
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "cost": -5
                }
            ],
            "id": 51
        },
        {
            "display_name": "Stronger Hook",
            "desc": "Increase your Grappling Hook's range, speed and strength.",
            "archetype": "Trapper",
            "archetype_req": 5,
            "parents": [
                51
            ],
            "dependencies": [
                12
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 35,
                "col": 8
            },
            "properties": {
                "range": 8
            },
            "id": 52
        },
        {
            "display_name": "Cheaper Arrow Bomb (2)",
            "desc": "Reduce the Mana cost of Arrow Bomb.",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                63,
                30
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 40,
                "col": 5
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -5
                }
            ],
            "id": 53
        },
        {
            "display_name": "Bouncing Bomb",
            "desc": "Arrow Bomb will bounce once when hitting a block or enemy",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                40
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 25,
                "col": 7
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Arrow Bomb": 2
                    }
                }
            ],
            "id": 54
        },
        {
            "display_name": "Homing Shots",
            "desc": "Your Main Attack arrows will follow nearby enemies and not be affected by gravity",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                17,
                18
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 28,
                "col": 2
            },
            "properties": {},
            "effects": [],
            "id": 55
        },
        {
            "display_name": "Shrapnel Bomb",
            "desc": "Arrow Bomb's explosion will fling 15 shrapnel, dealing damage in a large area",
            "archetype": "Boltslinger",
            "archetype_req": 8,
            "parents": [
                23,
                48
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 1
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Shrapnel Bomb",
                    "cost": 0,
                    "multipliers": [
                        40,
                        0,
                        0,
                        0,
                        20,
                        0
                    ]
                }
            ],
            "id": 56
        },
        {
            "display_name": "Elusive",
            "desc": "If you do not get hit for 8+ seconds, become immune to self-damage and remove Arrow Storm's recoil. (Dodging counts as not getting hit)",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                24
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 38,
                "col": 0
            },
            "properties": {},
            "effects": [],
            "id": 57
        },
        {
            "display_name": "Double Shots",
            "desc": "Double Main Attack arrows, but they deal -30% damage per arrow (harder to hit far enemies)",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                1
            ],
            "dependencies": [],
            "blockers": [
                60
            ],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 2
            },
            "properties": {
                "arrow": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Melee Damage",
                    "cost": 0,
                    "multipliers": 0.7
                }
            ],
            "id": 58
        },
        {
            "display_name": "Triple Shots",
            "desc": "Triple Main Attack arrows, but they deal -20% damage per arrow",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                69,
                67
            ],
            "dependencies": [
                58
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 17,
                "col": 0
            },
            "properties": {
                "arrow": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 0,
                    "target_part": "Melee Damage",
                    "cost": 0,
                    "multipliers": 0.7
                }
            ],
            "id": 59
        },
        {
            "display_name": "Power Shots",
            "desc": "Main Attack arrows have increased speed and knockback",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                1
            ],
            "dependencies": [],
            "blockers": [
                58
            ],
            "cost": 1,
            "display": {
                "row": 7,
                "col": 6
            },
            "properties": {},
            "effects": [],
            "id": 60
        },
        {
            "display_name": "Focus",
            "desc": "When hitting an aggressive mob 5+ blocks away, gain +1 Focus (Max 3). Resets if you miss once",
            "archetype": "Sharpshooter",
            "archetype_req": 2,
            "parents": [
                68
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 19,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Focus",
                    "output": {
                        "type": "stat",
                        "abil_name": "Focus",
                        "name": "damMult"
                    },
                    "scaling": [
                        35
                    ],
                    "max": 3
                }
            ],
            "id": 61
        },
        {
            "display_name": "More Focus",
            "desc": "Add +2 max Focus",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                33,
                12
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Focus",
                    "output": {
                        "type": "stat",
                        "abil_name": "Focus",
                        "name": "damMult"
                    },
                    "scaling": [
                        35
                    ],
                    "max": 5
                }
            ],
            "id": 62
        },
        {
            "display_name": "More Focus (2)",
            "desc": "Add +2 max Focus",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                25,
                28
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 39,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Focus",
                    "output": {
                        "type": "stat",
                        "abil_name": "Focus",
                        "name": "damMult"
                    },
                    "scaling": [
                        35
                    ],
                    "max": 7
                }
            ],
            "id": 63
        },
        {
            "display_name": "Traveler",
            "desc": "For every 1% Walk Speed you have from items, gain +1 Raw Spell Damage (Max 100)",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                42,
                14
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 25,
                "col": 2
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
            ],
            "id": 64
        },
        {
            "display_name": "Patient Hunter",
            "desc": "Your Traps will deal +20% more damage for every second they are active (Max +80%)",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                40
            ],
            "dependencies": [
                10
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 8
            },
            "properties": {
                "max": 80
            },
            "effects": [],
            "id": 65
        },
        {
            "display_name": "Stronger Patient Hunter",
            "desc": "Add +80% Max Damage to Patient Hunter",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                26
            ],
            "dependencies": [
                65
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 38,
                "col": 8
            },
            "properties": {
                "max": 80
            },
            "effects": [],
            "id": 66
        },
        {
            "display_name": "Frenzy",
            "desc": "Every time you hit an enemy, briefly gain +6% Walk Speed (Max 200%). Decay -40% of the bonus every second",
            "archetype": "Boltslinger",
            "archetype_req": 0,
            "parents": [
                59,
                6
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 2
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
                    "max": 200
                }
            ],
            "id": 67
        },
        {
            "display_name": "Phantom Ray",
            "desc": "Condense Arrow Storm into a single ray that damages enemies 10 times per second",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                84,
                4
            ],
            "dependencies": [
                7
            ],
            "blockers": [
                11,
                6,
                23
            ],
            "cost": 2,
            "display": {
                "row": 16,
                "col": 4
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Phantom Ray",
                    "cost": 40,
                    "display_text": "Max Damage",
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
                }
            ],
            "id": 68
        },
        {
            "display_name": "Arrow Rain",
            "desc": "When Arrow Shield loses its last charge, unleash 200 arrows raining down on enemies",
            "archetype": "Trapper",
            "archetype_req": 0,
            "parents": [
                6,
                85
            ],
            "dependencies": [
                0
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 0
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Arrow Rain",
                    "cost": 0,
                    "multipliers": [
                        120,
                        0,
                        0,
                        0,
                        0,
                        80
                    ]
                }
            ],
            "id": 69
        },
        {
            "display_name": "Decimator",
            "desc": "Phantom Ray will increase its damage by 10% everytime you do not miss with it (Max 50%)",
            "archetype": "Sharpshooter",
            "archetype_req": 0,
            "parents": [
                49
            ],
            "dependencies": [
                68
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 34,
                "col": 5
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Phantom Ray hits",
                    "output": {
                        "type": "stat",
                        "name": "PhRayDmg"
                    },
                    "scaling": 10,
                    "max": 50
                }
            ],
            "id": 70
        }
    ],
    "Warrior": [
        {
            "display_name": "Bash",
            "desc": "Violently bash the ground, dealing high damage in a large area",
            "archetype": "",
            "archetype_req": 0,
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
                    "display_text": "Total Damage Average",
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
                                "Single Hit": 1
                            }
                        }
                    ]
                }
            ],
            "id": 71
        },
        {
            "display_name": "Spear Proficiency 1",
            "desc": "Improve your Main Attack's damage and range w/ spear",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                71
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
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "mdPct",
                            "value": 5
                        }
                    ]
                }
            ],
            "id": 72
        },
        {
            "display_name": "Cheaper Bash",
            "desc": "Reduce the Mana cost of Bash",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                72
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
            ],
            "id": 73
        },
        {
            "display_name": "Double Bash",
            "desc": "Bash will hit a second time at a farther range",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                72
            ],
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
                        "name": "Single Hit",
                        "value": 1
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "cost": 0,
                    "multipliers": [
                        -50,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 74
        },
        {
            "display_name": "Charge",
            "desc": "Charge forward at high speed (hold shift to cancel)",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                74
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 6,
                "col": 4,
                "icon": "node_4"
            },
            "properties": {},
            "effects": [
                {
                    "type": "replace_spell",
                    "name": "Charge",
                    "cost": 25,
                    "display_text": "Total Damage Average",
                    "base_spell": 2,
                    "spell_type": "damage",
                    "scaling": "spell",
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
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "None": 0
                            }
                        }
                    ]
                }
            ],
            "id": 75
        },
        {
            "display_name": "Heavy Impact",
            "desc": "After using Charge, violently crash down into the ground and deal damage",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                79
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
                }
            ],
            "id": 76
        },
        {
            "display_name": "Vehement",
            "desc": "For every 1% or 1 Raw Main Attack Damage you have from items, gain +2% Walk Speed (Max 20%)",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                75
            ],
            "dependencies": [],
            "blockers": [
                78
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
                        1,
                        1
                    ],
                    "max": 20
                }
            ],
            "id": 77
        },
        {
            "display_name": "Tougher Skin",
            "desc": "Harden your skin and become permanently +5% more resistant\nFor every 1% or 1 Raw Heath Regen you have from items, gain +10 Health (Max 100)",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                75
            ],
            "dependencies": [],
            "blockers": [
                77
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
                            "name": "baseResist",
                            "value": "5"
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
            ],
            "id": 78
        },
        {
            "display_name": "Uppercut",
            "desc": "Rocket enemies in the air and deal massive damage",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                77
            ],
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
                    "display_text": "Total Damage Average",
                    "base_spell": 3,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "total",
                    "parts": [
                        {
                            "name": "Uppercut",
                            "type": "damage",
                            "multipliers": [
                                150,
                                50,
                                50,
                                0,
                                0,
                                0
                            ]
                        },
                        {
                            "name": "Total Damage",
                            "type": "total",
                            "hits": {
                                "Uppercut": 1
                            }
                        }
                    ]
                }
            ],
            "id": 79
        },
        {
            "display_name": "Cheaper Charge",
            "desc": "Reduce the Mana cost of Charge",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                79,
                81
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
            ],
            "id": 80
        },
        {
            "display_name": "War Scream",
            "desc": "Emit a terrorizing roar that deals damage, pull nearby enemies, and add damage resistance to yourself and allies",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                78
            ],
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
                    "display_text": "War Scream",
                    "base_spell": 4,
                    "spell_type": "damage",
                    "scaling": "spell",
                    "display": "Total Damage Average",
                    "parts": [
                        {
                            "name": "War Scream",
                            "type": "damage",
                            "multipliers": [
                                50,
                                0,
                                0,
                                0,
                                50,
                                0
                            ]
                        }
                    ]
                }
            ],
            "id": 81
        },
        {
            "display_name": "Earth Mastery",
            "desc": "Increases base damage from all Earth attacks",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                79
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
                            "name": "eDam",
                            "value": [
                                2,
                                4
                            ]
                        }
                    ]
                }
            ],
            "id": 82
        },
        {
            "display_name": "Thunder Mastery",
            "desc": "Increases base damage from all Thunder attacks",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                79,
                85,
                80
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
                            "name": "tDam",
                            "value": [
                                1,
                                8
                            ]
                        }
                    ]
                }
            ],
            "id": 83
        },
        {
            "display_name": "Water Mastery",
            "desc": "Increases base damage from all Water attacks",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                80,
                83,
                85
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
                            "name": "wDam",
                            "value": [
                                2,
                                4
                            ]
                        }
                    ]
                }
            ],
            "id": 84
        },
        {
            "display_name": "Air Mastery",
            "desc": "Increases base damage from all Air attacks",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                81,
                83,
                80
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
                            "name": "aDamPct",
                            "value": 15
                        },
                        {
                            "type": "stat",
                            "name": "aDam",
                            "value": [
                                3,
                                4
                            ]
                        }
                    ]
                }
            ],
            "id": 85
        },
        {
            "display_name": "Fire Mastery",
            "desc": "Increases base damage from all Earth attacks",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                81
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
                            "name": "fDamPct",
                            "value": 15
                        },
                        {
                            "type": "stat",
                            "name": "fDam",
                            "value": [
                                3,
                                5
                            ]
                        }
                    ]
                }
            ],
            "id": 86
        },
        {
            "display_name": "Quadruple Bash",
            "desc": "Bash will hit 4 times at an even larger range",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                82,
                88
            ],
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
                    "cost": 0,
                    "hits": {
                        "Single Hit": 2
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "cost": 0,
                    "multipliers": [
                        -20,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 87
        },
        {
            "display_name": "Fireworks",
            "desc": "Mobs hit by Uppercut will explode mid-air and receive additional damage",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                83,
                87
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 12,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Fireworks",
                    "cost": 0,
                    "multipliers": [
                        80,
                        0,
                        20,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Fireworks": 1
                    }
                }
            ],
            "id": 88
        },
        {
            "display_name": "Half-Moon Swipe",
            "desc": "Uppercut will deal a footsweep attack at a longer and wider angle. All elemental conversions become Water",
            "archetype": "Battle Monk",
            "archetype_req": 1,
            "parents": [
                84
            ],
            "dependencies": [
                79
            ],
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
                    "multipliers": [
                        -70,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "type": "convert_spell_conv",
                    "target_part": "all",
                    "conversion": "water"
                }
            ],
            "id": 89
        },
        {
            "display_name": "Flyby Jab",
            "desc": "Damage enemies in your way when using Charge",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                85,
                91
            ],
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
                    "cost": 0,
                    "multipliers": [
                        20,
                        0,
                        0,
                        0,
                        0,
                        40
                    ]
                }
            ],
            "id": 90
        },
        {
            "display_name": "Flaming Uppercut",
            "desc": "Uppercut will light mobs on fire, dealing damage every 0.6 seconds",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                86,
                90
            ],
            "dependencies": [
                79
            ],
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
                    "cost": 0,
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        50,
                        0
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Flaming Uppercut Total Damage",
                    "cost": 0,
                    "hits": {
                        "Flaming Uppercut": 5
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "target_part": "Total Damage",
                    "cost": 0,
                    "hits": {
                        "Flaming Uppercut": 5
                    }
                }
            ],
            "id": 91
        },
        {
            "display_name": "Iron Lungs",
            "desc": "War Scream deals more damage",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                90,
                91
            ],
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
                    "multipliers": [
                        30,
                        0,
                        0,
                        0,
                        0,
                        30
                    ]
                }
            ],
            "id": 92
        },
        {
            "display_name": "Generalist",
            "desc": "After casting 3 different spells in a row, your next spell will cost 5 mana",
            "archetype": "Battle Monk",
            "archetype_req": 3,
            "parents": [
                94
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 15,
                "col": 2,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [],
            "id": 93
        },
        {
            "display_name": "Counter",
            "desc": "When dodging a nearby enemy attack, get 30% chance to instantly attack back",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                89
            ],
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
                    "type": "add_spell_prop",
                    "base_spell": 5,
                    "target_part": "Counter",
                    "cost": 0,
                    "multipliers": [
                        60,
                        0,
                        20,
                        0,
                        0,
                        20
                    ]
                }
            ],
            "id": 94
        },
        {
            "display_name": "Mantle of the Bovemists",
            "desc": "When casting War Scream, create a holy shield around you that reduces all incoming damage by 70% for 3 hits (20s cooldown)",
            "archetype": "Paladin",
            "archetype_req": 3,
            "parents": [
                92
            ],
            "dependencies": [
                81
            ],
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
            "effects": [],
            "id": 95
        },
        {
            "display_name": "Bak'al's Grasp",
            "desc": "After casting War Scream, become Corrupted (15s Cooldown). You cannot heal while in that state\n\nWhile Corrupted, every 2% of Health you lose will add +4 Raw Damage to your attacks (Max 120)",
            "archetype": "Fallen",
            "archetype_req": 2,
            "parents": [
                87,
                88
            ],
            "dependencies": [
                81
            ],
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
                        "name": "raw"
                    },
                    "scaling": [
                        4
                    ],
                    "slider_step": 2,
                    "max": 120
                }
            ],
            "id": 96
        },
        {
            "display_name": "Spear Proficiency 2",
            "desc": "Improve your Main Attack's damage and range w/ spear",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                96,
                98
            ],
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
            ],
            "id": 97
        },
        {
            "display_name": "Cheaper Uppercut",
            "desc": "Reduce the Mana Cost of Uppercut",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                97,
                99,
                94
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 17,
                "col": 3,
                "icon": "node_0"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 3,
                    "cost": -5
                }
            ],
            "id": 98
        },
        {
            "display_name": "Aerodynamics",
            "desc": "During Charge, you can steer and change direction",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                98,
                100
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 17,
                "col": 5,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [],
            "id": 99
        },
        {
            "display_name": "Provoke",
            "desc": "Mobs damaged by War Scream will target only you for at least 5s \n\nReduce the Mana cost of War Scream",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                99,
                95
            ],
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
            ],
            "id": 100
        },
        {
            "display_name": "Precise Strikes",
            "desc": "+30% Critical Hit Damage",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                98,
                97
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 18,
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
                            "name": "critDmg",
                            "value": 30
                        }
                    ]
                }
            ],
            "id": 101
        },
        {
            "display_name": "Air Shout",
            "desc": "War Scream will fire a projectile that can go through walls and deal damage multiple times",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                99,
                100
            ],
            "dependencies": [
                81
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 18,
                "col": 6,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Air Shout",
                    "cost": 0,
                    "multipliers": [
                        20,
                        0,
                        0,
                        0,
                        0,
                        5
                    ]
                }
            ],
            "id": 102
        },
        {
            "display_name": "Enraged Blow",
            "desc": "While Corriupted, every 1% of Health you lose will increase your damage by +2% (Max 200%)",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                97
            ],
            "dependencies": [
                96
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 0,
                "icon": "node_2"
            },
            "properties": {},
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
                    "scaling": [
                        3
                    ],
                    "max": 300
                }
            ],
            "id": 103
        },
        {
            "display_name": "Flying Kick",
            "desc": "When using Charge, mobs hit will halt your momentum and get knocked back",
            "archetype": "Battle Monk",
            "archetype_req": 1,
            "parents": [
                98,
                105
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 20,
                "col": 3,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 2,
                    "target_part": "Flying Kick",
                    "cost": 0,
                    "multipliers": [
                        120,
                        0,
                        0,
                        10,
                        0,
                        20
                    ]
                }
            ],
            "id": 104
        },
        {
            "display_name": "Stronger Mantle",
            "desc": "Add +2 additional charges to Mantle of the Bovemists",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                106,
                104
            ],
            "dependencies": [
                95
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 20,
                "col": 6,
                "icon": "node_0"
            },
            "properties": {
                "mantle_charge": 2
            },
            "effects": [],
            "id": 105
        },
        {
            "display_name": "Manachism",
            "desc": "If you receive a hit that's less than 5% of your max HP, gain 10 Mana (1s Cooldown)",
            "archetype": "Paladin",
            "archetype_req": 3,
            "parents": [
                105,
                100
            ],
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
            "effects": [],
            "id": 106
        },
        {
            "display_name": "Boiling Blood",
            "desc": "Bash leaves a trail of boiling blood behind its first explosion, slowing down and damaging enemies above it every 0.4 seconds",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                103,
                108
            ],
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
                    "multipliers": [
                        25,
                        0,
                        0,
                        0,
                        5,
                        0
                    ]
                }
            ],
            "id": 107
        },
        {
            "display_name": "Ragnarokkr",
            "desc": "War Scream become deafening, increasing its range and giving damage bonus to players",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                107,
                104
            ],
            "dependencies": [
                81
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 22,
                "col": 2,
                "icon": "node_2"
            },
            "properties": {
                "damage_bonus": 30,
                "aoe": 2
            },
            "effects": [
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "cost": 10
                }
            ],
            "id": 108
        },
        {
            "display_name": "Ambidextrous",
            "desc": "Increase your chance to attack with Counter by +30%",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                104,
                105,
                110
            ],
            "dependencies": [
                94
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
                "col": 4,
                "icon": "node_0"
            },
            "properties": {
                "chance": 30
            },
            "effects": [],
            "id": 109
        },
        {
            "display_name": "Burning Heart",
            "desc": "For every 100 Health Bonus you have from item IDs, gain +2% Fire Damage (Max 100%)",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                109,
                111
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 22,
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
                            "name": "hpBonus"
                        }
                    ],
                    "output": {
                        "type": "stat",
                        "name": "fDamPct"
                    },
                    "scaling": [
                        2
                    ],
                    "max": 100,
                    "slider_step": 100
                }
            ],
            "id": 110
        },
        {
            "display_name": "Stronger Bash",
            "desc": "Increase the damage of Bash",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                110,
                106
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
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "target_part": "Single Hit",
                    "cost": 0,
                    "multipliers": [
                        30,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 111
        },
        {
            "display_name": "Intoxicating Blood",
            "desc": "After leaving Corrupted, gain 2% of the health lost back for each enemy killed while Corrupted",
            "archetype": "Fallen",
            "archetype_req": 5,
            "parents": [
                108,
                107
            ],
            "dependencies": [
                96
            ],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [],
            "id": 112
        },
        {
            "display_name": "Comet",
            "desc": "After being hit by Fireworks, enemies will crash into the ground and receive more damage",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                108
            ],
            "dependencies": [
                88
            ],
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
                    "multipliers": [
                        80,
                        20,
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
                    "cost": 0,
                    "hits": {
                        "Comet": 1
                    }
                }
            ],
            "id": 113
        },
        {
            "display_name": "Collide",
            "desc": "Mobs thrown into walls from Flying Kick will explode and receive additonal damage",
            "archetype": "Battle Monk",
            "archetype_req": 4,
            "parents": [
                109,
                110
            ],
            "dependencies": [
                104
            ],
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
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        50,
                        0
                    ]
                }
            ],
            "id": 114
        },
        {
            "display_name": "Rejuvenating Skin",
            "desc": "Regain back 30% of the damage you take as healing over 30s",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                110,
                111
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 23,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [],
            "id": 115
        },
        {
            "display_name": "Uncontainable Corruption",
            "desc": "Reduce the cooldown of Bak'al's Grasp by -5s, and increase the raw damage gained for every 2% of health lost by +1",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                107,
                117
            ],
            "dependencies": [
                96
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 26,
                "col": 0,
                "icon": "node_0"
            },
            "properties": {
                "cooldown": -5
            },
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Corrupted",
                    "output": {
                        "type": "stat",
                        "name": "raw"
                    },
                    "scaling": [
                        1
                    ],
                    "slider_step": 2,
                    "max": 50
                }
            ],
            "id": 116
        },
        {
            "display_name": "Radiant Devotee",
            "desc": "For every 4% Reflection you have from items, gain +1/5s Mana Regen (Max 10/5s)",
            "archetype": "Battle Monk",
            "archetype_req": 1,
            "parents": [
                118,
                116
            ],
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
                    "scaling": [
                        1
                    ],
                    "max": 10,
                    "slider_step": 4
                }
            ],
            "id": 117
        },
        {
            "display_name": "Whirlwind Strike",
            "desc": "Uppercut will create a strong gust of air, launching you upward with enemies (Hold shift to stay grounded)",
            "archetype": "Battle Monk",
            "archetype_req": 5,
            "parents": [
                109,
                117
            ],
            "dependencies": [
                79
            ],
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
                    "cost": 0,
                    "multipliers": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        50
                    ]
                }
            ],
            "id": 118
        },
        {
            "display_name": "Mythril Skin",
            "desc": "Gain +5% Base Resistance and become immune to knockback",
            "archetype": "Paladin",
            "archetype_req": 6,
            "parents": [
                115
            ],
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
            ],
            "id": 119
        },
        {
            "display_name": "Armour Breaker",
            "desc": "While Corrupted, losing 30% Health will make your next Uppercut destroy enemies' defense, rendering them weaker to damage",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                116,
                117
            ],
            "dependencies": [
                96
            ],
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
            "effects": [],
            "id": 120
        },
        {
            "display_name": "Shield Strike",
            "desc": "When your Mantle of the Bovemist loses all charges, deal damage around you for each Mantle individually lost",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                119,
                122
            ],
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
                    "type": "add_spell_prop",
                    "base_spell": 5,
                    "target_part": "Shield Strike",
                    "cost": 0,
                    "multipliers": [
                        60,
                        0,
                        20,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 121
        },
        {
            "display_name": "Sparkling Hope",
            "desc": "Everytime you heal 5% of your max health, deal damage to all nearby enemies",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                119
            ],
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
                    "type": "add_spell_prop",
                    "base_spell": 5,
                    "target_part": "Sparkling Hope",
                    "cost": 0,
                    "multipliers": [
                        10,
                        0,
                        5,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 122
        },
        {
            "display_name": "Massive Bash",
            "desc": "While Corrupted, every 3% Health you lose will add +1 AoE to Bash (Max 10)",
            "archetype": "Fallen",
            "archetype_req": 8,
            "parents": [
                124,
                116
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
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Corrupted",
                    "output": {
                        "type": "stat",
                        "name": "bashAoE"
                    },
                    "scaling": [
                        1
                    ],
                    "max": 10,
                    "slider_step": 3
                }
            ],
            "id": 123
        },
        {
            "display_name": "Tempest",
            "desc": "War Scream will ripple the ground and deal damage 3 times in a large area",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                123,
                125
            ],
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
                    "cost": "0",
                    "multipliers": [
                        30,
                        10,
                        0,
                        0,
                        0,
                        10
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Tempest Total Damage",
                    "cost": "0",
                    "hits": {
                        "Tempest": 3
                    }
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Total Damage",
                    "cost": "0",
                    "hits": {
                        "Tempest": 3
                    }
                }
            ],
            "id": 124
        },
        {
            "display_name": "Spirit of the Rabbit",
            "desc": "Reduce the Mana cost of Charge and increase your Walk Speed by +20%",
            "archetype": "Battle Monk",
            "archetype_req": 5,
            "parents": [
                124,
                118
            ],
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
                    "bonuses": [
                        {
                            "type": "stat",
                            "name": "spd",
                            "value": 20
                        }
                    ]
                }
            ],
            "id": 125
        },
        {
            "display_name": "Massacre",
            "desc": "While Corrupted, if your effective attack speed is Slow or lower, hitting an enemy with your Main Attack will add +1% to your Corrupted bar",
            "archetype": "Fallen",
            "archetype_req": 5,
            "parents": [
                124,
                123
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 29,
                "col": 1,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [],
            "id": 126
        },
        {
            "display_name": "Axe Kick",
            "desc": "Increase the damage of Uppercut, but also increase its mana cost",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                124,
                125
            ],
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
                    "multipliers": [
                        100,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            "id": 127
        },
        {
            "display_name": "Radiance",
            "desc": "Bash will buff your allies' positive IDs. (15s Cooldown)",
            "archetype": "Paladin",
            "archetype_req": 2,
            "parents": [
                125,
                129
            ],
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
            "effects": [],
            "id": 128
        },
        {
            "display_name": "Cheaper Bash 2",
            "desc": "Reduce the Mana cost of Bash",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                128,
                121,
                122
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
                    "type": "add_spell_prop",
                    "base_spell": 1,
                    "cost": -5
                }
            ],
            "id": 129
        },
        {
            "display_name": "Cheaper War Scream",
            "desc": "Reduce the Mana cost of War Scream",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                123
            ],
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
            ],
            "id": 130
        },
        {
            "display_name": "Discombobulate",
            "desc": "Every time you hit an enemy, briefly increase your elemental damage dealt to them by +2 (Additive, Max +50). This bonus decays -5 every second",
            "archetype": "Battle Monk",
            "archetype_req": 12,
            "parents": [
                133
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 31,
                "col": 2,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [
                {
                    "type": "stat_scaling",
                    "slider": true,
                    "slider_name": "Hits dealt",
                    "output": {
                        "type": "stat",
                        "name": "rainrawButDifferent"
                    },
                    "scaling": [
                        2
                    ],
                    "max": 50
                }
            ],
            "id": 131
        },
        {
            "display_name": "Thunderclap",
            "desc": "Bash will cast at the player's position and gain additional AoE.\n\n All elemental conversions become Thunder",
            "archetype": "Battle Monk",
            "archetype_req": 8,
            "parents": [
                133
            ],
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
                    "conversion": "thunder"
                },
                {
                    "type": "raw_stat",
                    "bonuses": [
                        {
                            "type": "prop",
                            "abil_name": "Bash",
                            "name": "aoe",
                            "value": 3
                        }
                    ]
                }
            ],
            "id": 132
        },
        {
            "display_name": "Cyclone",
            "desc": "After casting War Scream, envelop yourself with a vortex that damages nearby enemies every 0.5s",
            "archetype": "Battle Monk",
            "archetype_req": 0,
            "parents": [
                125
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 1,
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
                    "cost": 0,
                    "multipliers": [
                        10,
                        0,
                        0,
                        0,
                        5,
                        10
                    ]
                },
                {
                    "type": "add_spell_prop",
                    "base_spell": 4,
                    "target_part": "Cyclone Total Damage",
                    "cost": 0,
                    "hits": {
                        "Cyclone": 40
                    }
                }
            ],
            "id": 133
        },
        {
            "display_name": "Second Chance",
            "desc": "When you receive a fatal blow, survive and regain 30% of your Health (10m Cooldown)",
            "archetype": "Paladin",
            "archetype_req": 12,
            "parents": [
                129
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 32,
                "col": 7,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [],
            "id": 134
        },
        {
            "display_name": "Blood Pact",
            "desc": "If you do not have enough mana to cast a spell, spend health instead (1% health per mana)",
            "archetype": "",
            "archetype_req": 10,
            "parents": [
                130
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 34,
                "col": 1,
                "icon": "node_3"
            },
            "properties": {},
            "effects": [],
            "id": 135
        },
        {
            "display_name": "Haemorrhage",
            "desc": "Reduce Blood Pact's health cost. (0.5% health per mana)",
            "archetype": "Fallen",
            "archetype_req": 0,
            "parents": [
                135
            ],
            "dependencies": [
                135
            ],
            "blockers": [],
            "cost": 1,
            "display": {
                "row": 35,
                "col": 2,
                "icon": "node_1"
            },
            "properties": {},
            "effects": [],
            "id": 136
        },
        {
            "display_name": "Brink of Madness",
            "desc": "If your health is 25% full or less, gain +40% Resistance",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                135,
                138
            ],
            "dependencies": [],
            "blockers": [],
            "cost": 2,
            "display": {
                "row": 35,
                "col": 4,
                "icon": "node_2"
            },
            "properties": {},
            "effects": [],
            "id": 137
        },
        {
            "display_name": "Cheaper Uppercut 2",
            "desc": "Reduce the Mana cost of Uppercut",
            "archetype": "",
            "archetype_req": 0,
            "parents": [
                134,
                137
            ],
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
            ],
            "id": 138
        },
        {
            "display_name": "Martyr",
            "desc": "When you receive a fatal blow, all nearby allies become invincible",
            "archetype": "Paladin",
            "archetype_req": 0,
            "parents": [
                134
            ],
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
            "effects": [],
            "id": 139
        }
    ]
}
