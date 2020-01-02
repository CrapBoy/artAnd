var express = require('express');
var router = express.Router();
const db = require('./../utils/db.js')

const fs = require("fs");
const multer = require("multer");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

//所有数据
//所有数据
router.get('/getListFnclick.jsp', (req, res) => {
  let typeval = req.query.typeval;
  let nameval = req.query.nameval;
  let keyval = req.query.keyval;
  let page_num = req.query.page_num;
  let page_count = req.query.page_count;
  let arr = [];
  //查全表
  let sql = 'SELECT * FROM goods where 1=1 ';
  new Promise((resolve, reject) => {
    db.connection(sql, arr, (err, data) => {
      if (!err) {
        if (data.length != 0) {
          resolve(data.length);
        } else {
          res.json({
            code: 2,
            msg: "未找到数据"
          })
        }
      } else {
        reject(err)
      }
    })
  }).then(result => {
    if (typeval != 0) {
      sql += 'and g_type=? '
      arr.push(typeval);
    }
    if (nameval != "") {
      sql += 'and g_a_name like ? '
      arr.push('%' + nameval + '%');
    }
    if (keyval != "") {
      sql += 'and g_name like ?'
      arr.push('%' + keyval + '%');
    }
  
      sql += `limit ${(page_num-1)*page_count},${page_count}`
      db.connection(sql, arr, (err_i, data_i) => {
        if (!err_i) {
          if (data_i.length != 0) {
            if (typeval == 0 && nameval == "" && keyval == "") {
              res.json({
                code: 0,
                msg: "ok",
                result,
                data: data_i,
                // result
              })
            } else {
              res.json({
                code: 0,
                msg: "ok",
                data: data_i,
                result: data_i.length + 1
              })
            }
  
          } else {
            res.json({
              code: 4,
              msg: "未找到数据"
            })
          }
        } else {
          res.json({
            code: 3,
            msg: "查询失败"
          })
        }
      })
    }).catch(err => {
      res.json({
        code: 1,
        msg: "出错"
      })
    })
  })

//首页
router.get('/shouye.jsp', function (req, res, next) {
  let sql = 'SELECT a_name,a_img,a_article_num,a_attention_num FROM `author`'
  db.connection(sql, [], (err, data) => {
    if (!err) {
      res.json({
        code: 0,
        msg: 'ok',
        data, nickname: req.session.nickname,//向下个首页传送用户名
        headImgSrc: req.session.headImgSrc
      })
    } else {
      res.json(err)
    }
  })
})

// // 获取每人前四张
// router.get('/getListfour.jsp', (req, res) => {
//   //查全表
//   let sql = `SELECT * FROM goods group by g_a_name`;
//   let arr = [];
//   db.connection(sql, arr, (err, data) => {
//     if (!err) {
//       if (data.length != 0) {
//         //查询总条数'
//         res.json({
//           code: 0,
//           msg: 'ok',
//           data
//         })
//       } else {
//         res.json({
//           code: 2,
//           msg: "未找到数据"
//         })
//       }
//     } else {
//       res.json({
//         code: 1,
//         msg: "查询失败"
//       })
//     }
//   })
// })



// 获取每人
router.get('/getListpeo.jsp', (req, res) => {
  //查全表
  let sql = 'select * from goods group by g_a_name';
  let arr = [];
  db.connection(sql, arr, (err, data) => {
    if (!err) {
      if (data.length != 0) {
        //查询总条数
        res.json({
          code: 0,
          msg: 'ok',
          data,
          nickname: req.session.nickname
        })
      } else {
        res.json({
          code: 2,
          msg: "未找到数据"
        })
      }
    } else {
      res.json({
        code: 1,
        msg: "查询失败"
      })
    }
  })
})

//作品
router.get('/works.php', (req, res) => {
  var sql = 'select * from works';
  db.connection(sql, [], (err, data) => {
    if (!err) {
      res.json({ code: 0, msg: 'ok', data, nickname: req.session.nickname, headImgSrc: req.session.headImgSrc });
    } else {
      res.json({ code: 1, msg: '查询失败' });
    }
  })
})

