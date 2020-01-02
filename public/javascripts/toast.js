;(function(){
    var glabol=function(){
        return this;
    }()
    function Toast(Id,txt,time,callBack){
        var obj=arguments;
        if(obj[0] instanceof Object){
            this.show=document.querySelector(obj[0].Id);
            this.txt=obj[0].txt;
            this.time=typeof obj[0].time == 'number' ?  obj[0].time:1000;
            this.callBack=typeof obj[0].time == 'function' ? obj[0].time:typeof obj[0].callBack == 'function' ? obj[0].callBack:function(){};
            this.init();
        }else{
            var [Id,txt,time,callBack] = [...arguments];
            this.show=document.querySelector(Id);
            this.txt=txt;
            this.time=typeof time == 'number' ?  time:1000;
            this.callBack=typeof time == 'function' ? time:typeof callBack == 'function' ? callBack:function(){};
            this.init();
        }
    }
    
    Toast.prototype.init=function(){
        this.show.style.display='block';
        this.show.innerHTML=this.txt;
        setTimeout(()=>{
            this.show.style.display='none';
            this.callBack();
        },this.time);
    }
    // window.Toast=Toast
    !('Toast' in glabol) && (glabol.Toast=function(){
        return new Toast(...arguments);
    });
}())