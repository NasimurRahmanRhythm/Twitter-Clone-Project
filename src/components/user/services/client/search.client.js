import axios from "axios";

export async function searchUser(name){
  const {data:users} = await axios.get('/api/user/?search='+name)
  return users
}
