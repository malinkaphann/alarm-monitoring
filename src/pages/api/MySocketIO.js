import { Server } from 'socket.io';

let socketServer = null;

const MySocketIO = {
    createServer(server) {
        if (!socketServer) {
            socketServer = new Server(server);
        }
        return socketServer;
    },
    getServer() {
        return socketServer;
    },
    emit(topic, message){
        const server = this.getServer();
        if (!server) {
            throw new Error('socket io server is not yet created');
        }
        server.emit(topic, message);
    }
}

Object.freeze(MySocketIO);  

export default MySocketIO;