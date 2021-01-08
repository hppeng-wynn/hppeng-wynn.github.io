function calculate_skillpoints(equipment, weapon) {
    // Calculate equipment equipping order and required skillpoints.
    // Return value: [equip_order, best_skillpoints, final_skillpoints, best_total];

    let fixed = [];
    let consider = [];
    let noboost = [];
    console.log(equipment);
    for (const item of equipment) {
        if (item.reqs.every(x => x === 0)) {
            fixed.push(item);
        }
        else if (item.skillpoints.every(x => x === 0)) {
            noboost.push(item);
        }
        else {
            consider.push(item);
        }
    }
    function apply_skillpoints(skillpoints, item) {
        for (let i = 0; i < 5; i++) {
            skillpoints[i] += item.skillpoints[i];
        }
    }

    function remove_skillpoints(skillpoints, item) {
        for (let i = 0; i < 5; i++) {
            skillpoints[i] -= item.skillpoints[i];
        }
    }

    // Figure out (naively) how many skillpoints need to be applied to get the current item to fit.
    // Doesn't handle -skp.
    function apply_to_fit(skillpoints, item, skillpoint_filter) {
        let applied = [0, 0, 0, 0, 0];
        let total = 0;
        for (let i = 0; i < 5; i++) {
            if (item.skillpoints[i] < 0 && skillpoint_filter[i]) {
                applied[i] -= item.skillpoints[i];
                total -= item.skillpoints[i];
            }
            if (item.reqs[i] == 0) continue;
            if (skillpoint_filter) skillpoint_filter[i] = true;
            const req = item.reqs[i];
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

    let best = null;
    let final_skillpoints = null;
    let best_skillpoints = [0, 0, 0, 0, 0];
    let best_total = Infinity;

    if (consider.length > 0 || noboost.length > 0) {
        // Try every combination and pick the best one.
        for (let permutation of perm(consider)) {
            let has_skillpoint = [false, false, false, false, false];

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
            result = apply_to_fit(skillpoints, weapon);
            needed_skillpoints = result[0];
            total_diff = result[1];
            for (let i = 0; i < 5; ++i) {
                skillpoints_applied[i] += needed_skillpoints[i];
                skillpoints[i] += needed_skillpoints[i];
            }

            apply_skillpoints(skillpoints, weapon);
            total_applied += total_diff;

            if (total_applied < best_total) {
                best = permutation;
                final_skillpoints = skillpoints;
                best_skillpoints = skillpoints_applied;
                best_total = total_applied;
            }
        }

        let equip_order = fixed.concat(best);
        return [equip_order, best_skillpoints, final_skillpoints, best_total];
    }
    else {
        //Temporary fix: please verify
        let has_skillpoint =  [false,false,false,false,false]
        let skillpoints_applied = [0, 0, 0, 0, 0];
        let skillpoints = static_skillpoints_base.slice();
        let total_applied = 0;
        let result;
        let needed_skillpoints;
        let total_diff;
        result = apply_to_fit(skillpoints, weapon, has_skillpoint);
        needed_skillpoints = result[0];
        total_diff = result[1];

        for (let i = 0; i < 5; ++i) {
            skillpoints_applied[i] += needed_skillpoints[i];
            skillpoints[i] += needed_skillpoints[i];
        }

        apply_skillpoints(skillpoints, weapon);
        total_applied += total_diff;

        if (total_applied < best_total) {
            best = [weapon];
            final_skillpoints = skillpoints;
            best_skillpoints = skillpoints_applied;
            best_total = total_applied;
        }
        return [ best ? best : fixed.concat(noboost) , best_skillpoints, final_skillpoints ? final_skillpoints : static_skillpoints_base, best_total ? best_total : 0];
    }
}
