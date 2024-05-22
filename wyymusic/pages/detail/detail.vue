<template>
	<view class="detail">
		<view class="fixbg" :style="{ 'background-image':'url('+picUrl+')'}">
		  
		</view>
		<musichead :title="name" :icon="true" color="white"></musichead>	
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="picUrl" :class="{'detail-play-run':isPlayRotate}"></image>
					<text class="iconfont" :class="iconPlay"></text>
					<!-- <view></view> -->
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex)*82+'rpx)'}">
						<!-- <view class="detail-lyric-item">
							测试文字
						</view> -->
						<view class="detail-lyric-item" v-for="(item,index) in songLyric" :key="index" :class="{active : lyricIndex == index }">
							{{item.lyric}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musichead from '../../components/musichead/musichead.vue'
	import { songLyric } from '../../common/api.js'
	import { song } from '../../common/api.js'
	export default {
		data() {
			return {
				picUrl:'',
				songLyric:[],
				lyricIndex:0,
				name:'',
				iconPlay:'icon-zanting',
				isPlayRotate:true,
				
			}
		},
		methods: {
			formatTimeToSec(value){
				let arr = value.split(':');
				return (Number(arr[0]*60)+Number(arr[1])).toFixed(1);
			},
			listenLyricIndex(){
				clearInterval(this.timer)
				const bgAudioManager = uni.getBackgroundAudioManager();
				this.timer = setInterval(()=>{
					for(var i=0;i<this.songLyric.length;i++ ){
						if(bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time){
							this.lyricIndex = this.songLyric.length-1;
							break
						}
						if(bgAudioManager.currentTime > this.songLyric[i].time && bgAudioManager.currentTime < this.songLyric[i+1].time){
							this.lyricIndex = i
						}
					}
					console.log(this.lyricIndex)
				},500)
			},
			cancelLyricIndex(){
				clearInterval(this.timer)
			},
			handleToPlay(){
				const bgAudioManager = uni.getBackgroundAudioManager();
				if(bgAudioManager.paused){
					bgAudioManager.play()
				}else{
					bgAudioManager.pause()
				}
			}
			
			
		},
		onLoad(options) {
			console.log(options)
			// 对歌曲的封面地址进行解析
			console.log(JSON.parse(decodeURIComponent(options.picurl)))
			this.picUrl = JSON.parse(decodeURIComponent(options.picurl))
			this.name = options.name
			songLyric(options.id).then(res=>{
				console.log(res)
				let lyc = res[1].data.lrc.lyric
				console.log(lyc)
				let re = /\[([^\]]+)\]([^\[]+)/g
				var result = [];
				lyc.replace(re,($0,$1,$2)=>{
					result.push({"time":this.formatTimeToSec($1),"lyric":$2});
				})
				console.log(result)
				this.songLyric = result
			})
			
			song(options.id).then(res=>{
				const bgAudioManager = uni.getBackgroundAudioManager();
				// this.bgAudioManager = uni.getBackgroundAudioManager();
				// console.log(this.bgAudioManager)
				bgAudioManager.title = this.name;
				console.log(res)
				bgAudioManager.src = res[1].data.data[0].url;
				console.log(res[1].data.data[0].url)
				this.listenLyricIndex()
				bgAudioManager.onPlay(()=>{
					this.iconPlay = 'icon-zanting1'
					this.isPlayRotate = true
					this.listenLyricIndex()
				})
				bgAudioManager.onPause(()=>{
					this.iconPlay = 'icon-bofang'
					this.isPlayRotate = false
					this.cancelLyricIndex()
				})
			})
			
			
		},
		onUnload() {
			this.cancelLyricIndex()
		},
		onHide() {
			this.cancelLyricIndex()
		},
		components:{
			musichead
		}
	}
</script>

<style scoped>
	.detail-play{
		width: 500rpx;
		height: 500rpx;
		/* background:url(~@/static/1687078364506.png); */
		background-color:black;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 15rpx;
		background-size: cover;
		margin: 180rpx auto 0 auto;
		position: relative;
	}
	.detail-play image{
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin:auto;
		animation: 10s linear move infinite;
		animation-play-state: paused;
	}
	.detail-play .detail-play-run{
		animation-play-state: running;
	}
	@keyframes move {
		from{transform: rotate(0deg);}
		to{transform: rotate(360deg);}
	}
	.detail-play text{
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: white;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}
	/* .detail-play view{
		
	} */
	.detail-lyric{
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: #6f6e73;
	}
	.detail-lyric-wrap{
		transition: 0.5s;
	}
	.detail-lyric-item{
		height: 82rpx;
	}
	.detail-lyric-item.active{
		color: white;
	}
</style>
