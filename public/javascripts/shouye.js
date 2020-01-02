// $(window).ready(()=>{
//     $.ajax({
//         url:"shouye.jsp",
//         type:"get",
//         success(res){   
//             console.log(res);

//            res.data.forEach((item,index) => {
//             $('.main').append(`<div class="show">
//             <img src="${item.a_img}" alt="">
//             <p class="ArtName">
//                 <a href="" id="name">${item.a_name}</a>
//                 <span id="att">+关注</span>
//             </p>
//             <p id="artNum">${item.a_article_num}</p>
//             <p id="attNum">被${item.a_attention_num}</p>
//         </div>`)
//            });
//         }
//     })
// })


function hint(txt){//提示登录
  $('.hint').text(txt);
  $('.hint').css({
    
    visibility:'visible'
  })
  setTimeout(()=>{
    $('.hint').css({
    
      visibility:'hidden'
    })
  },500)
 
}


class show {
  constructor(url, box, type, return_data, next_url) {//地址 大盒子 访问方式 临时缓存名 跳转地址
    this.url = url;
    this.box = $(box);
    this.type = type;
    this.re_data = return_data;//缓存名
    this.next_url = next_url;
    this.box_len = 0;//盒子的长度
    this.init();
  }
  init() {//初始化
    this.ajx();
    this.modal_au();
  }
  ajx() {//ajax请求
    ; (function (o) {
      $.ajax({
        type: o.type,
        url: o.url,
        success(res) {
          if (!res.nickname) {
            $('.logbtn').html(`
            <a href="login.html">登录</a>
            <a href="reg.html">注册</a> 
            `)
            
          } else {
            o.nickname = res.nickname;//获取用户名         
            $('#headImgOneSmall').html(`
            <img src="./images/头像/${res.headImgSrc}" role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="headImg" alt="">
					  <span id="headImgName">${res.nickname}</span>
            `)
			$('#regHead').css('display', 'none')
			$('#loginHead').css('display', 'none')
			$('#headImgOne').append(`
			<li data-toggle="modal" data-target=".bs-example-modal-sm" class="likes_tabel">
								<a href="#"><i class="fa fa-fw fa-folder"></i>已点赞</a>
							</li>
							<li>
								<a id="destoryHead" href="destory.do"><i class="fa fa-fw fa-file-o"></i>退出登录</a>
							</li>
			`)
         
    
    
    
$('.main').on('click',(e)=>{
  if($(e.target).attr('class') == 'att'){
    let i = parseInt($(e.target).attr('data-idx'));

    let x = parseInt($(`.attt${i}`).text().split('被')[1]);
 
    x++;
    $(`.attt${i}`).text(`被${x}位圈内人关注`)
  }
})
    
  
    }

          o.like_table();//点赞表的获取

          if (res.code == 0) {
            o.box_len = res.data.length;  //获取数据的长度          
            o.add(res);
          }
        }
      })
    })(this)
  }
  add(res) {//增加盒子
    let str = '';
    for (let i = 0; i < this.box_len; i++) {//被创建的盒子  可以根据实际 改变盒子的结构
      str += `
           <div class="show">
            <img class="imgs" data-idx=${i} src="${res.data[i].a_img}" alt="">
            <p class="ArtName">
                <a href="" id="name">${res.data[i].a_name}</a>
                <span class="att" data-idx=${i} >+关注</span>
            </p>
            <p id="artNum">${res.data[i].a_article_num}</p>
            <p class="attt${i}" id="attNum">${res.data[i].a_attention_num}</p>
        </div>
        `
    }
    this.box.append(str);
    this.next_t(res);
    this.attention(res);///关注函数  接受参数res
  }
  next_t(res) {
    let ul = 'http://localhost:3000/';
    ; (function (o) {
      $('.imgs').click(function () {
        let idx = $(this).data('idx');//获取每个盒子的下标，根据data-idx属性        
        sessionStorage.setItem(o.re_data, res.data[idx].a_name);//创建临时缓存  缓存名为 传入的参数 return_data 
        sessionStorage.setItem('uer_id', idx);//传送id值
        location.href = ul + o.next_url;
      })
    })(this)
  }
  attention(res) {//关注请求 传入参数res 根据下标找出你点击的对象为谁，在根据idx 下标值找出res对象中的作者名 
  
    ;(function(obj){
         $('.att').click(function () {//关注点击          
           let idx = $(this).data('idx');//获取每个盒子的下标     
           
           if(!res.nickname){ // if 用户未登录时不能 进行关注 判断值用户是否存在
             hint('请登录');//登录提示函数
           }else{
             
             $.ajax({
               type:'get',
               url:'exist.php',
               data:{
                 at_name: res.nickname,//shouye.php中获取的登录用户名
                 at_author: res.data[idx].a_name
               },
               success(res01){
                 if(res01.code==0){//根据后台返回的数据 res01.code值进行判断 为0时为已经关注无法调用 关注ajax请求
                   hint('已关注');
                 }else{
                   
                   obj.attention_ajax(idx,res);//接受点击盒子下标 以及首页页面返回的res 对象
                 }
     
               }
             })
           }
         })
       })(this)
  }
  
