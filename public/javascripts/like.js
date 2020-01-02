


class like{
    constructor(user,author,box,bk,login){//用户名 作者名 盒子 是否改变背景 是否登录
        this.user =user;
        this.author = author;
        this.box = $(box);
        this.bk = bk;
        this.login = login;
        this.like_num = 1;//初始次数为1点赞
        this.ck = false;//判断是否重复点击
        this.judge = 0;//判断sql 语句的使用 1代表尚未点赞 0代表已有没被点赞
        this.init()
    }
    init(){
    
            this.like_click();//查询语句
			
        
  
       
    }
    like_click(){
        this.box.click(function(){
			console.log('来了')
            if(this.login){
                this.like_ajax_sel();//插入 更改
            }else{
                this.hint('请登录');//登录提示
            }
           
        }.bind(this))
    }
    like_ajax_sel(){//查询是否用户已经被赞

        ;(function(obj){
            $.ajax({
                type:'get',
                url:'like_sel.php',
                data:{
                    like_name :obj.user,
                    like_author:obj.author
                },
                success(res){
                    
                   
                    if(res.code == 0){
                        console.log(res);
                     obj.like_num = res.data[0].like_num;//获取到已经被点赞的次数 并且加一
                      obj.like_num++;
                      
                      
                        obj.like_ajax_insert(obj.judge,obj.like_num);//传递两个 为判断sql语句 即返回后台的点赞次数
                    }else{
                        console.log(res);
                    obj.judge =1;
                      
                    obj.like_ajax_insert(obj.judge,obj.like_num);  
                    }
                }
            })
        })(this)
       
    }
    like_ajax_insert(judge,like_num){//根据不同的查询结果 向后台传送 判断值 采用不同的sql语句

        ;(function(obj){
            $.ajax({
                type:'get',
                url:'like_add.php',
                data:{
                    like_name:obj.user,
                    like_author:obj.author,
                    like_judge:obj.judge,
                    like_num:obj.like_num
                },
                success(res){
                    console.log(res);
                    if(obj.bk){//改变背景
                        obj.box.css({
                            background:'#e24233'
                        })
                    }
                    obj.hint('点赞成功');
                    
                }
            })
        })(this)

    }
    hint(txt) {//登录提示
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

}

class sel_liks{//查询被赞的作者
    constructor(user,box){
        this.user = user;
        this.box = $(box)
        this.init()
    }
    init(){
       
        this.sel_click();
    }
    sel_click(){
        this.box.click(function(){
            //初始化点赞表
            $("#modal_likes").html(`
            <tr>
                            <td class="active text-center">被你点赞的作者</td>
            </tr>`
        );
            this.sel_liks_ajax();//请求ajax 获取点赞表
        }.bind(this))
       
    }

    sel_liks_ajax(){
        ;(function(obj){

            $.ajax({
                type:'get',
                url:'sel_liks.php',
                data:{
                    like_name:obj.user
                },
                success(res){
                     let str =''
                    console.log(res);
                    if(res.code == 0){
                        for(let i=0;i<res.data.length;i++){
                            str+=`  <tr>
                            <td class="active text-center text-success">${res.data[i].like_author}</td>
              
                          </tr>`
                          }
                        
                    }
                    $('#modal_likes').append(str);
                }
            })
        })(this)
    }
}
