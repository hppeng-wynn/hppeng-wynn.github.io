theorySpeeds = [4.3, 3.1, 2.5, 2.05, 1.5, 0.83, 0.51]
realSpeeds = [] # TODO

atkSpd = 6

#spellCycle = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 2]
#spellDelay = [0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, 1, 0.5]
spellCycle = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2]
spellDelay = [0.5, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5]
#spellCycle = [-1, 1, 0, 2, 1, 1]
#spellDelay = [0.4312345, 0, 0.4, 0.4, 0.4, 0.4]
#spellCycle = [9, 0, 9, 0, 10, 0, 0]
#spellDelay = [0, 1.4, 0, 1.4, 0, 1.3, 1.3]
#delayCycle = [1.2, 0, 0.4, 0.4, 0.4, 0.4]
#spellCycle = spellCycle*8
#spellDelay = spellDelay*4 + delayCycle + spellDelay*2 + delayCycle

simulation_end = 100
#manaRegens = [5, 0, 15]
#manaSteals = [9, 13, 0]
manaRegens = [0, 0]
manaSteals = [8, 11]

import random
import math
import statistics

def simulate(manaRegen, manaSteal, spellCycle, spellDelay, simulation_end, atkSpd):
    realSpeed = theorySpeeds[atkSpd]

    realDt = 1/realSpeed
    print(realDt)

    stealChance = (1/realSpeed) / 3
    lastAttackTime = 0
    lastManaTime = -random.random()
    lastMRTime = lastManaTime + random.randint(-4, 0)
    currentTime = 0
    currentMana = 20

    times = [0]
    manas = [20]
    colors = [0]

    numSpells = len(spellCycle)
    currentSpell = 0

    mrDisabled = False

    failedCasts = 0
    lost_mana = 0

    while currentTime < simulation_end:
        spellCost = spellCycle[currentSpell]
        spellTime = spellDelay[currentSpell]
        
        currentTime += spellTime
        if currentTime >= lastManaTime + 1:
            mana_gained = math.floor(currentTime - lastManaTime)
            if not mrDisabled:
                currentMana = min(20, currentMana + mana_gained)
            else:
                currentMana = max(0, currentMana - mana_gained)
            lastManaTime += mana_gained
        if currentTime >= lastMRTime + 5:
            mr_proc = math.floor((currentTime - lastMRTime) / 5)
            if not mrDisabled:
                mana_nocap = currentMana + mr_proc * manaRegen
                currentMana = min(20, mana_nocap)
                lost_mana += mana_nocap - currentMana
            else:
                lostMana += mr_proc * manaRegen
            lastMRTime += 5 * mr_proc
        times.append(currentTime)
        manas.append(currentMana)

        if spellCost < 0:
            mrDisabled = True
            spellCost *= -1
        else:
            mrDisabled = False

        if spellCost == 0:
            if currentTime - lastAttackTime > realDt:
                lastAttackTime = currentTime
                #currentMana = min(20, currentMana + manaSteal * stealChance)
                if random.random() < stealChance:
                    mana_nocap = currentMana + manaSteal
                    currentMana = min(20, mana_nocap)
                    lost_mana += mana_nocap - currentMana
            colors.append(0)
        elif currentMana > spellCost:
            currentMana -= spellCost
            colors.append(0)
        else:
            failedCasts += 1
            colors.append(1)
        currentSpell = (currentSpell + 1) % numSpells
    return ((times, manas, colors), failedCasts, lost_mana)

plot = True
seeds = list(range(1000))

results = []
results2 = []

import matplotlib.pyplot as plt
for (manaRegen, manaSteal) in zip(manaRegens, manaSteals):
    result = []
    result2 = []
    for seed in seeds:
        random.seed(seed)
        ((times, manas, colors), failedCasts, lost_mana) = simulate(manaRegen, manaSteal, spellCycle, spellDelay, simulation_end, atkSpd)
        result.append(failedCasts)
        result2.append(lost_mana)
        print(f"({manaRegen}+{manaSteal}) Failed {failedCasts} casts!")

        if seed == 0:
            plt.figure()
            plt.scatter(times, manas, c=colors)
            plt.xlabel("Time (seconds)")
            plt.ylabel("Mana")
            plt.title(f"Mana steal simulation ({manaRegen} mr {manaSteal} ms)")

    results.append(result)
    results2.append(result2)

print("----------------")

averages = [statistics.mean(result) for result in results]
maxs = [min(result) for result in results]
mins = [max(result) for result in results]
averages2 = [statistics.mean(result) for result in results2]
maxs2 = [min(result) for result in results2]
mins2 = [max(result) for result in results2]
for (manaRegen, manaSteal, failedCasts, maxk, mink, lostMana, minl, maxl) in zip(manaRegens, manaSteals, averages, mins, maxs, averages2, mins2, maxs2):
    print(f"({manaRegen}+{manaSteal}) on average failed {failedCasts} casts (max {maxk} min {mink}) and lost {lostMana} mana (max {maxl} min {minl})")

plt.show()
