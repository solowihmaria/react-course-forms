import { createSlice } from '@reduxjs/toolkit';

type CountriesState = {
  list: string[];
};

const initialState: CountriesState = {
  list: [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Poland',
    'Russia',
    'Turkey',
  ],
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export default countriesSlice.reducer;
