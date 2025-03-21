



const router = require('express').Router();
const { Createuser, Userlogin, Updateinfo, CreateBoard, GetBoard, GetBoardIndex, UpdateBoard, Userselectcntrl } = require('../controllers/controller');
const { Imgupload } = require('../models/imguplaod');
const { Deleteuser, Usercheck } = require('../models/user');

// const {CreateBoard, GetBoard, GetBoardIndex, UpdateBoard} = require('../controllers/controller');
// const router = require('express').Router();


router.get('/login', async (req, res) => { 
    const data =  await GetBoard();
    const {uid} = req.query;
    res.render('main', {data, uid})
})
router.get('/plus', (req, res) => {
    res.render('plus')
})

router.get('/detail', async (req, res) => {
    console.log("현재 요청한 쿼리",req.query);
    const { title } = req.query;
    console.log(title)
    const data =  await GetBoardIndex(title);
    console.log("누가 뜨니?", data.id);
    res.render('detail', {data})
})

router.get('/update', async (req, res) => {
    console.log("수정될 거야", req.query);
    const {title} = req.query;
    const data = await GetBoardIndex(title);
    console.log("너냐? 수정될 요소", data);
    res.render('update', {data});
})



router.post('/plus', async (req, res) => {
    try {
        const {titleValue, contentValue} = req.body;
        console.log("너구나", titleValue, contentValue);
        await CreateBoard(titleValue, contentValue);
        res.json({state : 200, message : "게시판 작성 성공!!"});
    } catch (error) {
        res.json({state:  404, message :  "오류야 오류!"});
    }
})

router.put('/update', async (req, res) => {
    const {title, content} = req.body;
    console.log(req.body);
    console.log("수정될 요소 너네지?", title, content);
    const {index} = req.query;
    try {
        const boardDB = GetBoardIndex(index);
        if(!boardDB){
            console.log("게시글 찾을 수 없다..")
        }
        await UpdateBoard(index, title, content);
        res.json({state : 200, message : "게시글 업데이트!!"});
    } catch (error) {
        res.json({state : 404, message : "게시글 업데이트 실패!!"});
    }
})

// ------------------------------------

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/login', async (req, res) => {
    const {uid} = req.query;
    const data = 
    res.render('main', {uid})
})

router.get('/mypage', (req, res) => {
    const {uid} = req.query;
    
    res.render('mypage', {uid})
})
router.get('/userdelete', async (req, res) => {

    const {uid} = req.query;
    const data = await Deleteuser(uid);
    console.log(data)
    if(data.state === 200) {
        res.render('login');
    }
    else {
        res.render('error')
    }
})

router.get('/editinfo', (req, res) => {
    const {uid} = req.query;
    res.render('editinfo', {uid})
})

router.post('/login', async (req, res) => {
    const {uid, upw} = req.body;
    console.log(req.body)
    const data = await Userlogin(uid, upw)
    console.log(data, 'asdf')
    if(data.state === 200) {
        const jwttoken = data.jwttoken;
        res.cookie('login-token', jwttoken, {
            maxAge : 10 * 60 * 60 * 1000,
            httpOnly : true
        })
        res.json({state : 200, message : data.message, uid})
    }else {
        res.json({state : 407, message : data.message })
    }
})


router.post('/editinfo', Imgupload.single('image'), async (req, res) => {
    const {path} = req.file;
    const {uname, nname,gender} = req.body;
    const {uid} = req.query;
    console.log(req.body,path, req.query)
    const data = await Updateinfo(uid, uname, nname,gender,path)
    const {jwttoken} = data;
    if(data.state === 200) { 
        res.cookie('login-token', jwttoken, {
            maxAge : 10 * 60 * 60 * 1000,
            httpOnly : true
        })
    }
    console.log(data, 'edit')
    res.json(data);
})


router.post('/signup', Imgupload.single('image'), async (req, res) => {
    console.log(req.file)
    const {path} = req.file;
    const { uname, uid, upw, upw1, nname, gender} = req.body;
    if(upw !== upw1) {
        return {state : 403, message : '같은 비밀번호 입력해주세요'}};
    const data = await Createuser(uname, uid, upw, nname, gender, path);
    res.json(data)       
})

module.exports = router;