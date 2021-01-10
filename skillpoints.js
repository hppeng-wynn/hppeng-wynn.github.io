function calculate_skillpoints(equipment, weapon) {
    // Calculate equipment equipping order and required skillpoints.
    // Return value: [equip_order, best_skillpoints, final_skillpoints, best_total];

    let fixed = [];
    let consider = [];
    let noboost = [];
    console.log(equipment);
    for (const item of equipment) {
        if (item.get("reqs").every(x => x === 0)) {
            fixed.push(item);
        }
        else if (item.get("skillpoints").every(x => x === 0)) {
            noboost.push(item);
        }
        else {
            consider.push(item);
        }
    }
    function apply_skillpoints(skillpoints, item) {
        for (let i = 0; i < 5; i++) {
            skillpoints[i] += item.get("skillpoints")[i];
        }
    }

    function remove_skillpoints(skillpoints, item) {
        for (let i = 0; i < 5; i++) {
            skillpoints[i] -= item.get("skillpoints")[i];
        }
    }

    // Figure out (naively) how many skillpoints need to be applied to get the current item to fit.
    // Doesn't handle -skp.
    function apply_to_fit(skillpoints, item, skillpoint_filter) {
        let applied = [0, 0, 0, 0, 0];
        let total = 0;
        for (let i = 0; i < 5; i++) {
            if (item.get("skillpoints")[i] < 0 && skillpoint_filter[i] === true) {
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
        return [applied, total];
    }

    // Separate out the no req items and add them to the static skillpoint base.
    let static_skillpoints_base = [0, 0, 0, 0, 0]
    for (const item of fixed) {
        apply_skillpoints(static_skillpoints_base, item);
    }

    let best = consider.concat(noboost);
    let final_skillpoints = static_skillpoints_base.slice();
    let best_skillpoints = [0, 0, 0, 0, 0];
    let best_total = Infinity;

    let allFalse = [false, false, false, false, false];
    if (consider.length > 0 || noboost.length > 0) {
        // Try every combination and pick the best one.
        for (let permutation of perm(consider)) {
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
                result = apply_to_fit(skillpoints, item, has_skillpoint);
                needed_skillpoints = result[0];
                total_diff = result[1];

                for (let i = 0; i < 5; ++i) {
                    skillpoints_applied[i] += needed_skillpoints[i];
                    skillpoints[i] += needed_skillpoints[i];
                }
                apply_skillpoints(skillpoints, item);
                total_applied += total_diff;
                if (total_applied >= best_total) {
                    break;
                }
            }
//            if (total_applied < best_total) {
//                console.log(total_applied);
//                console.log(skillpoints_applied);
//                console.log("Iteration 2");
//                for (const item of permutation) {
//                    console.log(item);
//
//                    remove_skillpoints(skillpoints, item);
//                    console.log(skillpoints);
//                    result = apply_to_fit(skillpoints, item, has_skillpoint);
//                    needed_skillpoints = result[0];
//                    total_diff = result[1];
//                    for (let i = 0; i < 5; ++i) {
//                        skillpoints_applied[i] += needed_skillpoints[i];
//                        skillpoints[i] += needed_skillpoints[i];
//                    }
//
//                    apply_skillpoints(skillpoints, item);
//                    console.log(skillpoints);
//                    console.log(total_diff);
//                    total_applied += total_diff;
//                    if (total_applied >= best_total) {
//                        break;
//                    }
//                }
//            }
            let pre = skillpoints.slice();
            result = apply_to_fit(skillpoints, weapon, allFalse.slice());
            needed_skillpoints = result[0];
            total_diff = result[1];
            for (let i = 0; i < 5; ++i) {
                skillpoints_applied[i] += needed_skillpoints[i];
                skillpoints[i] += needed_skillpoints[i];
            }

            apply_skillpoints(skillpoints, weapon);
            total_applied += total_diff;

            if (total_applied < best_total) {
                console.log(pre);
                console.log(skillpoints);
                best = permutation;
                final_skillpoints = skillpoints;
                best_skillpoints = skillpoints_applied;
                best_total = total_applied;
            }
        }

    }
    else {
        best_total = 0;
        result = apply_to_fit(final_skillpoints, weapon, allFalse.slice());
        needed_skillpoints = result[0];
        total_diff = result[1];
        for (let i = 0; i < 5; ++i) {
            best_skillpoints[i] += needed_skillpoints[i];
            final_skillpoints[i] += needed_skillpoints[i];
        }
        apply_skillpoints(final_skillpoints, weapon);
        best_total += total_diff;
    }
    let equip_order = fixed.concat(best);
    return [equip_order, best_skillpoints, final_skillpoints, best_total];
}
