const {CreateBoardData , SelctBoardData, SelectIndexData, UpdateData, DeleteData} = require('../Models/board');

exports.CreateBoard =  async (title, content) => {
    return await CreateBoardData(title, content); 
}


exports.GetBoard =  async () => {
    return await SelctBoardData();
}

exports.GetBoardIndex = async (title) => {
    const data = await SelectIndexData(title);
    return data;
}

exports.UpdateBoard = async (id, title, content) => {
    const [data] = await SelctBoardData(id);

    data.title= title;
    data.content = content;

    try {
        await UpdateData(id, title, content);
        console.log("게시글 수정되었디~")
    } catch (error) {
        console.log("에러 발생", error);
    }
}
