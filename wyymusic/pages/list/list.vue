<template>
	<view class="list">
		
		<view class="fixbg" :style="{ 'background-image':'url('+listinfo[0].coverImgUrl+')'}">
		  
		</view>
		<musichead title="歌单" :icon="true" color="white"></musichead>	
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image :src="listinfo[0].coverImgUrl"></image>
						<text class="iconfont icon-yousanjiao">{{listinfo[0].playCount | formatCount}}</text>
					</view>
					<view class="list-head-text">
						<view class="">{{listinfo[0].name}}</view>
						<view class="">
							<image src="../../static/屏幕截图 2023-06-18 131531.png"></image>网易云音乐
						</view>
						<view>
							{{listinfo[0].description}}
						</view>
					</view>
				</view>
				 <button open-type="share" class="list-share"> 
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				 </button>
				 <view class="list-music">
				 	<view class="list-music-head">
				 		<text class="iconfont icon-play"></text>
						<text>播放全部</text>
						<text>（共{{listinfo[0].trackCount}}首）</text>
				 	</view>
					<view class="list-music-item" v-for="(item,index) in listItem.songs" @tap="handleToDetail(item.id,item.name,item.al.picUrl)">
						<view class="list-music-top">
							{{index+1}}
						</view>
						<view class="list-music-song">
							<view>{{item.name}}</view>
							<view>
								<image src=""></image>
								<image src=""></image>
								<text v-for="(ar,index) in item.ar">{{ar.name}}{{index+1 >= item.ar.length ? '':'/'}}</text>-{{item.al.name}}
							</view>
						</view>
						<view class="iconfont icon-play"></view>
					</view>
				 </view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musichead from '../../components/musichead/musichead.vue'
	import { topList } from '../../common/api.js'
	import { list } from '../../common/api.js'
	export default {
		data() {
			return {
			   listinfo:[],
			   listItem:{},
			   // picurl:{}
			}
		},
		methods: {
			handleToDetail(id,name,picurl){
				console.log(picurl)
				// 解析
				let url = encodeURIComponent(JSON.stringify(picurl))
				uni.navigateTo({
					url:'/pages/detail/detail?id='+ id +'&name='+ name + '&picurl='+url
				})
			}
		},
		onLoad(options) {
			console.log(options)
			topList().then((res)=>{
				console.log(res)
				for(var i = 0;i<res.length;i++){
					if(res.length && res[i].id == parseInt(options.listId)){
						// this.listinfo = res[i]
						this.listinfo.push(res[i])
					}
				}
				// console.log(this.listinfo.length)
				list(this.listinfo[0].id,this.listinfo[0].trackCount).then(res=>{
					console.log(res)
					if(res[1].data.code == '200'){
						this.listItem = res[1].data
						// this.picurl = res[1].data.songs
						uni.hideLoading()
					}
				})
			});
			uni.showLoading({
				title:'加载中....'
			})
			
		},
		components:{musichead}
		
	}
</script>

<style scoped>
	.list-head{
		display: flex;
		margin: 30rpx;
	}
	.list-head-img{
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}
	.list-head-img image{
		width: 100%;
		height: 100%;
		
	}
	.list-head-img text{
		position: absolute;
		right: 8rpx;
		top: 8rpx;
		color: white;
		font-size: 26rpx;
	}
	.list-head-text{
		flex: 1;
		color: f0f2f7;
	}
	.list-head-text view:nth-child(1){
		color: white;
		font-size: 34rpx;
	}
	.list-head-text view:nth-child(2){
		display: flex;
		margin: 20rpx 0;
		font-size: 24rpx;
		align-items: center;
	}
	.list-head-text view:nth-child(2) image{
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}
	.list-head-text view:nth-child(3){
		line-height: 34rpx;
		font-size: 22rpx;
	}
	.list-share{
		width: 330rpx;
		height: 74rpx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 37rpx;
		color: white;
		text-align: center;
		line-height: 74rpx;
		font-size: 28rpx;
	}
	.list-share text{
		margin-right: 16rpx;
	}
	.list-music{
		background: white;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;
	}
	.list-music-head{
		height: 50rpx;
		margin: 30rpx 0 70rpx 22rpx;
	}
	.list-music-head text:nth-child(1){
		height: 50rpx;
		font-size: 50rpx;
	}
	.list-music-head text:nth-child(2){
		font-size: 30rpx;
		margin: 0 10rpx 0 26rpx;
	}
	.list-music-head text:nth-child(3){
		font-size: 26rpx;
		color: #b2b2b2;
	}
	.list-music-item{
		display: flex;
		margin: 0 32rpx 66rpx 46rpx;
		align-items: center;
		color: #959595;
	}
	.list-music-top{
		width: 58rpx;
		font-size: 30rpx;
		line-height: 30rpx;
	}
	.list-music-song{
		flex: 1;
	}
	.list-music-song view:nth-child(1){
		font-size: 28rpx;
		color: black;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-song view:nth-child(2){
		/* display: flex; */
		font-size: 20rpx;
		align-items: center;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-song view:nth-child(2) image{
		width: 32rpx;
		height: 20rpx;
		margin-right: 10rpx;
		/* flex-shrink: 0; */
	}
</style>
