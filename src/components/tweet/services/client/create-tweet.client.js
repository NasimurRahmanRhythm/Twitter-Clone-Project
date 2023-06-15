import axios from "axios"

export async function postTweet({text,image}){
  const formData = new FormData()
  if(text)
  formData.append('text',text)
  if(image)
  formData.append('image',image)
  const newTweetRes = await fetch('/api/tweet',{body:formData,method:'POST'})
  const newTweet = await newTweetRes.json()
  return newTweet.data
}

export async function postReply({text,image,tweetId}){
  const formData = new FormData()
  formData.append('text',text)
  formData.append('image',image)
  formData.append('parent',tweetId)
  const newTweetRes = await fetch('/api/reply',{body:formData,method:'POST'})
  const newTweet = await newTweetRes.json()
  return newTweet.data
}

export async function postRetweet({tweetId}){
  const {data:retweet} = await axios.post(`/api/retweet`,{tweetId})
  return retweet.data
}
