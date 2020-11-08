<!--
	附件上传组件
	wodelu
 -->
<template>
	<view class="container">
		<view class="title" >
			<text>附件信息</text>
		</view>		
		<view class="mainBox">
			<view class="item">
				<view class="billIntro clearfix" @click="unfold(index)">
					<view class="left">请上传附件</view>
					<view class="uploadBtn" @click.stop="uploadOther()">
						<text>上传</text>
						<image src="../../static/img/upload.png" mode="" class="foldImg"></image>
					</view>
				</view>
				<view class="billInfo">
					<view class="billContent" v-show="(attachData.length > 0)" v-for="(item, index) in attachData">
						<view class="billname">
							<view class="name">
								<image  @click="viewFile(item.path)" src="../../static/img/ck.png" mode="" class="title"></image>
								<text class="nametext">{{item.name}}</text>
							</view>
							<image src="../../static/img/delete.png" mode="" class="delete" @click="deleteother(index)"></image>
						</view>
					</view>
					<view class="empty" v-show="(attachData.length == 0)">
						暂无数据
					</view>
				</view>
			</view>
		</view>
		<!-- 选择图片弹框 -->
		<view class="markBox">
			<uni-popup ref="popup" type="center">
				<view class="chooseImgBox">
					<view class="title">请选择图片来源</view>
					<view class="takephoto" @click="takePhoto">拍照</view>	
					<view class="pic" @click="choosePic">相册图片</view>
					<view class="pic" @click="chooseFile">选择文件</view>
					<button type="default" class="escChoose" @click="escChoose">取消</button>
				</view>
			</uni-popup>			
		</view>
		<view class="viewInfo" v-if='viewState'>
			<view class="header_top">
				<view class="headerTopLeft" @click="viewFile()"><image src="../../static/img/back_icon.png" mode="" class='banc-icon'></image></view>
				<view class="serchBoxRight"></view>
			</view>
			<iframe width="100%" height="100%" class="" :src="viewFileUrl"></iframe>
		</view>
	</view>
</template>

<script>
	//引入文件上传模块
	import FileUpload from "../../utils/uploadUtils.js"
	// 引入弹窗组件
	import uniPopup from '../../components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '../../components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '../../components/uni-popup/uni-popup-dialog.vue'	
	export default{
		data(){
			return{
				uploadURL:"/admin/attachment/upload",//上传文件接口路径
				saveAttachmentURL: "",
				uploadFileList:[],//上传文件列表
				attachementList: [],//附件列表
				otherAttachList:[], //其他附件
				viewFileUrl:this.API_URL+ '/admin/review/view?path=',
				viewState: false, //附件弹框状态
				attachData: [],
			}
		},
		props:{
			fileList: {
				type: Array,
			}
		},
		components:{
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
		},
		watch: {
			fileList: function() {
				this.attachData = this.fileList;
			}
		},
		methods:{
			//关闭附件预览弹框
			viewFile: function(path) {
				this.viewFileUrl =this.API_URL+'/admin/review/view?path=';
				if(path && path != '') {
					this.viewFileUrl = this.viewFileUrl + path;
				}
				this.viewState = !this.viewState;
			},
			//删除附件
			deleteother: function(index) {
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除附件?',
				    success: function (res) {
				        if (res.confirm) {
				          _this.attachData.splice(index, 1);
				        }
				    }
				});
			},
			/* 上传 */
			onUpload: function() { 
				this.$refs.lFile.upload({
					currentWebview: this.$mp.page.$getAppWebview(),
					 url:this.API_URL+'/admin/attachment/pro/upload',
					name: 'uploadFile',
				});
			},
			onSuccess:function(res) {
				uni.showToast({
					title: JSON.stringify(res),
					icon: 'none'
				})
			},
			//上传附件
			uploadOther:function(type){
				// this.attachType = type;
				this.$refs.popup.open()
			},
			//拍照
			takePhoto:function(){
				//调用拍照功能
				uni.chooseImage({
					// count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相册选择
					success: res =>{
						//res.tempFilePaths :返回图片的本地文件路径列表
						this.uploadFileList = res.tempFilePaths; //本地路径
						// this.invoicebeforeUpload(res.tempFiles[0]) //判断类型
						//调取上传发票接口 wodelu
						FileUpload.uploads(this.uploadFileList,this.uploadURL,this.saveAttachmentURL,this.token, function(res){
							let attachment = {};
							if(res[0]) {
								let data = res[0];
								attachment.size = res[0].size;//大小
								attachment.path = res[0].path;//路径
								attachment.name = res[0].name;//名称
								attachment.extend = res[0].extend;//扩展名
								_this.attachData.push(attachment)
								_this.$forceUpdate();
								_this.escChoose()
							}
							// 关闭遮罩层
							_this.escChoose()
							uni.showToast({
								title:"成功上传附件",
								duration:2000,//默认1500
								icon:"none"
							})
						})
						
						
					},
					fail:function(err){
						uni.showToast({
							title:"未能成功拍照，请重新再试",
							duration:2000,//默认1500
							icon:"none"
						})
					}
				});
				
			},
			//选择照片
			choosePic:function(){
				let _this = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: res =>{
						this.uploadFileList = res.tempFilePaths; //本地路径
						//调取上传发票接口 wodelu
						FileUpload.uploads(this.uploadFileList,this.uploadURL,this.saveAttachmentURL,this.token, function(res){
							let attachment = {};
							if(res[0]) {
								let data = res[0];
								attachment.size = res[0].size;//大小
								attachment.path = res[0].path;//路径
								attachment.name = res[0].name;//名称
								attachment.extend = res[0].extend;//扩展名
								_this.attachData.push(attachment)
								_this.$forceUpdate();
								_this.escChoose()
							}
							// 关闭遮罩层
							_this.escChoose()
							uni.showToast({
								title:"成功上传附件",
								duration:2000,//默认1500
								icon:"none"
							})
						})
						
				    },
					fail:function(err){
						uni.showToast({
							title:"未能成功上传图片，请重新再试",
							duration:2000,//默认1500
							icon:"none"
						})
					}
				});
			},
			//选择文件
			chooseFile:function(){
				let _this = this;  
				this.choosePic()
			},
			//取消选择照片
			escChoose:function(){
				this.$refs.popup.close()
				// this.$refs.popup[0].close()
			},
		}
		
	}
