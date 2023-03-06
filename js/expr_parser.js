/**
 * See `expr_parser.md` for notes on the implementation of this parser!
 */
const ExprParser = (function() {
  // buffer containing a list of tokens and a movable pointer into the list
  class TokenBuf {
    constructor(tokens) {
      this.tokens = tokens;
      this.index = 0;
    }

    get peek() {
      return this.tokens[this.index];
    }

    consume(termName) {
      if (this.peek.type !== termName) {
        throw new Error(`Expected a ${termName}, but got a ${this.peek.type}!`)
      }
      const node = { type: 'term', token: this.peek };
      ++this.index;
      return node;
    }
  }

  // tokenize an expression string
  function tokenize(exprStr) {
    exprStr = exprStr.trim();
    const tokens = [];
    let col = 0;

    function pushSymbol(sym) {
      tokens.push({ type: sym });
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
        case 'or':
          tokens.push({ type: '|' });
          col += 2;
          continue;
        case 'and':
          tokens.push({ type: '&' });
          col += 2;
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
      if (exprStr.slice(col, col + 2) === "?=") {
        pushSymbol("?=");
        continue;
      }
      // parse a numeric literal
      let m;
      if ((m = /^\d+(?:\.\d*)?/.exec(exprStr.substring(col))) !== null) {
        tokens.push({ type: 'nLit', value: parseFloat(m[0]) });
        col += m[0].length;
        continue;
      }
      // parse a string literal
      if ((m = /^"([^"]*)"/.exec(exprStr.substring(col))) !== null) { // with double-quotes
        tokens.push({ type: 'sLit', value: m[1] });
        col += m[0].length;
        continue;
      }
      if ((m = /^'([^']+)'/.exec(exprStr.substring(col))) !== null) { // with single-quotes
        tokens.push({ type: 'sLit', value: m[1] });
        col += m[0].length;
        continue;
      }
      // parse an identifier or boolean literal
      if ((m = /^\w[\w\d%]*/.exec(exprStr.substring(col))) !== null) {
        switch (m[0]) {
          case 'true':
            tokens.push({ type: 'bLit', value: true });
            col += 4;
            continue;
          case 'false':
            tokens.push({ type: 'bLit', value: false });
            col += 5;
            continue;
        }
        tokens.push({ type: 'ident', id: m[0] });
        col += m[0].length;
        continue;
      }
      // if we reach here without successfully parsing a token, it's an error
      throw new Error(`Could not parse character "${exprStr[col]}" at position ${col}`);
    }
    tokens.push({ type: 'eof' });
    return new TokenBuf(tokens);
  }

  // parse an AST from a sequence of tokens
  function takeExpr(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeConj(tokens));
        return { type: 'nonterm', name: 'expr', prod: 0, children };
      default:
        throw new Error('Could not parse an expression!');
    }
  }

  function takeExprList(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeExpr(tokens));
        children.push(takeExprList0(tokens));
        return { type: 'nonterm', name: 'exprList', prod: 0, children };
      default:
        throw new Error('Could not parse an expression list!');
    }
  }

  function takeExprList0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case ',':
        children.push(tokens.consume(','));
        children.push(takeExpr(tokens));
        children.push(takeExprList0(tokens));
        return { type: 'nonterm', name: 'exprList\'', prod: 0, children };
      case ')':
      case 'eof':
        return { type: 'nonterm', name: 'exprList\'', prod: 1, children };
      default:
        throw new Error('Could not parse a expression list!');
    }
  }

  function takeConj(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeDisj(tokens));
        children.push(takeConj0(tokens));
        return { type: 'nonterm', name: 'conj', prod: 0, children };
      default:
        throw new Error('Could not parse a conjunction!');
    }
  }

  function takeConj0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '&':
        children.push(tokens.consume('&'));
        children.push(takeDisj(tokens));
        children.push(takeConj0(tokens));
        return { type: 'nonterm', name: 'conj\'', prod: 0, children };
      case ')':
      case ',':
      case 'eof':
        return { type: 'nonterm', name: 'conj\'', prod: 1, children };
      default:
        throw new Error('Could not parse a conjunction!');
    }
  }

  function takeDisj(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeCmpEq(tokens));
        children.push(takeDisj0(tokens));
        return { type: 'nonterm', name: 'disj', prod: 0, children };
      default:
        throw new Error('Could not parse a disjunction!');
    }
  }

  function takeDisj0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '|':
        children.push(tokens.consume('|'));
        children.push(takeCmpEq(tokens));
        children.push(takeDisj0(tokens));
        return { type: 'nonterm', name: 'disj\'', prod: 0, children };
      case '&':
      case ')':
      case ',':
      case 'eof':
        return { type: 'nonterm', name: 'disj\'', prod: 1, children };
      default:
        throw new Error('Could not parse a disjunction!');
    }
  }

  function takeCmpEq(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeCmpRel(tokens));
        children.push(takeCmpEq0(tokens));
        return { type: 'nonterm', name: 'cmpEq', prod: 0, children };
      default:
        throw new Error('Could not parse an equality comparison!');
    }
  }

  function takeCmpEq0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '=':
        children.push(tokens.consume('='));
        children.push(takeCmpRel(tokens));
        children.push(takeCmpEq0(tokens));
        return { type: 'nonterm', name: 'cmpEq\'', prod: 0, children };
      case '!=':
        children.push(tokens.consume('!='));
        children.push(takeCmpRel(tokens));
        children.push(takeCmpEq0(tokens));
        return { type: 'nonterm', name: 'cmpEq\'', prod: 1, children };
      case '?=':
        children.push(tokens.consume('?='));
        children.push(takeCmpRel(tokens));
        children.push(takeCmpEq0(tokens));
        return { type: 'nonterm', name: 'cmpEq\'', prod: 2, children };
      case '&':
      case ')':
      case ',':
      case '|':
      case 'eof':
        return { type: 'nonterm', name: 'cmpEq\'', prod: 3, children };
      default:
        throw new Error('Could not parse an equality comparison!');
    }
  }

  function takeCmpRel(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeSum(tokens));
        children.push(takeCmpRel0(tokens));
        return { type: 'nonterm', name: 'cmpRel', prod: 0, children };
      default:
        throw new Error('Could not parse a relational comparison!');
    }
  }

  function takeCmpRel0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '<=':
        children.push(tokens.consume('<='));
        children.push(takeSum(tokens));
        children.push(takeCmpRel0(tokens));
        return { type: 'nonterm', name: 'cmpRel\'', prod: 0, children };
      case '<':
        children.push(tokens.consume('<'));
        children.push(takeSum(tokens));
        children.push(takeCmpRel0(tokens));
        return { type: 'nonterm', name: 'cmpRel\'', prod: 1, children };
      case '>':
        children.push(tokens.consume('>'));
        children.push(takeSum(tokens));
        children.push(takeCmpRel0(tokens));
        return { type: 'nonterm', name: 'cmpRel\'', prod: 2, children };
      case '>=':
        children.push(tokens.consume('>='));
        children.push(takeSum(tokens));
        children.push(takeCmpRel0(tokens));
        return { type: 'nonterm', name: 'cmpRel\'', prod: 3, children };
      case '!=':
      case '&':
      case ')':
      case ',':
      case '=':
      case '?=':
      case '|':
      case 'eof':
        return { type: 'nonterm', name: 'cmpRel\'', prod: 4, children };
      default:
        throw new Error('Could not parse a relational comparison!');
    }
  }

  function takeSum(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeProd(tokens));
        children.push(takeSum0(tokens));
        return { type: 'nonterm', name: 'sum', prod: 0, children };
      default:
        throw new Error('Could not parse an additive expression!');
    }
  }

  function takeSum0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '+':
        children.push(tokens.consume('+'));
        children.push(takeProd(tokens));
        children.push(takeSum0(tokens));
        return { type: 'nonterm', name: 'sum\'', prod: 0, children };
      case '-':
        children.push(tokens.consume('-'));
        children.push(takeProd(tokens));
        children.push(takeSum0(tokens));
        return { type: 'nonterm', name: 'sum\'', prod: 1, children };
      case '!=':
      case '&':
      case ')':
      case ',':
      case '<':
      case '<=':
      case '=':
      case '>':
      case '>=':
      case '?=':
      case '|':
      case 'eof':
        return { type: 'nonterm', name: 'sum\'', prod: 2, children };
      default:
        throw new Error('Could not parse an additive expression!');
    }
  }

  function takeProd(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeExp(tokens));
        children.push(takeProd0(tokens));
        return { type: 'nonterm', name: 'prod', prod: 0, children };
      default:
        throw new Error('Could not parse a multiplicative expression!');
    }
  }

  function takeProd0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '*':
        children.push(tokens.consume('*'));
        children.push(takeExp(tokens));
        children.push(takeProd0(tokens));
        return { type: 'nonterm', name: 'prod\'', prod: 0, children };
      case '/':
        children.push(tokens.consume('/'));
        children.push(takeExp(tokens));
        children.push(takeProd0(tokens));
        return { type: 'nonterm', name: 'prod\'', prod: 1, children };
      case '!=':
      case '&':
      case ')':
      case '+':
      case ',':
      case '-':
      case '<':
      case '<=':
      case '=':
      case '>':
      case '>=':
      case '?=':
      case '|':
      case 'eof':
        return { type: 'nonterm', name: 'prod\'', prod: 2, children };
      default:
        throw new Error('Could not parse a multiplicative expression!');
    }
  }

  function takeExp(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeUnary(tokens));
        children.push(takeExp0(tokens));
        return { type: 'nonterm', name: 'exp', prod: 0, children };
      default:
        throw new Error('Could not parse an exponential expression!');
    }
  }

  function takeExp0(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '^':
        children.push(tokens.consume('^'));
        children.push(takeUnary(tokens));
        children.push(takeExp0(tokens));
        return { type: 'nonterm', name: 'exp\'', prod: 0, children };
      case '!=':
      case '&':
      case ')':
      case '*':
      case '+':
      case ',':
      case '-':
      case '/':
      case '<':
      case '<=':
      case '=':
      case '>':
      case '>=':
      case '?=':
      case '|':
      case 'eof':
        return { type: 'nonterm', name: 'exp\'', prod: 1, children };
      default:
        throw new Error('Could not parse an exponential expression!');
    }
  }

  function takeUnary(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '-':
        children.push(tokens.consume('-'));
        children.push(takeUnary(tokens));
        return { type: 'nonterm', name: 'unary', prod: 0, children };
      case '!':
        children.push(tokens.consume('!'));
        children.push(takeUnary(tokens));
        return { type: 'nonterm', name: 'unary', prod: 1, children };
      case '(':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takePrim(tokens));
        return { type: 'nonterm', name: 'unary', prod: 2, children };
      default:
        throw new Error('Could not parse a unary expression!');
    }
  }

  function takePrim(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case 'nLit':
        children.push(tokens.consume('nLit'));
        return { type: 'nonterm', name: 'prim', prod: 0, children };
      case 'bLit':
        children.push(tokens.consume('bLit'));
        return { type: 'nonterm', name: 'prim', prod: 1, children };
      case 'sLit':
        children.push(tokens.consume('sLit'));
        return { type: 'nonterm', name: 'prim', prod: 2, children };
      case 'ident':
        children.push(tokens.consume('ident'));
        children.push(takeIdentTail(tokens));
        return { type: 'nonterm', name: 'prim', prod: 3, children };
      case '(':
        children.push(tokens.consume('('));
        children.push(takeExpr(tokens));
        children.push(tokens.consume(')'));
        return { type: 'nonterm', name: 'prim', prod: 4, children };
      default:
        throw new Error('Could not parse a primitive value!');
    }
  }

  function takeIdentTail(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '(':
        children.push(tokens.consume('('));
        children.push(takeArgs(tokens));
        children.push(tokens.consume(')'));
        return { type: 'nonterm', name: 'identTail', prod: 0, children };
      case '!=':
      case '&':
      case ')':
      case '*':
      case '+':
      case ',':
      case '-':
      case '/':
      case '<':
      case '<=':
      case '=':
      case '>':
      case '>=':
      case '?=':
      case '^':
      case '|':
      case 'eof':
        return { type: 'nonterm', name: 'identTail', prod: 1, children };
      default:
        throw new Error('Could not parse an identifier expression!');
    }
  }

  function takeArgs(tokens) {
    const children = [];
    switch (tokens.peek.type) {
      case '!':
      case '(':
      case '-':
      case 'bLit':
      case 'ident':
      case 'nLit':
      case 'sLit':
        children.push(takeExprList(tokens));
        return { type: 'nonterm', name: 'args', prod: 0, children };
      case ')':
      case 'eof':
        return { type: 'nonterm', name: 'args', prod: 1, children };
      default:
        throw new Error('Could not parse an argument list!');
    }
  }

  // apply tree transformations to recover the nominal-grammar AST
  function fixUp(ast) {
    if (ast.type === 'term') {
      return ast;
    }
    switch (ast.name) {
      case 'exprList': // recover left-recursive structures
      case 'conj':
      case 'disj':
      case 'exp':
        return fixUpRightRecurse(ast, 1);
      case 'sum':
      case 'prod':
        return fixUpRightRecurse(ast, 2);
      case 'cmpEq':
        return fixUpRightRecurse(ast, 3);
      case 'cmpRel':
        return fixUpRightRecurse(ast, 4);
      case 'prim': // recover left-factored identifier things
        switch (ast.prod) {
          case 3:
            switch (ast.children[1].prod) {
              case 0: // function call
                return {
                  type: 'nonterm', name: 'prim', prod: 3,
                  children: [fixUp(ast.children[0]), ...mapFixUp(ast.children[1].children)]
                };
              case 1: // just an identifier
                return { type: 'nonterm', name: 'prim', prod: 4, children: [fixUp(ast.children[0])] };
            }
            break;
          case 4:
            return { ...ast, prod: 5, children: mapFixUp(ast.children) };
        }
        break;
    }
    return { ...ast, children: mapFixUp(ast.children) };
  }

  function mapFixUp(nodes) {
    return nodes.map(chAst => fixUp(chAst));
  }

  function fixUpRightRecurse(ast, maxProd) {
    let nomAst = { type: 'nonterm', name: ast.name, prod: maxProd, children: [fixUp(ast.children[0])] };
    let tree = ast.children[1];
    while (tree.prod < maxProd) {
      nomAst = {
        type: 'nonterm', name: ast.name, prod: tree.prod,
        children: [nomAst, ...mapFixUp(tree.children.slice(0, tree.children.length - 1))]
      };
      tree = tree.children[tree.children.length - 1];
    }
    return nomAst;
  }

  // compile nominal AST into an item builder expression function
  function translate(ast, builtInProps, builtInFuncs) {
    function trans(ast) {
      return translate(ast, builtInProps, builtInFuncs);
    }

    if (ast.type === 'term') {
      switch (ast.token.type) {
        case 'nLit':
          return ast.token.value;
        case 'bLit':
          return ast.token.value;
        case 'sLit':
          return ast.token.value;
        case 'ident':
          return ast.token.value;
      }
    } else if (ast.type === 'nonterm') {
      switch (ast.name) {
        case 'expr':
          return trans(ast.children[0]);
        case 'exprList':
          switch (ast.prod) {
            case 0:
              return [...trans(ast.children[0]), trans(ast.children[2])];
            case 1:
              return [trans(ast.children[0])];
          }
          break;
        case 'conj':
          switch (ast.prod) {
            case 0:
              return new ConjTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return trans(ast.children[0]);
          }
          break;
        case 'disj':
          switch (ast.prod) {
            case 0:
              return new DisjTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return trans(ast.children[0]);
          }
          break;
        case 'cmpEq':
          switch (ast.prod) {
            case 0:
              return new EqTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return new NeqTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 2:
              return new ContainsTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 3:
              return trans(ast.children[0]);
          }
          break;
        case 'cmpRel':
          switch (ast.prod) {
            case 0:
              return new LeqTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return new LtTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 2:
              return new GtTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 3:
              return new GeqTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 4:
              return trans(ast.children[0]);
          }
          break;
        case 'sum':
          switch (ast.prod) {
            case 0:
              return new AddTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return new SubTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 2:
              return trans(ast.children[0]);
          }
          break;
        case 'prod':
          switch (ast.prod) {
            case 0:
              return new MulTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return new DivTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 2:
              return trans(ast.children[0]);
          }
          break;
        case 'exp':
          switch (ast.prod) {
            case 0:
              return new ExpTerm(trans(ast.children[0]), trans(ast.children[2]));
            case 1:
              return trans(ast.children[0]);
          }
          break;
        case 'unary':
          switch (ast.prod) {
            case 0:
              return new NegTerm(trans(ast.children[1]));
            case 1:
              return new InvTerm(trans(ast.children[1]));
            case 2:
              return trans(ast.children[0]);
          }
          break;
        case 'prim':
          switch (ast.prod) {
            case 0:
              return new NumLitTerm(ast.children[0].token.value);
            case 1:
              return new BoolLitTerm(ast.children[0].token.value);
            case 2:
              return new StrLitTerm(ast.children[0].token.value);
            case 3:
              const fn = builtInFuncs[ast.children[0].token.id.toLowerCase()];
              if (!fn) {
                throw new Error(`Unknown function: ${ast.children[0].token.id}`);
              }
              return new FnCallTerm(fn, trans(ast.children[2]));
            case 4: {
              const prop = builtInProps[ast.children[0].token.id.toLowerCase()];
              if (!prop) {
                throw new Error(`Unknown property: ${ast.children[0].token.id}`);
              }
              return new PropTerm(prop);
            }
            case 5:
              return trans(ast.children[1]);
          }
          break;
        case 'args':
          switch (ast.prod) {
            case 0:
              return trans(ast.children[0]);
            case 1:
              return [];
          }
          break;
      }
    }
  }

  return class ExprParser {
    constructor(builtInProps, builtInFuncs) {
      this.builtInProps = builtInProps;
      this.builtInFuncs = builtInFuncs;
    }

    parse(exprStr) {
      const tokens = tokenize(exprStr);
      if (tokens.tokens.length <= 1) {
        return null;
      }
      const transAst = takeExpr(tokens, 0);
      if (tokens.peek.type !== 'eof') {
        throw new Error('Could not parse entire expression!');
      }
      const nomAst = fixUp(transAst);
      return translate(nomAst, this.builtInProps, this.builtInFuncs);
    }
  };
})();
