import {Server} from "socket.io"
let io;
export const insializeSocket = (httpServer) =>{
 io = new Server(httpServer, {
    cors:{
        origin: "http://localhost:5173"
    }
 })

 io.on('connection', (socket)=>{
    socket.on('disconnect',()=>{
        console.log('client disconnected::::::',socket.id)
    })

    socket.on('event-call', (data)=>{
        console.log(data)
    })
 })
 console.log('Socket.IO Initialize')
 return io
 
}


export const getIo = () =>{
    if(!io){
        throw new Error ('Socket not connected')
    }
    return io
}