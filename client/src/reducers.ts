import type { PayloadAction } from '@reduxjs/toolkit'

interface filtersState {
    searchesLove: boolean;
}
const filters: filtersState = {
    searchesLove: false
}

const initialState = {
    filters: filters
}

interface standardAction {
    type: string;
}

type ActionType = standardAction | undefined;

export default function rootReducer(state = initialState, action: ActionType) {
    switch (action?.type) {
        case 'filters/toggleSearchesLove': {
            return {
                ...state,
                filters: {
                    searchesLove: !state.filters.searchesLove,
                },
            }
        }
        default:
            return state
    }
}