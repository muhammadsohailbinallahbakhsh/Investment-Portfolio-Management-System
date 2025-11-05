import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserSliceType, UserRole } from '@/types';
import images from '@/constants/images';

// Initialize from localStorage if available
const getInitialState = (): UserSliceType => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        name: user.name || 'Guest User',
        email: user.email || '',
        role: (user.role as UserRole) || UserRole.User,
        profileUrl: images.michaelImg,
        dateJoined: user.dateJoined || new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }

  // Default state if no stored user
  return {
    name: 'Guest User',
    email: '',
    role: UserRole.User,
    profileUrl: images.michaelImg,
    dateJoined: new Date().toISOString(),
  };
};

export const initialState: UserSliceType = getInitialState();

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
