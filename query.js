
/**
 * @description A query into the item
 * @module ItemNotFound
 */
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
