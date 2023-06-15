import { mapId } from "./mapId";

export function addIsLiked(tweet, userId) {
  tweet.isLiked = tweet.likes?.reduce(
    (acc, cur) => acc || cur.toString() === userId.toString(),
    false
  );
  tweet.replies = tweet.replies?.map((reply) => addIsLiked(reply, userId));
  return mapId(tweet);
}
