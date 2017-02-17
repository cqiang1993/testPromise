var host = "fepapi.debug.web.nd";
var user_id = "";
var sessions_id = "";
function setUserId(uid){
    user_id = uid
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

function getMyExam(){
    return {
        uri: 'http://'+host+'/v1.1/qom/exams/actions/my_exams',
        method:'GET',
        headers:{
            // "Authorization":MacTokenUtil.getMacContent(host,"GET","/v1.1/qom/exams/actions/my_exams",
            //     "639EF1FB9EBEAB044D332497B33C2E30ECC2BDE74CF42954285DD2F8DFA27E0CAB153203C3536098","IaWOZ/O8wiGqIJ6Zh4d0Yw==")
            "Authorization":"Debug UserId="+user_id
        },
        json:true
    }
}

function startExam(req){
    return {
        uri:'http://'+host+"/v1/qom/exams/"+req.params.exam_id+"/sessions",
        headers:{
            // "Authorization":MacTokenUtil.getMacContent(host,"GET","/v1.1/qom/exams/actions/my_exams",
            //     "639EF1FB9EBEAB044D332497B33C2E30ECC2BDE74CF42954285DD2F8DFA27E0CAB153203C3536098","IaWOZ/O8wiGqIJ6Zh4d0Yw==")
            "Authorization":"Debug UserId="+user_id
        },
        method:"POST",
        json:true
    }
}

function putAnswer(req,answers){
    return {
        uri:'http://'+host+"/v1/qom/exams/"+req.params.exam_id+"/sessions/"+sessions_id+"/answers",
        headers:{
            // "Authorization":MacTokenUtil.getMacContent(host,"GET","/v1.1/qom/exams/actions/my_exams",
            //     "639EF1FB9EBEAB044D332497B33C2E30ECC2BDE74CF42954285DD2F8DFA27E0CAB153203C3536098","IaWOZ/O8wiGqIJ6Zh4d0Yw==")
            "Authorization":"Debug UserId="+user_id
        },
        method:"PUT",
        body:answers,
        json:true
    }
}

function submit(req){
    return {
        uri:'http://'+host+"/v1/qom/exams/"+req.params.exam_id+"/sessions/"+sessions_id+"/submit",
        headers:{
            // "Authorization":MacTokenUtil.getMacContent(host,"GET","/v1.1/qom/exams/actions/my_exams",
            //     "639EF1FB9EBEAB044D332497B33C2E30ECC2BDE74CF42954285DD2F8DFA27E0CAB153203C3536098","IaWOZ/O8wiGqIJ6Zh4d0Yw==")
            "Authorization":"Debug UserId="+user_id
        },
        method:"POST",
        json:true
    }
}

function getReport(req){
    return {
        uri:'http://'+host+"/v1/qom/reports/exams/"+req.params.exam_id,
        headers:{
            // "Authorization":MacTokenUtil.getMacContent(host,"GET","/v1.1/qom/exams/actions/my_exams",
            //     "639EF1FB9EBEAB044D332497B33C2E30ECC2BDE74CF42954285DD2F8DFA27E0CAB153203C3536098","IaWOZ/O8wiGqIJ6Zh4d0Yw==")
            "Authorization":"Debug UserId="+user_id
        },
        method:"GET",
        json:true
    }
}

exports.getMyExam = getMyExam;
exports.getCodes = getCodes;
exports.login = login;
exports.setUserId = setUserId;
exports.startExam = startExam;
exports.setSession = setSession;
exports.putAnswer = putAnswer;
exports.submit = submit;
exports.getReport = getReport;