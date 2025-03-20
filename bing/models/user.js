

const mysql = require('mysql2/promise');
require('dotenv').config()

const sqlpool = mysql.createPool({
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PAWSSWORD,
    host : process.env.DATABASE_HOST,
    database : process.env.DATABASE_NAME,
    port : process.env.DATABASE_PORT,
    multipleStatements : true
})

sqlpool.getConnection((err) => {
    console.log(err,'asd')
})
const Createuser = async () => {
    try {
        const [data] = await sqlpool.query('select * from user')
        // console.log(data)
    } catch (error) {    
        const data = await sqlpool.query("create table user(userid varchar(15), pwd varchar(128), name varchar(15), nickname varchar(15), gender varchar(10), imgpath varchar(128))");
    }
}
Createuser();

const Insertuser = async (userid, pwd, name, nickname, gender, imgpath) => {
    try {
        const [data] = await sqlpool.query("insert into user(name, userid, pwd,  nickname, gender, imgpath) values (?,?,?,?,?,?);", 
        [userid, pwd, name, nickname, gender, imgpath]);
        return {state : 200, message : '가입 완료되었습니다'}
    } catch (error) {
        return {state : 401, message : error}
    }
}

const Logincheck = async (uid) => {
    try {
        const [[data]] = await sqlpool.query("select * from user where userid = ?;",[uid])
        return data;
    } catch (error) {
        console.log(error)
        return {state : 402, message : '아이디와 비밀번호를 확인해주세요'}
    }
}

const Usercheck = async (uid) => {
    try {
        const [[data]] = await sqlpool.query("select * from user where userid = ?;",[uid])
        
        return data;
    } catch (error) {
        return {state : 403, message : '사용된 아이디입니다'}
    }
}

const Updatecontent = async (uid, uname, nname,gender,imgpath) => {
    try {
        const [[data]] = await sqlpool.query("update user set name=?, nickname=?, gender=?, imgpath=? where userid=?;", [uname, nname,gender,imgpath, uid])
        return data;
    } catch (error) {
        console.log(error)
        return {state : 408, message : error}
    }
}

const Deleteuser = async (uid) => {
    try {
        
        const data = await sqlpool.query("delete from user where userid=?;", [uid])
        return {state : 200, message : '회원 탈퇴 완료되었습니다'}
    } catch (error) {
        return {state : 409, message : error}
    }
}

module.exports = {Insertuser, Logincheck, Usercheck, Updatecontent, Deleteuser}