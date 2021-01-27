/*
 * disj := conj "|" disj
 *       | conj
 *
 * conj := cmp "&" conj
 *       | cmpEq
 *
 * cmpEq := cmpRel "=" cmpEq
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
  function prop(names, prop) {
    if (Array.isArray(names)) {
      for (name of names) {
        props[name] = prop;
      }
    } else {
      props[names] = prop;
    }
  }
  function maxId(names, idKey) {
    prop(names, (i, ie) => ie.get('maxRolls').get(idKey));
  }

  prop('name', (i, ie) => i.displayName || i.name);

  prop('str', (i, ie) => i.str);
  prop('dex', (i, ie) => i.dex);
  prop('int', (i, ie) => i.int);
  prop('def', (i, ie) => i.def);
  prop('agi', (i, ie) => i.agi);
  // TODO more properties

  return props;
})();

// functions that can be called in query expressions
const itemQueryFuncs = {
  max(args) {
    if (args.length < 1) throw new Error('Not enough args to max()')
    let runningMax = -Infinity;
    for (let i = 0; i < args.length; i++) {
      if (checkNum(args[i]) > runningMax) runningMax = args[i];
    }
    return runningMax;
  },
  min(args) {
    if (args.length < 1) throw new Error('Not enough args to min()')
    let runningMin = Infinity;
    for (let i = 0; i < args.length; i++) {
      if (checkNum(args[i]) < runningMin) runningMin = args[i];
    }
    return runningMin;
  },
  floor(args) {
    if (args.length < 1) throw new Error('Not enough args to floor()')
    return Math.floor(checkNum(args[0]));
  },
  ceil(args) {
    if (args.length < 1) throw new Error('Not enough args to ceil()')
    return Math.ceil(checkNum(args[0]));
  }
  // TODO more functions
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
      // parse a numeric literal
      let m;
      if ((m = /^\d+(?:\.\d*)?/.exec(exprStr.substring(col))) !== null) {
        tokens.push({ type: 'num', value: parseFloat(m[0]) });
        col += m[0].length;
        continue;
      }
      // parse a string literal
      if ((m = /^"[^"]+"/.exec(exprStr.substring(col))) !== null) {
        tokens.push({ type: 'str', value: m[1] });
        col += m[0].length;
        continue;
      }
      // parse an identifier or boolean literal
      if ((m = /^\w[\w\d_]*/.exec(exprStr.substring(col))) !== null) {
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
          const func = itemQueryFuncs[id];
          if (!func) throw new Error(`Unknown function: ${id}`);
          return (i, ie) => {
            const args = [];
            for (let k = 0; k < argExprs.length; k++) args.push(argExprs[k](i, ie));
            return func(args);
          };
        } else { // not a function call
          const prop = itemQueryProps[id];
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
