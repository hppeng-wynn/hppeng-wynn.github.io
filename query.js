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

class TypeQuery {
    constructor(type) { this.type = type; }

    filter(item) {
        if (item.remapID === undefined) {
            return (item.type === this.type);
        }
        return false;
    }

    compare(a, b) { return a < b; }
}
queryTypeMap.set("type", function(s) { return new TypeQuery(s); } );

class CategoryQuery {
    constructor(category) { this.category = category; }

    filter(item) {
        if (item.remapID === undefined) {
            return (item.category === this.category);
        }
        return false;
    }

    compare(a, b) { return a < b; }
}
queryTypeMap.set("category", function(s) { return new CategoryQuery(s); } );

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
