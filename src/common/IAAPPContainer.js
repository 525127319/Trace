import jsBridge from "./bridging";
export default {


    bind: function (containerBindingConfig, bindObject) {

        for (var fName in containerBindingConfig) {
            jsBridge.registerHandler(fName, containerBindingConfig[fName].bind(bindObject));
        }


    },

    setTitle: function (title,config) {

        config.title = title;
        this.call("getTitleName",config);
   


    },





    call: function (fName, params, callback) {


        jsBridge.callHandler(
            fName,
            params,
            callback
        );



    }






}