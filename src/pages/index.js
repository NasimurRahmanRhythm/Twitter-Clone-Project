import Form from "@/components/Form/Form";
import Header from "@/components/Header/Header";
import PostFeed from "@/components/posts/PostFeed/PostFeed";

export default function Home() {
  return (
    <>
      <Header label="Home" />
      <Form placeholder="What's hapeening?" />
      <PostFeed />
    </>
  );
}
