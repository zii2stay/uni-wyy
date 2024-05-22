import { baseUrl } from './config.js'

export function topList(){
	let listIds = ['19723756','3779629','2884035','3778678']
	return new Promise(function(resolve,reject){
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				let result = res.data.list
				result.length = 4
				
				for(var i = 0;i<listIds.length;i++){
					result[i].listId = listIds[i]
				}
				
				resolve(result)
				// console.log(res)
			},
			fail: () => {},
			complete: () => {}
		});
		
	})
	
}

export function list(listId,count){
	return uni.request({
		url: `${baseUrl}/playlist/track/all?id=${listId}&limit=${count}&offset=0`,
		method: 'GET',
	});
}

export function songLyric(songId){
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		method: 'GET',
	});
}

export function song(songId){
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET',
	});
}