export default {

      submit:function(context){

           alert("挖掘任务已经提交到大数据平台");
           return;



           //异步任务提交到服务
           this.$axiosHttp
           .axiosPost("ks-rinse/rinse/queryCustomerInfoProcess.api?async=true", context)
           .then(res => {
                  //提交结果回调
                  let { code, msg, data } = res;
                  switch(code){
                         case 200:
                         alert("挖掘任务已经提交到大数据平台");
                         break;
                         case 500:
                         break;
                  }


           })



      }




}