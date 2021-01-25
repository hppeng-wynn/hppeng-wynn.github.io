// ported from Wynntils item search infrastructure, which is licensed under GNU AGPL 3
// the search string format is not one-to-one, but it's close enough

function quoteIfContainsSpace(str) {
    return str.indexOf(' ') === -1 ? str : `"${str}"`;
}

class Type {

    static typeRegistry = new Map();

    static getType(name) {
        const type = Type.typeRegistry.get(name.toLowerCase());
        if (type == null) throw new Error(`Unknown filter type: ${name}`);
        return type;
    }

    constructor(name, desc, aliases, parseFn) {
        if (!Array.isArray(aliases)) {
            parseFn = aliases;
            aliases = [];
        }

        this.name = name;
        this.desc = desc;
        this.parseFn = parseFn;

        Type.typeRegistry.set(name.toLowerCase(), this);
        for (const alias of aliases) {
            Type.typeRegistry.set(alias.toLowerCase(), this);
        }
    }

    parse(filterStr) {
        return this.parseFn(filterStr);
    }
    
}

const SortDirection = {
    ascending: { prefix: '^', modifyComparison: cmp => cmp },
    descending: { prefix: '$', modifyComparison: cmp => -cmp },
    none: { prefix: '', modifyComparison: cmp => 0 }
};

const Comparison = {
    lt: { symbol: '<', test: cmp => cmp < 0 },
    leq: { symbol: '<=', test: cmp => cmp <= 0 },
    eq: { symbol: '=', test: cmp => cmp === 0 },
    neq: { symbol: '!=', test: cmp => cmp !== 0 },
    geq: { symbol: '>=', test: cmp => cmp >= 0 },
    gt: { symbol: '>', test: cmp => cmp > 0 }
};

function parseSortDirection(filterStr) {
    if (filterStr) {
        switch (filterStr.charAt(0)) {
            case '^':
                return [filterStr.substring(1), SortDirection.ascending];
            case '$':
                return [filterStr.substring(1), SortDirection.descending];
        }
    }
    return [filterStr, SortDirection.none];
}

function parseComparisons(filterStr, extractKey) {
    if (!filterStr) return [];
    const rels = [];
    const relStrs = filterStr.split(',');
    for (let i = 0; i < relStrs.length; i++) {
        const relStr = relStrs[i];
        if (!relStr) continue;
        if (relStr.startsWith('<=')) {
            rels.push([Comparison.leq, extractKey(relStr.substring(2))]);
        } else if (relStr.startsWith('>=')) {
            rels.push([Comparison.geq, extractKey(relStr.substring(2))]);
        } else if (relStr.startsWith('!=')) {
            rels.push([Comparison.neq, extractKey(relStr.substring(2))]);
        } else {
            switch (relStr.charAt(0)) {
                case '<':
                    rels.push([Comparison.lt, extractKey(relStr.substring(1))]);
                    continue;
                case '>':
                    rels.push([Comparison.gt, extractKey(relStr.substring(1))]);
                    continue;
                case '=':
                    rels.push([Comparison.eq, extractKey(relStr.substring(1))]);
                    continue;
            }
            const rangeDelimNdx = relStr.indexOf('..');
            if (rangeDelimNdx === -1) {
                rels.push([Comparison.eq, extractKey(relStr)]);
                continue;
            }
            rels.push([Comparison.geq, extractKey(relStr.substring(0, rangeDelimNdx))]);
            rels.push([Comparison.leq, extractKey(relStr.substring(rangeDelimNdx + 2))]);
        }
    }
    return rels;
}

class NameFilter {

    static TYPE = new Type('Name', 'Item Name', function(filterStr) {
        return new NameFilter(...parseSortDirection(filterStr));
    });
    
    constructor(searchStr, sortDir) {
        this.searchStr = searchStr.toLowerCase();
        this.sortDir = sortDir;
    }

    adjoin(other) { // this is a hack; don't call this unless you're ItemSearchState!
        this.searchStr = !this.searchStr ? other.searchStr : `${this.searchStr} ${other.searchStr}`;
    }

    getFilterType() {
        return NameFilter.TYPE;
    }

