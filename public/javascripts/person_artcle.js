var author = sessionStorage.getItem('name');
var author_id = sessionStorage.getItem('uer_id')
author_id++
console.log(author);

function add_name() {
	$('.h_name').find('h2').text(author);
	$('.ft_na').text(author)
}
add_name()
class person {
	constructor(url, type, author_name, box) { //地址 类型 作者id 容器盒子 作者名
		this.url = url;
		this.type = type;
		this.author_id = author_name;
		this.nickname = '';
		this.box = $(box);
		this.init()
	}

	init() { //初始化
		this.res_ajax();
		this.modal_au();
		this.res_hedimg();
	}

	res_hedimg() { //ajax请求


		;
		(function(obj) { //改变this指向
			$.ajax({
				type: obj.type,
				url: 'brief.php',
				data: {
					name: obj.author_id
				},
				success(res) {
					let str = '';
					let textsarr = [];






					if (res.code == 0) {

						//添加头像和关注人数及作品数
						$('.head_imgmin').attr('src', res.data[0].a_headimg);
						$('.text_au').text(res.data[0].a_article_num)
						$('.text_at').text(res.data[0].a_attention_num)
						$('.addres').text(res.data[0].a_address)

					}
				}

			})
		})(this)

		//this.addbox(res)

	}

	res_ajax() { //ajax请求


		;
		(function(obj) { //改变this指向
			$.ajax({
				type: obj.type,
				url: obj.url,
				data: {
					name: obj.author_id
				},
				success(res) {
					let str = '';
					let imgsarr = [];
					console.log(res);
					
					if (res.code == 0) {

						for (let i = 0; i < res.data.length; i++) {
							str +=
								`
                            <div class="works_imgs">
								<img  class="img_work" src="https://pics.yingworks.com/FWI_Fu9fA-jCEq55U_ECK4SXx3hUXMGe_01134443.jpg!c600" >
								<div class="imgs_ft">
                              
                                    <div class="text_headline">
                                   ${res.data[0].article_title}
                                    </div>
                            
                                    <div class="text_cont">
                                       ${res.data[0].article_str2}
                                        <span>[阅读文章]</span>
                                    </div>
                                    
									<div class="praise_all">
										<div class="btn01">作品展示</div>
										<div class=" praise">❤ 点赞一下</div>
									</div>
									
								</div>
							</div>
                            
                            `
						}





						obj.box.append(str);
						

					} else { //在没有获取到数据时渲染上去为 以下固定值
						str = `<p class="KAITI text-center">这个人很懒什么都没留下</p>`;
						obj.box.append(str)
					}
					
					obj.nick(res);
				}

			})
		})(this)

		//this.addbox(res)
		
	}
	nick(res) { //获取用户名判断用户是否登录
		console.log(res);

		if (!res.nickname) {
			$('.login').html(`
			<div class ="login_lg">
			<a href="login.html">登录</a>
			</div>
			<div class ="register">
			<a href="reg.html">注册</a> 
			</div>
			`)
		} else {
			this.nickname = res.nickname; //获取用户名

			$('#headImgOneSmall').html(
				`
            <img role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="headImg" src="${res.headImgSrc}" alt="">
					<span id="headImgName">${res.nickname}</span>
            `
			)
			$('#regHead').css('display', 'none')
			$('#loginHead').css('display', 'none')

			$('#headImgOne').append(
				`
			  <li data-toggle="modal" data-target=".bs-example-modal-sm" class="likes_tabel">
						<a href="#"><i class="fa fa-fw fa-folder"></i>已点赞</a>
					</li>
					<li>
						<a id="destoryHead" href="#"><i class="fa fa-fw fa-file-o"></i>退出登录</a>
					</li>
			  `
			)

		}
		this.likefn();//点赞功能
		this.like_table() //获取点赞表


	}
	modal_au() {
		$('#att').click(function() {
			//初始化关注弹框
			$('#modal_au').html(
				`
          <tr>
                                <td class="active text-center">作者</td>
                </tr>`
			);
			let nickname_you = this.nickname; //在构造函数中获取用户名
			console.log(nickname_you);

			if (nickname_you == '') { //判断是否定登录
				$('#modal_au').html(
					`
            <tr>
                                <td class="active text-center">请登录</td>
    
                            </tr>
                        
            `
				)
			} else { //确认登录后发起ajax请求，请求关注表
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
								str +=
									`  <tr>
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
	likefn() { //点赞功能
		new like(this.nickname, this.name, '.praise', false, this.login)
	}

	like_table() {
		new sel_liks(this.nickname, '.likes_tabel')
	}


}


new person('person_artcle.php', 'get', author, '.works_img_all');




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
