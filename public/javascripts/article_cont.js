var id = sessionStorage.getItem('id')-1 //通过存储的id拿取数据
var name = sessionStorage.getItem('name')
var title = sessionStorage.getItem('title')

$(document).ready(function () {
    $.ajax({
        type: 'get',
        url: 'article_cont.php',
        success(res) {
            // console.log(res[0].article_str1);
            // console.log(res[0].see); 
            if (res.code == 0) {
                // console.log(res);                
                /*  res.forEach((index,item)=>{ */
                $('.title').append(
                    ` <h2>${res[id].article_title}</h2>
                        <div class="border">
                           <div class="author">
                               <div class="left">
                                       <img class='head-img' src="${res[id].head_img} " data-id=${res[id].article_id} data-name=${res[id].article_a_name} alt="" srcset="">
                                   <span class="artist">${res[id].article_a_name}</span>
                                   <img src="./images/article/audit2.png" alt="" srcset="" class="identify">
                                   <span>${res[id].date}</span>
                               </div>
                               <!-- 图标 -->
                               <div class="right">
                                   <div class="sns_box"><span>分享到：</span>
                                       <a href=""> <i class="iconfont wb">&#xe600;</i> </a>
                                       <a href=""> <i class="iconfont wx">&#xe7da;</i> </a>
                                       <a href=""> <i class="iconfont bird">&#xe65e;</i> </a>
                                       <a href=""> <i class="iconfont facebook">&#xe604;</i> </a>
                                       <a href=""> <i class="iconfont"></i> </a>
                                       <a href=""> <i class="iconfont ma">&#xe601;</i> </a>
                                   </div>
                               </div>
                           </div>
                        </div>`
                )

                $('.container').append(`
                    <div class='text'>
                    <img src="${res[id].article_imgsrc1}" alt="">
                    <p>${res[id].article_str1}</p>
                    <img src="${res[id].article_imgsrc2}" alt="">
                    <p> ${res[id].article_str2}</p>
                    <img src="${res[id].article_imgsrc3}" alt="">
                    <p> ${res[id].article_str3}</p>
                    </div>
                    </div>
                    `)
                $('.seeLeft').after(`
                    <span> ${res[id].see}</span>
                    `)

                /* 下面作品渲染 */
                $.ajax({
                    url: 'article_cont.php',
                    type: "get",
                    success(data) {
                        var text = '';
                        for (let val of data) {
                            text += `

                 <div id="article-img" data-id=${val.article_id}  >
                 <div class='imgbox'>
                 <div class="img-box">
                        <img class='img' src="${val.art_pic} " alt="" srcset="">
                </div>
                <div class="text-box">
                    <h3 class='art_title' >  ${val.article_title}</h3>
                    <p >
                    ${val.article_intro}[ <span class='read-blue'>阅读文章</span> ]
                    </p>

                 </div>
                 </div>
               <div class="praisese">
                   <div class="artist">
                       <span class="by_icon"></span>
                       <span class="name"> ${val.article_a_name}</span>
                   </div>
               </div> 
               </div>
            `
                        }
                        $('.more').append(text);
                    }
                })

            }
        }
    })
})
/* 下面点击跳转对应文章页面 */
// $('.more').on('click', '#article-img', function (e) {
//     if(e.target.className=='img'||'art_title'||'read-blue'){
//         console.log(e);
//     }

//     let Baseurl = 'http://localhost:3000/';
//     // sessionStorage.setItem ('imgId',)                      
//     // location.href = Baseurl + 'article_cont.html'  
// })

/* 跳转到作者个人页面*/
$('.title').on('click', '.head-img', function (e) {
    console.dir(e.target);
    let Baseurl = 'http://localhost:3000/';
    sessionStorage.setItem('name', e.target.dataset.name);
    sessionStorage.setItem('uer_id', e.target.dataset.id);
    location.href = Baseurl + 'index_personage.html'
})

// class Article_cont {
//     constructor(title, url, name, imgBox) {
//         this.title = title; //标题
//         this.url = url;
//         this.name = name; //姓名
//         this.imgBox = $(imgBox);
//         this.id=id;
//         this.init();
//     }
//     init() {
//         this.ajax()
//     }
//     /* ajax封装 */

//     ajax() {
//         ;
//         (function (obj) {
//             $.ajax({
//                 type: obj.type,
//                 url: obj.url,

//                 success(res) {
//                     if (res.code == 0) {
//                         obj.pic_len = res.data.length;
//                         obj.addPic(res);
//                     }
//                     // console.log(res, res.nickName)
//                     if (res.nickName != 'undefined') {
//                         $('.logbtn').css('display', 'none')
//                     } else {
//                         $('.logbtn').html(`
//                              <a href="login.html">登录</a>
//                              <a href="reg.html">注册</a>`)
//                     }
//                 }
//             })
//         })(this)
//     }

//     addPic(res) {
//         let str = ''
//         // console.log(res)
//         for (let i = 0; i < this.pic_len; i++) {
//             str += `
//             <div id="article-img" >
//                    <img class='img-box' src="${res.data[i].art_pic}" data-id='${res.data[i].article_id}' alt="" srcset="">
//                <div class="text-box">
//                    <h3 class='art_title' data-id=${res.data[i].article_id}>${res.data[i].article_title}</h3>
//                    <p >
//                        ${res.data[i].article_intro}[ <span class='read-blue' data-id=${res.data[i].article_id}>阅读文章</span> ]
//                    </p>
//                </div>
//                <div class="praisese">
//                    <div class="artist">
//                        <span class="by_icon"></span>
//                        <a class="name" data-id=${res.data[i].article_id} >${res.data[i].article_a_name}</a>
//                    </div>
//                    <div class="btn-zan">
//                        <span class="heart"></span>
//                        <span class="zanzan">赞一下</span>
//                    </div>
//                </div> 
//             </div>
//                `
//         }
//         this.imgBox.append(str);
//         this.her_person(res)
//     }

//     her_person(res){
//         $('.img-box').click(function(){//图片
//             let idx = $(this).data('id')
//             console.log(res.data)
//             sessionStorage.setItem('id', idx);//序号
//             sessionStorage.setItem('name', res.data[idx-1].article_a_name);//作者名字
//             sessionStorage.setItem('title', res.data[idx-1].article_title);//文章题目
//             location.href='article_cont.html';
//         })
//         $('.art_title').click(function(){//文章标题
//             let idx = $(this).data('id')
//             sessionStorage.setItem('id', idx);//序号
//             sessionStorage.setItem('name', res.data[idx-1].article_a_name);//作者名字
//             sessionStorage.setItem('title', res.data[idx-1].article_title);//文章题目
//             console.log(res.data[idx-1].article_a_name)
//             console.log(res.data[idx-1].article_title)
//             console.log(res.data[idx-1].article_id)

//             location.href='article_cont.html';
//         })
//         $('.read-blue').click(function(){//阅读文章
//             let idx = $(this).data('id')            
//             sessionStorage.setItem('id', idx);//序号
//             sessionStorage.setItem('name', res.data[idx-1].article_a_name);//作者名字
//             sessionStorage.setItem('title', res.data[idx-1].article_title);//文章题目
//             location.href='article_cont.html';
//         })
//         $('.btn-zan').click(function(){
//             console.log(111)
//             $(this).text('已赞')
//             $(this).css({
//                 'background':'#fff',
//                 'color':'rgb(226,66,51)'
//             })
//         })   
    
//     }
// }
// new Article('title', 'article_cont.php', 'name', '.more')