    toFilterString() {
        const str = `${NameFilter.TYPE.name}:${this.sortDir.prefix}`;
        return !this.searchStr ? str : (str + quoteIfContainsSpace(this.searchStr));
    }

    test(item, itemExp) {
        return (item.displayName || item.name).toLowerCase().includes(this.searchStr);
    }

    compare(a, aExp, b, bExp) {
        return this.sortDir.modifyComparison((a.displayName || a.name).toLowerCase().localeCompare((b.displayName || b.name).toLowerCase()));
    }

}

class TypeFilter {

    static TYPE = new Type('Type', 'Item Type', function(filterStr) {
        const [typeStr, sortDir] = parseSortDirection(filterStr);
        const allowedTypes = new Set();
        const tokens = typeStr.split(',');
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i].trim().toLowerCase();
            if (!token) continue;
            switch (token) {
                case 'armor':
                case 'armour':
                    for (let i = 0; i < TypeFilter.ARMOUR_TYPES.length; i++) allowedTypes.add(TypeFilter.ARMOUR_TYPES[i]);
                    break;
                case 'weapon':
                    for (let i = 0; i < TypeFilter.WEAPON_TYPES.length; i++) allowedTypes.add(TypeFilter.WEAPON_TYPES[i]);
                    break;
                case 'accessory':
                case 'bauble':
                    for (let i = 0; i < TypeFilter.ACCESSORY_TYPES.length; i++) allowedTypes.add(TypeFilter.ACCESSORY_TYPES[i]);
                    break;
                default:
                    allowedTypes.add(token.toLowerCase());
                    break;
            }
        }
        return new TypeFilter(allowedTypes, sortDir);
    });

    static WEAPON_TYPES = ['wand', 'dagger', 'spear', 'bow', 'relik'];
    static ARMOUR_TYPES = ['helmet', 'chestplate', 'leggings', 'boots'];
    static ACCESSORY_TYPES = ['necklace', 'ring', 'bracelet'];
    static TYPE_INDICES = (function() {
        const typeIndices = {};
        let i = 0;
        for (const type of [...TypeFilter.WEAPON_TYPES, ...TypeFilter.ARMOUR_TYPES, ...TypeFilter.ACCESSORY_TYPES]) {
            typeIndices[type] = i++;
        }
        return typeIndices;
    })();

    constructor(allowedTypes, sortDir) {
        this.allowedTypes = allowedTypes;
        this.sortDir = sortDir;
    }

    getFilterType() {
        return TypeFilter.TYPE;
    }

    toFilterString() {
        const keys = [];
        this.categoryToFilterString(TypeFilter.ARMOUR_TYPES, 'armor', keys);
        this.categoryToFilterString(TypeFilter.WEAPON_TYPES, 'weapon', keys);
        this.categoryToFilterString(TypeFilter.ACCESSORY_TYPES, 'accessory', keys);
        const str = `${TypeFilter.TYPE.name}:${this.sortDir.prefix}`;
        return keys.length === 0 ? str : (str + quoteIfContainsSpace(keys.join(',')));
    }

    categoryToFilterString(types, categoryName, dest) {
        for (let i = 0; i < types.length; i++) {
            if (!this.allowedTypes.has(types[i])) {
                // not all the types in the category are allowed, so add all the individual types
                for (let i = 0; i < types.length; i++) {
                    if (this.allowedTypes.has(types[i])) dest.add(types[i].name.toLowerCase());
                }
                return;
            }
        }
        dest.add(categoryName); // all the types in the category are allowed, so just add the category
    }

    test(item, itemExp) {
        return this.allowedTypes.has(item.type);
    }

    compare(a, aExp, b, bExp) {
        return this.sortDir.modifyComparison(TypeFilter.TYPE_INDICES[a.type] - TypeFilter.TYPE_INDICES[b.type]);
    }

}

class RarityFilter {

    static TYPE = new Type('Rarity', 'Item Rarity', ['Tier'], function(filterStr) {
        const [rarityStr, sortDir] = parseSortDirection(filterStr);
        return new RarityFilter(parseComparisons(rarityStr, s => s.trim().toLowerCase()), sortDir);
    });
    