//注册
router.post('/artuserReg.jsp', (req, res) => {
  let ArtUser = req.body.ArtUser;
  let pwd = req.body.pwd;
  let nickName = req.body.nickName;
  let headImgSrc = 'badf131ba7093071287f6f7cb351846b'
  var sql = 'INSERT INTO user (u_name,u_pwd,u_nickname,headImgSrc) VALUES(?,?,?,?)';
  db.connection(sql, [ArtUser, pwd, nickName,headImgSrc], (err, data) => {
    if (!err) {
      res.json({ code: 0, msg: 'ok', data });
    } else {
      res.json({ code: 1, msg: '查询失败' });
    }
  })
})
//登陆
router.get('/artuserLogin.jsp', (req, res) => {
  let userlogin = req.query.userlogin;
  let userpwd = req.query.userpwd;
  var sql = 'SELECT * FROM user WHERE u_name=? AND u_pwd=?';
  db.connection(sql, [userlogin, userpwd], (err, data) => {
    req.session.nickname = data[0].u_nickname;
    req.session.headImgSrc = data[0].headImgSrc;
    req.session.u_id = data[0].u_id;
    if (!err) {
      res.json({ code: 0, msg: 'ok', data });
    } else {
      res.json({ code: 1, msg: '查询失败' });
    }
  })
})
//关注请求
router.get('/attention.php', (req, res) => {
  let at_name = req.query.at_name;
  let at_author = req.query.at_author;
  let sql = ' INSERT INTO user_attention (at_name,at_author) VALUE (?,?) '
  db.connection(sql, [at_name, at_author], (err, data) => {
    if (!err) {
      res.json({ code: 0, msg: '关注成功', data, nickname: req.session.nickname })
    } else {
      res.json(err)
    }
  })
})
// 作者个人主页请求-wl
router.get('/person.php', (req, res) => {
  let goods_id = req.query.goods_id;
  let sql = `SELECT * FROM goods WHERE g_id=? `;
  db.connection(sql, [goods_id], (err, data) => {
    if (!err) {
      if (data.length >= 1) {
        res.json({ code: 0, msg: '成功', data ,nickname: req.session.nickname,headImgSrc: req.session.headImgSrc})
      }
    } else {
      res.json({ code: 1, msg: '失败' })
    }
  })
})

//作品详情
router.get('/works_sub.php', (req, res) => {
  let goods_id = req.query.goods_id;
  let sqlstr = 'select * from goods where g_id=?'
  db.connection(sqlstr, [goods_id], (err, data) => {
    if (!err) {
      if (data.length >= 1) {
        res.json({ code: 0, msg: '成功', data, nickname: req.session.nickname, headImgSrc: req.session.headImgSrc })
      } else {
        res.json({ code: 2, msg: '查无此人' })
      }
    } else {
      res.json({ code: 1, msg: '失败' })
    }
  })
})
//作品封面
router.get('/works_subbb.php', (req, res) => {
  let aut_id = req.query.aut_id;
  let aut_type = req.query.aut_type;
  console.log(aut_type);
  
  console.log(aut_id);
  let sqlstr;
  if (aut_type == 'ym') {
    sqlstr = 'select * from works where id=?'
  } else {
    sqlstr = 'select * from goods where g_id=?'
  }
  db.connection(sqlstr, [aut_id], (err, data) => {
    console.log(sqlstr);
    if (!err) {
      if (data.length > 0) {
        res.json({ code: 0, msg: '成功封面', data })
      }
    } else {
      res.json({ code: 1, msg: '失败' })
    }
  })
})

//加入购物车
router.post('/add.php', (req, res) => {
  let add_id = req.body.add_id;
  let u_id = req.session.u_id;
  let sql = 'insert into shopping(s_u_id,s_g_id) values(?,?)';
  db.connection(sql, [u_id, add_id], (err, data) => {
    if (!err) {
      res.json({ code: 0, msg: 'ok', data })
    } else {
      res.json({ code: 1, msg: '插入失败' })
    }
  })

})

//作品点赞-杨敏
router.get('/awesome.php', (req, res) => {
  let sql = 'select img from works'
  db.connection(sql, [], (err, data) => {
    if (!err) {
      res.json({ code: 0, msg: 'ok', data })
    }
    else {
      res.json(err);
    }
  })
})

//实景预览
router.get('/yulan.php',(req,res)=>{
  let yulan_id=req.query.yulan_id;
  let sql='select * from works where id=?'
  db.connection(sql,[yulan_id],(err,data)=>{
    if(!err){
      res.json({code:0,msg:'ok',data})
    }else{
      res.json(err);
    }
  })
})


