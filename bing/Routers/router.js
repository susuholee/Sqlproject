



const router = require('express').Router();
const { Createuser, Userlogin, Updateinfo, Userselectcntrl } = require('../controllers/controller');
const { Imgupload } = require('../models/imguplaod');
const { Deleteuser, Usercheck } = require('../models/user');



router.get('/', (req, res) => {
    res.render('login');
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/login',Userselectcntrl, async (req, res) => {
    const {nickname, imgpath} = req.user;
    const {uid} = req.query;
    console.log(nickname, imgpath, 'asdf')
    res.render('main', {uid, nickname, imgpath})
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