// dynamic type casts
function checkBool(v) {
  if (typeof v !== 'boolean') throw new Error(`Expected boolean, but got ${typeof v}`);
  return v;
}

function checkNum(v) {
  if (typeof v === 'boolean') {
    if (v) return 1;
    return 0;
  }
  if (typeof v !== 'number') throw new Error(`Expected number, but got ${typeof v}`);
  return v;
}

function checkStr(v) {
  if (typeof v !== 'string') throw new Error(`Expected string, but got ${typeof v}`);
  return v;
}

function checkComparable(v) {
  if (typeof v === 'boolean') throw new Error('Boolean is not comparable');
  return v;
}

// properties of items that can be looked up
// each entry is a function `(item, extended item) -> value`
const itemQueryProps = (function() {
  const props = {};

  function prop(names, type, resolve) {
    if (Array.isArray(names)) {
      for (name of names) {
        props[name] = { type, resolve };
      }
    } else {
      props[names] = { type, resolve };
    }
  }

  function maxId(names, idKey) {
    prop(names, 'number', (i, ie) => ie.get('maxRolls').get(idKey) || 0);
  }

  function minId(names, idKey) {
    prop(names, 'number', (i, ie) => ie.get('minRolls').get(idKey) || 0);
  }

  function rangeAll(names, getProp) {
    // Max
    prop(names.map((s) => s+'max'), 'number', (i, ie) => {
      const range = getProp(i, ie);
      if (!range) return 0;
      const ndx = range.indexOf('-');
      return parseInt(range.substring(ndx + 1), 10);
    });
    // Min
    prop(names.map((s) => s+'min'), 'number', (i, ie) => {
      const range = getProp(i, ie);
      if (!range) return 0;
      const ndx = range.indexOf('-');
      return parseInt(range.substring(0, ndx), 10);
    });
    // Average
    prop(names, 'number', (i, ie) => {
      const range = getProp(i, ie);
      if (!range) return 0;
      const ndx = range.indexOf('-');
      return (parseInt(range.substring(0, ndx), 10) + parseInt(range.substring(ndx + 1), 10)) / 2;
    });
    prop(names.map((s) => s+'avg'), 'number', (i, ie) => {
      const range = getProp(i, ie);
      if (!range) return 0;
      const ndx = range.indexOf('-');
      return (parseInt(range.substring(0, ndx), 10) + parseInt(range.substring(ndx + 1), 10)) / 2;
    });
  }

  function map(names, comps, outType, f) {
    return prop(names, outType, (i, ie) => {
      const args = [];
      for (let k = 0; k < comps.length; k++) args.push(comps[k].resolve(i, ie));
      return f.apply(null, args);
    });
  }

  function sum(names, ...comps) {
    return map(names, comps, 'number', (...summands) => {
      let total = 0;
      for (let i = 0; i < summands.length; i++) total += summands[i];
      return total;
    });
  }

  prop('name', 'string', (i, ie) => i.displayName || i.name);
  prop('lore', 'string', (i, ie) => i.lore || "");
  prop('type', 'string', (i, ie) => i.type);
  prop(['cat', 'category'], 'string', (i, ie) => i.category);
  const tierIndices = { Normal: 0, Unique: 1, Set: 2, Rare: 3, Legendary: 4, Fabled: 5, Mythic: 6 };
  prop(['rarityname', 'raritystr', 'tiername', 'tierstr'], 'string', (i, ie) => i.tier);
  prop(['rarity', 'tier'], 'number', (i, ie) => tierIndices[i.tier]);
  prop(['majid', 'majorid'], 'string', (i, ie) => ((i.majorIds || [""])[0] || ""));
  prop(['majids', 'majorids'], 'number', (i, ie) => (i.majorIds || []).length);

  prop(['level', 'lvl', 'combatlevel', 'combatlvl'], 'number', (i, ie) => i.lvl);
  prop(['strmin', 'strreq'], 'number', (i, ie) => i.strReq);
  prop(['dexmin', 'dexreq'], 'number', (i, ie) => i.dexReq);
  prop(['intmin', 'intreq'], 'number', (i, ie) => i.intReq);
  prop(['defmin', 'defreq'], 'number', (i, ie) => i.defReq);
  prop(['agimin', 'agireq'], 'number', (i, ie) => i.agiReq);
  sum(['summin', 'sumreq', 'totalmin', 'totalreq'], props.strmin, props.dexmin, props.intmin, props.defmin, props.agimin);

  prop('str', 'number', (i, ie) => i.str);
  prop('dex', 'number', (i, ie) => i.dex);
  prop('int', 'number', (i, ie) => i.int);
  prop('def', 'number', (i, ie) => i.def);
  prop('agi', 'number', (i, ie) => i.agi);
  sum(['skillpoints', 'skillpts', 'attributes', 'attrs'], props.str, props.dex, props.int, props.def, props.agi);

  rangeAll(['neutraldmg', 'neutraldam', 'ndmg', 'ndam'], (i, ie) => i.nDam);
  rangeAll(['earthdmg', 'earthdam', 'edmg', 'edam'], (i, ie) => i.eDam);
  rangeAll(['thunderdmg', 'thunderdam', 'tdmg', 'tdam'], (i, ie) => i.tDam);
  rangeAll(['waterdmg', 'waterdam', 'wdmg', 'wdam'], (i, ie) => i.wDam);
  rangeAll(['firedmg', 'firedam', 'fdmg', 'fdam'], (i, ie) => i.fDam);
  rangeAll(['airdmg', 'airdam', 'admg', 'adam'], (i, ie) => i.aDam);
  sum(['sumdmg', 'sumdam', 'totaldmg', 'totaldam'], props.ndam, props.edam, props.tdam, props.wdam, props.fdam, props.adam);

  maxId(['earthdmg%', 'earthdam%', 'edmg%', 'edam%', 'edampct'], 'eDamPct');
  maxId(['thunderdmg%', 'thunderdam%', 'tdmg%', 'tdam%', 'tdampct'], 'tDamPct');
  maxId(['waterdmg%', 'waterdam%', 'wdmg%', 'wdam%', 'wdampct'], 'wDamPct');
  maxId(['firedmg%', 'firedam%', 'fdmg%', 'fdam%', 'fdampct'], 'fDamPct');
  maxId(['airdmg%', 'airdam%', 'admg%', 'adam%', 'adampct'], 'aDamPct');
  maxId(['elementaldmg%', 'elementaldam%', 'rdmg%', 'rdam%', 'rdampct'], 'rDamPct');
  //sum(['sumdmg%', 'sumdam%', 'totaldmg%', 'totaldam%', 'sumdampct', 'totaldampct'], props.edampct, props.tdampct, props.wdampct, props.fdampct, props.adampct);

  maxId(['earthdmgraw', 'earthdamraw', 'edmgraw', 'edamraw', 'edamraw'], 'eDamRaw');
  maxId(['thunderdmgraw', 'thunderdamraw', 'tdmgraw', 'tdamraw', 'tdamraw'], 'tDamRaw');
  maxId(['waterdmgraw', 'waterdamraw', 'wdmgraw', 'wdamraw', 'wdamraw'], 'wDamRaw');
  maxId(['firedmgraw', 'firedamraw', 'fdmgraw', 'fdamraw', 'fdamraw'], 'fDamRaw');
  maxId(['airdmgraw', 'airdamraw', 'admgraw', 'adamraw', 'adamraw'], 'aDamRaw');
  maxId(['elementaldmgraw', 'elementaldamraw', 'rdmgraw', 'rdamraw', 'rdamraw'], 'rDamRaw');

  maxId(['mainatkdmg', 'mainatkdam', 'mainatkdmg%', 'mainatkdam%', 'meleedmg', 'meleedam', 'meleedmg%', 'meleedam%', 'mdpct'], 'mdPct');
  maxId(['emdpct'], 'eMdPct');
  maxId(['tmdpct'], 'tMdPct');
  maxId(['wmdpct'], 'wMdPct');
  maxId(['fmdpct'], 'fMdPct');
  maxId(['amdpct'], 'aMdPct');
  maxId(['nmdpct'], 'nMdPct');
  maxId(['rmdpct'], 'rMdPct');

  maxId(['mainatkrawdmg', 'mainatkrawdam', 'mainatkneutraldmg', 'mainatkneutraldam', 'meleerawdmg', 'meleerawdam', 'meleeneutraldmg', 'meleeneutraldam', 'mdraw'], 'mdRaw');
  maxId(['emdraw'], 'eMdRaw');
  maxId(['tmdraw'], 'tMdRaw');
  maxId(['wmdraw'], 'wMdRaw');
  maxId(['fmdraw'], 'fMdRaw');
  maxId(['amdraw'], 'aMdRaw');
  maxId(['nmdraw'], 'nMdRaw');
  maxId(['rmdraw'], 'rMdRaw');

  maxId(['spelldmg', 'spelldam', 'spelldmg%', 'spelldam%', 'sdpct'], 'sdPct');
  maxId(['esdpct'], 'eSdPct');
  maxId(['tsdpct'], 'tSdPct');
  maxId(['wsdpct'], 'wSdPct');
  maxId(['fsdpct'], 'fSdPct');
  maxId(['asdpct'], 'aSdPct');
  maxId(['nsdpct'], 'nSdPct');
  maxId(['rsdpct'], 'rSdPct');

  maxId(['spellrawdmg', 'spellrawdam', 'spellneutraldmg', 'spellneutraldam', 'sdraw'], 'sdRaw');
  maxId(['esdraw'], 'eSdRaw');
  maxId(['tsdraw'], 'tSdRaw');
  maxId(['wsdraw'], 'wSdRaw');
  maxId(['fsdraw'], 'fSdRaw');
  maxId(['asdraw'], 'aSdRaw');
  maxId(['nsdraw'], 'nSdRaw');
  maxId(['rainbowraw', 'rsdraw'], 'rSdRaw');

  maxId('critdampct', 'critDamPct');

  const atkSpdIndices = { SUPER_SLOW: -3, VERY_SLOW: -2, SLOW: -1, NORMAL: 0, FAST: 1, VERY_FAST: 2, SUPER_FAST: 3 };
  prop(['attackspeed', 'atkspd'], 'number', (i, ie) => i.atkSpd ? atkSpdIndices[i.atkSpd] : 0);
  maxId(['bonusattackspeed', 'bonusatkspd', 'attackspeedid', 'atkspdid', 'atktier'], 'atkTier');
  sum(['sumattackspeed', 'totalattackspeed', 'sumatkspd', 'totalatkspd', 'sumatktier', 'totalatktier'], props.atkspd, props.atktier);

  prop(['earthdef', 'edef'], 'number', (i, ie) => i.eDef || 0);
  prop(['thunderdef', 'tdef'], 'number', (i, ie) => i.tDef || 0);
  prop(['waterdef', 'wdef'], 'number', (i, ie) => i.wDef || 0);
  prop(['firedef', 'fdef'], 'number', (i, ie) => i.fDef || 0);
  prop(['airdef', 'adef'], 'number', (i, ie) => i.aDef || 0);
  sum(['sumdef', 'totaldef'], props.edef, props.tdef, props.wdef, props.fdef, props.adef);

  maxId(['earthdef%', 'edef%', 'edefpct'], 'eDefPct');
  maxId(['thunderdef%', 'tdef%', 'tdefpct'], 'tDefPct');
  maxId(['waterdef%', 'wdef%', 'wdefpct'], 'wDefPct');
  maxId(['firedef%', 'fdef%', 'fdefpct'], 'fDefPct');
  maxId(['airdef%', 'adef%', 'adefpct'], 'aDefPct');
  maxId(['eledef%', 'rdef%', 'rdefpct'], 'rDefPct');
  sum(['sumdef%', 'totaldef%', 'sumdefpct', 'totaldefpct'], props.edefpct, props.tdefpct, props.wdefpct, props.fdefpct, props.adefpct);

  prop(['health', 'hp'], 'number', (i, ie) => i.hp || 0);
  maxId(['bonushealth', 'healthid', 'bonushp', 'hpid', 'hpbonus'], 'hpBonus');
  sum(['sumhealth', 'sumhp', 'totalhealth', 'totalhp'], props.hp, props.hpid);

  maxId(['hpregen', 'hpr', 'hr', 'hprraw'], 'hprRaw');
  maxId(['hpregen%', 'hpr%', 'hr%', 'hprpct'], 'hprPct');
  maxId(['lifesteal', 'ls'], 'ls');
  maxId(['manaregen', 'mr'], 'mr');
  maxId(['manasteal', 'ms'], 'ms');

  maxId(['walkspeed', 'movespeed', 'ws', 'spd'], 'spd');
  maxId('sprint', 'sprint');
  maxId(['sprintregen', 'sprintreg'], 'sprintReg');
  maxId(['jumpheight', 'jh'], 'jh');

  maxId(['spellcost1', 'rawspellcost1', 'spcost1', 'spraw1'], 'spRaw1');
  maxId(['spellcost1%', 'spcost1%', 'sppct1'], 'spPct1');
  maxId(['spellcost2', 'rawspellcost2', 'spcost2', 'spraw2'], 'spRaw2');
  maxId(['spellcost2%', 'spcost2%', 'sppct2'], 'spPct2');
  maxId(['spellcost3', 'rawspellcost3', 'spcost3', 'spraw3'], 'spRaw3');
  maxId(['spellcost3%', 'spcost3%', 'sppct3'], 'spPct3');
  maxId(['spellcost4', 'rawspellcost4', 'spcost4', 'spraw4'], 'spRaw4');
  maxId(['spellcost4%', 'spcost4%', 'sppct4'], 'spPct4');
  sum(['sumspellcost', 'totalspellcost', 'sumrawspellcost', 'totalrawspellcost', 'sumspcost', 'totalspcost', 'sumspraw', 'totalspraw'], props.spraw1, props.spraw2, props.spraw3, props.spraw4);
  sum(['sumspellcost%', 'totalspellcost%', 'sumspcost%', 'totalspcost%', 'sumsppct', 'totalsppct'], props.sppct1, props.sppct2, props.sppct3, props.sppct4);

  maxId(['exploding', 'expl', 'expd'], 'expd');
  maxId('poison', 'poison');
  maxId('thorns', 'thorns');
  maxId(['reflection', 'refl', 'ref'], 'ref');
  maxId(['soulpointregen', 'spr', 'spregen'], 'spRegen');
  maxId(['lootbonus', 'lb'], 'lb');
  maxId(['xpbonus', 'xpb', 'xb'], 'xpb');
  maxId(['stealing', 'esteal'], 'eSteal');
  maxId(['lq', 'quality'], 'lq');
  maxId('gxp', 'gXp');
  maxId('gspd', 'gSpd');
  maxId(['healeff', 'healpct'], 'healPct');
  maxId('kb', 'kb');
  maxId('weakenenemy', 'weakenEnemy');
  maxId('slowenemy', 'slowEnemy');
  maxId('maxmana', 'maxMana');

  prop(['powderslots', 'powders', 'slots', 'sockets'], 'number', (i, ie) => i.slots || 0);

  return props;
})();

