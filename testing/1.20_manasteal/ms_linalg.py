import numpy as np
import numpy.linalg as la
import matplotlib.pyplot as plt

# Attack speed independent. Fast speed losses not accounted for
mana_consumption = 3
mana_steal = 10     # /3s
mana_regen = 0      # /5s
#mana_steal = 5     # /3s
#mana_regen = 5      # /5s
natural_regen = 1

weight_natural = 8/15   # 4/5 * 2/3
weight_mr = 2/15        # 1/5 * 2/3
weight_ms = 4/15        # 4/5 * 1/3
weight_mr_ms = 1/15     # 1/5 * 1/3

MAX_MANA = 20
transition_matrix = np.zeros((MAX_MANA, MAX_MANA))
for i in range(MAX_MANA):
    natural_state = max(0, i - mana_consumption + natural_regen)
    mr_state = min(19, natural_state + mana_regen)
    ms_state = min(19, natural_state + mana_steal)
    mr_ms_state = min(19, natural_state + mana_regen + mana_steal)
    transition_matrix[natural_state, i] = weight_natural
    transition_matrix[mr_state, i] += weight_mr
    transition_matrix[ms_state, i] += weight_ms
    transition_matrix[mr_ms_state, i] += weight_mr_ms

eigval, eigvec = la.eig(transition_matrix)
print(eigval)
eps = 0.00001
ind = np.argwhere(abs(eigval - 1) < eps)
steady_state = abs(eigvec[:, ind])
steady_state /= np.sum(steady_state)
cumulative = np.cumsum(steady_state)
print("mana\tprob cumsum")
for i in range(MAX_MANA):
    print(f"{i+1}\t{cumulative[i]}")

plt.figure()
plt.scatter(range(len(steady_state)), steady_state)
plt.xlim(0, 19)
plt.ylim(0, 0.2)
plt.xlabel("Mana Value")
plt.ylabel("Probability at t=infty")
plt.title(f"Build={mana_regen}mr,{mana_steal}ms,{mana_consumption}mana/sec")
plt.show()
