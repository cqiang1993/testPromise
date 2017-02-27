var express = require('express');
var models = require('../models');
var router = express.Router();
var rp = require("request-promise");
var MacTokenUtil = require("./MacTokenUtil");
var middleFunc = require("./middleFunc");


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
    var options = middleFunc.getMyExam();
    rp(options).then(function (repos) {
        res.json(repos)
    }).catch(function (err) {
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

router.get('/importExcel/:paper_id',function (req,res) {
    var options = middleFunc.getPaper(req);
    rp(options)
        .then(function (repos) {
            var paperId = repos["id"];
            var parts = repos['parts'];
            var questionList = [];
            var tagCodes = [{code:"interpersonal_agility",scores:[{max:5},{mid:3},{min:1},{random:0}]},
                {code:"result_agility",scores:[{max:5},{mid:3},{min:1},{random:0}]},
                {code:"change_agility",scores:[{max:5},{mid:3},{min:1},{random:0}]},
                {code:"self_awareness",scores:[{max:5},{mid:3},{min:1},{random:0}]},
                {code:"mental_agility",scores:[{max:5},{mid:3},{min:1},{random:0}]}];
            parts.forEach(function(item,index){
                var quesitons = item["questions"];
                quesitons.forEach(function (item,index) {
                    questionList.push({questionId:item["id"],options:[{max:"E"},{mid:"C"},{min:"A"},{random:""}]})
                })
            });
            new models.Qom({PaperId:paperId,QuestionList:questionList,TagCodes:tagCodes}).save(function (err,data) {
                if(err){
                    res.status(500).json(err);
                } else {
                    res.status(200).json({"message":"导入成功"});
                }
            });
        }).catch(function (err) {
            console.log(err);
    })
});

module.exports = router;
