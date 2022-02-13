import numpy as np
import numpy.linalg as la
import matplotlib.pyplot as plt

# Super slow attack speed. (Idealized to 1 hit/2s, 2/3 chance of proc
mana_consumption = 6
mana_steal = 14     # /3s
mana_regen = 6      # /5s
#mana_steal = 5      # /3s
#mana_regen = 5      # /5s
natural_regen = 1

ms_period = 2
ms_chance = ms_period / 3
no_ms_chance = 1 - ms_chance

MAX_MANA = 20
TIME_CYCLE = 10
transition_matrix = np.zeros((MAX_MANA * TIME_CYCLE, MAX_MANA * TIME_CYCLE))
for j in range(TIME_CYCLE):
    for i in range(MAX_MANA):
        natural_state = max(0, i - mana_consumption + natural_regen)
        if j % 5 == 0:  # mr activation
            natural_state = min(19, natural_state + mana_regen)
        next_ind = ((j+1) % TIME_CYCLE) * MAX_MANA
        if j % ms_period == 0:  # ms activation
            ms_state = min(19, natural_state + mana_steal)
            transition_matrix[next_ind + natural_state, i+j*MAX_MANA] = no_ms_chance
            transition_matrix[next_ind + ms_state, i+j*MAX_MANA] += ms_chance
        else:
            transition_matrix[next_ind + natural_state, i+j*MAX_MANA] = 1

eigval, eigvec = la.eig(transition_matrix)
print(eigval)
eps = 0.00001
ind = np.argwhere(abs(eigval - 1) < eps)
steady_state = np.sum(abs(eigvec[:, ind]).reshape((TIME_CYCLE, MAX_MANA)), axis=0)
steady_state /= np.sum(steady_state)
cumulative = np.cumsum(steady_state)
print("mana\tcumulative probability")
for i in range(MAX_MANA):
    print(f"{i+1}\t{cumulative[i]}")

mana_limit = 6+mana_consumption

x_ticks = list(range(len(steady_state)))
plt.figure()
plt.scatter(x_ticks, steady_state, label="mana values")
plt.xlim(0, 19)
plt.ylim(0, 0.3)
plt.axvline(x=mana_limit, color="red")
plt.xlabel("Mana Value")
plt.xticks(x_ticks)
plt.ylabel("Probability at t=infty")
plt.legend()
ax2 = plt.gca().twinx()
ax2.plot(x_ticks, cumulative, label="cumulative probability", color="pink")

plt.text(mana_limit - 0.2, cumulative[mana_limit] + 0.03, f"time with sprint loss: {cumulative[mana_limit]*100:.2f}%", horizontalalignment='right')
plt.scatter((mana_limit,), (cumulative[mana_limit],), color="red")
ax2.set_ylim(0, 1)
ax2.set_ylabel("Cumulative probability at t=infty")
plt.title(f"Super Slow Speed: Build={mana_regen}mr,{mana_steal}ms,{mana_consumption}mana/sec")
plt.legend()
plt.show()