    static RARITY_INDICES = { 'normal': 0, 'unique': 1, 'rare': 2, 'legendary': 3, 'fabled': 4, 'mythic': 5 };
    
    constructor(comps, sortDir) {
        this.comps = comps;
        this.sortDir = sortDir;
    }
    
    getFilterType() {
        return RarityFilter.TYPE;
    }
    
    toFilterString() {
        return `${RarityFilter.TYPE.name}:${this.sortDir.prefix}${this.comps.map(this.stringifyComparison).join(',')}`;
    }
    
    stringifyComparison([comp, rarity]) {
        return `${comp === Comparison.eq ? '' : comp.symbol}${rarity}`
    }
    
    test(item, itemExp) {
        for (let i = 0; i < this.comps.length; i++) {
            if (!this.comps[i][0].test(RarityFilter.RARITY_INDICES[item.tier.toLowerCase()] - RarityFilter.RARITY_INDICES[this.comps[i][1]])) return false;
        }
        return true;
    }
    
    compare(a, aExp, b, bExp) {
        return this.sortDir.modifyComparison(RarityFilter.RARITY_INDICES[a.tier.toLowerCase()] - RarityFilter.RARITY_INDICES[b.tier.toLowerCase()]);
    }

}

class StatType extends Type {

    static sum(name, desc, ...summands) {
        return new StatType(name, desc, i => {
            let value = 0;
            for (let i = 0; i < summands.length; i++) value += summands[i].extractStat(i);
            return value;
        });
    }

    constructor(name, desc, aliases, statExtractor) {
        super(name, desc, aliases);
        this.statExtractor = statExtractor;
    }

    extractStat(item, itemExp) {
        return this.statExtractor(item, itemExp);
    }

    parse(filterStr) {
        const [valueStr, sortDir] = parseSortDirection(filterStr);
        const comparisons = parseComparisons(valueStr, s => {
            const value = parseInt(s, 10);
            if (isNaN(value)) throw new Error(`Not a number: ${s}`);
            return value;
        });
        return new StatFilter(this, comparisons, sortDir);
    }

}

function getAverageDamage(item, dmgType) {
    return item.hasOwnProperty(dmgType) ? item[dmgType].split('-').map(s => parseInt(s, 10)) : 0;
}

function getMaxRoll(base) {
    return base === 0 ? 0 : (base > 0 ? Math.round(base * 1.3) : Math.round(base ))
}

class StatFilter {

    // requirements
    static TYPE_COMBAT_LEVEL = new StatType('Level', 'Combat Level', ['Lvl', 'CombatLevel', 'CombatLvl'], (i, ie) => i.lvl);
    static TYPE_STR_REQ = new StatType('StrReq', 'Strength Min', ['StrMin'], (i, ie) => i.strReq);
    static TYPE_DEX_REQ = new StatType('DexReq', 'Dexterity Min', ['DexMin'], (i, ie) => i.dexReq);
    static TYPE_INT_REQ = new StatType('IntReq', 'Intelligence Min', ['IntMin'], (i, ie) => i.intReq);
    static TYPE_DEF_REQ = new StatType('DefReq', 'Defence Min', ['DefMin'], (i, ie) => i.defReq);
    static TYPE_AGI_REQ = new StatType('AgiReq', 'Agility Min', ['AgiMin'], (i, ie) => i.agiReq);
    static TYPE_SUM_REQ = StatType.sum('SumReq', 'Total Skill Points Min', ['SumMin', 'TotalReq', 'TotalMin'],
        StatFilter.TYPE_STR_REQ, StatFilter.TYPE_DEX_REQ, StatFilter.TYPE_INT_REQ, StatFilter.TYPE_DEF_REQ, StatFilter.TYPE_AGI_REQ);

