var express = require('express');
var formidable = require('formidable');
var models = require('../models');
var router = express.Router();
var rp = require("request-promise");
// var MacTokenUtil = require("./MacTokenUtil");
var middleFunc = require("./middleFunc");
var multer = require('multer');
var excelUitl = require('./excelUtil');

//
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post("/tokens",function (req,res) {
    var options = middleFunc.login(req);
    rp(options).then(function (repos) {
        console.log(repos);
        res.json(repos);
        middleFunc.setUser(repos["user_id"],repos["access_token"],repos["mac_key"]);
    }).catch(function (err) {

    })
});

router.get('/commonapi/get_codes',function (req,res) {
    console.log('读取');
    var options = middleFunc.getCodes();
    console.log(options);
    rp(options).then(function (repos) {
        console.log(repos);
        res.json(repos);
    }).catch(function (err) {

    })
});

router.get('/qom/exams/actions/my_exams',function (req,res) {
    var options = middleFunc.getMyExam(req);
    rp(options).then(function (repos) {
        res.json(repos)
    }).catch(function (err) {
        console.log(err);
        res.status(err["response"]["statusCode"]).json(err["response"])
    })
});

router.post("/qom/:exam_id/sessions",function (req,res) {
    var options = middleFunc.startExam(req);
    rp(options).then(function (repos) {
        middleFunc.setSession(repos["session_id"]);
        var questions = repos["paper"]["parts"][0]["questions"];
        var answers = [];
        questions.forEach(function (item,index) {
            answers.push({question_id:item["id"],answer:{answer: "A", time_consuming: 500}})
        });
        var options2 = middleFunc.putAnswer(req,answers);
        rp(options2).then(function (repos) {
            var options3 = middleFunc.submit(req);
            rp(options3).then(function (repos) {
                res.json(repos)
            }).catch(function (err){
                res.status(err["response"]["statusCode"]).json(err["response"])
            })
        }).catch(function (err){
            res.status(err["response"]["statusCode"]).json(err["response"])
        })

    }).catch(function (err) {
        res.status(err["response"]["statusCode"]).json(err["response"])
    })
});

router.get("/assertRepot/:exam_id",function (req,res) {
    var options = middleFunc.getReport(req);
    var report = [];
    rp(options)
        .then(function (repos) {
            var dimensions = repos["parts"][0]["data"]["dimensions"];
            dimensions.forEach(function (item, index) {
                report.push(
                    {
                        dimension_code: item["dimension_code"],
                        dimension_name: item["dimension_name"],
                        expected_value: "5".toFixed(3),
                        actual_value: item["score"].toFixed(3)
                    })
            });
            res.json(report)
        }).catch(function (err) {
        res.status(err["response"]["statusCode"]).json(err["response"])
    })
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+"_"+Date.now()+ '.xlsx');
    }
});

var upload = multer({ storage: storage });

router.all('/importExcel/baseFile',upload.single("file"),function (req,res) {
    var options = middleFunc.getPaper(req);
    console.log(req);
    var object = "";
    console.log(options);
    if(req.file) {
        object = excelUitl.excelToJson(req.file["filename"]);

        console.log(object);
        rp(options)
            .then(function (repos) {
                console.log(repos);
                var paperId = repos["id"];
                var parts = repos['parts'];
                var questionList = [];
                var tagCodes = object["tagcodes"];
                parts.forEach(function(item,index){
                    var quesitons = item["questions"];
                    quesitons.forEach(function (item,index) {
                        questionList.push({questionId:item["id"],options:object["options"][index]})
                    })
                });
                models.Qom.find({},{},{PaperId:paperId},function(err,data){
                    if(err){
                        console.log("1这里打印的："+err);
                        res.status(500).json(err);
                    }else if(data.length>0){
                        models.Qom.update({PaperId:paperId},{$set:{QuestionList:questionList,TagCodes:tagCodes}},function (err,data) {
                            if(err) {
                                console.log("2这里打印的："+err);
                                res.status(500).json(err);
                            }else {
                                res.status(200).json({"message":"更新成功"});
                            }
                        })
                    }else {
                        models.Qom({PaperId:paperId,QuestionList:questionList,TagCodes:tagCodes}).save(function (err,data) {
                            if(err) {
                                console.log("3这里打印的："+err);
                                res.status(500).json(err);
                            }else {
                                res.status(200).json({"message":"导入成功"});
                            }
                        })
                    }
                })
            }).catch(function (err) {
                console.log(err);
        });
    }
    // else{
    //     res.writeHead(200, {'content-type': 'text/html'});
    //     res.end(
    //         '<form action="/v1/importExcel/baseFile" enctype="multipart/form-data" method="post">'+
    //         '<input type="text" name="paper_id"><br>'+
    //         '<input type="file" name="file" multiple="multiple"><br>'+
    //         '<input type="submit" value="Upload">'+
    //         '</form>'
    //     );
    // }
});



module.exports = router;