// properties of ingredients that can be looked up
// each entry is a function `(item, extended item) -> value`
const ingredientQueryProps = (function() {
  const props = {};

  function prop(names, type, resolve) {
    if (Array.isArray(names)) {
      for (name of names) {
        props[name] = { type, resolve };
      }
    } else {
      props[names] = { type, resolve };
    }
  }

  function typeProp(names, idKey) {
    prop(names, 'boolean', (i, ie) => ie.get('skills').filter(i => i === idKey).length > 0);
  }

  function modProp(names, idKey) {
    prop(names, 'boolean', (i, ie) => ie.get('posMods').get(idKey) || 0);
  }

  function maxId(names, idKey) {
    prop(names, 'number', (i, ie) => ie.get("ids").get('maxRolls').get(idKey) || 0);
  }

  function minId(names, idKey) {
    prop(names, 'number', (i, ie) => ie.get("ids").get('minRolls').get(idKey) || 0);
  }

  function rangeAvg(names, getProp) {
    prop(names, 'number', (i, ie) => {
      const range = getProp(i, ie);
      if (!range) return 0;
      const ndx = range.indexOf('-');
      return (parseInt(range.substring(0, ndx), 10) + parseInt(range.substring(ndx + 1), 10)) / 2;
    });
  }

  function map(names, comps, outType, f) {
    return prop(names, outType, (i, ie) => {
      const args = [];
      for (let k = 0; k < comps.length; k++) args.push(comps[k].resolve(i, ie));
      return f.apply(null, args);
    });
  }

  function sum(names, ...comps) {
    return map(names, comps, 'number', (...summands) => {
      let total = 0;
      for (let i = 0; i < summands.length; i++) total += summands[i];
      return total;
    });
  }

  prop('name', 'string', (i, ie) => i.displayName || i.name);
  const starIndices = { 0: "zero", 1: "one", 2: "two", 3: "three" };
  prop(['starsname', 'starsstr', 'tiername', 'tierstr'], 'string', (i, ie) => starIndices[i.tier]);
  prop(['stars', 'tier'], 'number', (i, ie) => i.tier);
  prop(['level', 'lvl', 'combatlevel', 'combatlvl'], 'number', (i, ie) => i.lvl);

  // TODO allow specification of item types
  for (const entry of [
    ["armouring", "helmet", "chestplate"], 
    ["tailoring", "leggings", "boots"], 
    ["weaponsmithing", "spear", "dagger"], 
    ["woodworking", "bow", "relik", "wand"], 
    ["jeweling", "ring", "bracelet", "necklace"], 
    ["cooking", "food"], 
    ["alchemism", "potion"], 
    ["scribing", "scroll"]
  ]) {
    typeProp(entry, entry[0].toUpperCase());
  }

  for (const entry of [
    ["left"], 
    ["right"], 
    ["above", "top"], 
    ["under", "bottom"], 
    ["touching", "touch"], 
    ["notTouching", "notTouch"]
  ]) {
    modProp(entry.map(i => i.toLowerCase()), entry[0]);
  }

  prop(['strmin', 'strreq'], 'number', (i, ie) => i["itemIDs"].strReq);
  prop(['dexmin', 'dexreq'], 'number', (i, ie) => i["itemIDs"].dexReq);
  prop(['intmin', 'intreq'], 'number', (i, ie) => i["itemIDs"].intReq);
  prop(['defmin', 'defreq'], 'number', (i, ie) => i["itemIDs"].defReq);
  prop(['agimin', 'agireq'], 'number', (i, ie) => i["itemIDs"].agiReq);

  prop(['durability'], 'number', (i, ie) => i["itemIDs"].dura || 0);

  prop(['charges'], 'number', (i, ie) => i["consumableIDs"].charges || 0);
  prop(['duration'], 'number', (i, ie) => i["consumableIDs"].dura || 0);

  sum(['summin', 'sumreq', 'totalmin', 'totalreq'], props.strmin, props.dexmin, props.intmin, props.defmin, props.agimin);

  maxId('str', 'str');
  maxId('dex', 'dex');
  maxId('int', 'int');
  maxId('def', 'def');
  maxId('agi', 'agi');
  sum(['skillpoints', 'skillpts', 'attributes', 'attrs'], props.str, props.dex, props.int, props.def, props.agi);

  maxId(['earthdmg%', 'earthdam%', 'edmg%', 'edam%', 'edampct'], 'eDamPct');
  maxId(['thunderdmg%', 'thunderdam%', 'tdmg%', 'tdam%', 'tdampct'], 'tDamPct');
  maxId(['waterdmg%', 'waterdam%', 'wdmg%', 'wdam%', 'wdampct'], 'wDamPct');
  maxId(['firedmg%', 'firedam%', 'fdmg%', 'fdam%', 'fdampct'], 'fDamPct');
  maxId(['airdmg%', 'airdam%', 'admg%', 'adam%', 'adampct'], 'aDamPct');
  sum(['sumdmg%', 'sumdam%', 'totaldmg%', 'totaldam%', 'sumdampct', 'totaldampct'], props.edampct, props.tdampct, props.wdampct, props.fdampct, props.adampct);

  maxId(['mainatkdmg', 'mainatkdam', 'mainatkdmg%', 'mainatkdam%', 'meleedmg', 'meleedam', 'meleedmg%', 'meleedam%', 'mdpct'], 'mdPct');
  maxId(['mainatkrawdmg', 'mainatkrawdam', 'mainatkneutraldmg', 'mainatkneutraldam', 'meleerawdmg', 'meleerawdam', 'meleeneutraldmg', 'meleeneutraldam', 'mdraw'], 'mdRaw');
  maxId(['spelldmg', 'spelldam', 'spelldmg%', 'spelldam%', 'sdpct'], 'sdPct');
  maxId(['spellrawdmg', 'spellrawdam', 'spellneutraldmg', 'spellneutraldam', 'sdraw'], 'sdRaw');
  maxId(['rainbowraw'], 'rSdRaw');

  maxId('critdampct', 'critDamPct');

  maxId(['bonusattackspeed', 'bonusatkspd', 'attackspeedid', 'atkspdid', 'atktier'], 'atkTier');

  maxId(['earthdef%', 'edef%', 'edefpct'], 'eDefPct');
  maxId(['thunderdef%', 'tdef%', 'tdefpct'], 'tDefPct');
  maxId(['waterdef%', 'wdef%', 'wdefpct'], 'wDefPct');
  maxId(['firedef%', 'fdef%', 'fdefpct'], 'fDefPct');
  maxId(['airdef%', 'adef%', 'adefpct'], 'aDefPct');
  maxId(['elementaldef%', 'rdef%', 'rdefpct'], 'rDefPct');
  sum(['sumdef%', 'totaldef%', 'sumdefpct', 'totaldefpct'], props.edefpct, props.tdefpct, props.wdefpct, props.fdefpct, props.adefpct, props.rDefPct);

  maxId(['bonushealth', 'healthid', 'bonushp', 'hpid', 'hpbonus'], 'hpBonus');

  maxId(['hpregen', 'hpr', 'hr', 'hprraw'], 'hprRaw');
  maxId(['hpregen%', 'hpr%', 'hr%', 'hprpct'], 'hprPct');
  maxId(['lifesteal', 'ls'], 'ls');
  maxId(['manaregen', 'mr'], 'mr');
  maxId(['manasteal', 'ms'], 'ms');

  maxId(['walkspeed', 'movespeed', 'ws', 'spd'], 'spd');
  maxId('sprint', 'sprint');
  maxId(['sprintregen', 'sprintreg'], 'sprintReg');
  maxId(['jumpheight', 'jh'], 'jh');

  maxId(['spellcost1', 'rawspellcost1', 'spcost1', 'spraw1'], 'spRaw1');
  maxId(['spellcost1%', 'spcost1%', 'sppct1'], 'spPct1');
  maxId(['spellcost2', 'rawspellcost2', 'spcost2', 'spraw2'], 'spRaw2');
  maxId(['spellcost2%', 'spcost2%', 'sppct2'], 'spPct2');
  maxId(['spellcost3', 'rawspellcost3', 'spcost3', 'spraw3'], 'spRaw3');
  maxId(['spellcost3%', 'spcost3%', 'sppct3'], 'spPct3');
  maxId(['spellcost4', 'rawspellcost4', 'spcost4', 'spraw4'], 'spRaw4');
  maxId(['spellcost4%', 'spcost4%', 'sppct4'], 'spPct4');
  sum(['sumspellcost', 'totalspellcost', 'sumrawspellcost', 'totalrawspellcost', 'sumspcost', 'totalspcost', 'sumspraw', 'totalspraw'], props.spraw1, props.spraw2, props.spraw3, props.spraw4);
  sum(['sumspellcost%', 'totalspellcost%', 'sumspcost%', 'totalspcost%', 'sumsppct', 'totalsppct'], props.sppct1, props.sppct2, props.sppct3, props.sppct4);

  maxId(['exploding', 'expl', 'expd'], 'expd');
  maxId('poison', 'poison');
  maxId('thorns', 'thorns');
  maxId(['reflection', 'refl', 'ref'], 'ref');
  maxId(['soulpointregen', 'spr', 'spregen'], 'spRegen');
  maxId(['lootbonus', 'lb'], 'lb');
  maxId(['xpbonus', 'xpb', 'xb'], 'xpb');
  maxId(['stealing', 'esteal'], 'eSteal');
  maxId(['lq', 'quality'], 'lq');
  maxId('gxp', 'gXp');
  maxId('gspd', 'gSpd');
  maxId(['healeff', 'healpct'], 'healPct');
  maxId('kb', 'kb');
  maxId('weakenenemy', 'weakenEnemy');
  maxId('slowenemy', 'slowEnemy');
  maxId('maxmana', 'maxMana');

  return props;
})();

