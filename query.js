let queryTypeMap = new Map();

class NameQuery {
    constructor(string) { this.queryString = string.toLowerCase(); }

    filter(item) {
        if (item.remapID === undefined) {
            return (item.displayName.toLowerCase().includes(this.queryString));
        }
        return false;
    }

    compare(a, b) { return a < b; }
}
queryTypeMap.set("name", function(s) { return new NameQuery(s); } );

class LevelRangeQuery {
    constructor(min, max) { this.min = min; this.max = max; }

    filter(item) {
        if (item.remapID === undefined) {
            return (item.lvl <= this.max && item.lvl >= this.min);
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
        return (!(this.id in item)) || (item[this.id] == 0);
    }
}
queryTypeMap.set("null", function(s) { return new IdQuery(s); } );

class IdQuery {
    constructor(id) {
        this.id = id;
        this.compare = function(a, b) {
            return b[id] - a[id];
        };
    }

    filter(item) {
        return (this.id in item) && (item[this.id]);
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
        return (this.id in item) && (item[this.id] == this.value);
    }
}

class SumQuery {
    constructor(ids) {
        this.compare = function(a, b) {
            let balance = 0;
            for (const id of ids) {
                if (a[id]) { balance -= a[id]; }
                if (b[id]) { balance += b[id]; }
            }
            return balance;
        };
    }

    filter(item) {
        return true;
    }
}
