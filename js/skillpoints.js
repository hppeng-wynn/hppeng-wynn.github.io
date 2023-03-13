/**
 * Apply skillpoint bonuses from an item.
 * Also applies set deltas.
 * Modifies the skillpoints array.
 */
function apply_skillpoints(skillpoints, item, activeSetCounts) {
    for (let i = 0; i < 5; i++) {
        skillpoints[i] += item.skillpoints[i];
    }

    const setName = item.set;
    if (setName) { // undefined/null means no set.
        let setCount = activeSetCounts.get(setName);
        let old_bonus = {};
        if (setCount) {
            old_bonus = sets.get(setName).bonuses[setCount-1];
            activeSetCounts.set(setName, setCount + 1);
        }
        else {
            setCount = 0;
            activeSetCounts.set(setName, 1);
        }
        const new_bonus = sets.get(setName).bonuses[setCount];
        //let skp_order = ["str","dex","int","def","agi"];
        for (const i in skp_order) {
            const delta = (new_bonus[skp_order[i]] || 0) - (old_bonus[skp_order[i]] || 0);
            skillpoints[i] += delta;
        }
    }
}

/**
 * Apply skillpoints until this item can be worn.
 * Also applies set deltas.
 * Confusingly, does not modify the skillpoints array.
 * Instead, return an array of deltas.
 */
function apply_to_fit(skillpoints, item, skillpoint_min, activeSetCounts) {
    let applied = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        if (item.skillpoints[i] < 0 && skillpoint_min[i]) {
            const unadjusted = skillpoints[i] + item.skillpoints[i];
            const delta = skillpoint_min[i] - unadjusted;
            if (delta > 0) {
                applied[i] += delta;
            }
        }
        if (item.reqs[i] == 0) continue;
        skillpoint_min[i] = Math.max(skillpoint_min[i], item.reqs[i] + item.skillpoints[i]);
        const req = item.reqs[i];
        const cur = skillpoints[i];
        if (req > cur) {
            const diff = req - cur;
            applied[i] += diff;
        }
    }

    const setName = item.set;
    if (setName) { // undefined/null means no set.
        const setCount = activeSetCounts.get(setName);
        if (setCount) {
            const old_bonus = sets.get(setName).bonuses[setCount-1];
            const new_bonus = sets.get(setName).bonuses[setCount];
            //let skp_order = ["str","dex","int","def","agi"];
            for (const i in skp_order) {
                const set_delta = (new_bonus[skp_order[i]] || 0) - (old_bonus[skp_order[i]] || 0);
                if (set_delta < 0 && skillpoint_min[i]) {
                    const unadjusted = skillpoints[i] + set_delta;
                    const delta = skillpoint_min[i] - unadjusted;
                    if (delta > 0) {
                        applied[i] += delta;
                    }
                }
            }
        }
    }
    return applied;
}

