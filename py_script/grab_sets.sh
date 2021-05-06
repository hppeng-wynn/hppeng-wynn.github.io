#!/bin/bash

#while read line; do
#    curl "https://www.wynndata.tk/sets/${line}" > "sets/${line}"
#done < sets_list.txt
#
#ls sets/ | while read line; do
#    grep "Set Items:" "sets/${line}" > "sets/_${line}"
#done

rm sets/*.json
ls sets/ | grep "_" | while read line; do
    python3 parse_set_individual.py "sets/${line}"
done