// functions that can be called in query expressions
const queryFuncs = {
  max: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to max()');
      let runningMax = -Infinity;
      for (let i = 0; i < args.length; i++) {
        if (checkNum(args[i]) > runningMax) runningMax = args[i];
      }
      return runningMax;
    }
  },
  min: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to min()');
      let runningMin = Infinity;
      for (let i = 0; i < args.length; i++) {
        if (checkNum(args[i]) < runningMin) runningMin = args[i];
      }
      return runningMin;
    }
  },
  floor: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to floor()');
      return Math.floor(checkNum(args[0]));
    }
  },
  ceil: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to ceil()');
      return Math.ceil(checkNum(args[0]));
    }
  },
  round: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to round()');
      return Math.round(checkNum(args[0]));
    }
  },
  sqrt: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to sqrt()');
      return Math.sqrt(checkNum(args[0]));
    }
  },
  abs: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to abs()');
      return Math.abs(checkNum(args[0]));
    }
  },
  contains: {
    type: 'boolean',
    fn: function(item, itemExp, args) {
      if (args.length < 2) throw new Error('Not enough args to contains()');
      return checkStr(args[0]).toLowerCase().includes(checkStr(args[1]).toLowerCase());
    }
  },
  atkspdmod: {
    type: 'number',
    fn: function(item, itemExp, args) {
      if (args.length < 1) throw new Error('Not enough args to atkSpdMod()');
      switch (checkNum(args[0])) {
        case 2:
          return 3.1;
        case 1:
          return 2.5;
        case 0:
          return 2.05;
        case -1:
          return 1.5;
        case -2:
          return 0.83;
      }
      if (args[0] <= -3) return 0.51;
      if (args[0] >= 3) return 4.3;
      throw new Error('Invalid argument to atkSpdMod()');
    }
  }
};

