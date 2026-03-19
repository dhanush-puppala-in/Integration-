import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChapterLeaderDetails {
  _id: string;
  name: string;
  email: string;
  totalIpEarned: number;
  isVerified: boolean;
  recoveryOtp?: string | null;
  universeMetaData: {
    name: string;
    location: string;
    lat: number;
    lng: number;
    logo: string;
    callSign: string;
    logoKey: string;
  };
  progress?: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
  approvedBy?: string;
  uid: string;
}

interface ChapterLeaderState {
  details: ChapterLeaderDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChapterLeaderState = {
  details: null,
  loading: false,
  error: null,
};

const chapterLeaderSlice = createSlice({
  name: 'chapterLeader',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDetails: (state, action: PayloadAction<any>) => {
      state.details = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setDetails, setError } = chapterLeaderSlice.actions;
export default chapterLeaderSlice.reducer;
