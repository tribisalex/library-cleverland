import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SearchParams } from './types';

export const initialState: SearchParams = {
    filter: '',
    method: '',
    isSortedByRatingDesc: true,
    isSortedByAuthorDesc: true,
    isSortedByNameDesc: true,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchbookList: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        setSortMethod: (state, action: PayloadAction<string>) => {
            state.method = action.payload;
        },
        setSortByRatingMethod: (state) => {
            state.isSortedByRatingDesc = !state.isSortedByRatingDesc;
        },
        setSortByAuthorMethod: (state) => {
            state.isSortedByAuthorDesc = !state.isSortedByAuthorDesc;
        },
        setSortByNameMethod: (state) => {
            state.isSortedByNameDesc = !state.isSortedByNameDesc;
        },
    },
});

export const {
    searchbookList,
    setSortByRatingMethod,
    setSortByAuthorMethod,
    setSortByNameMethod,
    setSortMethod,
} = searchSlice.actions;
