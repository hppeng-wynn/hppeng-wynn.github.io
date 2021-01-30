/*
 * disj := conj "|" disj
 *       | conj
 *
 * conj := cmp "&" conj
 *       | cmpEq
 *
 * cmpEq := cmpRel "=" cmpEq
 *        | cmpRel "?=" sLit
 *        | cmpRel "!=" cmpEq
 *
 * cmpRel := sum "<=" cmpRel
 *         | sum "<" cmpRel
 *         | sum ">" cmpRel
 *         | sum ">=" cmpRel
 *         | sum
 *
 * sum := prod "+" sum
 *      | prod "-" sum
 *      | prod
 *
 * prod := exp "*" prod
 *       | exp "/" prod
 *       | exp
 *
 * exp := unary "^" exp
 *      | unary
 *
 * unary := "-" unary
 *        | "!" unary
 *        | prim
 *
 * prim := nLit
 *       | bLit
 *       | sLit
 *       | ident "(" [disj ["," disj...]] ")"
 *       | ident
 *       | "(" disj ")"
 */

// a list of tokens indexed by a single pointer
class TokenList {
  constructor(tokens) {
    this.tokens = tokens;
    this.ptr = 0;
  }

  get here() {
    if (this.ptr >= this.tokens.length) throw new Error('Reached end of expression');
    return this.tokens[this.ptr];
  }

  advance(steps = 1) {
    this.ptr = Math.min(this.ptr + steps, this.tokens.length);
  }
}

// type casts
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

// properties of items that can be looked up
const itemQueryProps = (function() {
  const props = {};
  function prop(names, getProp) {
    if (Array.isArray(names)) {
      for (name of names) {
        props[name] = getProp;
      }
    } else {
      props[names] = getProp;
    }
  }
  function maxId(names, idKey) {
    prop(names, (i, ie) => ie.get('maxRolls').get(idKey) || 0);
  }
  function minId(names, idKey) {
    prop(names, (i, ie) => ie.get('minRolls').get(idKey) || 0);
  }
  function rangeAvg(names, getProp) {
    prop(names, (i, ie) => {
      const range = getProp(i, ie);
      if (!range) return 0;
      const ndx = range.indexOf('-');
      return (parseInt(range.substring(0, ndx), 10) + parseInt(range.substring(ndx + 1), 10)) / 2;
    });
  }
  function map(names, comps, f) {
    return prop(names, (i, ie) => {
      const args = [];
      for (let k = 0; k < comps.length; k++) args.push(comps[k](i, ie));
      return f.apply(null, args);
    });
  }
  function sum(names, ...comps) {
    return map(names, comps, (...summands) => {
      let total = 0;
      for (let i = 0; i < summands.length; i++) total += summands[i];
      return total;
    });
  }

  prop('name', (i, ie) => i.displayName || i.name);
  prop('type', (i, ie) => i.type);
  prop(['cat', 'category'], (i, ie) => i.category);
  const tierIndices = { Normal: 0, Unique: 1, Set: 2, Rare: 3, Legendary: 4, Fabled: 5, Mythic: 6 };
  prop(['rarityname', 'raritystr', 'tiername', 'tierstr'], (i, ie) => i.tier);
  prop(['rarity', 'tier'], (i, ie) => tierIndices[i.tier]);

  prop(['level', 'lvl', 'combatlevel', 'combatlvl'], (i, ie) => i.lvl);
  prop(['strmin', 'strreq'], (i, ie) => i.strReq);
  prop(['dexmin', 'dexreq'], (i, ie) => i.dexReq);
  prop(['intmin', 'intreq'], (i, ie) => i.intReq);
  prop(['defmin', 'defreq'], (i, ie) => i.defReq);
  prop(['agimin', 'agireq'], (i, ie) => i.agiReq);
  sum(['summin', 'sumreq', 'totalmin', 'totalreq'], props.strmin, props.dexmin, props.intmin, props.defmin, props.agimin);

  prop('str', (i, ie) => i.str);
  prop('dex', (i, ie) => i.dex);
  prop('int', (i, ie) => i.int);
  prop('def', (i, ie) => i.def);
  prop('agi', (i, ie) => i.agi);
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
  prop(['attackspeed', 'atkspd'], (i, ie) => i.atkSpd ? atkSpdIndices[i.atkSpd] : 0);
  maxId(['bonusattackspeed', 'bonusatkspd', 'attackspeedid', 'atkspdid', 'attackspeed+', 'atkspd+', 'atktier'], 'atkTier');
  sum(['sumattackspeed', 'totalattackspeed', 'sumatkspd', 'totalatkspd', 'sumatktier', 'totalatktier'], props.atkspd, props.atktier);

  prop(['earthdef', 'edef'], (i, ie) => i.eDef || 0);
  prop(['thunderdef', 'tdef'], (i, ie) => i.tDef || 0);
  prop(['waterdef', 'wdef'], (i, ie) => i.wDef || 0);
  prop(['firedef', 'fdef'], (i, ie) => i.fDef || 0);
  prop(['airdef', 'adef'], (i, ie) => i.aDef || 0);
  sum(['sumdef', 'totaldef'], props.edef, props.tdef, props.wdef, props.fdef, props.adef);

  maxId(['earthdef%', 'edef%', 'edefpct'], 'eDefPct');
  maxId(['thunderdef%', 'tdef%', 'tdefpct'], 'tDefPct');
  maxId(['waterdef%', 'wdef%', 'wdefpct'], 'wDefPct');
  maxId(['firedef%', 'fdef%', 'fdefpct'], 'fDefPct');
  maxId(['airdef%', 'adef%', 'adefpct'], 'aDefPct');
  sum(['sumdef%', 'totaldef%', 'sumdefpct', 'totaldefpct'], props.edefpct, props.tdefpct, props.wdefpct, props.fdefpct, props.adefpct);

  prop(['health', 'hp'], (i, ie) => i.hp || 0);
  maxId(['bonushealth', 'healthid', 'bonushp', 'hpid', 'health+', 'hp+', 'hpbonus'], 'hpBonus');
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
  prop(['powderslots', 'powders', 'slots', 'sockets'], (i, ie) => i.slots || 0);

  return props;
})();

