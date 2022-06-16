const atrees = 
{
    "Archer": [
        {"title": "Arrow Bomb", "desc": "Throw a long-ranged arrow that explodes and deal high damage in a large area (self-damage for 30% of DPS) Mana cost: 50 Total damage: 180% (of DPS) - Neutral: 160% - Fire: 20% Range: 26 blocks AoE: 2.5 blocks (circular)", "image": "../media/atree/node.png", "connector": false, "row": 0, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 1, "col": 4, "rotate": 0},
        {"title": "Bow Proficiency", "desc": "Improve Main Attack damage and range w/ bow Main attack damage: +5% Main attack range: +6 blocks AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 2, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 2, "col": 5, "rotate": 90},
        {"title": "Cheaper Arrow Bomb", "desc": "Reduce Mana cost of Arrow Bomb Mana cost: -10 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 2, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 3, "col": 4, "rotate": 0},
        {"title": "Heart Shatter", "desc": "If you hit a mob directly with Arrow Bomb, shatter its heart and deal bonus damage Total damage: +100% (of DPS) - Neutral: 100% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 4, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 5, "col": 4, "rotate": 0},
        {"title": "Escape", "desc": "Throw yourself backward to avoid danger (hold shift to cancel) Mana cost: 25 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 6, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 6, "col": 3, "rotate": 90},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 6, "col": 5, "rotate": 90},
        {"title": "Double Shots Ability\nBoltslinger Archetype", "desc": "Double Main Attack arrows, but they deal -30% damage per arrow (harder to hit far enemies) Blocks: - Power Shots AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 6, "col": 2},
        {"title": "Power Shots Ability\nSharpshooter Archetype", "desc": "Main Attack arrows have increased speed and knockback Blocks: - Double Shots AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 6, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 7, "col": 6, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 7, "col": 2, "rotate": 0},
        {"title": "Arrow Storm", "desc": "Shoots 2 streams of 8 arrows, dealing damage to close mobs and pushing them back Mana cost: 40 Total damage: 40% (of DPS per arrow) - Neutral: 30% - Thunder: 10% Range: 16 blocks AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 8, "col": 2},
        {"title": "Cheaper Escape", "desc": "Reduce mana cost of Escape Mana cost: -5 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 8, "col": 4},
        {"title": "Arrow Shield", "desc": "Create a shield around you that deal damage and knockback mobs when triggered (2 charges) Mana cost: 30 Total damage: 100% (of DPS) - Neutral: 90% - Air: 10% Duration: 60s AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 8, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 8, "col": 3, "rotate": 90},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 8, "col": 5, "rotate": 90},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 8, "col": 1, "rotate": 180},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 8, "col": 0, "rotate": 180},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 8, "col": 7, "rotate": 90},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 8, "col": 8, "rotate": 270},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 9, "col": 0, "rotate": 0},
        {"title": "Windy Feet Ability\nBoltslinger Archetype", "desc": "When casting Escape, give speed to yourself and nearby allies Effect: +20% Walk Speed Duration: 120s AoE: 8 blocks (circular) AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 9, "col": 1},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 9, "col": 2, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 9, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 9, "col": 6, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 9, "col": 8, "rotate": 0},
        {"title": "Air Mastery Ability\nBoltslinger Archetype", "desc": "Increases base damage from all Air attacks Air Damage: +3-4 Air Damage: +15% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 10, "col": 0},
        {"title": "Thunder Mastery Ability\nBoltslinger Archetype", "desc": "Increases base damage from all Thunder attacks Thunder Damage: +1-8 Thunder Damage: +10% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 10, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 10, "col": 3, "rotate": 90},

        {"image": "../media/atree/connect_c.png", "connector": true, "row": 10, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 10, "col": 5, "rotate": 90},

        {"title": "Fire Mastery Ability\nSharpshooter Archetype", "desc": "Increases base damage from all Fire attacks Fire Damage: +3-5 Fire Damage: +15% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 10, "col": 6},
        {"title": "Earth Mastery Ability\nSharpshooter Archetype", "desc": "Increases base damage from all Earth attacks Earth Damage: +2-4 Earth Damage: +20% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 10, "col": 8},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 11, "col": 0, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 11, "col": 2, "rotate": 0},
        {"title": "Water Mastery Ability\nSharpshooter Archetype", "desc": "Increases base damage from all Water attacks Water Damage: +2-4 Water Damage: +15% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 11, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 11, "col": 6, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 11, "col": 8, "rotate": 0},
        {"title": "Arrow Rain", "desc": "When Arrow Shield loses its last charge, unleash 200 arrows raining down on enemies Total Damage: 200% (of DPS per arrow) - Neutral: 120% - Air: 80% AP: 2 Req: Arrow Shield", "image": "../media/atree/node.png", "connector": false, "row": 12, "col": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 12, "col": 1, "rotate": 90},
        {"title": "Nimble String", "desc": "Arrow Storm throws out +8 arrows per stream and shoot twice as fast Total Damage: -15% (of DPS per arrow) - Neutral: -15% Blocks: - Phantom Ray AP: 2 Req: Arrow Storm", "image": "../media/atree/node.png", "connector": false, "row": 12, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 12, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 12, "col": 6, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 12, "col": 8, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 13, "col": 0, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 13, "col": 2, "rotate": 0},
        {"title": "Phantom Ray", "desc": "Condense Arrow Storm into a single ray that damages enemies 10 times per second Mana cost: -10 Total Damage: 30% (of DPS per hit) - Neutral: 25% - Water: 5% Range: 12 blocks Blocks: - Windstorm - Nimble String - Arrow Hurricane AP: 2 Req: Arrow Storm Min Sharpshooter: 0/1", "image": "../media/atree/node.png", "connector": false, "row": 13, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 13, "col": 5, "rotate": 90},
        {"title": "Fire Creep\nSharpshooter Archetype", "desc": "Arrow Bomb will leak a trail of fire for 6s, damaging enemies that walk into it every 0.4s Total Damage: 50% (of DPS) - Neutral: 30% - Fire: 20% Duration: 6s AoE: 2 blocks (linear) AP: 2", "image": "../media/atree/node.png", "connector": false, "row": 13, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 13, "col": 7, "rotate": 90},
        {"title": "Bryophyte Roots\nTrapper Archetype", "desc": "When you hit an enemy with Arrow Storm, create an area that slows them down and deals damage every 0.4s Total Damage: 60% (of DPS) - Neutral: 40% - Earth: 20% Effect: 40% Slowness to Enemies Duration: 5s AoE: 2 blocks (circular) AP: 2 Req: Arrow Storm Min Trapper: 0/1", "image": "../media/atree/node.png", "connector": false, "row": 13, "col": 8},
        {"title": "Triple Shot\nBoltslinger Archetype", "desc": "Triple Main Attack arrows, but they deal -20% damage per arrow AP: 1 Req: Double Shots", "image": "../media/atree/node.png", "connector": false, "row": 14, "col": 0},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 14, "col": 1, "rotate": 180},
        {"title": "Frenzy\nBoltslinger Archetype", "desc": "Every time you hit an enemy, briefly gain +6% Walk Speed (Max 200%). Decay -40% of the bonus every second AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 14, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 14, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 14, "col": 8, "rotate": 0},
        {"title": "Guardian Angels Ability", "desc": "Your protective arrows from Arrow Shield will become sentient bows, dealing damage up to 8 times each to nearby enemies (Arrow Shield will no longer push nearby enemies) Total Damage: 60% (of DPS per arrow) - Neutral: 40% - Air: 20% Range: 4 Blocks Duration: 60s AP: 2 Req: Arrow Shield Min Boltslinger: 0/3", "image": "../media/atree/node.png", "connector": false, "row": 15, "col": 1},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 15, "col": 3, "rotate": 180},
        {"title": "Focus Ability\nSharpshooter Archetype", "desc": "When hitting an aggressive mob 5+ blocks away, gain +1 Focus (Max 3). Resets if you miss once Damage Bonus: +35% (per focus) AP: 2 Min Sharpshooter: 0/1", "image": "../media/atree/node.png", "connector": false, "row": 15, "col": 4},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 15, "col": 5, "rotate": 270},
        {"title": "Basaltic Trap Ability\nTrapper Archetype", "desc": "When you hit the ground with Arrow Bomb, leave a Trap that damages enemies (Max 2 Traps) Total Damage: 200% (of DPS) - Neutral: 140% - Earth: 30% - Fire: 30% AoE: 7 Blocks (Circular) AP: 2 Min Trapper: 0/1", "image": "../media/atree/node.png", "connector": false, "row": 15, "col": 8},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 15, "col": 7, "rotate": 180},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 16, "col": 0, "rotate": 180},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 16, "col": 1},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 16, "col": 2, "rotate": 90},
        {"title": "Cheaper Arrow Storm", "desc": "Reduces the Mana cost of Arrow Storm. Mana Cost: -5 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 16, "col": 3},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 16, "col": 4, "rotate": 180},
        {"title": "Grappling Hook Ability\nTrapper Archetype", "desc": "When casting Escape, you throw a hook that pulls you when hitting a block. If you hit a mob, pull them towards you instead. (Escape will not throw you backward anymore) Range: 20 blocks Blocks: - Escape Artist AP: 2", "image": "../media/atree/node.png", "connector": false, "row": 16, "col": 5},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 16, "col": 6, "rotate": 180},
        {"title": "More Shields Ability", "desc": "Give +2 charges to Arrow Shield AP: 1 Req: Arrow Shield", "image": "../media/atree/node.png", "connector": false, "row": 16, "col": 7},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 16, "col": 8, "rotate": 270},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 17, "col": 0, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 17, "col": 1, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 17, "col": 4, "rotate": 0},
        {"title": "Implosion Ability\nTrapper Archetype", "desc": "Arrow Bomb will pull enemies towards you. If a Trap is nearby, it will pull them towards it instead. Increase Heart Shatter's damage Total Damage: +40% (of DPS) - Neutral: +40% AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 17, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 17, "col": 7, "rotate": 0},
        {"title": "Patient Hunter Ability\nTrapper Archetype", "desc": "Your Traps will deal +20% more damage for every second they are active (Max +80%) AP: 2 Req: Basaltic Trap", "image": "../media/atree/node.png", "connector": false, "row": 17, "col": 8},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 18, "col": 0, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 18, "col": 1},
        {"title": "More Focus Ability\nSharpshooter Archetype", "desc": "Add +2 max Focus Damage Bonus: -5% (per focus) AP: 1 Req: Focus", "image": "../media/atree/node.png", "connector": false, "row": 18, "col": 4},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 18, "col": 7, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 19, "col": 0, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 19, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 19, "col": 7, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 20, "col": 0},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 20, "col": 1, "rotate": 180},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 20, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 20, "col": 3, "rotate": 90},
        {"title": "Twain's Arc Ability\nSharpshooter Archetype", "desc": "If you have 2+ Focus, holding shift will summon Twain's Arc. Charge it up to shoot a destructive long-range beam. (Damage is dealt as Main Attack Damage) Total Damage: 200% (of DPS) - Neutral: 200% Range: 64 blocks AP: 2 Min Sharpshooter: 0/4 Req: Focus", "image": "../media/atree/node.png", "connector": false, "row": 20, "col": 4},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 20, "col": 5, "rotate": 180},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 20, "col": 6, "rotate": 270},
        {"title": "Bouncing Bomb Ability", "desc": "Arrow Bomb will bounce once when hitting a block or mob AP: 2", "image": "../media/atree/node.png", "connector": false, "row": 20, "col": 7},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 20, "col": 8, "rotate": 270},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 21, "col": 0, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 21, "col": 1},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 21, "col": 4, "rotate": 0},
        {"title": "Scorched Earth Ability\nSharpshooter Archetype", "desc": "Fire Creep becomes much stronger Total Damage: +15% (of DPS) - Neutral: +10% - Fire: +5% Duration: 2s AoE: +0.4 Blocks (linear) AP: 1 Req: Fire Creep", "image": "../media/atree/node.png", "connector": false, "row": 21, "col": 5},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 21, "col": 6, "rotate": 0},
        {"title": "More Traps Ability\nTrapper Archetype", "desc": "Increase the maximum amount of active Traps you can have by +2 AP: 1 Req: Basaltic Trap", "image": "../media/atree/node.png", "connector": false, "row": 21, "col": 8},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 22, "col": 0, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 22, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 22, "col": 6, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 22, "col": 8, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 23, "col": 0},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 23, "col": 1, "rotate": 180},
        {"title": "Homing Shots Ability", "desc": "Your Main Attack arrows will follow nearby enemies and not be affected by gravity AP: 2", "image": "../media/atree/node.png", "connector": false, "row": 23, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 23, "col": 3, "rotate": 90},
        {"title": "Shocking Bomb Ability\nSharpshooter Archetype", "desc": "Arrow Bomb will not be affected by gravity, and all damage conversions become Thunder AP: 2 Min Sharpshooter: 0/5 Req: Arrow Bomb", "image": "../media/atree/node.png", "connector": false, "row": 23, "col": 4},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 23, "col": 5, "rotate": 180},
        {"title": "Better Arrow Shield Ability", "desc": "Arrow Shield will gain additonal AoE, knockback, and damage Total Damage: +40% (of DPS) - Neutral: +40% AoE: +1 Blocks (Circular) AP: 1 Req: Arrow Shield", "image": "../media/atree/node.png", "connector": false, "row": 23, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 23, "col": 7, "rotate": 90},
        {"title": "Mana Trap Ability\nTrapper Archetype", "desc": "Your Traps will give you 4 Mana per second when you stay close to them Mana Cost: +10 Range: 12 Blocks AP: 2 Min Trapper: 0/5", "image": "../media/atree/node.png", "connector": false, "row": 23, "col": 8},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 24, "col": 0, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 24, "col": 1},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 24, "col": 2, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 24, "col": 5, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 24, "col": 8, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 25, "col": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 25, "col": 1, "rotate": 90},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 25, "col": 2},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 25, "col": 4, "rotate": 180},
        {"title": "Initiator Ability\nSharpshooter Archetype", "desc": "If you do not damage an enemy for 5s for more, your next successful hit will deal +50% damage and add +1 Focus AP: 2 Req: Focus Min Sharpshooter: 0/5", "image": "../media/atree/node.png", "connector": false, "row": 25, "col": 5},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 25, "col": 6, "rotate": 90},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 25, "col": 7, "rotate": 180},
        {"title": "Cheaper Arrow Storm Ability", "desc": "Reduce the Mana cost of Arrow Storm Mana Cost: -5 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 25, "col": 8},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 26, "col": 0, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 26, "col": 2, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 26, "col": 4, "rotate": 0},
        {"title": "Call of the Hound Ability\nTrapper Archetype", "desc": "Arrow Shield summons a Hound that will attack and drag aggressive mobs towards your traps Total Damage: 40% (of DPS) - Neutral: 40% AP: 2 Req: Arrow Shield", "image": "../media/atree/node.png", "connector": false, "row": 26, "col": 7},
        {"title": "Arrow Hurricane Ability\nBoltslinger Archetype", "desc": "Arrow Storm will shoot +2 stream of arrows Blocks: - Phantom Ray AP: 2 Min Boltslinger: 0/8", "image": "../media/atree/node.png", "connector": false, "row": 27, "col": 0},
        {"image": "../media/atree/connect_t.png", "connector": true, "row": 27, "col": 1, "rotate": 180},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 27, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 27, "col": 3, "rotate": 90},
        {"title": "Cheaper Arrow Shield Ability", "desc": "Reduce the Mana cost of Arrow Shield Mana Cost: -5 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 27, "col": 4},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 27, "col": 5, "rotate": 270},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 27, "col": 7, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 28, "col": 1},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 28, "col": 4, "rotate": 0},
        {"title": "Decimator Ability\nSharpshooter Archetype", "desc": "Phantom Ray will increase its damage by 10% everytime you do not miss with it (Max 50%) AP: 2 Req: Phantom Ray", "image": "../media/atree/node.png", "connector": false, "row": 28, "col": 5},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 28, "col": 6, "rotate": 90},
        {"title": "Cheaper Escape Ability", "desc": "Reduce the Mana cost of Escape Mana Cost: -5 AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 28, "col": 7},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 28, "col": 8, "rotate": 270},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 29, "col": 1, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 29, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 29, "col": 7, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 29, "col": 8},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 30, "col": 0, "rotate": 180},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 30, "col": 1},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 30, "col": 2, "rotate": 270},
        {"title": "Crepuscular Ray Ability\nSharpshooter Archetype", "desc": "If you have 5 Focus, casting Arrow Storm will make you levitate and shoot 20 homing arrows per second until you run out of Focus While in that state, you will lose 1 Focus per second Total Damage: 15% (of DPS per arrrow) - Neutral: 10% - Water: 5% AP: 2 Req: Arrow Storm Min Sharpshooter: 0/8", "image": "../media/atree/node.png", "connector": false, "row": 30, "col": 4},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 30, "col": 6, "rotate": 180},
        {"title": "Grape Bomb Ability", "desc": "Arrow Bomb will throw 3 additional smaller bombs when exploding Total Damage: 40% (of DPS) - Neutral: 30% - Fire: 10% AoE: 2 Blocks (Circular) AP: 2", "image": "../media/atree/node.png", "connector": false, "row": 30, "col": 7},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 30, "col": 8, "rotate": 270},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 31, "col": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 31, "col": 2, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 31, "col": 4, "rotate": 0},
        {"title": "Tangled Traps Ability\nTrapper Archetype", "desc": "Your Traps will be connected by a rope that deals damage to enemies every 0.2s Total Damage: 40% (of DPS) - Neutral: 20% - Air: 20% AP: 2", "image": "../media/atree/node.png", "connector": false, "row": 31, "col": 6},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 31, "col": 7, "rotate": 0},
        {"title": "Stringer Patient Hunter Ability\nTrapper Archetype", "desc": "Add +80% Max Damage to Patient Hunter AP: 1", "image": "../media/atree/node.png", "connector": false, "row": 31, "col": 8},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 32, "col": 2, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 32, "col": 4, "rotate": 0},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 32, "col": 7, "rotate": 0},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 33, "col": 1, "rotate": 180},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 33, "col": 2},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 33, "col": 3, "rotate": 90},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 33, "col": 4},
        {"image": "../media/atree/connect_angle.png", "connector": true, "row": 33, "col": 5, "rotate": 270},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 33, "col": 7, "rotate": 0},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 34, "col": 1},
        {"title": "text", "desc": "desc", "image": "../media/atree/node.png", "connector": false, "row": 34, "col": 5},
        {"image": "../media/atree/connect_line.png", "connector": true, "row": 34, "col": 6, "rotate": 90},
        {"title": "Minefield Ability\nTrapper Archetype", "desc": "Allow you to place +6 Traps, but with reduced damage and range Total Damage: -80% (of DPS) - Neutral: -80% AoE: -2 Blocks (Circular) AP: 2 Req: Basaltic Trap Min Trapper: 0/10", "image": "../media/atree/node.png", "connector": false, "row": 34, "col": 7},
    ],
    "Assassin": [
        {
            "title": "Spin Attack",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 0,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 1,
            "col": 4
        },
        {
            "title": "Dagger Proficiency I",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 2,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 2,
            "col": 3
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 2,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 3,
            "col": 4
        },
        {
            "title": "Double Spin",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 4,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 5,
            "col": 4
        },
        {
            "title": "Dash",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 6,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 6,
            "col": 3
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 6,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 6,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 6,
            "col": 6
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 7,
            "col": 2
        },
        {
            "title": "Smoke Bomb",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 8,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 7,
            "col": 6
        },
        {
            "title": "Multihit",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 8,
            "col": 6
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 8,
            "col": 3
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 8,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 8,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 8,
            "col": 1
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 8,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 9,
            "col": 0
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 10,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 9,
            "col": 2
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 10,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 9,
            "col": 6
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 10,
            "col": 6
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 8,
            "col": 7
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 8,
            "col": 8
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 9,
            "col": 8
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 10,
            "col": 8
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 10,
            "col": 1
        },
        {
            "title": "Backstab",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 11,
            "col": 1
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 9,
            "col": 4
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 90,
            "row": 10,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 10,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 11,
            "col": 4
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 10,
            "col": 7
        },
        {
            "title": "Fatality",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 11,
            "col": 7
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 11,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 12,
            "col": 0
        },
        {
            "title": "Violent Vortex",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 13,
            "col": 0
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 11,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 12,
            "col": 2
        },
        {
            "title": "Vanish",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 13,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 12,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 13,
            "col": 3
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 13,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 13,
            "col": 6
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 14,
            "col": 2
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 15,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 14,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 15,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 12,
            "col": 7
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 13,
            "col": 7
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 14,
            "col": 7
        },
        {
            "title": "Lacerate",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 15,
            "col": 7
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 15,
            "col": 1
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 16,
            "col": 1
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 15,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 16,
            "col": 5
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 15,
            "col": 8
        },
        {
            "title": "Wall of Smoke",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 16,
            "col": 8
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 16,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 17,
            "col": 0
        },
        {
            "title": "Silent Killer",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 18,
            "col": 0
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 16,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 17,
            "col": 2
        },
        {
            "title": "Shadow Travel",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 18,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 17,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 18,
            "col": 5
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 17,
            "col": 8
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 18,
            "col": 8
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 18,
            "col": 4
        },
        {
            "title": "Exploding Clones",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 19,
            "col": 4
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 18,
            "col": 3
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 19,
            "col": 0
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 20,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 19,
            "col": 3
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 20,
            "col": 3
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 18,
            "col": 6
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 18,
            "col": 7
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 19,
            "col": 7
        },
        {
            "title": "Weightless",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 20,
            "col": 7
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 20,
            "col": 1
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 20,
            "col": 2
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 21,
            "col": 1
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 20,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 21,
            "col": 4
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 20,
            "col": 6
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 21,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 21,
            "col": 6
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 20,
            "col": 8
        },
        {
            "title": "Dancing Blade",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 21,
            "col": 8
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 21,
            "col": 0
        },
        {
            "title": "Spin Attack Damage",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 22,
            "col": 0
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 21,
            "col": 3
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 22,
            "col": 3
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 22,
            "col": 1
        },
        {
            "title": "Marked",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 23,
            "col": 1
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 22,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 23,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 23,
            "col": 5
        },
        {
            "title": "Shurikens",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 23,
            "col": 6
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 23,
            "col": 7
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 22,
            "col": 8
        },
        {
            "title": "Far Reach",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 23,
            "col": 8
        },
        {
            "title": "Stronger Multihit",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 24,
            "col": 5
        },
        {
            "title": "Psithurism",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 24,
            "col": 7
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 24,
            "col": 1
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 25,
            "col": 1
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 25,
            "col": 3
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 24,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 25,
            "col": 4
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 25,
            "col": 5
        },
        {
            "title": "Choke Bomb",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 25,
            "col": 6
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 25,
            "col": 7
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 25,
            "col": 8
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 26,
            "col": 5
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 25,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 26,
            "col": 0
        },
        {
            "title": "Death Magnet",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 27,
            "col": 0
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 25,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 26,
            "col": 2
        },
        {
            "title": "Cheaper Multihit",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 27,
            "col": 2
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 26,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 27,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 26,
            "col": 7
        },
        {
            "title": "Parry",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 27,
            "col": 7
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 27,
            "col": 1
        },
        {
            "title": "Fatal Spin",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 28,
            "col": 1
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 27,
            "col": 3
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 28,
            "col": 3
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 27,
            "col": 6
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 28,
            "col": 6
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 27,
            "col": 8
        },
        {
            "title": "Wall Jump",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 28,
            "col": 8
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 28,
            "col": 0
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 29,
            "col": 0
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 29,
            "col": 1
        },
        {
            "title": "Harvester",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 30,
            "col": 1
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 28,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 29,
            "col": 4
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 30,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 28,
            "col": 7
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 29,
            "col": 7
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 30,
            "col": 7 
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 30,
            "col": 2
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 31,
            "col": 2 
        },
        {
            "image": "../media/atree/connect_t.png",
            "connector": true,
            "rotate": 180,
            "row": 30,
            "col": 5
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 90,
            "row": 30,
            "col": 6
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 31,
            "col": 5
        },
        {
            "title": "Ricochet",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 31,
            "col": 8
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 31,
            "col": 1
        },
        {
            "title": "Satsujin",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 32,
            "col": 1
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 31,
            "col": 4
        },
        {
            "title": "Forbidden Art",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 32,
            "col": 4
        },
        {
            "image": "../media/atree/connect_line.png",
            "connector": true,
            "rotate": 0,
            "row": 31,
            "col": 7
        },
        {
            "title": "Jasmine Bloom",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 32,
            "col": 7
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 180,
            "row": 32,
            "col": 0
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 33,
            "col": 0
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 32,
            "col": 2
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 33,
            "col": 2
        },
        {
            "image": "../media/atree/connect_angle.png",
            "connector": true,
            "rotate": 270,
            "row": 32,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 33,
            "col": 5
        },
        {
            "title": "Text",
            "desc": "desc",
            "image": "../media/atree/node.png",
            "connector": false,
            "row": 33,
            "col": 8
        },
    ],
    "Warrior": [],
    "Mage": [],
    "Shaman": []
}

