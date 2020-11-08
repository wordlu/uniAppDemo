<!-- 
	搜索框
	父组件使用方法实例：（注：引入后一定要正确注册改组件）
		1.页面引入	import search from "@/components/components_self/search/index.vue"
		2.注册组件	components:{search}
		3.DOM使用组件	<search :searchHolder="searchPlaceholder" @searchVal="search"></search>			
		4.data赋值	searchPlaceholder:"可搜索编号",//父传子的值（搜索框提示信息）
		5.方法书写	search(val){//val即为子元素中搜索的内容}
	注：该搜索框为固定定位，请根据需要修改对应样式。该搜索组件top值在H5端为44px，非h5端为0px;
-->
	
<template>
	<view class="searchBox">
		<view>
			<input type="text" v-model="searchVal" :placeholder="placeholder" class="search" placeholder-class="search-place"	/>
			<icon type="search" size="16" color="#5a9af7" class="searchIcon" @click="search(searchVal)"/>
		</view>
	</view>
</template>

<script>
	
	export default{
		props:["searchHolder"],
		data(){
			return{
				searchVal:"",//搜索内容
				placeholder:this.searchHolder,//提示框内容
				clickHandler:null,
			}
		},
		created:function(){
			//防抖操作
			this.clickHandler = this.debounce(this.toParent, 1000)
		},
		methods:{
			//搜索框被点击
			search(val){
				//防抖操作
				this.clickHandler(val)
			},
			//子传父
			toParent(val){
				this.$emit('searchVal', val)
			},
			
			//防抖操作
			debounce(fn,wait=1000) {				
			    let timer = null;				
			    return function(...args) {   
					// console.log("搜索搜索222")
			        if(timer)   clearTimeout(timer);        
			        timer = setTimeout(()=>{
						fn.apply(this,args)
					},wait);
			    }
				
			},	
			
		},
	}
</script>

<style scoped>
	/* 搜索框 */
	.searchBox{
		position: fixed;
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		left: 0;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 3px 3px 0 #8b8484;
		background-color: #fff;
		z-index: 9999;
	}
	.searchBox .search{
		margin:10px 0 ;
		padding:5px 10px ;
		width: 80vw;
		height: 20px;
		font-size: 16px;
		line-height: 20px;
		border:1px solid #555555;
		border-radius: 5px;
	}
	.searchBox .search-place{
		padding-left:5px;
	}
	.searchBox>view{
		position: relative;
	}
	.searchBox .searchIcon{
		position: absolute;
		top:20px;
		right: 10px;
	}
</style>