    // damages
    static TYPE_NEUTRAL_DMG = new StatType('NeutralDmg', 'Neutral Damage', (i, ie) => getAverageDamage(i, 'nDam'));
    static TYPE_EARTH_DMG = new StatType('EarthDmg', 'Earth Damage', (i, ie) => getAverageDamage(i, 'eDam'));
    static TYPE_THUNDER_DMG = new StatType('ThunderDmg', 'Thunder Damage', (i, ie) => getAverageDamage(i, 'tDam'));
    static TYPE_WATER_DMG = new StatType('WaterDmg', 'Water Damage', (i, ie) => getAverageDamage(i, 'wDam'));
    static TYPE_FIRE_DMG = new StatType('FireDmg', 'Fire Damage', (i, ie) => getAverageDamage(i, 'fDam'));
    static TYPE_AIR_DMG = new StatType('AirDmg', 'Air Damage', (i, ie) => getAverageDamage(i, 'aDam'));
    static TYPE_SUM_DMG = StatType.sum('SumDmg', 'Total Damage', ['TotalDmg'],
        StatFilter.TYPE_NEUTRAL_DMG, StatFilter.TYPE_EARTH_DMG, StatFilter.TYPE_THUNDER_DMG,
        StatFilter.TYPE_WATER_DMG, StatFilter.TYPE_FIRE_DMG, StatFilter.TYPE_AIR_DMG);

    // defenses
    static TYPE_HEALTH = new StatType('Health', 'Health', ['hp'], (i, ie) => i.hp || 0);
    static TYPE_EARTH_DEF = new StatType('EarthDef', 'Earth Defence', (i, ie) => i.eDef || 0);
    static TYPE_THUNDER_DEF = new StatType('ThunderDef', 'Thunder Defence', (i, ie) => i.tDef || 0);
    static TYPE_WATER_DEF = new StatType('WaterDef', 'Water Defence', (i, ie) => i.wDef || 0);
    static TYPE_FIRE_DEF = new StatType('FireDef', 'Fire Defence', (i, ie) => i.fDef || 0);
    static TYPE_AIR_DEF = new StatType('AirDef', 'Air Defence', (i, ie) => i.aDef || 0);
    static TYPE_SUM_DEF = StatType.sum('SumDef', 'Total Defence', ['TotalDef'],
        StatFilter.TYPE_EARTH_DEF, StatFilter.TYPE_THUNDER_DEF, StatFilter.TYPE_WATER_DEF, StatFilter.TYPE_FIRE_DEF, StatFilter.TYPE_AIR_DEF);

    // attribute ids
    static TYPE_STR = new StatType('Str', 'Strength', (i, ie) => i.str);
    static TYPE_DEX = new StatType('Dex', 'Dexterity', (i, ie) => i.dex);
    static TYPE_INT = new StatType('Int', 'Intelligence', (i, ie) => i.int);
    static TYPE_DEF = new StatType('Def', 'Defence', (i, ie) => i.def);
    static TYPE_AGI = new StatType('Agi', 'Agility', (i, ie) => i.agi);
    static TYPE_SKILL_POINTS = StatType.sum('SkillPoints', 'Total Skill Points', ['SkillPts', 'Attributes', 'Attrs'],
        StatFilter.TYPE_STR, StatFilter.TYPE_DEX, StatFilter.TYPE_INT, StatFilter.TYPE_DEF, StatFilter.TYPE_AGI);

