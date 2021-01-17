function calculate_skillpoints(equipment, weapon) {
    // Calculate equipment equipping order and required skillpoints.
    // Return value: [equip_order, best_skillpoints, final_skillpoints, best_total];

    let fixed = [];
    let consider = [];
    let noboost = [];
    //console.log(equipment);
    for (const item of equipment) {
        if (item.get("reqs").every(x => x === 0)) {
            fixed.push(item);
        }
        // TODO hack: We will treat ALL set items as unsafe :(
        else if (item.get("skillpoints").every(x => x === 0) && item.get("set") === null) {
            noboost.push(item);
        }
        else {
            consider.push(item);
        }
    }
    function apply_skillpoints(skillpoints, item, activeSetCounts) {
        for (let i = 0; i < 5; i++) {
            skillpoints[i] += item.get("skillpoints")[i];
        }

        const setName = item.get("set");
        if (setName) { // undefined/null means no set.
            let setCount = activeSetCounts.get(setName);
            let old_bonus = {};
            if (setCount) {
                old_bonus = sets[setName].bonuses[setCount-1];
                activeSetCounts.set(setName, setCount + 1);
            }
            else {
                setCount = 0;
                activeSetCounts.set(setName, 1);
            }
            const new_bonus = sets[setName].bonuses[setCount];
            //let skp_order = ["str","dex","int","def","agi"];
            for (const i in skp_order) {
                const delta = (new_bonus[skp_order[i]] || 0) - (old_bonus[skp_order[i]] || 0);
                skillpoints[i] += delta;
            }
        }
    }

    function apply_to_fit(skillpoints, item, skillpoint_filter, activeSetCounts) {
        let applied = [0, 0, 0, 0, 0];
        let total = 0;
        for (let i = 0; i < 5; i++) {
            if (item.get("skillpoints")[i] < 0 && skillpoint_filter[i]) {
                applied[i] -= item.get("skillpoints")[i];
                total -= item.get("skillpoints")[i];
            }
            if (item.get("reqs")[i] == 0) continue;
            if (skillpoint_filter) skillpoint_filter[i] = true;
            const req = item.get("reqs")[i];
            const cur = skillpoints[i];
            if (req > cur) {
                const diff = req - cur;
                applied[i] += diff;
                total += diff;
            }
        }

        const setName = item.get("set");
        if (setName) { // undefined/null means no set.
            const setCount = activeSetCounts.get(setName);
            if (setCount) {
                const old_bonus = sets[setName].bonuses[setCount-1];
                const new_bonus = sets[setName].bonuses[setCount];
                //let skp_order = ["str","dex","int","def","agi"];
                for (const i in skp_order) {
                    const delta = (new_bonus[skp_order[i]] || 0) - (old_bonus[skp_order[i]] || 0);
                    if (delta < 0 && skillpoint_filter[i]) {
                        applied[i] -= delta;
                        total -= delta;
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

    let allFalse = [false, false, false, false, false];
    if (consider.length > 0 || noboost.length > 0) {
        // Try every combination and pick the best one.
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
    let equip_order = fixed.concat(best);
    return [equip_order, best_skillpoints, final_skillpoints, best_total, best_activeSetCounts];
}
