
class NameQuery {
    constructor(string) {
        this.queryString = string;
    }

    filter(item) {
        if (item.remapID === undefined) {
            return (item.displayName.includes(this.queryString));
        }
        return false;
    }

    compare(a, b) {
        return a < b;
    }
}

class TypeQuery {
    constructor(type) {
        this.type = type;
    }

    filter(item) {
        if (item.remapID === undefined) {
            return (item.type === this.type);
        }
        return false;
    }

    compare(a, b) {
        return a < b;
    }
}

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
