import { useAsyncReducer } from "@/participated/hooks/useAsyncReducer";
import axios from "axios";
import { postReply, postRetweet } from "../services/client/create-tweet.client";
import { deleteTweet } from "../services/client/delete-tweet";

export const TweetActions = {
  LIKE: "LIKE",
  UNLIKE: "UNLIKE",
  REPLY: "REPLY",
  RETWEET: "RETWEET",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOAD_REPLIES: "LOAD_REPLIES",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const tweetReducer = (state, action) => {
  if (action.error) return state;
  switch (action.type) {
    case TweetActions.RETWEET:
      return { ...state, totalRetweets: state.totalRetweets + 1 };

    case TweetActions.LIKE:
      return { ...state, totalLikes: state.totalLikes + 1, isLiked: true };

    case TweetActions.UNLIKE:
      return { ...state, totalLikes: state.totalLikes - 1, isLiked: false };

    case TweetActions.REPLY:
      return {
        ...state,
        totalReplies: state.totalReplies + 1,
        replies: [action.payload, ...state.replies],
      };

    case TweetActions.UPDATE:
      return { ...action.payload };

    case TweetActions.LOAD_REPLIES:
      return {
        ...state,
        replyPageIndex: state.replyPageIndex + 1,
        replies: [...state.replies, ...action.payload],
      };

    case TweetActions.SUCCESS:
      return { ...state, success: action.payload };

    case TweetActions.ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export const tweetMiddleware = async (state, action, dispatch) => {
  switch (action.type) {
    case TweetActions.LIKE:
      axios.post("/api/like", { tweetId: state.id });
      return action.payload;

    case TweetActions.UNLIKE:
      axios.post("/api/like", { tweetId: state.id });
      return action.payload;

    case TweetActions.REPLY:
      try {
        const newReply = await postReply({
          text: action.payload.text,
          image: action.payload.image,
          tweetId: state.id,
        });
        dispatch({
          type: TweetActions.SUCCESS,
          payload: { message: "replied successfully" },
        });
        return newReply;
      } catch (err) {
        dispatch({
          type: TweetActions.ERROR,
          payload: { message: "something went" },
        });
        throw err;
      }

    case TweetActions.RETWEET:
      const newTweet = postRetweet({ tweetId: state.id });
      return true;

    case TweetActions.UPDATE:
      const formData = new FormData();
      formData.append("content", action.payload.text);
      formData.append("image", action.payload.image?.file);
      formData.append("imageUrl", action.payload.image?.src);
      const newPostRes = await fetch("/api/tweet/" + state.id, {
        method: "PATCH",
        body: formData,
      });
      const newPost = await newPostRes.json();
      console.log(newPost);
      return newPost.data;

    case TweetActions.DELETE:
      const deleteResult = await deleteTweet(action.payload);
      return deleteResult;

    case TweetActions.LOAD_REPLIES:
      const { data } = await axios.get(
        `/api/reply?pageIndex=${state.replyPageIndex}&pageSize=10&tweetId=${state.id}`
      );
      return data.data;

    default:
      return action.payload;
  }
};

export function useTweetReducer(initialState) {
  const [state, dispatch] = useAsyncReducer(
    tweetReducer,
    initialState,
    tweetMiddleware
  );
  return [state, dispatch];
}
