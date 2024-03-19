function Common(){
    var self = this
    self.UserListHeaderItem = $(".right-wrapper .user-list-wrapper .wrapper-header > div")
    self.registerForm = $(".body-container .login-container .input-group")
    self.registerBtn = $(".body-container .login-container .input-group .register-btn")
}

Common.prototype.listenUserListBtn = function (){
    var self = this
    self.UserListHeaderItem.on("click", function (){
        $(this).siblings().removeClass('active')
        $(this).addClass("active")
        $(".right-wrapper .user-list-wrapper .user-list").hide()
        var index = $(this).index()
        $(".right-wrapper .user-list-wrapper .user-list").eq(index).show()

    })
}


Common.prototype.listenRegisterBtnEvent = function (){
    var self = this
    self.registerBtn.on("click", function (){
        var usernameInput = $(".body-container .input-group input[name='username']")
        var passwordInput = $(".body-container .input-group input[name='password']")
        var passwordInput2 = $(".body-container .input-group input[name='password2']")
        var mobileInput = $(".body-container .input-group input[name='mobile']")
        var sms_codeInput = $(".body-container .input-group input[name='sms_code']")


        moreRequest.post({
            "url":"/register/",
            "data":{
                "username":usernameInput.val(),
                "password":passwordInput.val(),
                "password2":passwordInput2.val(),
                "mobile":mobileInput.val(),
                "sms_code":sms_codeInput.val(),
            },
            "success":function (res){
                if(res.code==200){
                    alert(res.message)
                }else {
                    alert(res.message)
                }
                usernameInput.val('')
                passwordInput.val('')
                passwordInput2.val('')
                mobileInput.val('')
                sms_codeInput.val('')
            }
        })
    })
}

Common.prototype.listenGetSMSBtnEvent = function (){
    var self = this
    var mobileInput = self.registerForm.find('input[name="mobile"]')
    $("#getSmsBtn").on('click', function (){
        if(!mobileInput.val()){
            alert("请输入手机号")
        }else {
            moreRequest.get({
                "url":"/get_sms_code/?mobile="+mobileInput.val(),
                "success":function (res){
                    if(res.code==200){
                        self.smsCodeSuccessEvent()
                    }else {
                        alert(res.message)
                    }
                }
            })
        }
    })
}

Common.prototype.smsCodeSuccessEvent = function (){
    var self = this
    alert("验证码发送成功")
    $("#getSmsBtn").addClass("disable")
    $("#getSmsBtn").unbind("click")
    var count = 10
    var timer = setInterval(function (){
        $("#getSmsBtn").text(count+"s")
        if(count <0){
            clearInterval(timer)
            $("#getSmsBtn").removeClass("disable")
            $("#getSmsBtn").text("获取验证码")
            self.listenGetSMSBtnEvent()
        }
        count -=1
    }, 1000)
}


Common.prototype.run = function (){
    var self = this
    self.listenUserListBtn()
    self.listenRegisterBtnEvent()
    self.listenGetSMSBtnEvent()
}


$(function (){
    const common = new Common()
    common.run()
})