// functions that can be called in query expressions
const itemQueryFuncs = {
  max(args) {
    if (args.length < 1) throw new Error('Not enough args to max()');
    let runningMax = -Infinity;
    for (let i = 0; i < args.length; i++) {
      if (checkNum(args[i]) > runningMax) runningMax = args[i];
    }
    return runningMax;
  },
  min(args) {
    if (args.length < 1) throw new Error('Not enough args to min()');
    let runningMin = Infinity;
    for (let i = 0; i < args.length; i++) {
      if (checkNum(args[i]) < runningMin) runningMin = args[i];
    }
    return runningMin;
  },
  floor(args) {
    if (args.length < 1) throw new Error('Not enough args to floor()');
    return Math.floor(checkNum(args[0]));
  },
  ceil(args) {
    if (args.length < 1) throw new Error('Not enough args to ceil()');
    return Math.ceil(checkNum(args[0]));
  },
  round(args) {
    if (args.length < 1) throw new Error('Not enough args to ceil()');
    return Math.round(checkNum(args[0]));
  },
  sqrt(args) {
    if (args.length < 1) throw new Error('Not enough args to ceil()');
    return Math.sqrt(checkNum(args[0]));
  },
  abs(args) {
    if (args.length < 1) throw new Error('Not enough args to ceil()');
    return Math.abs(checkNum(args[0]));
  },
  contains(args) {
    if (args.length < 2) throw new Error('Not enough args to contains()');
    return checkStr(args[0]).toLowerCase().includes(checkStr(args[1]).toLowerCase());
  },
  atkspdmod(args) {
    if (args.length < 1) throw new Error('Not enough args to atkSpdMod()');
    switch (checkNum(args[0])) {
      case 2: return 3.1;
      case 1: return 2.5;
      case 0: return 2.05;
      case -1: return 1.5;
      case -2: return 0.83;
    }
    if (args[0] <= -3) return 0.51;
    if (args[0] >= 3) return 4.3;
    throw new Error('Invalid argument to atkSpdMod()');
  }
};

