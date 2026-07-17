const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Socket.IO 서버를 먼저 초기화합니다. serveClient 옵션은 기본값이 true이므로 생략 가능합니다.
const io = new Server(server, {
    serveClient: true
});

// 그 다음에 Express 미들웨어와 라우트를 설정합니다.
// 로고 이미지(logo.png) 같은 정적 파일들을 위해 필요합니다.
app.use(express.static('public'));

// 1. 플레이어용 로그인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// 2. 플레이어용 비밀번호 확인 및 게임 페이지 제공 라우트
app.get('/game', (req, res) => {
    const { password } = req.query;
    if (password === '121214') { // 플레이어용 비밀번호
        res.sendFile(__dirname + '/public/index.html');
    } else {
        res.status(401).send('<h1>접근 권한이 없습니다.</h1><p><a href="/">로그인 페이지로 돌아가기</a></p>');
    }
});

// 사회자용 페이지 라우트 추가
// 1. 로그인 페이지 라우트
app.get('/host_login', (req, res) => {
    res.sendFile(__dirname + '/public/host_login.html');
});

// 2. 비밀번호를 확인하고 실제 사회자 페이지를 보여주는 라우트
app.get('/host', (req, res) => {
    const { password } = req.query;
    // 실제 운영 시에는 더 안전한 비밀번호를 사용하고, 환경변수로 관리하는 것이 좋습니다.
    if (password === '121214') { // 사회자용 비밀번호
        res.sendFile(__dirname + '/public/host.html');
    } else {
        res.status(401).send('<h1>접근 권한이 없습니다.</h1><p><a href="/host_login">로그인 페이지로 돌아가기</a></p>');
    }
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