const atree_example = [
    {
        "title": "skill",
        "desc": "desc",
        "image": "../media/atree/node.png",
        "connector": false,
        "row": 5,
        "col": 3,
    },
    {
        "image": "../media/atree/connect_angle.png",
        "connector": true,
        "rotate": 270,
        "row": 4,
        "col": 3,
    },
    {
        "title": "skill2",
        "desc": "desc",
        "image": "../media/atree/node.png",
        "connector": false,
        "row": 0,
        "col": 2            
    },
    {
        "image": "../media/atree/connect_line.png",
        "connector": true,
        "rotate": 0,
        "row": 1,
        "col": 2
    },
    {
        "title": "skill3",
        "desc": "desc",
        "image": "../media/atree/node.png",
        "connector": false,
        "row": 2,
        "col": 2            
    },
    {
        "image": "../media/atree/connect_line.png",
        "connector": true,
        "rotate": 90,
        "row": 2,
        "col": 3
    },
    {
        "title": "skill4",
        "desc": "desc",
        "image": "../media/atree/node.png",
        "connector": false,
        "row": 2,
        "col": 4
    },
    {
        "image": "../media/atree/connect_line.png",
        "connector": true,
        "rotate": 0,
        "row": 3,
        "col": 2
    },
    {
        "title": "skill5",
        "desc": "desc",
        "image": "../media/atree/node.png",
        "connector": false,
        "row": 4,
        "col": 2
    },
];
