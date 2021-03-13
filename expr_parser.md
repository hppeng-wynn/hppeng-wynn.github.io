This file contains notes on how the parser implemented in `expr_parser.js` is designed.
The nominal grammar is as follows:

```
expr := conj

exprList := exprList "," expr
          | expr

conj := conj "&" disj
      | disj

disj := disj "|" cmpEq
      | cmpEq

cmpEq := cmpEq "=" cmpRel
       | cmpEq "!=" cmpRel
       | cmpEq "?=" cmpRel
       | cmpRel

cmpRel := cmpRel "<=" sum
        | cmpRel "<" sum
        | cmpRel ">" sum
        | cmpRel ">=" sum
        | sum

sum := sum "+" prod
     | sum "-" prod
     | prod

prod := prod "*" exp
      | prod "/" exp
      | exp

exp := exp "^" unary
     | unary

unary := "-" unary
       | "!" unary
       | prim

prim := nLit
      | bLit
      | sLit
      | ident "(" args ")"
      | ident
      | "(" expr ")"

args := exprList
      | ε
```

In order to eliminate left-recursion, the above grammar is transformed into the following:

```
expr := conj

exprList := expr exprListTail

exprList' := "," expr exprList'
           | ε

conj := disj conj'

conj' := "&" disj conj'
       | ε

disj := cmpEq disj'

disj' := "|" cmpEq disj'
       | ε

cmpEq := cmpRel cmpEq'

cmpEq' := "=" cmpRel cmpEq'
        | "!=" cmpRel cmpEq'
        | "?=" cmpRel cmpEq'
        | ε

cmpRel := sum cmpRel'

cmpRel' := "<=" sum cmpRel'
         | "<" sum cmpRel'
         | ">" sum cmpRel'
         | ">=" sum cmpRel'
         | ε

sum := prod sum'

sum' := "+" prod sum'
      | "-" prod sum'
      | ε

prod := exp prod'

prod' := "*" exp prod'
       | "/" exp prod'
       | ε

exp := unary exp'

exp' := "^" unary exp'
      | ε

unary := "-" unary
       | "!" unary
       | prim

prim := nLit
      | bLit
      | sLit
      | ident identTail
      | "(" expr ")"

identTail := "(" args ")"
           | ε

args := exprList
      | ε
```

The parser itself is a recursive-descent LL(1) parser.
To build the parsing rules, the following `FIRST` and `FOLLOW` sets are computed for the above grammar:

Nonterminal | FIRST
----------- | -----
`expr`      | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`exprList`  | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`exprList'` | `","`, `ε`
`conj`      | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`conj'`     | `"&"`, `ε`
`disj`      | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`disj'`     | `"\|"`, `ε`
`cmpEq`     | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`cmpEq'`    | `"!="`, `"="`, `"?="`, `ε`
`cmpRel`    | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`cmpRel'`   | `"<"`, `"<="`, `">"`, `">="`, `ε`
`sum`       | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`sum'`      | `"+"`, `"-"`, `ε`
`prod`      | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`prod'`     | `"*"`, `"/"`, `ε`
`exp`       | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`exp'`      | `"^"`, `ε`
`unary`     | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`
`prim`      | `"("`, `bLit`, `ident`, `nLit`, `sLit`
`identTail` | `"("`, `ε`
`args`      | `"!"`, `"("`, `"-"`, `bLit`, `ident`, `nLit`, `sLit`, `ε`

Nonterminal | FOLLOW
----------- | ------
`expr`      | `")"`, `","`, `$`
`exprList`  | `")"`
`exprList'` | `")"`
`conj`      | `")"`, `","`
`conj'`     | `")"`, `","`
`disj`      | `"&"`, `")"`, `","`
`disj'`     | `"&"`, `")"`, `","`
`cmpEq`     | `"&"`, `")"`, `","`, `"\|"`
`cmpEq'`    | `"&"`, `")"`, `","`, `"\|"`
`cmpRel`    | `"!="`, `"&"`, `")"`, `","`, `"="`, `"?="`, `"\|"`
`cmpRel'`   | `"!="`, `"&"`, `")"`, `","`, `"="`, `"?="`, `"\|"`
`sum`       | `"!="`, `"&"`, `")"`, `","`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"\|"`
`sum'`      | `"!="`, `"&"`, `")"`, `","`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"\|"`
`prod`      | `"!="`, `"&"`, `")"`, `"+"`, `","`, `"-"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"\|"`
`prod'`     | `"!="`, `"&"`, `")"`, `"+"`, `","`, `"-"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"\|"`
`exp`       | `"!="`, `"&"`, `")"`, `"*"`, `"+"`, `","`, `"-"`, `"/"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"\|"`
`exp'`      | `"!="`, `"&"`, `")"`, `"*"`, `"+"`, `","`, `"-"`, `"/"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"\|"`
`unary`     | `"!="`, `"&"`, `")"`, `"*"`, `"+"`, `","`, `"-"`, `"/"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"^"`, `"\|"`
`prim`      | `"!="`, `"&"`, `")"`, `"*"`, `"+"`, `","`, `"-"`, `"/"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"^"`, `"\|"`
`identTail` | `"!="`, `"&"`, `")"`, `"*"`, `"+"`, `","`, `"-"`, `"/"`, `"<"`, `"<="`, `"="`, `">"`, `">="`, `"?="`, `"^"`, `"\|"`
`args`      | `")"`

