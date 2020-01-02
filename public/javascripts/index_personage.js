var author = sessionStorage.getItem('name');
var author_id = sessionStorage.getItem('uer_id')
author_id++


function add_name() {
    $('.h_name').find('h2').text(author);
    $('.ft_na').text(author)
}
add_name();

class person {
    constructor(url, type, author_id, box,name) {//地址 类型 作者id 容器盒子  作者名
        this.url = url;
        this.type = type;
        this.name =name;
        this.author_id = author_id;
        this.nickname = '';
        this.box = $(box);
        this.login = false; //是否登录
        this.init()
    }

    init() {//初始化
        this.res_ajax();
        this.modal_au();
        this.res_hedimg();
    }

    res_hedimg() {//ajax请求

        
        ; (function (obj) {//改变this指向
            $.ajax({
                type: obj.type,
                url: 'brief.php',
                data: {
                    name: obj.name
                },
                success(res) {
                    let str ='';
                    let textsarr=[];
                    
                    
                     
                    // console.log(res);
                    // obj.nick(res);

                    if(res.code == 0){
                        
                        //添加头像和关注人数及作品数
                        $('.head_imgmin').attr('src',res.data[0].a_headimg);
                        $('.text_au').text(res.data[0].a_article_num)
                        $('.text_at').text(res.data[0].a_attention_num)
                        $('.addres').text(res.data[0].a_address)
                        
                    }
                }

            })
        })(this)

        //this.addbox(res)

    }

    res_ajax() {//ajax请求


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
                    //侧边栏 登录信息显示
                    




                    if (res.code == 0) {
                        imgsarr.push(res.data[0].g_imgsrc1);
                        imgsarr.push(res.data[0].g_imgsrc2);
                        imgsarr.push(res.data[0].g_imgsrc3);
                        imgsarr.forEach((item, index) => {

                            str += `
                            <div class="works_imgs">
								<img class="imgs_works" src=${item} >
								<div class="imgs_ft">
									<div class="praise_all">
										<div class="btn01">${res.data[0].g_type}</div>
										<div class=" praise">❤ 点赞一下</div>
									</div>
									<div class="author_name">
										${res.data[0].g_price}
									</div>
								</div>
							</div>
                            `

                        })

                        obj.box.append(str);

                   obj.nick(res);//用户名获取判断等
					obj.works_herf(res);//下个界面跳转 封面
                    }
                }

            })
        })(this)

        //this.addbox(res)

    }
    nick(res) {//获取用户名判断用户是否登录
        console.log(res);
        
        if (!res.nickname) {
            $('.login').html(`
            <div class ="login_lg"><a href="login.html">登录</a>
            </div>
            <div class ="register">
			<a href="reg.html">注册</a> 
			</div>
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
			$('#headImgOne').append(`
			  <li data-toggle="modal" data-target=".bs-example-modal-sm" class="likes_tabel">
						<a href="#"><i class="fa fa-fw fa-folder"></i>已点赞</a>
					</li>
					<li>
						<a id="destoryHead" href="#"><i class="fa fa-fw fa-file-o"></i>退出登录</a>
					</li>
			  `)
			
			
        }
       

      
         this.likefn()//点赞函数 
         this.like_table()//获取点赞表
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
    likefn(){//点赞功能
        new like( this.nickname,this.name,'.praise',false,this.login)
    }
    like_table(){//查询点赞功能
        new sel_liks(this.nickname,'.likes_tabel')
    }
	works_herf(res){
		$('.imgs_works').click(function(){
			console.log(res);
			sessionStorage.setItem('uer_id',res.data[0].g_id-1);
			sessionStorage.setItem('name',res.data[0].g_a_name);
            sessionStorage.setItem('title',res.data[0].g_name);
            sessionStorage.setItem('type','wl');
			location.href='works_sub.html';
		}.bind(this))
	}





}


new person('person.php', 'get', author_id, '.works_img_all',author);


$('#headImgOne').on('click', (e) => {//退出
    if (e.target.id == 'destoryHead') {
        $.ajax({
            url: 'destory.do',
            type: 'get',
            success(res) {

            }
        })
    }
})