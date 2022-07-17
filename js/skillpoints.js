function calculate_skillpoints(equipment, weapon) {
    const start = Date.now();
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
        else if (item.get("reqs").every(x => x === 0) && item.skillpoints.every(x => x >= 0)) {
            // All reqless item without -skillpoints.
            fixed.push(item);
        }
        // TODO hack: We will treat ALL set items as unsafe :(
        else if (item.skillpoints.every(x => x === 0) && item.set === null) {
            noboost.push(item);
        }
        else {
            consider.push(item);
        }
    }
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

    function apply_to_fit(skillpoints, item, skillpoint_min, activeSetCounts) {
        let applied = [0, 0, 0, 0, 0];
        let total = 0;
        for (let i = 0; i < 5; i++) {
            if (item.skillpoints[i] < 0 && skillpoint_min[i]) {
                const unadjusted = skillpoints[i] + item.skillpoints[i];
                const delta = skillpoint_min[i] - unadjusted;
                if (delta > 0) {
                    applied[i] += delta;
                    total += delta;
                }
            }
            if (item.reqs[i] == 0) continue;
            skillpoint_min[i] = Math.max(skillpoint_min[i], item.reqs[i] + item.skillpoints[i]);
            const req = item.reqs[i];
            const cur = skillpoints[i];
            if (req > cur) {
                const diff = req - cur;
                applied[i] += diff;
                total += diff;
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
                            total += delta;
                        }
                    }
                }
            }
        }

        return [applied, total];
    }

    // Separate out the no req items and add them to the static skillpoint base.
    let static_skillpoints_base = [0, 0, 0, 0, 0]
    let static_activeSetCounts = new Map()
    for (const item of fixed) {
        apply_skillpoints(static_skillpoints_base, item, static_activeSetCounts);
    }

    let best = consider.concat(noboost);
    let final_skillpoints = static_skillpoints_base.slice();
    let best_skillpoints = [0, 0, 0, 0, 0];
    let best_total = Infinity;
    let best_activeSetCounts = static_activeSetCounts;

    let allFalse = [0, 0, 0, 0, 0];
    if (consider.length > 0 || noboost.length > 0 || crafted.length > 0) {
        // Try every combination and pick the best one.
        construct_scc_graph(consider);
        for (let permutation of perm(consider)) {
            let activeSetCounts = new Map(static_activeSetCounts);
            let has_skillpoint = allFalse.slice();
            permutation = permutation.concat(noboost);

            let skillpoints_applied = [0, 0, 0, 0, 0];
            // Complete slice is a shallow copy.
            let skillpoints = static_skillpoints_base.slice();

            let total_applied = 0;

            let result;
            let needed_skillpoints;
            let total_diff;
            for (const item of permutation) {
                result = apply_to_fit(skillpoints, item, has_skillpoint, activeSetCounts);
                needed_skillpoints = result[0];
                total_diff = result[1];

                for (let i = 0; i < 5; ++i) {
                    skillpoints_applied[i] += needed_skillpoints[i];
                    skillpoints[i] += needed_skillpoints[i];
                }
                apply_skillpoints(skillpoints, item, activeSetCounts);
                total_applied += total_diff;
                if (total_applied >= best_total) {
                    break;
                }
            }
            
            // Crafted skillpoint does not count initially.
            for (const item of crafted) {
                //console.log(item)
                result = apply_to_fit(skillpoints, item, allFalse.slice(), activeSetCounts);
                //console.log(result)
                needed_skillpoints = result[0];
                total_diff = result[1];

                for (let i = 0; i < 5; ++i) {
                    skillpoints_applied[i] += needed_skillpoints[i];
                    skillpoints[i] += needed_skillpoints[i];
                }
                total_applied += total_diff;
            }

            if (total_applied >= best_total) {
                continue;
            }

            let pre = skillpoints.slice();
            result = apply_to_fit(skillpoints, weapon, allFalse.slice(), activeSetCounts);
            needed_skillpoints = result[0];
            total_diff = result[1];
            for (let i = 0; i < 5; ++i) {
                skillpoints_applied[i] += needed_skillpoints[i];
                skillpoints[i] += needed_skillpoints[i];
            }

            apply_skillpoints(skillpoints, weapon, activeSetCounts);
            total_applied += total_diff;

            // Applying crafted item skill points last.
            for (const item of crafted) {
                apply_skillpoints(skillpoints, item, activeSetCounts);
                //total_applied += total_diff;
            }

            if (total_applied < best_total) {
                best = permutation;
                final_skillpoints = skillpoints;
                best_skillpoints = skillpoints_applied;
                best_total = total_applied;
                best_activeSetCounts = activeSetCounts;
            }
        }

    }
    else {
        best_total = 0;
        result = apply_to_fit(final_skillpoints, weapon, allFalse.slice(), best_activeSetCounts);
        needed_skillpoints = result[0];
        total_diff = result[1];
        for (let i = 0; i < 5; ++i) {
            best_skillpoints[i] += needed_skillpoints[i];
            final_skillpoints[i] += needed_skillpoints[i];
        }
        apply_skillpoints(final_skillpoints, weapon, best_activeSetCounts);
        best_total += total_diff;
    }
    let equip_order = fixed.concat(best).concat(crafted);
    // best_skillpoints:  manually assigned (before any gear)
    // final_skillpoints: final totals (5 individ)
    // best_total:        total skillpoints assigned (number)
    const end = Date.now();
    const output_msg = `skillpoint calculation took ${(end-start)/ 1000} seconds.`;
    console.log(output_msg);
    document.getElementById('stack-box').textContent = output_msg;
    return [equip_order, best_skillpoints, final_skillpoints, best_total, best_activeSetCounts];
}

function construct_scc_graph(items_to_consider) {
    let nodes = [];
    for (const item of items_to_consider) {
        nodes.push({item: item, children: [], parents: [], visited: false});
    }
    let root_node = {
        children: nodes,
        parents: [],
        visited: false
    };
    // Dependency graph construction.
    for (const node_a of nodes) {
        const {item: a, children: a_children} = node_a;
        for (const node_b of nodes) {
            const {item: b, parents: b_parents} = node_b;
            for (let i = 0; i < 5; ++i) {
                if (b.reqs[i] < a.reqs[i] && b.skillpoints[i]) {
                    a_children.push(node_b);
                    b_parents.push(node_a);
                    break;
                }
            }
        }
    }
    const res = []
    /*
     * SCC graph construction.
     * https://en.wikipedia.org/wiki/Kosaraju%27s_algorithm
     */
    function visit(u, res) {
        if (u.visited) { return; }
        u.visited = true;
        for (const child of u.children) {
            if (!child.visited) { visit(child, res); }
        }
        res.push(u);
    }
    visit(root_node, res);
    res.reverse();
    console.log(res);
}
