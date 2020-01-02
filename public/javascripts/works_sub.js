var author = sessionStorage.getItem('name');//获取上个页面的作者
var author_id = sessionStorage.getItem('uer_id')//获取上个页面的作者的id
var title = sessionStorage.getItem('title');//获取上个页面的标题
var typee = sessionStorage.getItem('type');//不同页面的传值（作品）

author_id++

//赋值
function add_name() {
    $('.auto').text(author);
    $('.art').text(author);
    $('.tit').text(title);
    $('.zz').text(author);
}
add_name();


//作品类
class person {
    constructor(url, type, author_id, box, author) {//地址 类型 作者id 容器盒子
        this.url = url;
        this.type = type;
        this.author_id = author_id;
        this.author = author
        this.box = $(box);
        this.nickname = "";
        this.imgsarr = [];
        this.init()
    }
    //初始化
    init() {
        this.res_ajax();
    }
    //ajax请求
    res_ajax() {
        ; (function (obj) {//改变this指向
            $.ajax({
                type: obj.type,
                url: obj.url,
                data: {
                    goods_id: obj.author_id
                },
                success(res) {
                    let str = '';
                    let imgsarr = [];
                    console.log(res);
                    if (res.code == 0) {
                        imgsarr.push(res.data[0].g_imgsrc1);
                        imgsarr.push(res.data[0].g_imgsrc2);
                        imgsarr.push(res.data[0].g_imgsrc3);
                        imgsarr.forEach((item, index) => {
                            str += `<div class="show_one" >
                            <div class="img" ><img src="${item}" alt="" data-id=${index}></div>
                            <div class="txt">
                                <p>${res.data[0].g_name}</p>
                                <p>${res.data[0].g_price}</p>
                                <p class="zan">
                                    <i class="iconfont icon-icon-test"></i>
                                    <span class="zyx">赞一下</span>
                                </p>
                            </div>
                        </div>`
                        })
                        obj.box.append(str);
                        obj.nick(res);
                        obj.son(res);
                    }
                }

            })
        })(this)
    }
    son(res) {
        $('.img').on('click', function (e) {
            console.dir(e.target);
            var yq = e.target.dataset.id;
            $.ajax({
                type: 'get',
                url: 'works_sub_son.php',
                data: { son_id: author_id },
                success(res) {
                    if (res.code == 0) {
                        sessionStorage.setItem('uer_id', yq)
                        sessionStorage.setItem('type', 'xz')
                        location.href = 'works_sub.html';
                    }
                    console.log(res);
                }
            })

        })
    }
    nick(res) {//获取用户名判断用户是否登录
        console.log(res);

        if (!res.nickname) {
            $('.login').html(`
            <div class ="login_lg">登录</div>
            <div class ="register">注册</div>
            `)
        } else {
            this.nickname = res.nickname;//获取用户名

            //     $('#headImgOneSmall').html(`
            //     <img role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="headImg" src="${res.headImgSrc}" alt="">
            // 			<span id="headImgName">${res.nickname}</span>
            //     `)
            // }
            // $('#regHead').css('display', 'none')
            // $('#loginHead').css('display', 'none')

            // $('#headImgOne').append(`
            //   <li data-toggle="modal" data-target=".bs-example-modal-sm" class="likes_tabel">
            // 			<a href="#"><i class="fa fa-fw fa-folder"></i>已点赞</a>
            // 		</li>
            // 		<li>
            // 			<a id="destoryHead" href="#"><i class="fa fa-fw fa-file-o"></i>退出登录</a>
            // 		</li>
            //   `)

            new like(this.nickname, author, '.zan', false, true)
        }
    }
    modal_au() {
        $('#att').click(function () {
            //初始化关注弹框
            $('#modal_au').html(`
          <tr>
                                <td class="active text-center">作者</td>
                </tr>`
            );
            let nickname_you = this.nickname;//在构造函数中获取用户名
            console.log(nickname_you);

            if (nickname_you == '') {//判断是否定登录
                $('#modal_au').html(`
            <tr>
                                <td class="active text-center">请登录</td>
    
                            </tr>
                        
            `)
            } else {//确认登录后发起ajax请求，请求关注表
                $.ajax({
                    type: 'get',
                    url: 'exist.php',
                    data: {
                        at_name: nickname_you
                    },
                    success(res) {
                        let str = ''
                        console.log(res);
                        if (res.code == 0) {
                            for (let i = 0; i < res.data.length; i++) {
                                str += `  <tr>
                    <td class="active text-center text-success">${res.data[i].at_author}</td>
      
                  </tr>`
                            }
                            $('#modal_au').append(str);
                        }
                    }

                })
            }

        }.bind(this))
    }