</script>

<style scoped>
	.container{margin-bottom: 45px;width: 100%;background-color: #f2f2f2;}
	.header_top{width: 100%;height:70px;background-color: rgb(90, 154, 247);position: fixed;left: 0;top:0;right: 0;z-index: 999;display: flex;flex-direction: row;}
	.headerTopLeft{position: absolute;left: 0;top:20px;width:44px;height:44px;}
	.viewInfo {
		    display: flex;
		    -webkit-box-orient: vertical;
		    -webkit-box-direction: normal;
		    -webkit-flex-direction: column;
		    flex-direction: column;
		    position: fixed;
		    left: 0px;
		    top: 0px;
		    right: 0px;
		    bottom: 0px;
		    background: #f2f2f2;
		    z-index: 1000;
	}
	.empty {
		display: flex;
		justify-content: center;
		font-size: 14px;
		color: #666;
		padding-top: 60px;
	}
	.nametext {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 170px;
		font-size: 14px;
	}
	.mainBox, .item {
		background-color: #f2f2f2;
		margin-bottom: 0px !important;
	}
	.billname image.title {
		width: 60rpx;
		height: 60rpx;
	}
	.billname image.delete {
		width: 40rpx;
		height: 40rpx;
	}
	.billname text {
		font-size: 14px;
	}
	.billContent {
		background: white;
		margin: 10px;
		padding: 0 20px;
		display: flex;
		flex-direction: column;
		border-radius: 10px;
	}
	.billname {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.billname .name {
		display: flex;
		align-items: center;
	}
	.billname .name image.title {
		padding-right: 10px;
	}
	.title{
		font-size:16px;
		font-weight: bold;
		text-align: center;
	}
	.billIntro{
		height: 108rpx;
		line-height: 108rpx;
		background-color: #e8f1ff;
		font-size: 16px;
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
	}
	.billIntro .left{
		float: left;
		margin-left: 24rpx;
	}
	.billInfo{
		line-height: 108rpx;
	}
	.uploadBtn {
		position: absolute;
		right: 25px;
	}
	.foldImg{
		width: 38rpx;
		height: 38rpx;
		vertical-align: middle;
		margin-left:10rpx;
	}
	/* 弹出层 */
	.chooseImgBox{
		width: 80vw;
		padding-bottom: 40rpx;
		background-color: #fff;
		border-radius: 8px;
	}
	.chooseImgBox{
		font: 38rpx/60rpx "宋体" ;
	}
	.chooseImgBox .title{
		padding-top: 30rpx;
		color: #5a9af7;
		font-size: 40rpx;
		text-align: center;
	}
	.takephoto,.pic{
		margin-left: 20rpx;
		line-height: 70rpx;
	}
	.pic{
		margin-top: 15rpx;
	}
	.escChoose{
		margin-top: 20rpx;
		width: 80%;
		background-color: #5a9af7;
		color: #fff;
	}
	uni-image.banc-icon {
		width: 40px;
		height: 40px;
	}
</style>