    // damage ids
    static TYPE_MAIN_ATK_NEUTRAL_DMG = new StatType('MainAtkNeutralDmg', 'Main Attack Neutral Damage', ['MainAtkRawDmg'], (i, ie) => ie.get('maxRolls').get('mdRaw'));
    static TYPE_MAIN_ATK_DMG = new StatType('MainAtkDmg', 'Main Attack Damage %', ['MainAtkDmg%', '%MainAtkDmg', 'Melee%', '%Melee'], (i, ie) => i.get('maxRolls').get('mdPct'));
    static TYPE_SPELL_NEUTRAL_DMG = new StatType('SpellNeutralDmg', 'Neutral Spell Damage', ['SpellRawDmg'], (i, ie) => ie.get('maxRolls').get('sdRaw'));
    static TYPE_SPELL_DMG = new StatType('SpellDmg', 'Spell Damage %', ['SpellDmg%', '%SpellDmg', 'Spell%', '%Spell', 'sd'], (i, ie) => ie.get('maxRolls').get('sdPct'));
    static TYPE_BONUS_EARTH_DMG = new StatType('BonusEarthDmg', 'Earth Damage %', ['EarthDmg%', '%EarthDmg'], (i, ie) => ie.get('maxRolls').get('eDamPct'));
    static TYPE_BONUS_THUNDER_DMG = new StatType('BonusThunderDmg', 'Thunder Damage %', ['ThunderDmg%', '%ThunderDmg'], (i, ie) => ie.get('maxRolls').get('tDamPct'));
    static TYPE_BONUS_WATER_DMG = new StatType('BonusWaterDmg', 'Water Damage %', ['WaterDmg%', '%WaterDmg'], (i, ie) => ie.get('maxRolls').get('wDamPct'));
    static TYPE_BONUS_FIRE_DMG = new StatType('BonusFireDmg', 'Fire Damage %', ['FireDmg%', '%FireDmg'], (i, ie) => ie.get('maxRolls').get('fDamPct'));
    static TYPE_BONUS_AIR_DMG = new StatType('BonusAirDmg', 'Air Damage %', ['AirDmg%', '%AirDmg'], (i, ie) => ie.get('maxRolls').get('aDamPct'));
    static TYPE_BONUS_SUM_DMG = StatType.sum('BonusSumDmg', 'Total Damage %', ['SumDmg%', '%SumDmg', 'BonusTotalDmg', 'TotalDmg%', '%TotalDmg'],
        StatFilter.TYPE_BONUS_EARTH_DMG, StatFilter.TYPE_BONUS_THUNDER_DMG, StatFilter.TYPE_BONUS_WATER_DMG, StatFilter.TYPE_BONUS_FIRE_DMG, StatFilter.TYPE_BONUS_AIR_DMG);

    // defense ids
    static TYPE_BONUS_HEALTH = new StatType('BonusHealth', 'Bonus Health', ['Health+', 'hp+'], (i, ie) => ie.get('maxRolls').get('hpBonus'));
    static TYPE_SUM_HEALTH = StatType.sum('SumHealth', 'Total Health', ['SumHp', 'TotalHealth', 'TotalHp'],
        StatFilter.TYPE_HEALTH, StatFilter.TYPE_BONUS_HEALTH);
    static TYPE_BONUS_EARTH_DEF = new StatType('BonusEarthDef', 'Earth Defence %', ['EarthDef%', '%EarthDef'], (i, ie) => ie.get('maxRolls').get('eDefPct'));
    static TYPE_BONUS_THUNDER_DEF = new StatType('BonusThunderDef', 'Thunder Defence %', ['ThunderDef%', '%ThunderDef'], (i, ie) => ie.get('maxRolls').get('tDefPct'));
    static TYPE_BONUS_WATER_DEF = new StatType('BonusWaterDef', 'Water Defence %', ['WaterDef%', '%WaterDef'], (i, ie) => ie.get('maxRolls').get('wDefPct'));
    static TYPE_BONUS_FIRE_DEF = new StatType('BonusFireDef', 'Fire Defence %', ['FireDef%', '%FireDef'], (i, ie) => ie.get('maxRolls').get('fDefPct'));
    static TYPE_BONUS_AIR_DEF = new StatType('BonusAirDef', 'Air Defence %', ['AirDef%', '%AirDef'], (i, ie) => ie.get('maxRolls').get('aDefPct'));
    static TYPE_BONUS_SUM_DEF = StatType.sum('BonusSumDef', 'Total Defence %', ['SumDef%', '%SumDef', 'BonusTotalDef', 'TotalDef%', '%TotalDef'],
        StatFilter.TYPE_BONUS_EARTH_DEF, StatFilter.TYPE_BONUS_THUNDER_DEF, StatFilter.TYPE_BONUS_WATER_DEF,StatFilter.TYPE_BONUS_FIRE_DEF, StatFilter.TYPE_BONUS_AIR_DEF);

