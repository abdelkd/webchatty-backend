import { Server, Socket } from 'socket.io'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  }
})

const users: Record<string, Socket> = {}
const data: Record<string, string> = {}

app.use(cors({
  origin: '*'
}))

app.get('/', (req, res) => {
  res.json({})
})

io.on('connection', (socket) => {

  socket.on('findMatch', (interest: string) => {
    let _ = interest

    users[socket.id] = socket
    findMatch(socket)
  })

  socket.on('sendMessage', ({ roomId, message, timeStamp }: any) => {
    console.log('message:', message)
    console.log('room:', roomId)
    io.to(roomId).emit('message', {authorId: socket.id, message, timeStamp})
  })

  socket.on('disconnect', () => {
    const room = data[socket.id]
    console.log('User disconnected', socket.id)
    delete users[socket.id];

    if(room) {
      io.to(room).emit('leaveRoom', 'your chat partner has left the room')
    }
  })
})

function findMatch(socket: Socket) {
  const availableUsers = Object.values(users).filter(user => user !== socket && !data[user.id])

  if(availableUsers.length > 0) {
    const randomUser = availableUsers[Math.floor(Math.random() * (availableUsers.length - 1))]
    const room = socket.id + "#" + randomUser.id

    data[socket.id] = room
    data[randomUser.id] = room

    console.log('found match')

    randomUser.join(room)
    socket.join(room)

    io.to(room).emit('matchFound', room)
  } else {
    socket.emit('noMatch', '')
  }
    
}

server.listen(port, () => {
  console.log('server running at http://localhost:3000/')
})