    like_table() {
        new sel_liks(this.nickname, '.likes_tabel')
    }

}
new person('works_sub.php', 'get', author_id, '.author_show');


//封面详情类
class per {
    constructor(url1, type, author_id, box1, typee) {//地址 类型 作者id 容器盒子  缓存值(作品)
        this.url1 = url1;
        this.type = type;
        this.author_id = author_id;
        this.box1 = $(box1);
        this.typee = typee;
        this.init()
    }
    //初始化
    init() {
        this.res_ajaxone();
    }
    //ajax请求（封面详情）
    res_ajaxone() {
        ; (function (obj) {//改变this指向
            $.ajax({
                type: obj.type,
                url: obj.url1,
                data: {
                    aut_id: obj.author_id,
                    aut_type: obj.typee
                },
                success(res) {
                    let str = '';
                    console.log(res);
                    if (res.code == 0) {
                        if (typee == 'ym') {
                            res.data.forEach((item, index) => {
                                str += `<div class="show_item center">
                                            <img class="show_img showImg" data-idx=${index} src="${item.img}">
                                            <img class="show_img" src="${item.img2}">
                                            <img class="show_img" src="${item.img3}">
                                        </div>
                                        <div class="show_effect">
                                            <div class="show_list bor"><img src="${item.img}"></div>
                                            <div class="show_list"><img src="${item.img2}"></div>
                                            <div class="show_list"><img src="${item.img3}"></div>
                                        </div>`
                            })
                        } else {
                            res.data.forEach((item, index) => {
                                str += `<div class="show_item center">
                                            <img class="show_img showImg" data-idx=${index} src="${item.g_imgsrc1}">
                                            <img class="show_img" src="${item.g_imgsrc2}">
                                            <img class="show_img" src="${item.g_imgsrc3}">
                                        </div>
                                        <div class="show_effect">
                                            <div class="show_list bor"><img src="${item.g_imgsrc1}"></div>
                                            <div class="show_list"><img src="${item.g_imgsrc2}"></div>
                                            <div class="show_list"><img src="${item.g_imgsrc3}"></div>
                                        </div>`
                            })
                        }
                        obj.box1.append(str);
                        $('.show_list').on('click', function () {
                            var index = $(this).index();
                            $(this).addClass('bor').siblings().removeClass('bor');
                            $('.show_img').eq(index).addClass('showImg').siblings().removeClass('showImg');
                        })
                    }
                }

            })
        })(this)
    }
}
new per('works_subbb.php', 'get', author_id, '.show', typee);


//加入购物车
class AddShopping {
    constructor(url, type, author_id) {//地址 类型 作者id 
        this.url = url;
        this.type = type;
        this.author_id = author_id;
        this.init()
    }
    init() {
        this.check()
    }
    check() {
        $('.addShopping').on('click', (e) => {
            e.preventDefault();
            this.add();
        })
    }
    add() {
        ; (function (obj) {
            $.ajax({
                type: obj.type,
                url: obj.url,
                data: {
                    add_id: obj.author_id
                },
                success(res) {
                    console.log(res);
                    if (res.code == 0) {
                        Toast('#toast', '加入购物车成功', 1000);
                    } else if (res.code == 1) {
                        location.href = 'login.html'
                    }
                }
            })
        })(this)
    }
}
new AddShopping('add.php', 'post', author_id);

//点赞
$('.awesome').on('click', function () {
    $.ajax({
        type: 'get',
        url: 'awesome.php',
        success(res) {
            console.log(res);
            let str = ''
            if (res.code == 0) {
                res.data.forEach((item, index) => {
                    str = `<p><img src="${item.img}" alt=""></p>`
                })
                $('.awesome_show').append(str);
                $('.yzan').text('已赞')
                $('.awesome').css({
                    'background': '#d04344',
                    'color': 'white'
                })                
            }
        }
    })
    if($('.awesome_show').length >=1){
        $('.awesome_show p:last').remove();
     }
})

//实景预览
$('.yulan').on('click', function () {
    location.href = 'Live_preview.html';
})



//头像渲染
$.ajax({
    type: 'get',
    url: 'headimg.php',
    // data:{head_id:author_id},
    success(res) {
        console.log(res);
        let str = ''
        if (res.code == 0) {
            res.data.forEach((item, index) => {
                str += `<p><img src="${item.a_img}"></p>`
            })
            $('.awesome_show').append(str);
        }

    }
})