    // resource regen ids
    static TYPE_RAW_HEALTH_REGEN = new StatType('RawHealthRegen', 'Health Regen', ['hpr', 'hr'], (i, ie) => ie.get('maxRolls').get('hprRaw'));
    static TYPE_HEALTH_REGEN = new StatType('HealthRegen', 'Health Regen %', ['hpr%', '%hpr', 'hr%', '%hr'], (i, ie) => ie.get('maxRolls').get('hprPct'));
    static TYPE_LIFE_STEAL = new StatType('LifeSteal', 'Life Steal', ['ls'], (i, ie) => ie.get('maxRolls').get('ls'));
    static TYPE_MANA_REGEN = new StatType('ManaRegen', 'Mana Regen', ['mr'], (i, ie) => ie.get('maxRolls').get('mr'));
    static TYPE_MANA_STEAL = new StatType('ManaSteal', 'Mana Steal', ['ms'], (i, ie) => ie.get('maxRolls').get('ms'));

    // movement ids
    static TYPE_WALK_SPEED = new StatType('WalkSpeed', 'Walk Speed', ['MoveSpeed', 'ws'], (i, ie) => ie.get('maxRolls').get('spd'));
    static TYPE_SPRINT = new StatType('Sprint', 'Sprint', (i, ie) => ie.get('maxRolls').get('sprint'));
    static TYPE_SPRINT_REGEN = new StatType('SprintRegen', 'Sprint Regen', (i, ie) => ie.get('maxRolls').get('sprintReg'));
    static TYPE_JUMP_HEIGHT = new StatType('JumpHeight', 'Jump Height', ['jh'], (i, ie) => ie.get('maxRolls').get('jh'));

    // spell cost ids
    static TYPE_RAW_SPELL_COST_1 = new StatType('RawSpellCost1', '1st Spell Cost', (i, ie) => ie.get('minRolls').get('spRaw1'));
    static TYPE_SPELL_COST_1 = new StatType('SpellCost1', '1st Spell Cost %', (i, ie) => ie.get('minRolls').get('spPct1'));
    static TYPE_RAW_SPELL_COST_2 = new StatType('RawSpellCost2', '2nd Spell Cost', (i, ie) => ie.get('minRolls').get('spRaw2'));
    static TYPE_SPELL_COST_2 = new StatType('SpellCost2', '2nd Spell Cost %', (i, ie) => ie.get('minRolls').get('spPct2'));
    static TYPE_RAW_SPELL_COST_3 = new StatType('RawSpellCost3', '3rd Spell Cost', (i, ie) => ie.get('minRolls').get('spRaw3'));
    static TYPE_SPELL_COST_3 = new StatType('SpellCost3', '3rd Spell Cost %', (i, ie) => ie.get('minRolls').get('spPct3'));
    static TYPE_RAW_SPELL_COST_4 = new StatType('RawSpellCost4', '4th Spell Cost', (i, ie) => ie.get('minRolls').get('spRaw4'));
    static TYPE_SPELL_COST_4 = new StatType('SpellCost4', '4th Spell Cost %', (i, ie) => ie.get('minRolls').get('spPct4'));
    static TYPE_RAW_SPELL_COST_SUM = StatType.sum('RawSpellCostSum', 'Total Spell Cost', ['RawSpellCostTotal'],
        StatFilter.TYPE_RAW_SPELL_COST_1, StatFilter.TYPE_RAW_SPELL_COST_2, StatFilter.TYPE_RAW_SPELL_COST_3, StatFilter.TYPE_RAW_SPELL_COST_4);
    static TYPE_SPELL_COST_SUM = StatType.sum('SpellCostSum', 'Total Spell Cost %', ['SpellCostTotal'],
        StatFilter.TYPE_SPELL_COST_1, StatFilter.TYPE_SPELL_COST_2, StatFilter.TYPE_SPELL_COST_3, StatFilter.TYPE_SPELL_COST_4);

