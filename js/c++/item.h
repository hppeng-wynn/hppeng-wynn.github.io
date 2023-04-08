#pragma once
#include <string>
#include <vector>

extern std::vector<std::string> numeric_IDs;
extern const std::vector<std::string> non_rolled_ids;

// TODO enum?
#define item_tier_t std::string
#define item_type_t std::string
#define item_drop_t std::string

class Item {
    std::string name;
    std::string display_name;
    std::string lore;
    std::string color;
    item_tier_t tier;
    std::string set;
    int slots;
    item_type_t type;
    std::string material;
    item_drop_t drop;
    std::string quest;

let item_fields = [ "name", "displayName", "lore", "color", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rSdRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "id", "majorIds", "damMobs", "defMobs",

// wynn2 damages.
"eMdPct","eMdRaw","eSdPct","eSdRaw",/*"eDamPct,"*/"eDamRaw","eDamAddMin","eDamAddMax",
"tMdPct","tMdRaw","tSdPct","tSdRaw",/*"tDamPct,"*/"tDamRaw","tDamAddMin","tDamAddMax",
"wMdPct","wMdRaw","wSdPct","wSdRaw",/*"wDamPct,"*/"wDamRaw","wDamAddMin","wDamAddMax",
"fMdPct","fMdRaw","fSdPct","fSdRaw",/*"fDamPct,"*/"fDamRaw","fDamAddMin","fDamAddMax",
"aMdPct","aMdRaw","aSdPct","aSdRaw",/*"aDamPct,"*/"aDamRaw","aDamAddMin","aDamAddMax",
"nMdPct","nMdRaw","nSdPct","nSdRaw","nDamPct","nDamRaw","nDamAddMin","nDamAddMax",      // neutral which is now an element
/*"mdPct","mdRaw","sdPct","sdRaw",*/"damPct","damRaw","damAddMin","damAddMax",          // These are the old ids. Become proportional.
"rMdPct","rMdRaw","rSdPct",/*"rSdRaw",*/"rDamPct","rDamRaw","rDamAddMin","rDamAddMax",  // rainbow (the "element" of all minus neutral). rSdRaw is rainraw
"critDamPct",
"spPct1Final", "spPct2Final", "spPct3Final", "spPct4Final"
];

}
