import Form from "@/src/components/Form/Form";
import Header from "@/src/components/Header/Header";
import PostFeed from "@/src/components/posts/PostFeed/PostFeed";

export default function Home() {
  return (
    <>
      <Header label="Home" />
      <Form placeholder="What's hapeening?" />
      <PostFeed />
    </>
  );
}
