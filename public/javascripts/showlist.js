let type_val = document.querySelector("#type_value");
let name_val = document.querySelector('#name_val');
let key_val = document.querySelector('#key_val');
let searchBtn = document.querySelector('.KeyWordBtn');
let listBox = document.querySelector('#listBox');
let navPage = document.querySelector(".tcdPageCode");
let str1 = "";
let page_num = 1
let page_count = 24;
var Pagenumber = 0;



function getListpeo() {
    var xhr
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("MicroSoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            let data = JSON.parse(xhr.responseText);
            let str = "";
            if (data.code == 0) {
                data.data.forEach(element => {

                    str1 = `<div class="card mb-3 mt-3 ImgBox d-flex justify-content-between">
                    <img  class="lazy" src="images/loading.gif" data-echo="${element.g_imgsrc1} "
                        class="card-img-top" alt=""  data-id=${element.g_id} data-name=${element.g_name} data-author=${element.g_a_name}>
                    <div class="cardbody d-flex justify-content-between">
                        <div>
                            <p class="card-title"><a href="">${element.g_name}</a></p>
                            <p class="card-text">${element.g_price}</p>
                        </div>
                        <a href="#" class="loveBtn"><span class="taoxin"></span> <span>赞一下</span></a>
                    </div>
                </div>
                
                <div class="card mb-3 mt-3 ImgBox d-flex justify-content-between">
                    <img class="lazy" src="images/loading.gif" data-echo="${element.g_imgsrcone}"
                        class="card-img-top" alt="">
                    <div class="cardbody d-flex justify-content-between">
                        <div>
                            <p class="card-title"><a href="">${element.g_imgsrconen}</a></p>
                            <p class="card-text">${element.g_imgsrconep}</p>
                        </div>
                        <a href="#" class="loveBtn"><span class="taoxin"></span> <span>赞一下</span></a>
                    </div>
                </div>

                <div class="card mb-3 mt-3 ImgBox d-flex justify-content-between">
                    <img class="lazy" src="images/loading.gif" data-echo="${element.g_imgsrctwo}"
                        class="card-img-top" alt="">
                    <div class="cardbody d-flex justify-content-between">
                        <div>
                            <p class="card-title"><a href="">${element.g_imgsrctwon}</a></p>
                            <p class="card-text">${element.g_imgsrctwop}</p>
                        </div>
                        <a href="#" class="loveBtn"><span class="taoxin"></span> <span>赞一下</span></a>
                    </div>
                </div>

                <div class="card mb-3 mt-3 ImgBox d-flex justify-content-between">
                    <img class="lazy" src="images/loading.gif" data-echo="${element.g_imgsrcthree}"
                        class="card-img-top" alt="">
                    <div class="cardbody d-flex justify-content-between">
                        <div>
                            <p class="card-title"><a href="">${element.g_imgsrcthreen}</a></p>
                            <p class="card-text">${element.g_imgsrcthreep}</p>
                        </div>
                        <a href="#" class="loveBtn"><span class="taoxin"></span> <span>赞一下</span></a>
                    </div>
                </div>
                `

                    str += `
                    <div class="author">
                    <div>
                        <img src="${element.g_imgsrc4}" alt="">
                        <span><a href="">${element.g_a_name}</a></span>
                    </div>
                    <span><a href="">更多作品</a></span>
                </div>` +
                        str1 +
                        `<div class="lineer"></div>`
                });
                listBox.innerHTML = str;
            }

        }
    }
    let url = `getListpeo.jsp`;
    xhr.open('get', url);
    xhr.send(null);
}
getListpeo();

//搜索按钮
searchBtn.addEventListener("click", function () {
    getListFnclick();  
})


function getListFnclick(p) {
    var xhr
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("MicroSoft.XMLHTTP");
    }
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            let data = JSON.parse(xhr.responseText);
            // console.log(data)
            let str = "";
            if (data.code == 0) {
                // console.log(data)
                data.data.forEach(element => {
                    str += `<div class="card mb-3 mt-3 ImgBox d-flex justify-content-between" >
                        <img class="lazy" src="${element.g_imgsrc1}"
                            class="card-img-top" alt="" data-id=${element.g_id} data-name=${element.g_name} data-author=${element.g_a_name}>
                        <div class="cardbody d-flex justify-content-between">
                            <div>
                                <p class="card-title"><a href="">${element.g_name}</a></p>
                                <p class="card-text">${element.g_price}</p>
                            </div>
                            <a href="#" class="loveBtn"><span class="taoxin"></span> <span>赞一下</span></a>
                            <a href="#" class="authorname">${element.g_a_name}</a>
                        </div>
                    </div>`

                });
                listBox.innerHTML = str;
                console.log(p)
                // sessionStorage.setItem("result",data.result);
                var Pagenumber = Math.ceil(data.result / page_count);
                sessionStorage.setItem("result",Pagenumber)
                var page = new Page(Pagenumber,p,".tcdPageCode");

            }

        }
    }
    let url = `getListFnclick.jsp?typeval=${type_val.value}&nameval=${name_val.value}&keyval=${key_val.value}&page_num=${page_num}&page_count=${page_count}`;
    xhr.open('get', url);
    xhr.send(null);
}

// 回到顶部函数
navPage.addEventListener("click", function (e) {
    if (e.target.tagName == "BUTTON") {
        $("body,html").animate({
            scrollTop: 500
        }, 1000)
    }
})
//下方点击事件
navPage.addEventListener("click", function (e) {
  var Pagenumber =  sessionStorage.getItem("result")
    // console.dir(e.target.innerHTML)
    if (e.target.innerHTML == "上一页") {
        page_num--;
        getListFnclick(page_num);
        if (page_num < 1) {
            page_num = Pagenumber;
        }
    } else if (e.target.innerHTML == "下一页") {
        page_num++;
        getListFnclick(page_num);
        if (page_num > Pagenumber) {
            page_num = 1;
        }
    } else if (parseInt(e.target.innerHTML)) {
        page_num = parseInt(e.target.innerHTML);
        getListFnclick(page_num)
        $("body,html").animate({
            scrollTop: 500
        }, 1000)
    }
})


//获取的图片的id号,作品名称,作者
$(window).on("click", function (e) {
    
    if (e.target.className == "lazy") {
        
        let id=e.target.dataset.id -1;
        let name=e.target.dataset.name
        let author=e.target.dataset.author
        console.log(id,name,author)
        sessionStorage.setItem("uer_id",id);
        sessionStorage.setItem("title",name);
        sessionStorage.setItem("name",author);
        location.href="works_sub.html"
    }
})
