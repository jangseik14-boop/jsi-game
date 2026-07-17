const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path'); // 경로 관리를 위한 'path' 모듈 추가

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 1. 특정 경로에 대한 라우트를 먼저 정의합니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/game', (req, res) => {
    const { password } = req.query;
    if (password === '121214') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(401).send('<h1>접근 권한이 없습니다.</h1><p><a href="/">로그인 페이지로 돌아가기</a></p>');
    }
});

app.get('/host_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'host_login.html'));
});

app.get('/host', (req, res) => {
    const { password } = req.query;
    if (password === '121214') {
        res.sendFile(path.join(__dirname, 'public', 'host.html'));
    } else {
        res.status(401).send('<h1>접근 권한이 없습니다.</h1><p><a href="/host_login">로그인 페이지로 돌아가기</a></p>');
    }
});

// 2. 그 외의 모든 정적 파일(css, js, 이미지 등)은 'public' 폴더에서 제공합니다.
app.use(express.static('public'));


// 3. Socket.IO 연결 로직
io.on('connection', (socket) => {
    console.log('✅ 클라이언트가 연결되었습니다.');

    socket.on('game-state-update', (data) => {
        socket.broadcast.emit('game-state-update', data);
    });

    socket.on('disconnect', () => {
        console.log('🔌 클라이언트 연결이 끊어졌습니다.');
    });
});

// 4. 서버 실행
server.listen(3000, () => {
    console.log('✅ 게임 센터 서버가 http://localhost:3000 에서 실행 중입니다.');
});