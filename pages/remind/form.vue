<template name="approvaling">
	<!-- 待审批组件 -->
	<view class="container">
		<view class="contentArea">
			<view class="title">
				{{allData.title}}
			</view>
			<view class="contents">
				{{allData.content}}
			</view>
		</view>
		
		<view class="btnBox">
			<button type="primary" class="approveBtn" @click="close">关闭</button>
		</view>
	</view>
</template>

<script>
	export default{
		name:"approvaling",
		props:["searchVal"],
		data(){
			return{
				urlType:"/common/notifyGet",
				dataList:[],//列表数据
				auditState:0,//审批状态：0（待审批） 1(已审批)
				current:"",//单选框当前值
				idsArr:[],	//选中的bill的id			
				token:"",//token
				modifyId:'',
				allData:null,
			}
		},
		components:{
			
		},
		mounted:function(){
			this.getData();
		},
		onLoad: function(option) {
			this.modifyId = option.id;
		},
		methods:{
			//关闭按钮
			close: function(){
			   uni.navigateTo({
					url:"/pages/remind/index"
			   })
			},
			//加载列表
			getData:function(){
				let _this = this;
				this.$http.GET(this.urlType,{
					id: this.modifyId
				}).then(res=>{
					if(res.data.code==0){
						let data = res.data.data
						_this.allData=data;
						setTimeout(()=>{
							uni.hideLoading()
						},2000)
					}else{
						uni.showToast({
							title:res.msg,
							duration: 2000,
							icon:'none',
						});
					}
				})
			},
		},
	}
</script>

<style scoped>
	.contentArea {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 10px;
	}
	.contentArea .title {
		margin-bottom: 20px;
	}
	.contentArea .contents {
		border: 1px solid #666;
		padding: 10px 7px;
		text-indent: 80rpx;
		min-height: 66vh;
		color: #444;
		width: 90vw;
		line-height: 20px;
	}
	.approveBtn{width: 90%; background-color: #599af6;}
</style>
