import { useTypedSelector } from "../../app/store";
import { useGetPostsQuery } from "./postsSlice";
import { selectAllUsers } from "./postsSlice";

const PostsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const selectedPosts = useTypedSelector(selectAllUsers);
  console.log(selectedPosts);
  return <div>{JSON.stringify(selectedPosts)}</div>;
};
export default PostsList;