Then, the parsing rule table is as follows, where each table entry refers to the production number for the given nonterminal:

Nonterminal | "!" | "!=" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "/" | "<" | "<=" | "=" | ">" | ">=" | "?=" | "^" | "&#124;" | bLit | ident | nLit | sLit | $
----------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | ---- | ---- | --- | --- | ---- | ----- | ---- | ---- | ---
expr        | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
exprList    | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
exprList'   | -   | -    | -   | -   | 1   | -   | -   | 0   | -   | -   | -   | -    | -   | -   | -    | -    | -   | -   | -    | -     | -    | -    | 1
conj        | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
conj'       | -   | -    | 0   | -   | 1   | -   | -   | 1   | -   | -   | -   | -    | -   | -   | -    | -    | -   | -   | -    | -     | -    | -    | 1
disj        | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
disj'       | -   | -    | 1   | -   | 1   | -   | -   | 1   | -   | -   | -   | -    | -   | -   | -    | -    | -   | 0   | -    | -     | -    | -    | 1
cmpEq       | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
cmpEq'      | -   | 1    | 3   | -   | 3   | -   | -   | 3   | -   | -   | -   | -    | 0   | -   | -    | 2    | -   | 3   | -    | -     | -    | -    | 3
cmpRel      | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
cmpRel'     | -   | 4    | 4   | -   | 4   | -   | -   | 4   | -   | -   | 1   | 0    | 4   | 2   | 3    | 4    | -   | 4   | -    | -     | -    | -    | 4
sum         | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
sum'        | -   | 2    | 2   | -   | 2   | -   | 0   | 2   | 1   | -   | 2   | 2    | 2   | 2   | 2    | 2    | -   | 2   | -    | -     | -    | -    | 2
prod        | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
prod'       | -   | 2    | 2   | -   | 2   | 0   | 2   | 2   | 2   | 1   | 2   | 2    | 2   | 2   | 2    | 2    | -   | 2   | -    | -     | -    | -    | 2
exp         | 0   | -    | -   | 0   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | -
exp'        | -   | 1    | 1   | -   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1   | 1   | 1    | 1    | 0   | 1   | -    | -     | -    | -    | 1
unary       | 1   | -    | -   | 2   | -   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 2    | 2     | 2    | 2    | -
prim        | -   | -    | -   | 4   | -   | -   | -   | -   | -   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 1    | 3     | 0    | 2    | -
identTail   | -   | 1    | 1   | 0   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1    | 1   | 1   | 1    | 1    | 1   | 1   | -    | -     | -    | -    | 1
args        | 0   | -    | -   | 0   | 1   | -   | -   | -   | 0   | -   | -   | -    | -   | -   | -    | -    | -   | -   | 0    | 0     | 0    | 0    | 1
