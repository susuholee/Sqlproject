const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Insertuser, Logincheck, Usercheck, Uploadcontent, Updatecontent } = require('../models/user');






const Userlogin = async (uid, upw) => {
    const data = await Logincheck(uid);
    if(!data) {
        return {state : 406, message : '아이디와 비밀번호 확인해주세요'};
    }
    console.log(data,'controller')
    const checkpw = await bcrypt.compareSync(upw, data.pwd)
    const {nickname, imgpath} = data;
    const jwttoken = jwt.sign({nickname,imgpath}, process.env.TKN, {expiresIn : '30m'});
    return ({state : 200, message : '로그인 성공', jwttoken})
}

const Createuser = async (uname, uid, upw, nname, gender, imgpath) => {
    try {
        const pwhash = bcrypt.hashSync(upw, 10);
        const isSignup = await Usercheck(uid);
        if(isSignup) {
            console.log(isSignup,'ww')
            return {state : 405, message : '사용하고있는 아이디입니다'}}
        const data = await Insertuser(uname, uid, pwhash, nname, gender, imgpath);
        return data;
    } catch (error) {
        return error;
    }
}

const Updateinfo = async (uid, uname, nname,gender,imgpath) => {
    try {
        
        const data = await Updatecontent(uid, uname, nname,gender,imgpath)
        return data;
    } catch (error) {
        return {state : 408, message : error}
    }
}


module.exports = {Createuser, Userlogin, Updateinfo}