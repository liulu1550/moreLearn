function Common(){
    var self = this
    self.UserListHeaderItem = $(".right-wrapper .user-list-wrapper .wrapper-header > div")
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


Common.prototype.run = function (){
    var self = this
    self.listenUserListBtn()
}


$(function (){
    const common = new Common()
    common.run()
})