// dynamic type casts
function checkBool(v) {
  if (typeof v !== 'boolean') throw new Error(`Expected boolean, but got ${typeof v}`);
  return v;
}

function checkNum(v) {
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
      for (let k = 0; k < comps.length; k++) args.push(comps[k](i, ie));
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
  prop('type', 'string', (i, ie) => i.type);
  prop(['cat', 'category'], 'string', (i, ie) => i.category);
  const tierIndices = { Normal: 0, Unique: 1, Set: 2, Rare: 3, Legendary: 4, Fabled: 5, Mythic: 6 };
  prop(['rarityname', 'raritystr', 'tiername', 'tierstr'], 'string', (i, ie) => i.tier);
  prop(['rarity', 'tier'], 'string', (i, ie) => tierIndices[i.tier]);

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

  rangeAvg(['neutraldmg', 'neutraldam', 'ndmg', 'ndam'], (i, ie) => i.nDam);
  rangeAvg(['earthdmg', 'earthdam', 'edmg', 'edam'], (i, ie) => i.eDam);
  rangeAvg(['thunderdmg', 'thunderdam', 'tdmg', 'tdam'], (i, ie) => i.tDam);
  rangeAvg(['waterdmg', 'waterdam', 'wdmg', 'wdam'], (i, ie) => i.wDam);
  rangeAvg(['firedmg', 'firedam', 'fdmg', 'fdam'], (i, ie) => i.fDam);
  rangeAvg(['airdmg', 'airdam', 'admg', 'adam'], (i, ie) => i.aDam);
  sum(['sumdmg', 'sumdam', 'totaldmg', 'totaldam'], props.ndam, props.edam, props.tdam, props.wdam, props.fdam, props.adam);

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

  const atkSpdIndices = { SUPER_SLOW: -3, VERY_SLOW: -2, SLOW: -1, NORMAL: 0, FAST: 1, VERY_FAST: 2, SUPER_FAST: 3 };
  prop(['attackspeed', 'atkspd'], 'string', (i, ie) => i.atkSpd ? atkSpdIndices[i.atkSpd] : 0);
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

  minId(['spellcost1', 'rawspellcost1', 'spcost1', 'spraw1'], 'spRaw1');
  minId(['spellcost1%', 'spcost1%', 'sppct1'], 'spPct1');
  minId(['spellcost2', 'rawspellcost2', 'spcost2', 'spraw2'], 'spRaw2');
  minId(['spellcost2%', 'spcost2%', 'sppct2'], 'spPct2');
  minId(['spellcost3', 'rawspellcost3', 'spcost3', 'spraw3'], 'spRaw3');
  minId(['spellcost3%', 'spcost3%', 'sppct3'], 'spPct3');
  minId(['spellcost4', 'rawspellcost4', 'spcost4', 'spraw4'], 'spRaw4');
  minId(['spellcost4%', 'spcost4%', 'sppct4'], 'spPct4');
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
  prop(['powderslots', 'powders', 'slots', 'sockets'], 'number', (i, ie) => i.slots || 0);

  return props;
})();

// functions that can be called in query expressions
const itemQueryFuncs = {
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
}

class EqTerm extends EqualityTerm {
  apply(a, b) {
    return a === b;
  }
}

class NeqTerm extends EqualityTerm {
  apply(a, b) {
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
    return this.compare(a, b);
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
    return a  / b;
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
