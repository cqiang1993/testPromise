var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/qom');
var models = require('../models');

models.Qom.find({PaperId: "e18ff007-1f5d-4bc2-a648-f17d5875f845"},function (err,data) {
    console.log(err);
    console.log(data);
    if(data.length>0){
        console.log("有数据")
    }
});