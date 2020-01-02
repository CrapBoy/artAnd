var author = sessionStorage.getItem('name');
var author_id = sessionStorage.getItem('uer_id')
author_id++
console.log(author);
function add_name() {
 
    $('.ft_na').text(author)
}
add_name()
class person {
    constructor(url, type, author_name, box) {//地址 类型 作者id 容器盒子
        this.url = url;
        this.type = type;
        this.author_id = author_name;
        this.box =$(box);
        this.init()
    }

    init() {//初始化
        this.res_ajax();
        this.modal_au();
    }

    res_ajax() {//ajax请求

        
        ; (function (obj) {//改变this指向
            $.ajax({
                type: obj.type,
                url: obj.url,
                data: {
                    name: obj.author_id
                },
                success(res) {
                    let str ='';
                    let textsarr=[];
                    
                    
                     
                    console.log(res);
                    obj.nick(res);

                    if(res.code == 0){
                        let texts = res.data[0].a_introduction;
                        //添加头像和关注人数及作品数
                        $('.head_imgmin').attr('src',res.data[0].a_headimg);
                        $('.text_au').text(res.data[0].a_article_num)
                        $('.text_at').text(res.data[0].a_attention_num)
                        $('.addres').text(res.data[0].a_address)
                         textsarr = texts.split('，');//分割字符串进行排列
                         for(let i = 0;i<textsarr.length;i++){
                            str+=`
                            <p>${textsarr[i]}</P>
                            
                            `
                         }

                           

                

                        obj.box.append(str);


                    }else{
                        str=`<p class="KAITI text-center">这个人很懒什么都没留下</p>`;
                        obj.box.append(str)
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
        } else {
            this.nickname = res.nickname;//获取用户名


    

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
			this.likefn();//点赞功能
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

    like_table(){
        new sel_liks(this.nickname,'.likes_tabel')
    }
	likefn(){//点赞功能
	    new like( this.nickname,this.name,'.praise',false,this.login)
	}


}


new person('brief.php','get',author,'.text_brief');


$('#headImgOne').on('click', (e) => {
    if (e.target.id == 'destoryHead') {
      $.ajax({
        url: 'destory.do',
        type: 'get',
        success(res) {
  
        }
      })
    }
  })
  