  attention_ajax(idx,res){//关注请求ajax
   
      $.ajax({//找到idx 后 发起ajax请求 
        type: 'get',
        url: 'attention.php',
   
        data: {
          at_name: res.nickname,//shouye.php中获取的登录用户名
          at_author: res.data[idx].a_name
        },
        success(res) {
          if(res.code ==0){
            hint('关注成功')
          }
        }
      })
    }

  modal_au(){
    $('#att').click(function(){
     //初始化关注弹框
      $('#modal_au').html(`
      <tr>
							<td class="active text-center">作者</td>
            </tr>`
            ); 
      let nickname_you = this.nickname;//在构造函数中获取用户名
      console.log(nickname_you );
      
      if(nickname_you == ''){//判断是否定登录
        $('#modal_au').html(`
        <tr>
							<td class="active text-center">请登录</td>

						</tr>
					
        `)
      }else{//确认登录后发起ajax请求，请求关注表
        $.ajax({
          type:'get',
          url:'exist.php',
          data:{
            at_name: nickname_you
          },
          success(res){
            let str = ''
            console.log(res);
            if(res.code == 0){
              for(let i=0;i<res.data.length;i++){
                str+=`  <tr>
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
    new sel_liks(this.nickname,'.likes_tabel')//用户名 点击的盒子
}

    

}
new show('shouye.jsp', '.main', 'get', 'name', 'index_personage.html')//url 外部盒子 方式get/post   给子子表返回的数据 跳转的页面


//退出登录
$('#headImgOne').on('click', (e) => {

 
  if ($(e.target).attr('id') == 'destoryHead') {
    
    $('#destoryHead').css("display","none")
    $('#gooded').css("display","none")
  $('#regHead').css('display', 'block')
  $('#loginHead').css('display', 'block')

  
  }
})

//图片上传
$('#upBtn').on('click', () => {
  const files = $('#in')[0].files[0];
  const formdata = new FormData();
  formdata.append("myfiles", files);//用formdata收集表单数据
  $.ajax({
    url: "upFile",
    type: "post",
    data: formdata,
    processData: false,
    contentType: false,
    success: function (data) {
      $('#headImgOneSmall').html(`
        <img src="/images/头像/${data.files.filename}" role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="headImg" alt="">
				<span id="headImgName">${data.nickname}</span>
      `)
    }
  })
})

if(location.pathname=='/index.html'){
  $('.nav01 a').eq(0).css('color','#C1463E')
}else if(location.pathname=='/plaza.html'){
  $('.nav01 a').eq(1).css('color','#C1463E')
}else if(location.pathname=='/works.html'){
  $('.nav01 a').eq(2).css('color','#C1463E')
}else if(location.pathname=='/article.html'){
  $('.nav01 a').eq(3).css('color','#C1463E')
}

