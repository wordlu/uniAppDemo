<template>
	<view class="container">
		<!-- 我是商旅外接 -->
		<view class="mainBox">
			<view class="itemBox">
				<view class="item" v-for="(item,index) in tradeList" :key="index" @click="goTradeLink(item.link)">
					<view class="item_img">
						<image :src="item.imgUrl" mode="widthFix" class="iconItem"></image>
					</view>
					<view class="item_title">
						<text>{{item.title}}</text>
					</view>
				</view>
				
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			//商旅接口列表
			let tradeArr=[
				{
					imgUrl:"../../static/img/ZCPT.png",
					title:"政采平台",
					link:"https://app.gpticket.org/login.action;jsessionid=0DB23B51A608305413FD38EF87E96354#",
				},
				{
					imgUrl:"../../static/img/DD.png",
					title:"滴滴",
					link:"https://common.diditaxi.com.cn/general/webEntry?wx=truebizid=257channel=70365"
				},				
				{
					imgUrl:"../../static/img/SF.png",
					title:"顺丰快递",
					link:"https://ucmp.sf-express.com/cx/order/sending.html?source=sending&v=2.2&t=1537428123398&openid=oxLfbjh_ZFENRn6oqcmPQz3HWDA8&mu=FF042B481264C1A2B49C694741E36C81FC98FD7B4207A4607FDAE6205756D2936543207933577FBF8173D642782C7C7A",
				},
				{
					imgUrl:"../../static/img/12306.png",
					title:"12306",
					link:"http://mobile.12306.cn/weixin/wxcore/init"
				},
				{
					imgUrl:"../../static/img/SYQC.png",
					title:"首约汽车",
					link:"https://booking.01zhuanche.com/car.html#/channel_sqycwechat"
				},
				{
					imgUrl:"../../static/img/XCJD.png",
					title:"携程酒店",
					link:"https://m.ctrip.com/html5/flight/swift/index?sourceid=2132&allianceid=275062&sid=820853&openapp=5"
				},
				{
					imgUrl:"../../static/img/XC.png",
					title:"机票预订",
					link:"https://flights.ctrip.com/international/search/"
				},
			]
			return{
				tradeList:tradeArr,
			}
		},
		methods:{
			//商旅平台链接
			goTradeLink(url){
				// // #ifndef H5
				// 	window.open(url)
				// // #endif  
				
				// #ifdef APP-PLUS
					//打开第三方链接
					plus.runtime.openURL(url, function(res) {  
					   //打开失败的回调
					   // console.log(res);  
					   uni.showToast({
						title:"链接打开失败，请联网或授权后再试",
						icon:"none"
					   })
					});
				// #endif
				
				
			},
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		min-height: 100vh;
		padding-bottom: 20px;
		font-size: 14px;
		line-height: 24px;
		background-color: #f7f3f7;
	}
	.mainBox{
		width: 100vw;
		display: flex;
		justify-content: center;
	}
	.itemBox{
		width: 95vw;
		display: flex;
		/* justify-content: flex-start; */
		justify-content:space-between;
		align-items: center;	
		/* 自动换行 */
		flex-wrap:wrap;
	}
	.itemBox .item{
		display: flex;
		width: 30vw;
		height: 240rpx;
		background-color: #fff;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 10rpx 0;
	}
	.iconImg{
		width: 60rpx;
		vertical-align:middle;
	}
	.iconItem{
		width: 100rpx;
		height: 100rpx;
	}
</style>
