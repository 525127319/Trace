<template>
    <div>
        <div class="drag-dialog">
            <p class="tit">本次数据挖掘分析涉及的数据量较大，需要更多的时间处理</p>
            <p class="del">是否向大数据平台申请深度挖掘</p>
            <p class="apply btn" @click="apply">申请</p>
            <p class="btn cancel" @click="cancel">取消</p>
            </div>
        <div class="mask"></div>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    methods:{
        apply(){

            this.$parent.startAsyncTask();
            
        },
        cancel(){
            this.$parent.cancelAsync();
        }
    }
}
</script>

