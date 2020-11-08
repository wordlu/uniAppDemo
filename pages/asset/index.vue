<!-- 资产盘点首页 -->
<template>
	<view class="container">
		
		<view class="mainBox">
			<view class="peopleInfoBox">
				<!-- 单据信息 -->
				<view class="billMsgBox">
					<view class="title">盘点员信息</view>
					<view class="msgBox">						
						<view class="itemBox msgTit">
							<text class="leftMsg">姓名</text>
							<text class="rightMsg ">部门</text>
						</view>	
						<view class="itemBox">
							<text class="leftMsg">张三</text>
							<text class="rightMsg">财务处</text>
						</view>	
					</view>	
				</view>	
			</view>
			<view class="peopleInfoBox">
				<view class="billMsgBox scanBox">
						<view class="title">资产盘点</view>
						<view class="scanMsgBox">
							<view class="" @click="scanAsset">
								<image src="../../static/img/scan.png" mode="widthFix" class="scanImg"></image>
							</view>
							<view class="scanTextBox">
								<text>扫码盘点</text>
							</view>
						</view>	
					</view>	
				</view>
			</view>
			<view class="btnBox">
				<button type="primary" @click="goList">已盘点资产</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			//扫码盘点
			scanAsset(){
				// 允许从相机和相册扫码
				uni.scanCode({
				    success:res=>{
						// console.log(res,"扫码的结果")
						if(res.errMsg=="scanCode:ok"){
							//扫描成功
							// console.log('条码类型：' + res.scanType);
							// console.log('条码内容：' + res.result);
							uni.showToast({
								title:"即将为您跳转资产盘点详情页",
								icon:"none"
							})
							setTimeout(()=>{
								this.openAssetDetail()
							},1000)
						}
				        
				    }
				});
			},
			//打开资产盘点界面
			openAssetDetail(){
				uni.navigateTo({
					url:"/pages/asset/detail"
				})
			},
			//去已盘点列表页
			goList(){				
				uni.navigateTo({
					url:"/pages/asset/list"
				})
			}
		}
	}
</script>

<style scoped>
	@import url("/static/css/expend.css");
	.container{
		width: 100vw;
		min-height: 100vh;
		background-color: #f2f2f2;
	}
	.mainBox{
		padding-top: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.peopleInfoBox{		
		display: flex;
		justify-content: center;
		width: 90vw;
		height: 400rpx;
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0px 3px 3px 0 #e3dede;
		margin-bottom: 20rpx;
	}
	.peopleInfoBox .billMsgBox{
		border: 0px solid #000;
	}
	.billMsgBox .title{
		font-size: 50rpx;
		margin-bottom: 20rpx;
	}
	.msgTit{
		background-color: #e9f0ff;
	}
	.itemBox .leftMsg,.itemBox .rightMsg{
		text-align: center;
		background-color: #fff;
	}
	.msgTit .leftMsg,.msgTit .rightMsg{
		background-color: #e9f0ff;
	}
	.itemBox .leftMsg{
		border-right: 2px solid #eee;
	}
	.scanBox{
		margin-top: 20rpx;
	}
	.scanMsgBox{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.scanImg{
		width: 150rpx;
	}
	.scanTextBox{
		width: 92rpx;
		font-size: 40rpx;
		margin-left: 20rpx;
	}
	.btnBox button{
		width: 90vw;
		background-color: #5c97f5;
	}
</style>