function calculate_skillpoints(equipment, weapon) {
    // const start = performance.now();
    // Calculate equipment equipping order and required skillpoints.
    // Return value: [equip_order, best_skillpoints, final_skillpoints, best_total];
    let fixed = [];
    let consider = [];
    let noboost = [];
    let crafted = [];
    weapon.skillpoints = weapon.get('skillpoints');
    weapon.reqs = weapon.get('reqs');
    weapon.set = weapon.get('set');
    for (const item of equipment) {
        item.skillpoints = item.get('skillpoints');
        item.reqs = item.get('reqs');
        item.set = item.get('set');
        if (item.get("crafted")) {
            crafted.push(item);
        }
        // TODO hack: We will treat ALL set items as unsafe :(
        else if (item.set !== null) {
            consider.push(item);
        }
        else if (item.get("reqs").every(x => x === 0) && item.skillpoints.every(x => x >= 0)) {
            // All reqless item without -skillpoints.
            fixed.push(item);
        }
        else if (item.skillpoints.every(x => x <= 0)) {
            noboost.push(item);
        }
        else {
            consider.push(item);
        }
    }


    // Separate out the no req items and add them to the static skillpoint base.
    let static_skillpoints_base = [0, 0, 0, 0, 0]
    let static_activeSetCounts = new Map()
    for (const item of fixed) {
        apply_skillpoints(static_skillpoints_base, item, static_activeSetCounts);
    }

    let best = consider;
    let final_skillpoints = static_skillpoints_base.slice();
    let best_skillpoints = [0, 0, 0, 0, 0];
    let best_total = Infinity;
    let best_activeSetCounts = static_activeSetCounts;

    let allFalse = [0, 0, 0, 0, 0];
    if (consider.length > 0 || noboost.length > 0 || crafted.length > 0) {
        // Try every combination and pick the best one.
        const [root, terminal, sccs] = construct_scc_graph(consider);
        const end_checks = crafted.concat(noboost);
        end_checks.push(weapon);

        function check_end(skillpoints_applied, skillpoints, activeSetCounts, total_applied) {
            // Crafted skillpoint does not count initially.
            for (const item of end_checks) {
                const needed_skillpoints = apply_to_fit(skillpoints, item,
                        [false, false, false, false, false], activeSetCounts);

                for (let i = 0; i < 5; ++i) {
                    const skp = needed_skillpoints[i]
                    skillpoints_applied[i] += skp;
                    skillpoints[i] += skp;
                    total_applied += skp;
                }
                if (best_total < total_applied) { return -1; }
            }
            return total_applied;
        }

        function permute_check(idx, _applied, _skillpoints, _sets, _has, _total_applied, order) {
            const {nodes, children} = sccs[idx];
            if (nodes[0] === terminal) {
                const total = check_end(_applied, _skillpoints, _sets, _total_applied);
                if (total !== -1 && total < best_total) {
                    final_skillpoints = _skillpoints;
                    best_skillpoints = _applied;
                    best_total = total;
                    best_activeSetCounts = _sets;
                    best = order;
                }
                return;
            }
            for (let permutation of perm(nodes)) {
                const skillpoints_applied = _applied.slice();
                const skillpoints = _skillpoints.slice();
                const activeSetCounts = new Map(_sets);
                const has_skillpoint = _has.slice();
                let total_applied = _total_applied;
                let short_circuit = false;
                for (const {item} of permutation) {
                    needed_skillpoints = apply_to_fit(skillpoints, item, has_skillpoint, activeSetCounts);
                    for (let i = 0; i < 5; ++i) {
                        skp = needed_skillpoints[i];
                        skillpoints_applied[i] += skp;
                        skillpoints[i] += skp;
                        total_applied += skp;
                    }
                    if (total_applied >= best_total) {
                        short_circuit = true;
                        break;  // short circuit failure
                    }
                    apply_skillpoints(skillpoints, item, activeSetCounts);
                }
                if (short_circuit) { continue; }
                permute_check(idx+1, skillpoints_applied, skillpoints, activeSetCounts, has_skillpoint, total_applied, order.concat(permutation.map(x => x.item)));
            }
        }
        if (sccs.length === 1) {
            // Only crafteds. Just do end check (check req first, then apply sp after)
            const total = check_end(best_skillpoints, final_skillpoints, best_activeSetCounts, allFalse.slice());
            final_skillpoints = best_skillpoints.slice();
            best_total = total;
            best_activeSetCounts = best_activeSetCounts;
            best = [];
        } else {
            // skip root.
            permute_check(1, best_skillpoints, final_skillpoints, best_activeSetCounts, allFalse.slice(), 0, []);
        }

        // add extra sp bonus
        apply_skillpoints(final_skillpoints, weapon, best_activeSetCounts);
        // Applying crafted item skill points last.
        for (const item of crafted) {
            apply_skillpoints(final_skillpoints, item, best_activeSetCounts);
        }
    }
    else {
        best_total = 0;
        needed_skillpoints = apply_to_fit(final_skillpoints, weapon, allFalse.slice(), best_activeSetCounts);
        for (let i = 0; i < 5; ++i) {
            const skp = needed_skillpoints[i];
            best_skillpoints[i] += skp;
            final_skillpoints[i] += skp;
            best_total += skp;
        }
        apply_skillpoints(final_skillpoints, weapon, best_activeSetCounts);
    }
    let equip_order = fixed.concat(best).concat(noboost).concat(crafted);
    // best_skillpoints:  manually assigned (before any gear)
    // final_skillpoints: final totals (5 individ)
    // best_total:        total skillpoints assigned (number)
    // const end = performance.now();
    // const output_msg = `skillpoint calculation took ${(end-start)/ 1000} seconds.`;
    // console.log(output_msg);
    return [equip_order, best_skillpoints, final_skillpoints, best_total, best_activeSetCounts];
}

function construct_scc_graph(items_to_consider) {
    let nodes = [];
    let terminal_node = {
        item: null,
        children: [],
        parents: nodes
    };
    let root_node = {
        item: null,
        children: nodes,
        parents: [],
    };
    for (const item of items_to_consider) {
        const set_neg = [false, false, false, false, false];
        const set_pos = [false, false, false, false, false];
        const set_name = item.set;
        if (set_name) {
            const bonuses = sets.get(set_name).bonuses;
            for (const bonus of bonuses) {
                for (const i in skp_order) {
                    if (bonus[skp_order[i]] > 0) { set_pos[i] = true; }
                    if (bonus[skp_order[i]] < 0) { set_neg[i] = true; }
                }
            }
        }
        nodes.push({item: item, children: [terminal_node], parents: [root_node], set_pos: set_pos, set_neg: set_neg});
    }
    // Dependency graph construction.
    for (const node_a of nodes) {
        const {item: a, children: a_children, set_pos: a_set_pos} = node_a;
        for (const node_b of nodes) {
            const {item: b, parents: b_parents, set_neg: b_set_neg} = node_b;

            const setName = b.set;

            for (let i = 0; i < 5; ++i) {
                if ((a.skillpoints[i] > 0 || a_set_pos[i] > 0)
                        && (a.reqs[i] < b.reqs[i] || b.skillpoints[i] < 0 || b_set_neg[i] < 0)) {
                    a_children.push(node_b);
                    b_parents.push(node_a);
                    break;
                }
            }
        }
    }
    const sccs = make_SCC_graph(root_node, nodes);
    return [root_node, terminal_node, sccs];
}

