const {CreateBoard, GetBoard, GetBoardIndex, UpdateBoard} = require('../Controller/board.controll')
const router = require('express').Router();


router.get('/', async (req, res) => { 
    const data =  await GetBoard();
    res.render('main', {data})
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





module.exports = router;