// $(document).ready(function () {
//     $.ajax({
//         type: 'get',
//         url: 'works.php',
//         success(res) {
//             console.log(res);
//             if (res.code == 0) {
//                 res.data.forEach((item, index) => {
//                     $('main').append(`<div class="box">
//                    <div class="works">
//                        <div class="works_item front">
//                            <img src="${item.img}" alt="">
//                        </div>
//                        <div class="works_item back">
//                            <div class="back_conText">
//                                <p><a href="#">${item.name}</a></p>
//                                <p class="heng">————————</p>
//                                <p><a href="#" id="authorName">${item.author}</a></p>
//                                <p><a href="#">查看作品</a></p>
//                            </div>
//                        </div>
//                    </div>
//                </div>`)
//                 });
//             }
//         }
//     })
// })

class Works {
    constructor(url, box, type, return_data,return_data1, next_url) {//地址 大盒子 访问方式 临时缓存名 跳转地址
        this.url = url;
        this.box = $(box);
        this.type = type;
        this.re_data = return_data;//缓存名1
        this.re_data1=return_data1;////缓存名1
        this.next_url = next_url;
        this.box_len = 0;//盒子的长度
        this.login = false; //是否登录
        this.init();
    }
    //初始化
    init() {
        this.ajx();
    }
    //ajax请求
    ajx() {
        ; (function (o) {
            $.ajax({
                type: o.type,
                url: o.url,
                success(res) {
                    if (res.code == 0) {
                        o.box_len = res.data.length;  //获取数据的长度          
                        o.addBox(res);
                    }
                }
            })
        })(this)
    }
    //渲染盒子
    addBox(res) {
        let str = ''
        for (var i = 0; i < this.box_len; i++) {
            str += `<div class="box">
            <div class="works_ym">
                <div class="works_item front">
                    <img src="${res.data[i].img}" alt="">
                </div>
                <div class="works_item back">
                    <div class="back_conText">
                        <p><a href="#" class="titlee" data-idx=${i}>${res.data[i].name}</a></p>
                        <p class="heng">————————</p>
                        <p><a href="#" class="authorNext" data-idx=${i}>${res.data[i].author}</a></p>
                        <p><a href="#" class="see" data-idx=${i}>查看作品</a></p>
                    </div>
                </div>
            </div>
        </div>`
        }
        this.box.append(str);
        this.next_t(res);
        this.nick(res);
    }
    //跳转子页面
    next_t(res) {
        let ul = 'http://localhost:3000/';
        ; (function (o) {
            $('.see').click(function () {
                console.log(123);
                let idx = $(this).data('idx');//获取每个盒子的下标，根据data-idx属性
                sessionStorage.setItem(o.re_data, res.data[idx].author);//创建临时缓存  缓存名为 传入的参数 return_data （作者）
                sessionStorage.setItem(o.re_data1,res.data[idx].name)//标题
                sessionStorage.setItem('uer_id', idx);//传送id值
                sessionStorage.setItem('type','ym');//不同页面的传值(作品)
                location.href = ul + o.next_url;
            })
            $('.authorNext').on('click',function(){
                let idx = $(this).data('idx');
                sessionStorage.setItem(o.re_data, res.data[idx].author);
                sessionStorage.setItem('uer_id', idx);//传送id值
                location.href="index_personage.html"                
            })
            $('.titlee').on('click',function(){
                let idx = $(this).data('idx');
                sessionStorage.setItem(o.re_data, res.data[idx].author);
                sessionStorage.setItem('uer_id', idx);//传送id值
                location.href = ul + o.next_url; 
            })
        })(this)

    }
    nick(res) {//获取用户名判断用户是否登录
        console.log(res);
        
        if (!res.nickname) {
            $('.logbtn').html(`
            <a href="login.html">登录</a>
            <a href="reg.html">注册</a> 
            `)
        } else {//已经登录
            this.nickname = res.nickname;//获取用户名
            this.login =true;//登录状态
            $('#headImgOneSmall').html(`
            <img role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="headImg" src="${res.headImgSrc}" alt="">
					<span id="headImgName">${res.nickname}</span>
            `)
            $('#regHead').css('display', 'none')
        $('#loginHead').css('display', 'none')

       
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

}
new Works('works.php', 'main', 'get', 'name','title', 'works_sub.html')