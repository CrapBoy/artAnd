
//渲染购物车
class Shop {
    constructor() {
        this.arr = [];
        this.sId;
        this.init();
    }
    init() {
        this.ajax()
    }
    ajax() {
        let _this = this;
        a(_this)

        function a(_this) {
            $.ajax({
                url: 'shopRender.jsp',
                type: 'get',

                success(res) {
                    $('#goodsNum').html(`${res.data.length}`)
                    let str = ''
                    if (res.nickname == undefined) {
                        $('.aaaa').append(`
                        <p class="logbtn">
                            <a href="login.html">登录</a>
                            <a href="reg.html">注册</a>
                        </p> 
                        `)
                    }else{
                        $('.aaaa').append(`
                        <div class="userSelf">  
                            <span>${res.nickname}</span>
                            <span>|&nbsp;退出登陆</span>
                        </div>
                            `)
                    }
                    res.data.forEach((item, inx) => {
                        var gPrice = item.g_price.split(('￥'))[1];
                        gPrice = gPrice.split(",")[0] + gPrice.split(",")[1];
                        str = $(` <div data-sId="${item.g_id}" class="mainCon content_shopping">
                        <span>
                            <input class="in inx${inx}" data-indx="${inx}" type="checkbox" id="oneCheck" name="chk1">
                        </span>
                        <span><img src="${item.g_imgsrc1}" alt=""></span>
                        <span>${item.g_name}</span>
                        <span class="unit_price${inx}" id="artPrice">${gPrice}元</span>
                        <span>
                            <i data-j="${inx}" id="jian">-</i>
                            <input class="inp${inx}" id="shopNum" type="text" value="1">
                            <i data-j="${inx}" id="jia">+</i>
                        </span>   
                        <span id="artSumPrice" class="to total_price${inx}">${gPrice}元</span>
                        <span><i class="del${inx}" id="delArt">×</i></span>
                    </div>`);
                        _this.arr.push(str)
                        $('.shopBox').append(str[0]);
                    });
                }
            })
        }
    }

}
new Shop()

var allPrice = []

function artPrice(i) {//获取单种作品的总价格
    let artP = parseInt($(`.unit_price${i}`).text())
    let artN = $(`.inp${i}`).val()
    $(`.total_price${i}`).text(`${artP * artN}.00元`);
}
function chooseGoods() {//获取被选中的checkbox的数量
    var allChkNum = $('input:checkbox[name=chk1]:checked').length;
    $('#chooseNum').html(`${allChkNum}`)
}


//选中商品总价格
function totalPrice() {
    var count = $('#countNum').text()
    count = parseInt(count)
    allPrice = $('input:checkbox[name=chk1]:checked')
    for (let n = 0; n < allPrice.length; n++) {
        let m = $(allPrice[n]).attr('class');
        m = m.split(' ')[1]
        m = m.split('inx')[1]
        let artPrice = $(`.total_price${m}`).text()
        artPrice = parseInt(artPrice)
        count += artPrice;
    }
    $('#countNum').text(count)
}


$('.shopBox').on('click', (e) => {//左右加减商品数量
    let j = $(e.target).attr('data-j')
    if (e.target.id == 'jia') {
        var a = $(`.inp${j}`).val()
        a++;
        $(`.inp${j}`).val(`${a}`)
        artPrice(j)
    } else if (e.target.id == 'jian') {
        var b = $(`.inp${j}`).val()
        if (b == 0) {
            b = 0
        } else {
            b--;
            $(`.inp${j}`).val(`${b}`)
            artPrice(j)
        }
    }
    $('#countNum').text(0)
    totalPrice()//商品被选中结算时，点击左右加减改变结算价格
})


setInterval(() => {//实时监听选中商品的数量
    chooseGoods();
}, 10);

$('#allCheck').on('click', (e) => {//全选反选
    if ($('#allCheck').prop('checked')) {
        $('input:checkbox[name=chk1]').prop('checked', true)
        $('#allSum').css({
            "backgroundColor": "rgb(255, 103, 0)",
            "color": "#fff"
        });
        $('#countNum').text(0)
        totalPrice()//点击全选时显示结算价格
    } else {
        $('input:checkbox[name=chk1]').prop('checked', false)
        $('#allSum').css({
            "backgroundColor": "rgb(224, 224, 224)",
            "color": "rgb(176, 176, 176)"
        });
        $('#countNum').text(0)
        totalPrice()//点击反选选时显示结算价格
    }
    chooseGoods();//点击全选反选时显示所选商品数量
})

$('.shopBox').on('click', (e) => {
    e.stopPropagation();
    let el = e.target
    let i = $(el).attr('data-indx')//拿到checkbox的data-indx值
    if ($(e.target).attr('class') == `in inx${i}`) {//点击checkbox
        chooseGoods();//单击选中显示选中商品数量
        artPrice(i);    //计算一行商品总价
        if ($('#allCheck').prop('checked')) {
            $('#allCheck').prop('checked', false)//全选的时候点击其他checkbox，则全选取消选中
            $('#allSum').css({
                "backgroundColor": "rgb(255, 103, 0)",
                "color": "#fff"
            });
        }
        if($('input:checkbox[name=chk1]:checked').length>=1){
            $('#allSum').css({
                "backgroundColor": "rgb(255, 103, 0)",
                "color": "#fff"
            });
        }else{
             $('#allSum').css({
            "backgroundColor": "rgb(224, 224, 224)",
            "color": "rgb(176, 176, 176)"
        });
        }
    }
})

//删除商品
del()
function del() {
    $('.shopBox').on('click', (e) => {
        if ($(e.target).attr('id') == 'delArt') {
            // console.log($(e.target).parent().parent().attr("data-sId"));
            // $(".mainCon").attr("data-sId") == g_id
            $.ajax({
                url: 'delArt.jsp',
                type: 'get',
                data: {
                    g_id: `${$(e.target).parent().parent().attr("data-sId")}`
                },
                success(res) {
                    if (res.code == 0) {
                        $.ajax({
                            url: 'shopRender.jsp',
                            type: 'get',
            
                            success(res) {
                                $('#goodsNum').html(`${res.data.length}`)
                            }
                            })
                       
                        $(e.target).parent().parent().remove()
                    }
                }
            })
        }
    })
}




// $('.aaaa').on('click',(e)=>{
//     if(e.target == ){}
// })
