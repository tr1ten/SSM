import { useEffect, useState } from "react";
import SinglePost from "./SinglePost";

const ShowPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    fetch("http://localhost:3001/post")
      .then((res) => res.json())
      .then((data: any) => {
        console.log("here data", data);
        if (data.posts) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      });
  }, []);
  return (
    <>
      {posts.map((post) => (
        <SinglePost key={post.id} {...post} />
      ))}
    </>
  );
};
export default ShowPosts;
