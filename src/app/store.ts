import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { postsSlice } from "../features/posts/postsSlice";
import { usersSlice } from "../features/users/usersSlice";

export const store = configureStore({
    reducer: {
        [usersSlice.reducerPath]: usersSlice.reducer, 
        [postsSlice.reducerPath]: postsSlice.reducer, 
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(usersSlice.middleware , postsSlice.middleware)
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector