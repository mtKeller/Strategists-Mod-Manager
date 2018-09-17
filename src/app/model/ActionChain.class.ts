import { Action, Store } from '@ngrx/store';

export const END_OF_ACTION_CHAIN = 'END_OF_ACTION_CHAIN';

export class EndOfActionChain implements Action {
    readonly type = END_OF_ACTION_CHAIN;
    constructor(public chain: ActionChain = null) { }
}

export const ACTION_CHAIN_FAILED = 'END_OF_ACTION_CHAIN_FAILED';

export class ActionChainFailed implements Action {
    readonly type = ACTION_CHAIN_FAILED;
    constructor(public chain: ActionChain = null) { }
}

export interface ActionNode {
    initAction: Action;
    successAction: ActionNode;
    failedAction: ActionNode;
}

export interface ActionChainParams {
    payload: any;
    actionNode: ActionNode;
    store: Store<any>;
}



export class ActionChain {
    payload: any;
    currentNode: ActionNode;
    actionList: Array<string>;
    store: Store<any>;
    lastAction: Action;
    constructor(params: ActionChainParams) {
        this.lastAction = params.actionNode.initAction;
        this.payload = params.payload;
        this.currentNode = params.actionNode;
        this.actionList = [params.actionNode.initAction.type];
        this.store = params.store;
    }
    init() {
        this.currentNode.initAction.chain = this;
        this.store.dispatch(this.currentNode.initAction);
    }
    success(payload?: any) {
        if (payload) {
            this.payload = payload;
        }
        let nextNode: Action;
        this.currentNode = this.currentNode.successAction;
        if (this.currentNode !== null) {
            nextNode = this.currentNode.initAction;
        } else {
            this.actionList.push('Failed: ' + this.lastAction.type);
            return new EndOfActionChain(this);
        }
        this.actionList.push('Success: ' + this.lastAction.type);
        this.lastAction = nextNode;
        nextNode.chain = this;
        return nextNode;
    }
    failed(payload?: any) {
        if (payload) {
            this.payload = payload;
        }
        let nextNode: Action;
        this.currentNode = this.currentNode.failedAction;
        if (this.currentNode !== null) {
            nextNode = this.currentNode.initAction;
        } else {
            this.actionList.push('Failed: ' + this.lastAction.type);
            return new EndOfActionChain(this);
        }
        this.actionList.push('Failed: ' + this.lastAction.type);
        this.lastAction = nextNode;
        nextNode.chain = this;
        return nextNode;
    }
    // toString() {
    //     let actionQueStr = '';
    //     for (let i = 0; i < this.actionQue.length; i++) {
    //         if (this.actionQue[i].success) {
    //             actionQueStr += `success: [${this.actionQue[i].success.type}],
    //              failed: [${this.actionQue[i].failed.type}`;
    //         } else {
    //             actionQueStr += `success: [${null}],
    //              failed: [${null}]`;
    //         }
    //     }
    //     return `ActionChain.toString()
    //     data : ${this.payload}
    //     initAction: ${this.initAction.type}
    //     actionQue: ${actionQueStr}
    //     actionIndex: ${this.actionIndex}
    //     `;
    // }
}
