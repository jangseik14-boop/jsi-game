const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// 사회자용 페이지 라우트 추가
app.get('/host', (req, res) => {
    res.sendFile(__dirname + '/public/host.html');
});

io.on('connection', (socket) => {
    console.log('✅ 클라이언트가 연결되었습니다.');

    // 게임 상태 업데이트 이벤트를 받아서 다른 모든 클라이언트에게 전달
    socket.on('game-state-update', (data) => {
        socket.broadcast.emit('game-state-update', data);
    });

    socket.on('disconnect', () => {
        console.log('🔌 클라이언트 연결이 끊어졌습니다.');
    });
});

server.listen(3000, () => {
    console.log('✅ 게임 센터 서버가 http://localhost:3000 에서 실행 중입니다.');
});