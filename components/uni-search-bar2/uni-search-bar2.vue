<template>
	<view class="searchBox">
		<view style="width: 100%;">
			<!-- @keypress="search(searchVal)" -->
			<input type="text" v-model="searchVal" :placeholder="placeholder" class="search" placeholder-class="search-place" />
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
				placeholder:this.searchHolder//提示框内容
			}
		},
		methods:{
			//搜索框被点击
			search(val){				
				 this.$emit('searchVal', val)
			}
		},
	}
</script>

<style>
	/* 搜索框 */
	.searchBox{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 20px;
		width: 100%;
	}
	.searchBox .search{
		padding:5px 10px ;
		width:100%;
		height: 20px;
		font-size: 16px;
		line-height: 20px;
		border:1px solid #555555;
		border-radius: 5px;
		background: #fff;
		box-sizing: border-box;
		height: 30px;
		font-size: 12px;
	}
	.searchBox .search-place{
		padding-left:5px;
	}
	.searchBox>view{
		position: relative;
	}
	.searchBox .searchIcon{
		position: absolute;
		top:7px;
		right: 10px;
	}
</style>
