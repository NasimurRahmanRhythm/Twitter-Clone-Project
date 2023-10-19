import { io } from "socket.io-client"
let socket
export async function findSocket(){
  if(!socket)
  {
    await fetch('/api/socket')
    socket = io()
  }
  return socket;
}
