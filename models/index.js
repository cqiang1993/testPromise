var mongoose = require('mongoose');
var Schema =mongoose.Schema;
exports.Qom = mongoose.model('Qom',new Schema({
    PaperId:String,
    QuestionList:Array,
    TagCodes:Array
}));