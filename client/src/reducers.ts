import type { PayloadAction } from '@reduxjs/toolkit'

interface filtersState {
    searchesLove: boolean;
}
const filters: filtersState = {
    searchesLove: false
}

const initialState = {
    filters,
    theme: localStorage.getItem('theme') || "light"
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
        case 'theme/invert': {
            const newTheme = state.theme === "light" ? "dark" : "light";
            localStorage.setItem('theme', newTheme)
            return {
                ...state,
                theme: newTheme,
            }
        }
        default:
            return state
    }
}