// static type check
function staticCheck(expType, term) {
  if (expType === 'any' || expType === term.type) {
    return true;
  }
  if (expType === 'number' && term.type === 'boolean') {
    return true;
  }
  throw new Error(`Expected ${expType}, but got ${term.type}`);
}

// expression terms
class Term {
  constructor(type) {
    this.type = type;
  }

  resolve(item, itemExt) {
    throw new Error('Abstract method!');
  }
}

class LiteralTerm extends Term {
  constructor(type, value) {
    super(type);
    this.value = value;
  }

  resolve(item, itemExt) {
    return this.value;
  }
}

class BoolLitTerm extends LiteralTerm {
  constructor(value) {
    super('boolean', value);
  }
}

class NumLitTerm extends LiteralTerm {
  constructor(value) {
    super('number', value);
  }
}

class StrLitTerm extends LiteralTerm {
  constructor(value) {
    super('string', value);
  }
}

class BinaryOpTerm extends Term {
  constructor(type, leftType, left, rightType, right) {
    super(type);
    staticCheck(leftType, left);
    staticCheck(rightType, right);
    this.left = left;
    this.right = right;
  }

  resolve(item, itemExt) {
    return this.apply(this.left.resolve(item, itemExt), this.right.resolve(item, itemExt));
  }

