

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

const mysqlconnect = require('./config')


const CreateBoardData = async (title, content, uid) => {
    await mysqlconnect.query(`INSERT INTO board(title, content, boardid) VALUES ('${title}', '${content}', '${uid}')`)
}

const SelctBoardData = async () => {
    try {
        const [data] = await mysqlconnect.query("SELECT * FROM board");
        console.log("나나나나나",data);
        return data;
    } catch (error) {
        console.log("에러 발생함~", error);
    }

}

const SelectIndexData = async (id) => {
    try {
        const [[data]] =  await mysqlconnect.query("SELECT * FROM board WHERE title=?", [id])
        return data;
    } catch (error) {
        console.log("에러 발생~", error);        
    }
}

const UpdateData = async (id, title, content) => { 
    try {
        const [data] = await mysqlconnect.query("UPDATE board SET title=?, content=? WHERE id=?", [id, title, content])
        return data;
    } catch (error) {
        console.log("에러 발생~", error);
    }
}

const DeleteData = async (id) => {
    try {
        const [data] = await mysqlconnect.query("DELETE FROM board WHERE id=?", [id])
        return data;
    } catch (error) {
        console.log("에러 발생~", error);
    }
}


// module.exports = { CreateBoardData, SelctBoardData, SelectIndexData, UpdateData, DeleteData }
// const Createuser = async () => {
//     try {
//         const [data] = await sqlpool.query('select * from user')
//         // console.log(data)
//     } catch (error) {    
//         const data = await sqlpool.query("create table user(userid varchar(15), pwd varchar(128), name varchar(15), nickname varchar(15), gender varchar(10), imgpath varchar(128))");
//     }
// }
// Createuser();

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

const Addlike = async (uid, boardid) => {
    try {
        const [[checklike]] = await sqlpool.query("select * from good where goodid=? and contentid=?;", [uid, boardid])
        if (checklike) {
            await sqlpool.query("delete from good where goodid=? and contentid=?;", [uid, boardid])
            return {state : 201, message : 'unliked'}
        }
        const data = await sqlpool.query("insert into good (goodid, contentid) values (?, ?);", [uid, boardid])
        return {state : 200, message : 'liked'}

    } catch (error) {
        return {state : 410, message : error}
        
    }
}

module.exports = {Addlike, Insertuser, Logincheck, Usercheck, Updatecontent, Deleteuser, CreateBoardData, SelctBoardData, SelectIndexData, UpdateData, DeleteData}