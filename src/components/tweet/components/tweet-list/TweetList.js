import { tweets as tweetList } from "@/db.mock"
import { TweetView } from "../tweet-view/TweetView"

export function TweetList({tweets=tweetList}){
  const onDelete = (tweetId) => {
    setTweetsState(state=>{
      return state.filter(tweet=>tweet.id != tweetId)
    }) 
  }
  return tweets.map((tweet)=>(
    <TweetView  key={tweet.id} onDelete={onDelete} tweet={tweet}/> 
  ))
}