  apply(a, b) {
    throw new Error('Abstract method!');
  }
}

class LogicalTerm extends BinaryOpTerm {
  constructor(left, right) {
    super('boolean', 'boolean', left, 'boolean', right);
  }
}

class ConjTerm extends LogicalTerm {
  apply(a, b) {
    return a && b;
  }
}

class DisjTerm extends LogicalTerm {
  apply(a, b) {
    return a || b;
  }
}

class EqualityTerm extends BinaryOpTerm {
  constructor(left, right) {
    super('boolean', 'any', left, 'any', right);
  }

  apply(a, b) {
    return (typeof a === 'string' && typeof b === 'string')
        ? this.compare(a.toLowerCase(), b.toLowerCase()) : this.compare(a, b);
  }

  compare(a, b) {
    throw new Error('Abstract method!');
  }
}

class EqTerm extends EqualityTerm {
  compare(a, b) {
    return a === b;
  }
}

class NeqTerm extends EqualityTerm {
  compare(a, b) {
    return a !== b;
  }
}

class ContainsTerm extends BinaryOpTerm {
  constructor(left, right) {
    super('boolean', 'string', left, 'string', right);
  }

  apply(a, b) {
    return a.toLowerCase().includes(b.toLowerCase());
  }
}

class InequalityTerm extends BinaryOpTerm {
  constructor(left, right) {
    super('boolean', 'any', left, 'any', right);
  }

