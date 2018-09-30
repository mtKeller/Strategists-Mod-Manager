import { Action, Store } from '@ngrx/store';

export const END_OF_ACTION_TREE_PATH = 'END_OF_ACTION_TREE_PATH';

export class EndOfActionChain implements Action {
    readonly type = END_OF_ACTION_TREE_PATH;
    constructor(public chain: ActionTree = null) { }
}

export const ACTION_CHAIN_FAILED = 'END_OF_ACTION_CHAIN_FAILED';

export class ActionTreeFailed implements Action {
    readonly type = ACTION_CHAIN_FAILED;
    constructor(public chain: ActionTree = null) { }
}

export interface ActionNode {
    initAction: Action;
    successNode: ActionNode;
    failureNode?: ActionNode;
    payload?: any;
}

export interface ActionTreeParams {
    payload: any;
    actionNode: ActionNode;
    store: Store<any>;
}

export class ActionTree {
    payload: any;
    currentNode: ActionNode;
    actionList: Array<string>;
    store: Store<any>;
    lastAction: Action;
    constructor(params: ActionTreeParams) {
        this.lastAction = params.actionNode.initAction;
        this.payload = params.payload;
        this.currentNode = params.actionNode;
        if (params.actionNode !== null) {
            this.actionList = ['[INIT]: ' + params.actionNode.initAction.type];
        }
        this.store = params.store;
    }
    init() {
        this.currentNode.initAction.tree = this;
        if (this.currentNode.initAction !== null) {
            if (this.currentNode.payload) {
                this.currentNode.initAction.payload = this.currentNode.payload;
            }
            this.store.dispatch(this.currentNode.initAction);
        } else {
            this.store.dispatch(new EndOfActionChain(this));
        }
    }
    success(payload?: any) {
        if (payload) {
            this.payload = payload;
        }
        let nextNode: Action;
        if (this.currentNode.successNode !== null) {
            nextNode = this.currentNode.successNode.initAction;
            this.currentNode = this.currentNode.successNode;
            // if (this.currentNode.payload !== null && this.currentNode.payload !== undefined) {
            //     this.payload = this.currentNode.payload;
            // }
        } else {
            this.actionList.push('Success: ' + END_OF_ACTION_TREE_PATH);
            return new EndOfActionChain(this);
        }
        this.actionList.push('Success: ' + nextNode.type);
        this.lastAction = nextNode;
        nextNode.tree = this;
        if (this.currentNode.payload !== null && this.currentNode.payload !== undefined) {
            nextNode.payload = this.currentNode.payload;
        }
        return nextNode;
    }
    failed(payload?: any) {
        if (payload) {
            this.payload = payload;
        }
        let nextNode: Action;
        if (this.currentNode.failureNode !== null || this.currentNode.failureNode !== undefined) {
            nextNode = this.currentNode.failureNode.initAction;
            this.currentNode = this.currentNode.failureNode;
            if (this.currentNode.payload !== null && this.currentNode.payload !== undefined) {
                this.payload = this.currentNode.payload;
            }
        } else {
            this.actionList.push('Failed: ' + END_OF_ACTION_TREE_PATH);
            return new EndOfActionChain(this);
        }
        this.actionList.push('Failed: ' + this.lastAction.type);
        this.lastAction = nextNode;
        nextNode.tree = this;
        if (this.currentNode.payload !== null && this.currentNode.payload !== undefined) {
            nextNode.payload = this.currentNode.payload;
        }
        return nextNode;
    }
}
