<template>
    
</template>
<script>
    import moment from "moment";
    export default {
         data() {
            return {
                typeValue:"iPad",
                startTime:"",
                endTime:" ",
                partId:"",
            }
         },
        created() {
            this.getInitModel();
            let day = new Date();
            day.setDate(day.getDate() - 1);
            this.startTime = moment(day).format("YYYY-MM-DD");
            this.endTime = moment(new Date()).format("YYYY-MM-DD");            
        },
        methods:{
            getInitModel() {
                let self = this;
                let params = { type: this.typeValue, keyWord: "" };      
                this.$axiosHttp.axiosPost("ks-newrep/ReportTool/findModelByTypeName.api", params).then(res => {                    
                    this.partId = res.data[0].modelId;
                    this.init();
                });
            },
            init() {
                let paramsO={
                    partId:this.partId,
                    startTime:this.startTime,
                    endTime:this.endTime
                }
                let paramsT={
                    partId:this.partId,
                }
                //成品信息
                this.$axiosHttp
                    .axiosPost("ks-rinse/rinse/queryCustomerInfoProcess.api", paramsO)
                    .then(res => {});
                 //产出数据
                this.$axiosHttp
                    .axiosPost("ks-newrep/InformationInfo/findInformationInfoOutputData.api", paramsO)
                    .then(res => {});
                //当天机种领料
                this.$axiosHttp
                    .axiosPost("ks-newrep/RepertoryMaterial/findReperMaterialCurrDay.api", paramsT)
                    .then(res => {});
                //生产在制
                 this.$axiosHttp
                    .axiosPost("ks-trace/traceSort/queryProductionProcess.api", paramsO)
                    .then(res => {});
                 // unknown汇总
                this.$axiosHttp
                    .axiosPost("ks-newrep/WorkInProgress/findWorkInProgress.api",paramsO)
                    .then(res => {});
                //投入产出
                this.$axiosHttp
                    .axiosPost("ks-rinse/rinse/queryInputOutputInfoProcess.api", paramsO)
                    .then(res => {});
                //不良信息
                this.$axiosHttp
                    .axiosPost("ks-trace/traceSort/queryBadnessInfoProcess.api", paramsO)
                    .then(res => {});
                 
            }
        }   
    }
</script>
