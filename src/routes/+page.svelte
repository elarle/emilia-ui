<script>
	import { onMount, onDestroy } from "svelte";

	import Taco from "$lib/components/Taco.svelte"
	import { createChart, LineSeries, createSeriesMarkers } from "lightweight-charts";
	import { invalidateAll } from '$app/navigation';

	import { Icon } from 'svelte-icons-pack';
	import { WiWiThermometer, WiWiThermometerExterior } from 'svelte-icons-pack/wi'

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	/** @type Array<ChartPoint> **/
	let adapted_data = $state([])

	let TIME_ADJUSTMENT = 60 * 60 

	function adaptDataToChart(){

		data.info.data = data.info.data.sort(function (a, b) {
			return (a.timestamp < b.timestamp) ? -1 : 1;
		});
		
		let last_date = [0, 0, 0, 0];
		let max_calc = [-272, -272, -272, -272];
		let min_calc = [300, 300, 300, 300];

		data.info.data.forEach((el, i) => {
			if(el.timestamp > Date.now()-(60*60*24*1000) && el.timestamp-last_date[el.data_type] > 1000 * 60){
				switch(el.data_type){
					case 0: {

						if(el.value > max_calc[0]){
							series.temperature.max = {time: el.timestamp/1000+TIME_ADJUSTMENT, value: el.value}
							max_calc[0] = el.value
						}

						if(el.value < min_calc[0]){
							series.temperature.min = {time: el.timestamp/1000+TIME_ADJUSTMENT, value: el.value}
							min_calc[0] = el.value
						}

						series.temperature.data.push({time: el.timestamp/1000+TIME_ADJUSTMENT, value: el.value})	
						break;	
					}
					case 2: {
						if(el.value > max_calc[2]){
							series.humidity.max = {time: el.timestamp/1000+TIME_ADJUSTMENT, value: el.value}
							max_calc[2] = el.value
						}

						if(el.value < min_calc[2]){
							series.humidity.min = {time: el.timestamp/1000+TIME_ADJUSTMENT, value: el.value}
							min_calc[2] = el.value
						}

						series.humidity.data.push({time: el.timestamp/1000+TIME_ADJUSTMENT, value: el.value})	
						break;	
					}
				}
				last_date[el.data_type] = el.timestamp
			}
		})
	}

	$inspect(data)

	/** @type any **/
	let chart_container;

	/** @type Series **/
	let series = $state(
		{
			temperature: {data: [], max: {}},
			humidity: {data: [], max: {}}
		}
	)

	let current_temp = $state(null);
	let current_hum = $state(null);
	
	//Gonna change in near future
	let refresh_timeout = 0

	onMount(() => {

		adaptDataToChart()

		current_temp = series.temperature.data[series.temperature.data.length-1]
		current_hum = series.humidity.data[series.humidity.data.length-1]

		console.log(adapted_data)
		const chart = createChart(chart_container, {autoSize:true})
		chart.timeScale().applyOptions({timeVisible: true, secondsVisible: false})
		console.log({ from: Date.now()/1000 - 60*60*24, to: Date.now()/1000 })

		series.temperature.serie = chart.addSeries(LineSeries)
		series.humidity.serie = chart.addSeries(LineSeries, {color: "#ffad33"})

		series.temperature.serie.setData(series.temperature.data)
		series.humidity.serie.setData(series.humidity.data)

		console.log(series)

		const markers_temp = [
			{
				time: series.temperature.min.time,
				position: 'belowBar',
				color: '#5047f6',
				shape: 'arrowUp',
			  text: `${series.temperature.min.value}º`,
			},
			{
				time: series.temperature.max.time,
				position: 'aboveBar',
				color: '#f64750',
				shape: 'arrowDown',
			  text: `${series.temperature.max.value}º`,
			},
		];

		const markers_hum = [
		{
			time: series.humidity.min.time,
			position: 'belowBar',
			color: '#50a4f6',
			shape: 'arrowDown',
			text: `${series.humidity.min.value}%`,
		},
		{
			time: series.humidity.max.time,
			position: 'aboveBar',
			color: '#f64750',
			shape: 'arrowDown',
			text: `${series.humidity.max.value}%`,
		},
		]


		createSeriesMarkers(series.temperature.serie, markers_temp);
		createSeriesMarkers(series.humidity.serie, markers_hum);

		chart.timeScale().fitContent()

		refresh_timeout = setTimeout(() => {
			window.location.reload()
		}, 2 * 60 * 1000)


		//adaptDataToChart()
	})

	onDestroy(() => {
		clearTimeout(refresh_timeout)
	})

</script>

<div class="absolute right-0 p-2 text-black text-sm">
	<div class="bg-neutral-100 px-3 p-2 rounded-md flex items-center text-xs gap-1">
		{#if current_temp != null}
			<div class={`w-2.5 h-2.5 bg-lime-500 rounded-full`}></div>
			Last Update: {new Date(current_temp?.time*1000-(60*60*1000)).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
		{:else}
			<div class={`w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0`}></div>
			{#if data?.error == true }
				Broker Error
			{/if}
		{/if}
	</div>
</div>
<div class="flex flex-col h-full w-full bg-blue-400 p-8 gap-8">
	<div class="flex h-1/2 justify-evenly items-center">
		<div class="hidden md:block">
			<Taco
				value={series.temperature.data.length <= 0 ? 0 : series.temperature.data[series.temperature.data.length-1].value}
				unit={'Temperatura ºC'}
				min_value={-20}
				range={70}
				steps={15}
				warning_value={35}
				initial_degree={130}
				degree_range={280}
			></Taco>
		</div>

		<div class="text-white font-bold justify-center flex">
			<div class="flex w-auto flex-col">
				<h1 class="text-9xl flex font-extrabold items-center">
					{current_temp?.value}º
					<div class="-ml-8 pb-2.5">
						<Icon size="1em" src={current_temp?.value > 15 ? WiWiThermometer : WiWiThermometerExterior}/>
					</div>	
				</h1>
				<div class="text-3xl flex -mt-4">
					<h3>Humedad: {current_hum?.value}%</h3>
				</div>
			</div>
			<div class="flex items-center -ml-8">
			</div>
		</div>

		<div class="hidden lg:block">
			<Taco
				value={series.humidity.data.length <= 0 ? 0 : series.humidity.data[series.humidity.data.length-1].value}
				unit={'Humedad %'}
				min_value={0}
				range={100}
				steps={11}
				warning_value={90}
				initial_degree={130}
				degree_range={280}
			></Taco>
		</div>
	</div>
	
	<div class="w-full flex text-center items-center justify-center gap-8 text-white">
		<div class="w-full h-[1px] bg-white"></div>
		<p class="flex flex-shrink-0">Últimas 24 horas</p>
		<div class="w-full h-[1px] bg-white"></div>
	</div>

	<div class="w-full h-1/2 flex">
		<div bind:this={chart_container} id="#container" class="chart-container w-full h-full flex"></div>
	</div>
</div>





<style>
:global(.chart-container) {
    margin: auto;
}
</style>
