const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelFoldersPath = path.join(__dirname, "../excel");
const excelFiles = fs.readdirSync(excelFoldersPath, { encoding: "utf-8" });
const distDir = path.join(__dirname, "../dist");

excelFiles.forEach((excelFile) => {
  // 读取 Excel 文件
  const workbook = xlsx.readFile(path.join(__dirname, "../excel/", excelFile));

  // 选择第一个工作表
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 将 Excel 中的数据转换为 JSON 格式
  const arrData = xlsx.utils.sheet_to_json(worksheet, { header: "A" });

  // 将第一列作为对象的键，第三列作为对象的值
  const dataObject = {};
  arrData.forEach((item, index) => {
    if (index === 0) return; // 第一行是表头，不需要
    const { A: key, C: value } = item;
    if (key !== undefined && value !== undefined) {
      dataObject[key] = value;
    }
  });

  const jsonFileName = `${distDir}/${excelFile.split(".")[0]}.json`;

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 将对象写入到文件中
  fs.writeFile(jsonFileName, JSON.stringify(dataObject, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
  });
});
