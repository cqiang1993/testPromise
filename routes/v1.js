var express = require('express');
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
        middleFunc.setUserId(repos["user_id"]);
    }).catch(function (err) {

    })
});

router.get('/commonapi/get_codes',function (req,res) {
    var options = middleFunc.getCodes();
    rp(options).then(function (repos) {
        console.log(repos)
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

module.exports = router;
