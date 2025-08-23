import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserFormData } from '../../forms/types';

type Source = 'uncontrolled' | 'rhf';

export type Submission = {
  id: string;
  source: Source;
  data: UserFormData;
  createdAt: number;
  isNew: boolean;
};

type FormsState = {
  submissions: Submission[];
};

const initialState: FormsState = {
  submissions: [],
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission: (
      state,
      action: PayloadAction<{ source: Source; data: UserFormData }>
    ) => {
      state.submissions.unshift({
        id: nanoid(),
        source: action.payload.source,
        data: action.payload.data,
        createdAt: Date.now(),
        isNew: true,
      });
    },
    clearNewFlag: (state, action: PayloadAction<string>) => {
      const item = state.submissions.find((s) => s.id === action.payload);
      if (item) item.isNew = false;
    },
  },
});

export const { addSubmission, clearNewFlag } = formsSlice.actions;
export default formsSlice.reducer;
