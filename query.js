let queryTypeMap = new Map();

class NameQuery {
    constructor(string) { this.queryString = string.toLowerCase(); }

    filter(item) {
        return (item.get("displayName").toLowerCase().includes(this.queryString));
    }

    compare(a, b) { return a < b; }
}
queryTypeMap.set("name", function(s) { return new NameQuery(s); } );

class LevelRangeQuery {
    constructor(min, max) { this.min = min; this.max = max; }

    filter(item) {
        if (item.get("remapID") === undefined) {
            return (item.get("lvl") <= this.max && item.get("lvl") >= this.min);
        }
        return false;
    }

    compare(a, b) { return a > b; }
}

class NegateQuery {
    constructor(id) {
        this.id = id;
        this.compare = function(a, b) { return 0; };
    }

    filter(item) {
        return (!item.get(this.id)) || (item.get(this.id) == 0);
    }
}
queryTypeMap.set("null", function(s) { return new IdQuery(s); } );

class IdQuery {
    constructor(id) {
        this.id = id;
        if (nonRolledIDs.includes(id)) {
            this.compare = function(a, b) {
                return b.get(id) - a.get(id);
            };
            this.filter = function(a) {
                return a.get(this.id);
            }
            console.log("QUERY: ID, NONROLL");
        }
        else if (reversedIDs.includes(id)) {
            this.compare = function(a, b) {
                return a.get("maxRolls").get(id) - b.get("maxRolls").get(id);
            };
            this.filter = function(a) {
                return a.get("maxRolls").get(this.id);
            }
            console.log("QUERY: ID, REVERSE");
        }
        else {
            this.compare = function(a, b) {
                return b.get("maxRolls").get(id) - a.get("maxRolls").get(id);
            };
            this.filter = function(a) {
                return a.get("maxRolls").get(this.id);
            }
            console.log("QUERY: ID, ,,,");
        }
    }
}
queryTypeMap.set("stat", function(s) { return new IdQuery(s); } );

class IdMatchQuery {
    constructor(id, value) {
        this.id = id;
        this.value = value;
        this.compare = function(a, b) {
            return 0;
        };
    }

    filter(item) {
        return item.get(this.id) && (item.get(this.id) == this.value);
    }
}

class SumQuery {
    constructor(ids) {
        let getters = [];
        for (const id of ids) {
            if (nonRolledIDs.includes(id)) {
                getters.push(a => a.get(id));
            }
            else {
                getters.push(a => a.get("maxRolls").get(id));
            }

        }
        this.compare = function(a, b) {
            let balance = 0;
            for (const getter of getters) {
                if (getter(a)) { balance -= getter(a); }
                if (getter(b)) { balance += getter(b); }
            }
            return balance;
        };
    }

    filter(item) {
        return true;
    }
}
