import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SessionData {
  userid: string
  userName: string
  permissions: string[]
  token?: string
}

const initialState: SessionData = {
  userid: "3bba4053-b3f0-4604-bd0d-c5d402b6d4a5",
  userName: 'dlsilva@romi.com',
  permissions: []
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    createSession(state, action: PayloadAction<SessionData>) {
      state.userName = action.payload.userName
      state.permissions = action.payload.permissions
      state.token = action.payload.token
    }
  }
})

export const sessionReducer = sessionSlice.reducer
export const sessionActions = sessionSlice.actions
export const sessionSelects = {
  userid: (state: any) => state.session.userid as string,
  userName: (state: any) => state.session.userName as string,
  permissions: (state: any) => state.session.permissions as string[],
  token: (state: any) => state.session.token as string
}