// the compiler itself
const compileQueryExpr = (function() {
  // tokenize an expression string
  function tokenize(exprStr) {
    exprStr = exprStr.trim();
    const tokens = [];
    let col = 0;
    function pushSymbol(sym) {
      tokens.push({ type: 'sym', sym });
      col += sym.length;
    }
    while (col < exprStr.length) {
      // parse fixed symbols, like operators and stuff
      switch (exprStr[col]) {
        case '(':
        case ')':
        case ',':
        case '&':
        case '|':
        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
        case '=':
          pushSymbol(exprStr[col]);
          continue;
        case '>':
          pushSymbol(exprStr[col + 1] === '=' ? '>=' : '>');
          continue;
        case '<':
          pushSymbol(exprStr[col + 1] === '=' ? '<=' : '<');
          continue;
        case '!':
          pushSymbol(exprStr[col + 1] === '=' ? '!=' : '!');
          continue;
        case ' ': // ignore extra whitespace
          ++col;
          continue;
      }
      if (exprStr.slice(col, col+2) === "?=") {
        pushSymbol("?=");
        continue;
      }
      // parse a numeric literal
      let m;
      if ((m = /^\d+(?:\.\d*)?/.exec(exprStr.substring(col))) !== null) {
        tokens.push({ type: 'num', value: parseFloat(m[0]) });
        col += m[0].length;
        continue;
      }
      // parse a string literal
      if ((m = /^"([^"]+)"/.exec(exprStr.substring(col))) !== null) { // with double-quotes
        tokens.push({ type: 'str', value: m[1] });
        col += m[0].length;
        continue;
      }
      if ((m = /^'([^']+)'/.exec(exprStr.substring(col))) !== null) { // with single-quotes
        tokens.push({ type: 'str', value: m[1] });
        col += m[0].length;
        continue;
      }
      // parse an identifier or boolean literal
      if ((m = /^\w[\w\d+%]*/.exec(exprStr.substring(col))) !== null) {
        switch (m[0]) {
          case 'true':
            tokens.push({ type: 'bool', value: true });
            col += 4;
            continue;
          case 'false':
            tokens.push({ type: 'bool', value: false });
            col += 5;
            continue;
        }
        tokens.push({ type: 'id', id: m[0] });
        col += m[0].length;
        continue;
      }
      // if we reach here without successfully parsing a token, it's an error
      throw new Error(`Could not parse character "${exprStr[col]}" at position ${col}`);
    }
    tokens.push({ type: 'eof' });
    return new TokenList(tokens);
  }

  // parse tokens into an ast
  function takeDisj(tokens) {
    const left = takeConj(tokens);
    if (tokens.here.type === 'sym' && tokens.here.sym === '|') {
      tokens.advance();
      const right = takeDisj(tokens);
      return (i, ie) => checkBool(left(i, ie)) || checkBool(right(i, ie));
    }
    return left;
  }

  function takeConj(tokens) {
    const left = takeCmpEq(tokens);
    if (tokens.here.type === 'sym' && tokens.here.sym === '&') {
      tokens.advance();
      const right = takeConj(tokens);
      return (i, ie) => checkBool(left(i, ie)) && checkBool(right(i, ie));
    }
    return left;
  }

  function takeCmpEq(tokens) {
    const left = takeCmpRel(tokens);
    if (tokens.here.type === 'sym') {
      switch (tokens.here.sym) {
        case '=': {
          tokens.advance();
          const right = takeCmpEq(tokens);
          return (i, ie) => {
            const a = left(i, ie), b = right(i, ie);
            if (typeof a !== typeof b) return false;
            switch (typeof a) {
              case 'number':
                return Math.abs(left(i, ie) - right(i, ie)) < 1e-4;
              case 'boolean':
                return a === b;
              case 'string':
                return a.toLowerCase() === b.toLowerCase();
            }
            throw new Error('???'); // wut
          };
        }
        case '!=': {
          tokens.advance();
          const right = takeCmpEq(tokens);
          return (i, ie) => {
            const a = left(i, ie), b = right(i, ie);
            if (typeof a !== typeof b) return false;
            switch (typeof a) {
              case 'number':
                return Math.abs(left(i, ie) - right(i, ie)) >= 1e-4;
              case 'boolean':
                return a !== b;
              case 'string':
                return a.toLowerCase() !== b.toLowerCase();
            }
            throw new Error('???'); // wtf
          };
        }
        case '?=': {
          tokens.advance();
          const right = takeCmpEq(tokens);
          return (i, ie) => {
            const a = left(i, ie), b = right(i, ie);
            if (typeof a !== typeof b) return false;
            switch (typeof a) {
              case 'number':
                return Math.abs(left(i, ie) - right(i, ie)) < 1e-4;
              case 'boolean':
                return a === b;
              case 'string':
                return a.toLowerCase().includes(b.toLowerCase());
            }
            throw new Error('???'); // wtf
          };
        }
      }
    }
    return left;
  }

  function takeCmpRel(tokens) {
    const left = takeSum(tokens);
    if (tokens.here.type === 'sym') {
      switch (tokens.here.sym) {
        case '<=': {
          tokens.advance();
          const right = takeCmpRel(tokens);
          return (i, ie) => checkNum(left(i, ie)) <= checkNum(right(i, ie));
        }
        case '<': {
          tokens.advance();
          const right = takeCmpRel(tokens);
          return (i, ie) => checkNum(left(i, ie)) < checkNum(right(i, ie));
        }
        case '>': {
          tokens.advance();
          const right = takeCmpRel(tokens);
          return (i, ie) => checkNum(left(i, ie)) > checkNum(right(i, ie));
        }
        case '>=': {
          tokens.advance();
          const right = takeCmpRel(tokens);
          return (i, ie) => checkNum(left(i, ie)) >= checkNum(right(i, ie));
        }
      }
    }
    return left;
  }

  function takeSum(tokens) {
    const left = takeProd(tokens);
    if (tokens.here.type === 'sym') {
      switch (tokens.here.sym) {
        case '+': {
          tokens.advance();
          const right = takeSum(tokens);
          return (i, ie) => checkNum(left(i, ie)) + checkNum(right(i, ie));
        }
        case '-': {
          tokens.advance();
          const right = takeSum(tokens);
          return (i, ie) => checkNum(left(i, ie)) - checkNum(right(i, ie));
        }
      }
    }
    return left;
  }

  function takeProd(tokens) {
    const left = takeExp(tokens);
    if (tokens.here.type === 'sym') {
      switch (tokens.here.sym) {
        case '*': {
          tokens.advance();
          const right = takeProd(tokens);
          return (i, ie) => checkNum(left(i, ie)) * checkNum(right(i, ie));
        }
        case '/': {
          tokens.advance();
          const right = takeProd(tokens);
          return (i, ie) => checkNum(left(i, ie)) / checkNum(right(i, ie));
        }
      }
    }
    return left;
  }

  function takeExp(tokens) {
    const left = takeUnary(tokens);
    if (tokens.here.type === 'sym' && tokens.here.sym === '^') {
      tokens.advance();
      const right = takeExp(tokens);
      return (i, ie) => checkNum(left(i, ie)) ** checkNum(right(i, ie));
    }
    return left;
  }

  function takeUnary(tokens) {
    if (tokens.here.type === 'sym') {
      switch (tokens.here.sym) {
        case '-': {
          tokens.advance();
          const operand = takeUnary(tokens);
          return (i, ie) => -checkNum(operand(i, ie));
        }
        case '!': {
          tokens.advance();
          const operand = takeUnary(tokens);
          return (i, ie) => !checkBool(operand(i, ie));
        }
      }
    }
    return takePrim(tokens);
  }

  function takePrim(tokens) {
    switch (tokens.here.type) {
      case 'num': {
        const lit = tokens.here.value;
        tokens.advance();
        return (i, ie) => lit;
      }
      case 'bool': {
        const lit = tokens.here.value;
        tokens.advance();
        return (i, ie) => lit;
      }
      case 'str': {
        const lit = tokens.here.value;
        tokens.advance();
        console.log(lit);
        return (i, ie) => lit;
      }
      case 'id':
        const id = tokens.here.id;
        tokens.advance();
        if (tokens.here.type === 'sym' && tokens.here.sym === '(') { // it's a function call
          tokens.advance();
          const argExprs = [];
          if (tokens.here.type !== 'sym' || tokens.here.sym !== ')') {
            arg_iter: // collect arg expressions, if there are any
            while (true) {
              argExprs.push(takeDisj(tokens));
              if (tokens.here.type === 'sym') {
                switch (tokens.here.sym) {
                  case ')':
                    tokens.advance();
                    break arg_iter;
                  case ',':
                    tokens.advance();
                    continue;
                }
              }
              throw new Error(`Expected "," or ")", but got ${JSON.stringify(tokens.here)}`);
            }
          }
          const func = itemQueryFuncs[id.toLowerCase()];
          if (!func) throw new Error(`Unknown function: ${id}`);
          return (i, ie) => {
            const args = [];
            for (let k = 0; k < argExprs.length; k++) args.push(argExprs[k](i, ie));
            return func(args);
          };
        } else { // not a function call
          const prop = itemQueryProps[id.toLowerCase()];
          if (!prop) throw new Error(`Unknown property: ${id}`);
          return prop;
        }
      case 'sym':
        if (tokens.here.sym === '(') {
          tokens.advance();
          const expr = takeDisj(tokens);
          if (tokens.here.type !== 'sym' || tokens.here.sym !== ')') throw new Error('Bracket mismatch');
          tokens.advance();
          return expr;
        }
        break;
    }
    throw new Error(tokens.here.type === 'eof' ? 'Reached end of expression' : `Unexpected token: ${JSON.stringify(tokens.here)}`);
  }

  // full compilation function, with extra safety for empty input strings
  return function(exprStr) {
    const tokens = tokenize(exprStr);
    return tokens.tokens.length <= 1 ? null : takeDisj(tokens);
  };
})();
