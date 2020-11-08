<script>
import Vue from 'vue'
export default {
	onLaunch: function() {
		console.log('App Launch');
		//设置顶部导航高度
		uni.getSystemInfo({
			success:function(e){
				uni.getSystemInfo({  
					success:function(e){  
						Vue.prototype.statusBar = e.statusBarHeight  
						// #ifndef MP  
						if(e.platform == 'android') {  
							Vue.prototype.customBar = e.statusBarHeight + 50  
						}else {  
							Vue.prototype.customBar = e.statusBarHeight + 45  
						}  
						// #endif  
			 
						// #ifdef MP-WEIXIN  
						let custom = wx.getMenuButtonBoundingClientRect()  
						Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight  
						// #endif  
			 
						// #ifdef MP-ALIPAY  
						Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight  
						// #endif  
					}  
				})
			}
		})
	},
	onShow: function() {
	},
	onHide: function() {
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/font/uni.ttf');
}
/* #endif */
</style>