    // loot and xp ids
    static TYPE_LOOT_BONUS = new StatType('LootBonus', 'Loot Bonus', ['lb'], (i, ie) => ie.get('maxRolls').get('lb'));
    static TYPE_STEALING = new StatType('Stealing', 'Stealing', (i, ie) => ie.get('maxRolls').get('eSteal'));
    static TYPE_XP_BONUS = new StatType('XpBonus', 'Xp Bonus', ['xp', 'xb', 'xpb'], (i, ie) => ie.get('maxRolls').get('xpb'));
    static TYPE_LOOT_QUALITY = new StatType('LootQuality', 'Loot Quality', ['lq'], (i, ie) => ie.get('maxRolls').get('lq'));
    static TYPE_GATHERING_XP_BONUS = new StatType('GatherXpBonus', 'Gathering Xp Bonus', ['gxp', 'gxpb'], (i, ie) => ie.get('maxRolls').get('gXp'));
    static TYPE_GATHERING_SPEED = new StatType('GatherSpeed', 'Gathering Speed', ['gs', 'gspd'], (i, ie) => ie.get('maxRolls').get('gSpd'));

    // other ids
    static TYPE_BONUS_ATK_SPD = new StatType('BonusAtkSpd', 'Bonus Attack Speed', ['AtkSpd+'], (i, ie) => ie.get('maxRolls').get('atkTier'));
    static TYPE_EXPLODING = new StatType('Exploding', 'Exploding', (i, ie) => ie.get('maxRolls').get('expd'));
    static TYPE_POISON = new StatType('Poison', 'Poison', (i, ie) => ie.get('maxRolls').get('poison'));
    static TYPE_THORNS = new StatType('Thorns', 'Thorns', (i, ie) => ie.get('maxRolls').get('thorns'));
    static TYPE_REFLECTION = new StatType('Reflection', 'Reflection', (i, ie) => ie.get('maxRolls').get('ref'));
    static TYPE_SOUL_POINT_REGEN = new StatType('SoulPointRegen', 'Soul Point Regen', (i, ie) => ie.get('maxRolls').get('spRegen'));

    // other stuff
    static TYPE_ATTACK_SPEED = new StatType('AtkSpd', 'Attack Speed', (i, ie) => i.atkSpd ? StatFilter.ATK_SPD_INDICES[i.atkSpd] : 0);
    static TYPE_ATK_SPD_SUM = StatType.sum('SumAtkSpd', 'Total Attack Speed', ['TotalAtkSpd'],
        StatFilter.TYPE_BONUS_ATK_SPD, StatFilter.TYPE_ATTACK_SPEED);
    static TYPE_POWDER_SLOTS = new StatType('PowderSlots', 'Powder Slot Count', ['Powders'], (i, ie) => i.slots);

    static ATK_SPD_INDICES = { 'SUPER_SLOW': -3, 'VERY_SLOW': -2, 'SLOW': -1, 'NORMAL': 0, 'FAST': 1, 'VERY_FAST': 2, 'SUPER_FAST': 3 };

    constructor(type, comps, sortDir) {
        this.type = type;
        this.comps = comps;
        this.sortDir = sortDir;
    }

    getFilterType() {
        return this.type;
    }

    toFilterString() {
        return `${this.type.name}:${this.sortDir.prefix}${this.comps.map(this.stringifyComparison).join(',')}`;
    }

    stringifyComparison([comp, value]) {
        return `${comp === Comparison.eq ? '' : comp.symbol}${value}`;
    }

    test(item, itemExp) {
        for (let i = 0; i < this.comps.length; i++) {
            if (!this.comps[i][0].test(this.type.extractStat(item, itemExp) - this.comps[i][1])) return false;
        }
        return true;
    }

    compare(a, aExp, b, bExp) {
        return this.sortDir.modifyComparison(this.type.extractStat(a, aExp) - this.type.extractStat(b, bExp));
    }

}

class StringType extends Type {

    constructor(name, desc, aliases, stringExtractor) {
        super(name, desc, aliases);
        this.stringExtractor = stringExtractor;
    }

    extractString(item, itemExp) {
        return this.stringExtractor(item, itemExp);
    }

    parse(filterStr) {
        return new StringFilter(this, ...parseSortDirection(filterStr));
    }

}

class StringFilter {

    static TYPE_SET = new StringType('Set', (i, ie) => i.set);
    static TYPE_RESTRICTION = new StringType('Restriction', 'Item Restriction', (i, ie) => i.restrict || null);

    constructor(type, matchStr, sortDir) {
        this.type = type;
        this.matchStr = matchStr.toLowerCase();
        this.sortDir = sortDir;
    }

