import { v4 as uuidv4 } from 'uuid';
import { createSlice } from '@reduxjs/toolkit';

const initialState = { query: '', searches: [] };

const slice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, { payload }) => {
      state.query = payload;
    },
    addSearchQuery: (state, { payload }) => {
      if (state.searches.length === 5) {
        state.searches.shift();
      }
      state.searches.unshift({
        id: uuidv4(),
        keyword: payload,
      });
    },
    removeSearchQuery: (state, { payload }) => {
      state.searches.splice(payload, 1);
    },
  },
});

export const { setSearchQuery, addSearchQuery, removeSearchQuery } =
  slice.actions;

export default slice.reducer;
