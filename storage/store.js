export class Store {
    static activeStorage = localStorage;
    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {*} stringify 
     */
    static set(key, value, stringify = false) {
        this.activeStorage.setItem(key, stringify ? JSON.stringify(value) : value)
    }
    static get(key, parsed = false) {
        return parsed ? JSON.parse(this.activeStorage.getItem(key)) : this.activeStorage.getItem(key);
    }
    /**
     * 
     * @param {*} type 
     */
    static defineActiveStorage(type) {
        switch (type) {
            case 'loc':
                this.activeStorage = localStorage;
                break;
            case 'sess':
                this.activeStorage = sessionStorage
                break;
            case 'cac':
                this.activeStorage = CacheStorage
                break;
            default:
                break;
        }
    }
}