import { dev } from "$app/environment"

var BROKER_SERVER = "127.0.0.1:8080"
if(dev){
	BROKER_SERVER = "192.168.1.189:8080"
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	/** @type Object{data: Array<ApiData>} **/
	try{
		const server_data = await fetch(`http://${BROKER_SERVER}/broker/api/v1/data/${Date.now()-(60*60*24*1000)}`).then(r => r.json())
		return {
			info: server_data
		};
	} catch (err) {
		return {
			info: {data: []},
			error: true
		}
	}
}
