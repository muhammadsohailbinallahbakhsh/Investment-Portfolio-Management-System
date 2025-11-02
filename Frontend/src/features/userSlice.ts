import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserSliceType, UserRole } from '@/types';
import images from '@/constants/images';

export const initialState: UserSliceType = {
  name: 'Muhammad Sohail',
  email: 'sohailbinAllahBakhsh@gmail.com',
  role: UserRole.User,
  profileUrl: images.michaelImg,
  dateJoined: new Date(),
};

const userSlice = createSlice({
  name: 'productFilter',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSliceType>) => {
      const { name, email, role, dateJoined, profileUrl } = action.payload;
      state.name = name;
      state.email = email;
      state.dateJoined = dateJoined;
      state.role = role;
      state.profileUrl = profileUrl;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
