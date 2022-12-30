// 모듈 불러오기
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
// app에서 cookieParser를 사용하겠다
app.use(cookieParser());
// app에서 json 형태의 body를 받겠다. (req.body)
app.use(express.json());

// 유저 리스트 작성
const users = [
    {name: "우준호", id: "noggong", password: "1234"},
    {name: "이설인", id: "seolin", password: "asdf"},
    {name: "주민석", id: "minseok", password: "hello"},
    {name: "유희선", id: "heesun", password: "94kf"},
    {name: "한동주", id: "dongjoo", password: "vded"},
]

// API 설정

// 로그인
app.get('/login', (req, res) => {

    // {name,id,password 중} 로그인 할 때 필요한 것 : id, password
    // query 데이터로 id, password 보내줄 게
    const id = req.query.id;
    const password = req.query.password;

    // users를 돌면서 user.id와 내가 query로 보낸 id 값이 동일한 유저 정보{}를 찾아줘
    const user = users.find(user => user.id === id);

    // 유저가 없는 경우
    if(!user) {
        return res.send("존재하지 않는 유저입니다.");
    };
    // id 값이 동일한 유저 정보는 있는데, 비밀번호가 틀린 경우
    if (user.password !== password) {
        return res.send("패스워드가 틀렸습니다.")
    };

    // 아이디도 맞고 패스워드도 맞아? 그럼 쿠키 값을 줄 게 => "user-id": user.id (key : value)형태로
    res.cookie("user-id",user.id);
    res.send("로그인 완료");
});

// 로그아웃
app.get('/logout', (req, res) => {
    
    // 로그아웃 하면 "user-id"라는 키 값을 가진 쿠키를 제거해줄게
    res.clearCookie("user-id");
    res.send("로그아웃");
});

// 회원가입
app.get('/register', (req, res) => {

    // 회원 가입 할 땐 {id, password, name} 다 받을거야
    // query 데이터로 id, password, name 보내줄 게
    const id = req.query.id;
    const password = req.query.password;
    const name = req.query.name;

    // users를 돌면서 user.id와 내가 query로 보낸 id 값이 동일한 유저 정보{}를 찾아줘
    const user = users.find(user => user.id === id);

    // 유저 정보가 있는 경우
    if (user) {
        return res.send("중복된 아이디 입니다.");
    };
    
    // 중복된 유저가 없어? 그럼 배열 맨 뒤에 정보를 넣어줄게(push),
    // {id: id, password: password, name: name} 형식으로
    users.push({id, password, name});

    // 유저 데이터에 추가되었는지 확인해보자
    console.log(users);
    res.send("회원 가입 완료");
});

// 유저정보
app.get('/users', (req, res) => {

    // 쿠키 값 중에 key값이 "user-id"인 value값을 요청할 거야
    const id = req.cookies["user-id"];

    // 쿠키 값 중에 key값이 "user-id"인게 없어?
    if(!id) {
        return res.send("로그인이 필요합니다.");
    };

    // users를 돌면서 (1) user.id와 (2)id(키 값이 "user-id"인 것의 value)값이 동일한 지 찾아줘
    const user = users.find(user =>user.id === id);

    // 동일하지 않은 경우
    if(!user) {
        return res.send("회원 정보를 잘못 입력하였습니다.");
    };
    // 동일하다면 유저 정보를 보자
    res.send(user);
});

//서버 열기
app.listen(3000, () => {
    console.log("서버 연결");
});
