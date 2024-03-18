function Common(){
    var self = this
    self.UserListHeaderItem = $(".right-wrapper .user-list-wrapper .wrapper-header > div")
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
        console.log(usernameInput.val())
        $.ajax({
            "url":"/register/",
            "method":"post",
            "data":{
                "username":usernameInput.val(),
                "password":passwordInput.val(),
                "password2":passwordInput2.val(),
            },
            "success":function (res){
                if(res.code==200){
                    alert(res.message)
                }else {
                    alert(res.message)
                }
            }
        })
    })
}


Common.prototype.run = function (){
    var self = this
    self.listenUserListBtn()
    self.listenRegisterBtnEvent()
}


$(function (){
    const common = new Common()
    common.run()
})