//退出登陆
router.get('/destory.do', function (req, res) {
  req.session.destroy()
  res.redirect("/login.html")
})
// 作者个人文章请求
router.get('/person_artcle.php', (req, res) => {
  let atrcle_name = req.query.name;
  let sql = ` SELECT * FROM article WHERE article_a_name = ? `;
  db.connection(sql, [atrcle_name], (err, data) => {
    if (!err) {
      if (data.length != 0) {
        res.json({ code: 0, msg: '成功', data ,nickname: req.session.nickname})
      } else {
        res.json({ code: 2, msg: '没有文章' })
      }
    } else {
      res.json({ code: 1, msg: '失败' })
    }
  })
})

//个人介绍 说说 请求
router.get('/brief.php', (req, res) => {

  let atrcle_name = req.query.name;
   let sql =` SELECT *FROM author WHERE a_name=? `;
  db.connection(sql, [atrcle_name], (err, data) => {
    if (!err) {
      if (data.length != 0) {
        res.json({ code: 0, msg: '成功', data,nickname: req.session.nickname })
      } else {
        res.json({ code: 2, msg: '没有说说' })
      }
    } else {
      res.json({ code: 1, msg: '失败' })
    }
  })
})

//查询是否重复关注同一个人
//查询是否重复关注同一个人以及查看关注作者-wl
router.get('/exist.php',(req,res)=>{
  let at_name = req.query.at_name;
  let at_author = req.query.at_author; 
  if(at_author == undefined){//判断作者名是否需要查询 
    let sql = ' SELECT *FROM user_attention WHERE at_name = ?  '
    db.connection(sql, [at_name], (err, data) => {
      if (!err) {
       if(data.length>=0){
        res.json({ code: 0, msg: '成功',data})
       }else
       {
        res.json({code:1,msg:'失败'})
       }
      } else {
        res.json({code:2,msg:'后台错误'})
      }
    })
  }else{
    let sql = ' SELECT *FROM user_attention WHERE at_name = ? AND  at_author =?  '
    db.connection(sql, [at_name, at_author], (err, data) => {
      if (!err) {
       if(data.length>0){
        res.json({ code: 0, msg: '已经关注'})
       }else
       {
        res.json({code:1,msg:'可以关注'})
       }
      } else {
        res.json({code:2,msg:'后台错误'})
      }
    })
  }
  

})




//购物车
router.get('/shopRender.jsp', (req, res) => {
  let uid = req.session.u_id;
  let nickname = req.session.nickname;
  let sql = 'SELECT * FROM goods JOIN shopping on goods.g_id=shopping.s_g_id WHERE s_u_id=?'
  db.connection(sql, [uid], (err, data) => {
    if (!err) {
      console.log(data);
      
      if (data.length > 0) {
        console.log(666);
        
        res.json({ nickname: nickname, data, code: 0, msg: 'ok' })
      } else {
        res.json({ code: 1, msg: 'err' })
      }
    } else {
      res.json({ code: 2, msg: 'err' })
    }
  })

})

//删除购物车商品delArt
router.get('/delArt.jsp', (req, res) => {
  let g_id = req.query.g_id
  let u_id = req.session.u_id
  let sql = 'DELETE FROM `shopping` WHERE `s_g_id`=? AND `s_u_id`=?'
  db.connection(sql, [g_id,u_id], (err, data) => {
    if (!err) {
      res.json({ code: 0, msg: 'ok' })
    } else {
      res.json({ code: 1, msg: 'err' })
    }
  })

})

/// 点赞请求 --王浪 
router.get('/like_sel.php',(req,res)=>{//查询该用户是否已经被点击
  let user = req.query.like_name;
  let author = req.query.like_author
  let sql = ` SELECT * FROM likes WHERE like_name = ? AND like_author = ?`

  db.connection(sql, [user,author], (err, data) => {
    if (!err) {
     if(data.length>0){
      res.json({ code: 0, msg: '已经有一次点赞',data})
     }else
     {
      res.json({code:1,msg:'尚未点赞',data})
     }
    } else {
      res.json({code:2,msg:'后台错误'})
    }
  })


})

