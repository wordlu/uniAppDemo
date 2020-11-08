<template>
	<view class="header-top">
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="top_nav">
		    	<text>xx移动平台</text>
		</view>
	</view>
</template>

<script>
</script>

<style>
	.header-top {
		position: fixed;
		/* top: 0; */
	}
	.status_bar {
	    height: var(--status-bar-height);
	    width: 100%;
	    background-color: #fff;
	}
	
	.top_nav {
	    background-color: #fff;
	    padding-top: 15upx;
	    padding-bottom: 15upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