  apply(a, b) {
    checkComparable(a);
    checkComparable(b);
    return (typeof a === 'string' && typeof b === 'string')
        ? this.compare(a.toLowerCase(), b.toLowerCase()) : this.compare(a, b);
  }

  compare(a, b) {
    throw new Error('Abstract method!');
  }
}

class LeqTerm extends InequalityTerm {
  compare(a, b) {
    return a <= b;
  }
}

class LtTerm extends InequalityTerm {
  compare(a, b) {
    return a < b;
  }
}

class GtTerm extends InequalityTerm {
  compare(a, b) {
    return a > b;
  }
}

class GeqTerm extends InequalityTerm {
  compare(a, b) {
    return a >= b;
  }
}

class ArithmeticTerm extends BinaryOpTerm {
  constructor(left, right) {
    super('number', 'number', left, 'number', right);
  }
}

class AddTerm extends ArithmeticTerm {
  apply(a, b) {
    return a + b;
  }
}

class SubTerm extends ArithmeticTerm {
  apply(a, b) {
    return a - b;
  }
}

class MulTerm extends ArithmeticTerm {
  apply(a, b) {
    return a * b;
  }
}

class DivTerm extends ArithmeticTerm {
  apply(a, b) {
    return a / b;
  }
}

class ExpTerm extends ArithmeticTerm {
  apply(a, b) {
    return a ** b;
  }
}

