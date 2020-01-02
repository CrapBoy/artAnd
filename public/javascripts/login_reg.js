function artReg() {
    var ArtUser = $('#ArtUser').val();
    var pwd = $('#pwd').val();
    var nickName = $('#nickName').val();
    if (ArtUser == "" || pwd == "" || nickName == "") {
        $('#prompt').append(`
        <span class="promptStyle">请完善注册信息!</span>
        `);
        setTimeout(() => {
            $('.promptStyle').css("display", "none")
        }, 1000);
        return;
    }
    $.ajax({
        url: "artuserReg.jsp",
        type: "post",
        data: {
            ArtUser: `${ArtUser}`,
            pwd: `${pwd}`,
            nickName: `${nickName}`
        },
        success(data) {
            if (data.msg == "ok") {
                $('#prompt').append(`
                <span class="promptStyle">注册成功!</span>
                `);
                setTimeout(() => {
                    $('.promptStyle').css("display", "none")
                }, 1000);
            }
        }
    })
}

function artLogin() {
    var userlogin = $('#userlogin').val();
    var userpwd = $('#userpwd').val();
    if (userlogin == "" || userpwd == "") {
        $('#prompt').append(`
        <span class="promptStyle">请输入用户名或密码!</span>
        `);
        setTimeout(() => {
            $('.promptStyle').css("display", "none")
        }, 1000);
        return;
    }
    $.ajax({
        url: "artuserLogin.jsp",
        type: "get",
        data: {
            userlogin: `${userlogin}`,
            userpwd: `${userpwd}`
        },
        success(data) {
            if (data.msg == "ok") {
                $('#prompt').append(`
                <span class="promptStyle">登陆成功!</span>
                `);
                setTimeout(() => {
                    $('.promptStyle').css("display", "none")
                }, 1000);
                setTimeout(() => {//跳转到主页
                    location.href = './index.html';
                }, 1000);
            }
        }
    })
}





$('#ArtReg').on('click', () => {
    artReg()
})
