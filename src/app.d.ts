// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface ApiData{
		timestamp: number,
		data_type: number,
		value: number
	}

	interface ChartPoint{
		time: number,
		value: number
	}

	interface ChartSerie{
		serie: any,
		max: ChartPoint,
		min: ChartPoint,
		data: Array<ChartPoint>
	}

	interface Series{
		temperature: ChartSerie,
		humidity: ChartSerie,
		pressure: ChartSerie,
		rain: ChartSerie
	}
}
export {};
