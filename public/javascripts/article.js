/* 点击返回 顶部*/
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            $('#return_top').fadeIn()
        } else {
            $('#return_top').fadeOut()
        }
    })
    $('#return_top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 1000);
        return false;
    })
});

// $.ajax({
//     url: 'article.php',
//     type: 'get',
//     success: (data) => {
//         var text = '';
//         for (let val of data) {
//             text += `
//             <div id="article-img">
//         <div class="img-box">
//             <a href=""  title=" ">
//                 <img src="${val.art_pic}" alt="" srcset="">
//             </a>
//         </div>
//         <div class="text-box">
//             <h3><a href="">${val.article_title}</a></h3>
//             <p>
//                 ${val.article_intro}[ <a href="" class='read-blue'>阅读文章</a> ]
//             </p>
//         </div>
//         <div class="praisese">
//             <div class="artist">
//                 <span class="by_icon"></span>
//                 <a href="" class="name">${val.article_a_name}</a>
//             </div>
//             <div href="" class="btn-zan">
//                 <span class="heart"></span>
//                 <span class="zanzan">赞一下</span>
//             </div>
//         </div> 
//         </div>
//         `
//         }
//         console.log(data);
//         $('#content').append(text);
//         $('.praisese').find('.btn-zan').click(function () {
//             console.log(111)
//             $(this).toggleClass('btn-zan-clicked')
//         })

//         // 跳转到新页面
//         // window.location.href='article_cont.html'
//     }
// })


// 点击小旗子侧边图标展开
$(document).ready(function () {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;
    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {
        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
});

/* 渲染文章，存储传入下一个页面 */
class Article {
    constructor(title, url, name, imgBox) {
        this.title = title; //标题
        this.url = url;
        this.name = name; //姓名
        this.imgBox = $(imgBox);
        this.init();
    }
    init() {
        this.ajax()
    }
    /* ajax封装 */

    ajax() {
        ;
        (function (obj) {
            $.ajax({
                type: obj.type,
                url: obj.url,
                success(res) {
                    if (res.code == 0) {
                        obj.pic_len = res.data.length;
                        obj.addPic(res);
                    }
                    // console.log(res, res.nickName)
                    if (res.nickName != 'undefined') {
                        $('.logbtn').css('display', 'none')
                    } else {
                        $('.logbtn').html(`
                             <a href="login.html">登录</a>
                             <a href="reg.html">注册</a>`)
                    }
                }
            })
        })(this)
    }

    addPic(res) {
        let str = ''
        // console.log(res)
        for (let i = 0; i < this.pic_len; i++) {
            str += `
            <div id="article-img" >
                   <img class='img-box' src="${res.data[i].art_pic}" data-id='${res.data[i].article_id}' alt="" srcset="">
               <div class="text-box">
                   <h3 class='art_title' data-id=${res.data[i].article_id}>${res.data[i].article_title}</h3>
                   <p >
                       ${res.data[i].article_intro}[ <span class='read-blue' data-id=${res.data[i].article_id}>阅读文章</span> ]
                   </p>
               </div>
               <div class="praisese">
                   <div class="artist">
                       <span class="by_icon"></span>
                       <a class="name" data-id=${res.data[i].article_id} >${res.data[i].article_a_name}</a>
                   </div>
                   <div class="btn-zan">
                       <span class="heart"></span>
                       <span class="zanzan">赞一下</span>
                   </div>
               </div> 
            </div>
               `
        }
        this.imgBox.append(str);
        this.her_person(res)
    }

    her_person(res){
        $('.img-box').click(function(){//图片
            let idx = $(this).data('id')
            console.log(res.data)
            sessionStorage.setItem('id', idx);//序号
            sessionStorage.setItem('name', res.data[idx-1].article_a_name);//作者名字
            sessionStorage.setItem('title', res.data[idx-1].article_title);//文章题目
            location.href='article_cont.html';
        })
        $('.art_title').click(function(){//文章标题
            let idx = $(this).data('id')
            sessionStorage.setItem('id', idx);//序号
            sessionStorage.setItem('name', res.data[idx-1].article_a_name);//作者名字
            sessionStorage.setItem('title', res.data[idx-1].article_title);//文章题目
            // console.log(res.data[idx-1].article_a_name)
            // console.log(res.data[idx-1].article_title)
            // console.log(res.data[idx-1].article_id)
            location.href='article_cont.html';
        })
        $('.read-blue').click(function(){//阅读文章
            let idx = $(this).data('id')            
            sessionStorage.setItem('id', idx);//序号
            sessionStorage.setItem('name', res.data[idx-1].article_a_name);//作者名字
            sessionStorage.setItem('title', res.data[idx-1].article_title);//文章题目
            location.href='article_cont.html';
        })
        $('.btn-zan').click(function(){
            console.log(111)
            $(this).text('已赞')
            $(this).css({
                'background':'#fff',
                'color':'rgb(226,66,51)'
            })
        })   
        
        
    }
}
new Article('title', 'article.php', 'name', '#content')

/* 跳转下一个页面 */
// $(window).on('click', function (e) {
//     // console.log();
//     if (e.target.className == 'img') {
//         console.dir(e.target.dataset.id);
//         sessionStorage.setItem('imgId', e.target.dataset.id);
//     }
//     location.href = 'article_cont.html'
// })

// $('#content').on('click', '#article-img', function (e) {
//     if (e.target.className == 'img') {
//         sessionStorage.setItem('imgId', e.target.dataset.id);
//     } else if (e.target.className == 'art_title') {
//         sessionStorage.setItem('imgId', e.target.dataset.id);
//     } else if (e.target.className == 'read-blue') {}
//     location.href =  'article_cont.html'
// })

/* 存储作家的名字信息 */
$('#content').on('click', '#article-img', function (e) {
    if (e.target.className == 'name') {
        // console.log(e.target.text);
        sessionStorage.setItem('name', e.target.text)
        sessionStorage.setItem('uer_id', e.target.dataset.id)
        location.href = 'index_personage.html'
    }
})
