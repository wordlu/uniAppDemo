<template>
	<view class="container">
		<view class="mainBox">
			<view class="monthInfo">
				<!-- 暂无头像字段 -->
				<!-- <view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">头像</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.name}}</text>
					</view>
				</view>-->
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">账号</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.code}}</text>
					</view>
				</view>
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">真实姓名</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.name}}</text>
					</view>
				</view>
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">手机号码</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.phone}}</text>
					</view>
				</view>
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">办公电话</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.workPhone}}</text>
					</view>
				</view>
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">邮箱</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.email}}</text>
					</view>
				</view>
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">公务卡账号</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.gongwuka}}</text>
					</view>
				</view>
				<view class="monthInfoItem">
					<view class="leftBox">
						<text class="month">工资卡账号</text>
					</view>
					<view class="rightBox">
						<text class="money">{{allData.gongzika}}</text>					 
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script> 
	export default{
		data(){
			return{
				urlType: '/datas/staff/getByCode',
				modifyId: '',
				allData: {},
			}
		},
		onLoad: function(option) {
			this.modifyId = option.userName;
		},
		mounted:function(){
			this.getData();
		},
		onNavigationBarButtonTap: function(type) {  
		    if(type.text=='修改'){
				 uni.redirectTo({
					url:"/pages/mine/mineInfoChange?modifyId="+this.modifyId
				 })
		    }
		},
		methods:{
			goDetail(date){
				uni.navigateTo({
					url:"/pages/salary/detail?date="+date
				})
			},
			//加载列表
			getData:function(){
				let _this = this;
				this.$http.GET(this.urlType,{
					code: this.modifyId
				}).then(res=>{
					if(res.data.code==0){
						let data = res.data.data
						_this.allData=data;
						if(_this.allData.bankList.length > 0) {
							_this.allData.bankList.forEach(function(item, index) {
								if(item.bankCardType == '1') {
									//工资卡
									_this.allData.gongzika = item.bankNum;
								} else if(item.bankCardType == '2'){
									//公务卡
									_this.allData.gongwuka = item.bankNum;
								} else {
									//个人账户
									_this.allData.geren = item.bankNum;
								}
							})
						}
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
		}
	}
</script>

<style scoped>
	.container{
		min-height: 100vh;
		background-color: #f2f2f2;
	}
	.titleBox{
		padding: 36rpx;
		font: 40rpx/44rpx "微软雅黑";
		/* color: #6997e2; */
		background-color: #fff;
	}
	.title{
		display: block;
		padding-left: 20rpx;
		border-left: 8rpx solid #5c97f5;
	}
	.monthInfo{
		margin-top: 12rpx;
	}
	.monthInfoItem{
		display: flex;
		width: 100vw;
		height: 120rpx;
		justify-content: space-between;
		align-items: center;
		font-size: 16px;
		background-color: #fff;	
		border-bottom: 1px solid #d1d1d1;
	}
	.dotImg{
		width: 14rpx;
	}
	.more{
		width: 22rpx;
	}
	.month{
		margin-left: 20rpx;
		vertical-align:middle;
	}
	.money{
		margin-right: 40rpx;
	}
	.leftBox{
		margin-left: 20rpx;
		white-space: nowrap;
	}
	.rightBox{
		margin-right: 26rpx;
		white-space: nowrap;
	}
</style>