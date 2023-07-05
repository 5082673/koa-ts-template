const fs = require('fs');
const path = require('path');

const packageFilePath = path.join(__dirname, '../package.json');
const packageDistFilePath = path.join(__dirname, '../dist/package.json');
(async () => {
  // 删除构建后的package.json文件
  // fs.unlinkSync(packageDistFilePath);
  // 读取源文件
  const file = JSON.parse(fs.readFileSync(packageFilePath, 'utf8'));
  // 添加新的文件信息
  const newFileMsg = JSON.stringify({
    name: file.name || '',
    version: file.version || '',
    description: file.description || '',
    main: file.main || '',
    scripts: file.scripts ?? {},
  });
  // 创建新的package
  fs.writeFileSync(packageDistFilePath, newFileMsg);
})();
