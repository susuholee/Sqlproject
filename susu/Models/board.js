const mysqlconnect = require('./config')


const CreateBoardData = async (title, content) => {
    await mysqlconnect.query(`INSERT INTO board(title, content) VALUES ('${title}', '${content}')`)
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


module.exports = { CreateBoardData, SelctBoardData, SelectIndexData, UpdateData, DeleteData }