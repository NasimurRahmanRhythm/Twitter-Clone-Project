import { io } from "socket.io-client"
let socket
export async function getSocket(){
  if(!socket)
  {
    await fetch('/api/socket')
    socket = io()
  }
  return socket
}
