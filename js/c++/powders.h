#pragma once
#include <map>
#include <string>
#include <vector>

extern const std::map<std::string, int> powder_IDs;
extern const std::map<int, std::string> powder_names;

struct Powder {
    int min;
    int max;
    int convert;
    int defPlus;
    int defMinus;

    Powder();
    Powder(int min, int max, int conv, int defPlus, int defMinus);
};

extern const std::vector<Powder> powder_stats;
