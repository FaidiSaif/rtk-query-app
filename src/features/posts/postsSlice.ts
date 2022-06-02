import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { PostType } from "../types";
import { sub } from "date-fns";

const postsAdapter = createEntityAdapter<PostType>(); // used to normalize data

//Returns a new entity state object like {ids: [], entities: {}}
const initialState = postsAdapter.getInitialState();

//EntityState<PostType> = {ids:[],entities: {}}

export const postsSlice = createApi({
  reducerPath: "posts",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    /////////////////////////////////////////////////////////////////////
    getPosts: builder.query<EntityState<PostType>, void>({
      query: () => "/posts",
      providesTags: (result, error, id) =>
        result
          ? [
              { type: "Posts", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Posts" as const, id })),
            ]
          : [{ type: "Posts", id: "LIST" }],
      transformResponse: (responseData: PostType[]) => {
        return postsAdapter.setAll(initialState, responseData);
      },
    }),

    /////////////////////////////////////////////////////////////////////
    getPostsByUserId: builder.query<EntityState<PostType>, number>({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData: PostType[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              { type: "Posts", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Posts" as const, id })),
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
    /////////////////////////////////////////////////////////////////////
    addNewPost: builder.mutation({
      query: (initialPost: PostType) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Posts" as const, id: "LIST" }],
    }),
    ///////////////////////////////////////////////////////////////////////////
    updatePost: builder.mutation({
      query: (initialPost : PostType) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Posts" as const , id: arg.id }],
    }),
    ///////////////////////////////////////////////////////////////////////////
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Posts" as const , id: arg.id }],
    }),
    ///////////////////////////////////////////////////////////////////////////
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
          url: `posts/${postId}`,
          method: 'PATCH',
          // In a real app, we'd probably need to base this on user ID somehow
          // so that a user can't do the same reaction more than once
          body: { reactions }
      }),
      async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
          // `updateQueryData` requires the endpoint name and cache key arguments,
          // so it knows which piece of cache state to update
          const patchResult = dispatch(
            postsSlice.util.updateQueryData('getPosts', undefined, draft => {
                  // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                  const post = draft.entities[postId]
                  if (post) post.reactions = reactions //optimistic update => update the cache 
              })
          )
          try {
              await queryFulfilled //if the query succeeded do nothing 
          } catch {
              patchResult.undo() //if the query fails undo the optimistic update 
          }
      }
  })

  }),
});

export const { useGetPostsQuery } = postsSlice;
//select the query object from the store gives {status, endpointName, requestId ..., data}
export const postsResultQuerySelector = postsSlice.endpoints.getPosts.select();
//use the query object to get the only a selector of the data as memoized data
export const selectPostssData = createSelector(
  postsResultQuerySelector,
  (usersResult) => usersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectEntities: selectUsersEntities,
  selectIds: selectUserIds,
  // Pass in a selector that returns the normalized data and some selectors based on ids , entities..
} = postsAdapter.getSelectors(
  (state) => selectPostssData(state as RootState) ?? initialState
);