router.get('/like_add.php',(req,res)=>{//在已有的基础上 整加上传数--王浪
  let user = req.query.like_name;
  let author = req.query.like_author;
  let judge = req.query.like_judge;//用于判断sql语句的使用 看用户点赞的对象是否再次被点击同一个作者的作品
  let num =req.query.like_num;
  console.log(num);
  
  let sql ='';
  if(judge==1){
  sql = `INSERT INTO likes (like_num,like_name,like_author) VALUE (?,?,?)`
  }else if(judge == 0){
 
    sql = `UPDATE likes SET like_num=? WHERE like_name =? AND like_author =? `
  }
  db.connection(sql, [num,user,author], (err, data) => {
    if (!err) {
 
      res.json({ code: 0, msg: '点赞成功'})
   
     
    } else {
      res.json({code:2,msg:'后台错误'})
    }
  })

})

router.get('/sel_liks.php',(req,res)=>{//查询该用户是否已经被点击
  let user = req.query.like_name;
  
  let sql = ` SELECT * FROM likes WHERE like_name = ? `

  db.connection(sql, [user], (err, data) => {
    if (!err) {
     if(data.length>0){
      res.json({ code: 0, msg: '查询点赞成功',data})
     }else
     {
      res.json({code:1,msg:'尚未点赞',data})
     }
    } else {
      res.json({ code: 2, msg: '后台错误' })
    }
  })


})
/* 文章内容 */
// router.get('/article.php', (req, res) => {
//   var sql = 'select * from article';
//   console.log(req.session.nickname);
  
//   db.connection(sql, [], (err, data) => {
//     if (!err) {
//       res.json({
//         code: 0,
//         msg: 'ok',
//         data,
//         nickName:`${req.session.nickname}`,
//         headImgSrc:`${req.session.headImgSrc}`
//     })   
//     }else{
//       res.json({
//         code:1,
//         msg:'失败',
//         data
//       })
//     }
//   })
// });



//头像渲染
router.get('/headimg.php',(req,res)=>{
  // let head_id=req.query.head_id;
  let sql='select a_img from author';
  db.connection(sql,[],(err,data)=>{
    if(!err){
      res.json({code:0,msg:'ok',data})
    }else{
      res.json(err);
    }
  })
})



//头像上传及更换
const upload = multer({//告诉Multer将上传文件保存在哪里
  dest: "E:/知了堂/平时作业/三阶段考核项目/artAnd/public/images/头像/"
});
const single = upload.single("myfiles");//保存到req.file里面
router.get("/images/头像/:imgname", function (req, res) {//拦截/img/***
  //读取文件req.params.imgname拿到/img/:imgname
  const rs = fs.createReadStream("E:/知了堂/平时作业/三阶段考核项目/artAnd/public/images/头像/" + req.params.imgname);
  rs.pipe(res);//rs导出到res
});

router.post("/upFile", single, function (req, res) {//拦截ajax
  let sql = ' UPDATE user SET headImgSrc=? WHERE u_nickname=? ';
  let nickname =req.session.nickname;
  db.connection(sql, [req.file.filename,nickname], (err, data) => {
  if (!err) {
    res.json({
      code: 0,
      msg: 'ok',
      data,
      files:req.file,
      nickname:`${nickname}`
    })
  } else {
    res.json(err)
  }
})
  // res.send()
});




/* 下面作者文章 */
// router.get('/article_cont.php',(req,res)=>{
//   var sql = 'select * from article';
//   db.connection(sql, [], (err, data) => {
//     if (err) {
//       console.log(err);
//     }
//     res.send(data)
//   })
// })

//作品详情子界面
router.get('/works_sub_son.php',(req,res)=>{
  let son_id=+req.query.son_id +1;
  let sql='select * from goods where g_id=?'
  db.connection(sql,[son_id],(err,data)=>{
    if(!err){
      res.json({code:0,msg:'ok',data})
    }else{
      res.json(err);
    }
  })
})



/* 文章内容 */
router.get('/article.php', (req, res) => {
  var sql = 'select * from article';
  // console.log(req.session.nickname);
  db.connection(sql, [], (err, data) => {
    if (!err) {
      res.json({
        code: 0,
        msg: 'ok',
        data,
        nickName:`${req.session.nickname}`,
        headImgSrc:`${req.session.headImgSrc}`
    })   
    }else{
      res.json({
        code:1,
        msg:'失败',
        data
      })
    }
  })
});
/* 下面作者文章 */
router.get('/article_cont.php',(req,res)=>{
  var sql = 'select * from article ';
  db.connection(sql, [], (err, data) => {
    if(!err){
      res.json({code:0,msg:'ok',data})
    }else{
      res.json(err);
    }
  })
})


module.exports = router;
