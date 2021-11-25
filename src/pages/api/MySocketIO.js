import { Server } from 'socket.io';

let socketServer = null;

const MySocketIO = {
    createServer(server) {
        if (!socketServer) socketServer = new Server(server);
        return socketServer;
    },
    getServer() {
        return socketServer;
    },
    emit(topic, message){
        this.createServer().emit(topic, message);
    }
}

Object.freeze(MySocketIO);  

export default MySocketIO;