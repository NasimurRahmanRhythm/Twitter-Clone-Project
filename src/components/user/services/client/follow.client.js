import axios from "axios";

export async function follow(followingId){
  const {data:followRes} = await axios.post(`/api/follow/${followingId}`) 
  return followRes.data
}


export async function unfollow(followingId){
  const {data:followRes} = await axios.post(`/api/follow/${followingId}`) 
  return followRes.data
}
