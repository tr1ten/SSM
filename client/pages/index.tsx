import type { NextPage } from "next";
import { useUser } from "../hooks/useUser";
import Layout from "../layout/base";
import PostContainer from "../components/SSM/Post";
import ShowPosts from "../components/SSM/ShowPosts";
const Home: NextPage = () => {
  const user = useUser();
  return (
    <Layout isLogged={Boolean(user)}>
      <h1>Posts</h1>
      <ShowPosts />

      <h2>Add Post</h2>
      <PostContainer authorId={user?.id} />
    </Layout>
  );
};

export default Home;
