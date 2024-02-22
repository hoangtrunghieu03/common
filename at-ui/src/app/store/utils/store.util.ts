import {Action, ActionReducer, Store} from '@ngrx/store';
import {TypedAction} from '@ngrx/store/src/models';

export class StoreUtil {
    private constructor(public store: any) {
    }
    static isNotBlank(value: any): boolean {
        return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
    }
    static of(store: Store<any>): StoreUtil {
        return new StoreUtil(store);
    }

    get(path: string): any {
        if (this.store != null && this.store.source != null && this.store.source.value != null) {
            let result = this.store.source.value;
            const p = path.split('.');
            if (StoreUtil.isNotBlank(p)) {
                for (const v of p) {
                    if (result[v] == null) {
                        return result[v];
                    }
                    result = result[v];
                }
                return result;
            }
        }
        return undefined;
    }
}

export interface On<S> {
    reducer: (state: any, action: Action & any) => any;
    types: string[];
}

export function on<S, T extends string>(
    creator: TypedAction<T>,
    rest: (state: S, action: Action & any) => S
): On<S> {
    return {
        types: [creator.type],
        reducer: rest
    };
}

export function createReducer<S>(initialState: S, ...ons: On<S>[]): ActionReducer<S, Action> {
    const map = new Map();
    for (const i of ons) {
        for (const type of i.types) {
            map.set(type, i.reducer);
        }
    }
    return (state = initialState, action) => {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}

