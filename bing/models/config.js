require('dotenv').config({path : "../.env"});
const mysql2 = require('mysql2/promise');

const connectSql =  mysql2.createPool({
    user :  process.env.DATABASE_USER,
    password : process.env.DATABASE_PAWSSWORD,
    database : process.env.DATABASE_NAME,
    multipleStatements : true,
    host : process.env.DATABASE_HOST,
    port : process.env.DATABASE_PORT
})

connectSql.getConnection((err) => {
    console.log("연결 에러~", err)
})

const tableInit = async () => {

    try {
        const [data] = await connectSql.query("select * from user")
        // console.log(data)
    } catch (error) {    
        const data = await connectSql.query("create table user(userid varchar(30) PRIMARY KEY, pwd varchar(128), name varchar(15), nickname varchar(15), gender varchar(10), imgpath varchar(128))");
    }
    
 
    try {
        await connectSql.query("SELECT * FROM board")
    } catch (error) {
        console.log("board 테이블이 존재하지 않아요~")
        await connectSql.query("CREATE TABLE board ( id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(30) NOT NULL, content VARCHAR(100) NOT NULL, image VARCHAR(50), boardid VARCHAR(30), CONSTRAINT fk_board_id FOREIGN KEY (boardid) REFERENCES user (userid))")
        console.log("board 테이블을 생성합니다..")
    }
    
    try {
        await connectSql.query("SELECT * FROM good")
    } catch (error) {
        console.log("good 테이블이 존재하지 않습니다~")
        await connectSql.query("CREATE TABLE good(id INT PRIMARY KEY AUTO_INCREMENT, goodid VARCHAR(50), contentid varchar(50), constraint fk_goodid FOREIGN KEY (goodid) REFERENCES user (userid), constraint fk_goodid1 FOREIGN KEY (contentid) REFERENCES board (boardid));")
        console.log("good 테이블을 생성합니다..")
    }

    try {
        await connectSql.query("SELECT * FROM comment")
    } catch (error) {
        console.log("comment 테이블이 존재하지 않습니다")        
        await connectSql.query("CREATE TABLE comment(id INT PRIMARY KEY AUTO_INCREMENT, userid INT, commentid VARCHAR(30), commentcnt VARCHAR(50) NOT NULL)")
        console.log("comment 테이블을 생성합니다..")
    }
}
// --
tableInit();

module.exports = connectSql;