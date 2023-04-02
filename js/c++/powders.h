#pragma once
#include <map>
#include <string>
#include <vector>

extern const std::map<std::string, int> powderIDs;
extern const std::map<int, std::string> powderNames;

struct Powder {
    int min;
    int max;
    int convert;
    int defPlus;
    int defMinus;

    Powder(int min, int max, int conv, int defPlus, int defMinus);
};

extern const std::vector<Powder> powderStats;
