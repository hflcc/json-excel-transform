const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path')

const jsonFoldersPath = path.join(__dirname, '../json/')
const jsonFiles = fs.readdirSync(jsonFoldersPath, {encoding: 'utf-8'})
const distDir = path.join(__dirname, '../dist')

jsonFiles.forEach(jsonFileName => {
    const filePath = path.join(__dirname, '../json/' + jsonFileName)
    const jsonData = require(filePath)

    // 创建一个新的工作簿
    const workbook = XLSX.utils.book_new();

    // 表名
    const sheetName = "Sheet1";



    // 将 JSON 数据转换为工作表数据
    // const data = [['语言key', '语言值', '语言类型', '语言包类型', '所在模块', '来源字段']];
    const data = [['语言key', '英语值']];

    for (const key in jsonData) {
      data.push([key, jsonData[key]]);
    }

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(data);


    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);



    // 将工作簿写入 Excel 文件
    const excelFileName = `${distDir}/${jsonFileName.split('.')[0]}.xlsx`;

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    XLSX.writeFile(workbook, excelFileName, { bookType: 'xlsx', type: 'file' });
})