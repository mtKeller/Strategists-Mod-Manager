export class DynamicEntity {
    currentIndex = 0;
    entity = {};
    constructor(item?: any, list?: Array<any>) {
        if (item) {
            this.entity = {
                0 : item
            };
        } else if (list) {
            const tempDict = {};
            list.map(li => {
                tempDict[this.currentIndex] = li;
                this.currentIndex++;
            });
            this.entity = tempDict;
        }
    }
    push(item) {
        this.entity = {
            ...this.entity,
            [this.currentIndex]: item
        };
        this.currentIndex = this.currentIndex + 1;
    }
    removeIndex(indx) {
        const keys = this.keys();
        const newEntity = {};
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== indx) {
                newEntity[keys[i]] = this.entity[keys[i]];
            }
        }
        this.entity = newEntity;
    }
    keys() {
        return Object.keys(this.entity);
    }
    toArray() {
        const keyChain = this.keys();
        const newArray = [];
        for (let i = 0; i < keyChain.length; i++) {
            newArray.push({
                index: keyChain[i],
                data: this.entity[keyChain[i]]
            });
        }
        return newArray;
    }
}
