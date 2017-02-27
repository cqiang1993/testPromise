var MacTokenUtil = require('./MacTokenUtil');
var querystring = require('querystring');
var host = "fepapi.debug.web.nd";
var user_id = "";
var sessions_id = "";
var macToken = "";
var macKey = "";
function setUser(uid,token,key){
    user_id = uid;
    macToken = token;
    macKey = key;
}

function setSession(session){
    sessions_id = session
}

function login(req){
    return {
        uri:'https://ucbetapi.101.com/v0.93/tokens',
        method:"POST",
        body:{
            login_name:req.body.login_name,
            org_name:req.body.org_name,
            password:req.body.password
        },
        json:true
    }
}

function getCodes(){
    return {
        uri: 'http://'+host+'/v1/commonapi/get_codes',
        method:'GET',
        json:true
    }
}

function getMyExam(req){
    var url = '/v1.1/qom/exams/actions/my_exams';
    var qustring = "?"+querystring.stringify(req.query);
    if(req.query){
        url = url + qustring
    }
    console.log(url);
    return {
        uri: 'http://'+host+url,
        method:'GET',
        headers:{
            "Authorization":MacTokenUtil.getMacContent(host,"GET",url,macToken,macKey)
        },
        json:true
    }
}

function startExam(req){
    var url = "/v1/qom/exams/"+req.params.exam_id+"/sessions";
    return {
        uri:'http://'+host+url,
        headers:{
            "Authorization":MacTokenUtil.getMacContent(host,"POST",url,macToken,macKey)
        },
        method:"POST",
        json:true
    }
}

function putAnswer(req,answers){
    var url = "/v1/qom/exams/"+req.params.exam_id+"/sessions/"+sessions_id+"/answers";
    return {
        uri:'http://'+host+url,
        headers:{
            "Authorization":MacTokenUtil.getMacContent(host,"PUT",url,macToken,macKey)
        },
        method:"PUT",
        body:answers,
        json:true
    }
}

function submit(req){
    var url = "/v1/qom/exams/"+req.params.exam_id+"/sessions/"+sessions_id+"/submit";
    return {
        uri:'http://'+host+url,
        headers:{
            // // "Authorization":MacTokenUtil.getMacContent(host,"GET","/v1.1/qom/exams/actions/my_exams",
            // //     "639EF1FB9EBEAB044D332497B33C2E30ECC2BDE74CF42954285DD2F8DFA27E0CAB153203C3536098","IaWOZ/O8wiGqIJ6Zh4d0Yw==")
            // "Authorization":"Debug UserId="+user_id
            "Authorization":MacTokenUtil.getMacContent(host,"POST",url,macToken,macKey)
        },
        method:"POST",
        json:true
    }
}

function getReport(req){
    var url = "/v1/qom/reports/exams/"+req.params.exam_id;
    return {
        uri:'http://'+host+url,
        headers:{
            "Authorization":MacTokenUtil.getMacContent(host,"GET",url,macToken,macKey)
        },
        method:"GET",
        json:true
    }
}

function getPaper(req){
    var url = "/v1/qom/papers/"+req.body.paper_id;
    return {
        uri:"http://"+host+url,
        headers:{
            "Authorization":MacTokenUtil.getMacContent(host,"GET",url,macToken,macKey)
        },
        method:"GET",
        json:true
    }
}

exports.getMyExam = getMyExam;
exports.getCodes = getCodes;
exports.login = login;
exports.setUser = setUser;
exports.startExam = startExam;
exports.setSession = setSession;
exports.putAnswer = putAnswer;
exports.submit = submit;
exports.getReport = getReport;
exports.getPaper = getPaper;