class UnaryOpTerm extends Term {
  constructor(type, inType, inVal) {
    super(type);
    staticCheck(inType, inVal);
    this.inVal = inVal;
  }

  resolve(item, itemExt) {
    return this.apply(this.inVal.resolve(item, itemExt));
  }

  apply(x) {
    throw new Error('Abstract method!');
  }
}

class NegTerm extends UnaryOpTerm {
  constructor(inVal) {
    super('number', 'number', inVal);
  }

  apply(x) {
    return -x;
  }
}

class InvTerm extends UnaryOpTerm {
  constructor(inVal) {
    super('boolean', 'boolean', inVal);
  }

  apply(x) {
    return !x;
  }
}

class FnCallTerm extends Term {
  constructor(fn, argExprs) {
    super(fn.type);
    this.fn = fn;
    this.argExprs = argExprs;
  }

  resolve(item, itemExt) {
    const argVals = [];
    for (const argExpr of this.argExprs) {
      argVals.push(argExpr.resolve(item, itemExt));
    }
    return this.fn.fn(item, itemExt, argVals);
  }
}

class PropTerm extends Term {
  constructor(prop) {
    super(prop.type);
    this.prop = prop;
  }

  resolve(item, itemExt) {
    return this.prop.resolve(item, itemExt);
  }
}

function compareLexico(ia, keysA, ib, keysB) {
    for (let i = 0; i < keysA.length; i++) { // assuming keysA and keysB are the same length
        let aKey = keysA[i], bKey = keysB[i];
        if (typeof aKey !== typeof bKey) throw new Error(`Incomparable types ${typeof aKey} and ${typeof bKey}`); // can this even happen?
        switch (typeof aKey) {
            case 'string':
                aKey = aKey.toLowerCase();
                bKey = bKey.toLowerCase();
                if (aKey < bKey) return -1;
                if (aKey > bKey) return 1;
                break;
            case 'number': // sort numeric stuff in reverse order
                aKey = isNaN(aKey) ? 0 : aKey;
                bKey = isNaN(bKey) ? 0 : bKey;
                if (aKey < bKey) return 1;
                if (aKey > bKey) return -1;
                break;
            default:
                throw new Error(`Incomparable type ${typeof aKey}`);
        }
    }
    return ib.lvl - ia.lvl;
}
