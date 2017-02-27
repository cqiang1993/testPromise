var xlsx = require('node-xlsx');

function excelToJson(filename){
    var file = "./public/uploads/"+filename;
    var obj = xlsx.parse(file);
    var importOption = obj[1];
    var importExpect = obj[2];
    var optionData = importOption["data"];
    var expectData = importExpect["data"];
    var options = [];
    var tagcodes = [];
    for(var i=1;i<optionData.length;i++){
        var option = {};
        for(var j=0;j<optionData[i].length;j++){
            option[j]  =optionData[i][j];
        }
        options.push(option);
    }
    for(var x=1;x<expectData.length;x++){
        var tagCode = {};
        for(var y=2;y<expectData[x].length;y++){
            tagCode["code"] = expectData[x][1];
            tagCode[y-2] = expectData[x][y]
        }
        tagcodes.push(tagCode)
    }

    object = {options:options,tagcodes:tagcodes};

    return object
}
exports.excelToJson = excelToJson;