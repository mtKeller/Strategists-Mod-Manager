export class DynamicEntity {
    currentIndex = 0;
    entity = {};
    length = 0;
    constructor(item?: any, list?: Array<any>) {
        if (item) {
            this.entity = {
                0 : item
            };
            this.length = 1;
        } else if (list) {
            const tempDict = {};
            list.map(li => {
                tempDict[this.currentIndex] = li;
                this.currentIndex++;
                this.length = this.length + 1;
            });
            this.entity = tempDict;
        }
    }
    swapIndexed(indx, data) {
        this.entity[indx] = data;
    }
    push(item) {
        this.entity = {
            ...this.entity,
            [this.currentIndex]: item
        };
        this.currentIndex = this.currentIndex + 1;
        this.length = this.length + 1;
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
        this.length = this.length - 1;
    }
    keys() {
        return Object.keys(this.entity);
    }
    toArray(): Array<[number, any]> {
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
