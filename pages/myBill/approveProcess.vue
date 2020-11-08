<template>
	<!-- 审批流程及进度查看 -->
	<view class="container">
		<view class="progressBox">
			<!-- 已审核 -->
			<view class="item" v-for="(item,index) in progressList" :key="index">
				<view :class="{
						'statusBox':true,
						'clearfix':true,
						'statusBox_approving':item.pass == '审批中' || item.pass == '驳回',
						'statusBox_wait':item.pass == '待审批',
						'statusBox_finish':item.pass == '审批完成',
					}">
					<text :class="{
							'num':true,
							'num_approving':item.pass == '审批中' || item.pass == '驳回',
							'num_wait':item.pass == '待审批',
							'num_finish':item.pass == '审批完成',
						}">{{index+1}}</text>
					<text class="res">{{item.completeDate}}</text>
					<text :class="{
							'status':true,
							'status_approving':item.pass == '审核中' || item.pass == '驳回',
							'status_wait':item.pass == '待审批',
							'status_finish':item.pass == '审批完成',
						}">{{item.pass}}</text>
				</view>
				<view class="people">{{item.name}}：{{item.complete}}</view>
				<view class="options">审批意见：{{item.comment}}</view>
			</view>

		</view>

		<view class="btnBox">
			<view class="btn">
				<button type="default" class="backBtn" @click="back">返回单据详情</button>
			</view>
		</view>
	</view>

</template>

<script>
	//引入封装的本地存储处理工具
	import StorageUtil from "../../utils/storageUtils.js"
	//引入封装的字典匹配方法
	import FixedDictionaryData from "../../utils/fixedDictionaryData.js"
	//引入工具类
	import Utils from "../../utils/utils.js"
	export default {
		data: function() {
			return {
				id: "", //单据id
				token: "", //token，用于设置请求头
				progressList: [], //审批列表
				complateList: [], //审批完成列表
				approvingList: [], //审批中列表
				waitList: [], //待审批列表
				urlType: '/admin/audit/auditLog'
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		mounted: function() {
			// 获取token
			this.token = StorageUtil.get("token")
			this.requestUrl();
			uni.showLoading({
				title: "正在加载中~"
			})
		},
		methods: {
			// 回退
			back: function() {
				uni.navigateBack(); //默认回退一层
			},
			
			//封装一个请求方法
			requestUrl: function() {
				let params={
					"procInstId": this.id
				}
				let _this = this;
				this.$http.GET(this.urlType,params).then(res=>{
					if(res.data.code==0){
						let progressList=res.data.data.map(item =>{
							//1.分割成数组
							let dataList =item.complete.split(",")
							//2.转为字典查询后的数组
							let newList=[]//字典查询后的数组 [测试497,测试535,测试666,管理员admin]
							for (let s of dataList) {
								let data=FixedDictionaryData.findValue("dict_user_real",s)
								newList.push(data)
							}
							//3.将newList加工为字符串并赋值给item.complete
							item.complete = newList.join(',')
							return item
						})
						_this.progressList=progressList;
					}else{
						uni.showToast({
							title:res.msg,
							duration: 2000,
							icon:'none',
						});
						this.mescroll.endErr();
					}
					uni.hideLoading()
				}).catch(err=>{
					uni.showModal({
						title:"错误提示："+err,
						content:err,
					})
				})
			}
		},

	}
</script>

<style scoped>
	@import url("/static/css/progress.css");
</style>
