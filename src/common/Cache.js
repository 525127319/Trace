export default {


    create: function (name) {

        var namedCacheDatas = sessionStorage.getItem(name);
        var __cacheObj = {

            datas: {},

            put: function (key, value) {

                this.datas[key] = value;

                return this;


            },



            putAll: function (map) {

             

               return this;


            },

            get: function (key) {

                return this.datas[key];

            },


            getAll: function () {

                return this.datas;


            },

            del: function (key) {
                delete this.datas[key];
                return this;
            },
            clear: function () {
                this.datas = {};
                return this;
            },


            storeAll:function(map){

               for(var key in map){
                  this.datas[key] = map[key];

               }

              this.store();
              return this;

            },


            store: function () {
                sessionStorage.setItem(name, JSON.stringify(__cacheObj.datas));
                return this;

            },

            destroy: function () {

                this.datas = null;
                sessionStorage.removeItem(name);

            }






        }



        if(namedCacheDatas){
            __cacheObj.datas = JSON.parse(namedCacheDatas);
        }



        return __cacheObj;


    }

}