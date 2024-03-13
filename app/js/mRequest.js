function MoreRequest(url, data, type, success, fail){
    $.ajax({
        "url":url,
        "type":type,
        "data":data,
        "timeout":5000,
        "beforeSend":function (xhr){},
        "success": function (res){
            if(res.code === 200){
                if(success){
                    console.log(res)
                    success(res)
                }
            }else {
                if(fail){
                    fail(res)
                }
            }
        },
        "error":function (e){
            if(fail){
                fail(e)
            }
        }
    })
}



function _get(url, data, success){
    MoreRequest(url, data, success)
}

function _post(url, data, success){
    MoreRequest(url, data, success)
}