    getFilterType() {
        return this.type;
    }

    toFilterString() {
        return `${this.type.name}:${this.sortDir.prefix}${quoteIfContainsSpace(this.matchStr)}`;
    }

    test(item, itemExp) {
        const s = this.type.extractString(item, itemExp);
        return s != null && s.toLowerCase().includes(this.matchStr);
    }

    compare(a, aExp, b, bExp) {
        return this.sortDir.modifyComparison(this.type.extractString(a, aExp).localeCompare(this.type.extractString(b, bExp)));
    }

}

class MajorIdFilter {

    static TYPE = new Type('MajorId', 'Major Identifications', function(filterStr) {
        return new MajorIdFilter(filterStr.split(','));
    });

    constructor(majorIds) {
        this.majorIds = majorIds.map(s => s.toLowerCase()).filter(s => s);
    }

    getFilterType() {
        return MajorIdFilter.TYPE;
    }

    toFilterString() {
        return `${MajorIdFilter.TYPE.name}:${quoteIfContainsSpace(this.majorIds.join(','))}`;
    }

    test(item, itemExp) {
        const itemIds = item.majorIds;
        if (!itemIds) return false;
        // quadratic-time subset check is bad, but items generally don't have many major IDs so it should be fine in practice
        iter_ids:
        for (let i = 0; i < this.majorIds.length; i++) {
            for (let j = 0; j < itemIds.length; j++) {
                if (itemIds[j].toLowerCase().contains(this.majorIds[i])) continue iter_ids;
            }
            return false;
        }
        return true;
    }

    compare(a, aExp, b, bExp) {
        return 0;
    }

}

function parseFilterString(filterStr) {
    const n = filterStr.indexOf(':');
    return n === -1 ? NameFilter.TYPE.parse(filterStr) : Type.getType(filterStr.substring(0, n)).parse(filterStr.substring(n + 1));
}

class ItemSearchState {

    static parseSearchString(searchStr) {
        // tokenize
        const tokens = [];
        let buf = [];
        let inQuotes = false;
        for (let i = 0; i < searchStr.length; i++) {
            const chr = searchStr.charAt(i);
            switch (chr) {
                case '"':
                    inQuotes = !inQuotes;
                    break;
                case ' ':
                    if (inQuotes) {
                        buf.push(' ');
                    } else {
                        const token = buf.join('').trim();
                        if (token) tokens.push(token);
                        buf.length = 0; // lol js
                    }
                    break;
                default:
                    buf.push(chr);
                    break;
            }
        }

        if (inQuotes) throw new Error("Mismatched quotes!");

        // pick up a last token, if any
        {
            const token = buf.join('').trim();
            if (token) tokens.push(token);
        }

        // parse filters
        const searchState = new ItemSearchState();
        for (let i = 0; i < tokens.length; i++) searchState.addFilter(parseFilterString(tokens[i]));

        return searchState;
    }

    constructor() {
        this.filterList = [];
        this.filterTable = new Map();
    }

    addFilter(filter) {
        const type = filter.getFilterType();
        if (this.filterTable.has(type)) {
            if (type === NameFilter.TYPE) { // special-case: adjoin multiple by-name filters
                this.getFilter(NameFilter.TYPE).adjoin(filter);
                return;
            }
            throw new Error(`Duplicate filters: $[type.name}`);
        }
        this.filterList.push(filter);
        this.filterTable.set(type, filter);
    }

    getFilter(type) {
        return this.filterTable.get(type);
    }

    toSearchString() {
        return this.filterList.map(f => f.toFilterString()).join(' ');
    }

    test(item, itemExp) {
        for (let i = 0; i < this.filterList.length; i++) {
            if (!this.filterList[i].test(item, itemExp)) return false;
        }
        return true;
    }

    compare(a, aExp, b, bExp) {
        for (let i = 0; i < this.filterList.length; i++) {
            const result = this.filterList[i].compare(a, aExp, b, bExp);
            if (result !== 0) return result;
        }

        // default to combat level, descending
        return b.lvl - a.lvl;
    }

}
