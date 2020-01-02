//实景预览
var author_id = sessionStorage.getItem('uer_id')//获取上个页面的作者的id
console.log(author_id);
author_id++
function prveiew(author_id){
    $.ajax({
        type: 'get',
        url: 'yulan.php',
        data: { yulan_id: author_id },
        success(res) {
            console.log(res);
            let str = ''
            if (res.code == 0) {
                res.data.forEach((item, index) => {
                    str += `<div class="img"><img src="${item.img}"></div>`
                })
                $('.da').append(str);
            }
        }
    })
}
prveiew(author_id);

