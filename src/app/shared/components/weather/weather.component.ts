import { Component, OnInit } from '@angular/core';
import { OpenMeteoResponse, WeatherService } from '../../services/weather.service';


type CardModel = {
	badgeDay: string;
	windLabel: string;
	cloudLabel: string;
	tempRange: string;
	rainTag: string;
	chillTag: string | null;
	visibilityTag: string;
};

@Component({
	selector: 'app-weather',
	templateUrl: './weather.component.html',
	standalone: false,
})
export class WeatherComponent implements OnInit {
	loading = true;
	error: string | null = null;

	raw: OpenMeteoResponse | null = null;
	card: CardModel | null = null;

	showDetails = false;
	nextHours: Array<{ time: string; temp: number; wind: number; rainProb: number }> = [];

	constructor(private weather: WeatherService) {}

	private indicesForDay(hourlyTimes: string[], dayISO: string): number[] {
		// hourlyTimes are ISO strings; compare by YYYY-MM-DD prefix
		const prefix = dayISO;
		const idxs: number[] = [];
		for (let i = 0; i < hourlyTimes.length; i++) {
			if (hourlyTimes[i].startsWith(prefix)) idxs.push(i);
		}
		return idxs;
	}

	private avg(nums: number[]): number {
		if (!nums.length) return 0;
		return nums.reduce((a, b) => a + b, 0) / nums.length;
	}

	private dayNameFromISO(dayISO: string): string {
		const dt = new Date(dayISO + 'T00:00:00');
		return dt.toLocaleDateString(undefined, { weekday: 'long' });
	}

	private hhmm(iso: string): string {
		const dt = new Date(iso);
		return dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}

	private windLabel(kmh: number): string {
		if (kmh < 12) return 'Light';
		if (kmh < 28) return 'Moderate';
		if (kmh < 45) return 'Fresh';
		return 'Strong';
	}

	private cloudLabel(percent: number): string {
		if (percent < 15) return 'Clear';
		if (percent < 40) return 'Scattered';
		if (percent < 75) return 'Broken';
		return 'Overcast';
	}

	private visibilityLabel(meters: number): string {
		const km = meters / 1000;
		if (km >= 10) return 'good';
		if (km >= 5) return 'fair';
		return 'poor';
	}

	private rainTag(prob: number): string {
		if (prob < 15) return 'low chance rain';
		if (prob < 40) return 'chance of showers';
		return 'likely rain';
	}

	ngOnInit() {
		this.weather.getForecast(56.8169321, -5.1135336).subscribe({
			next: (data) => {
				this.raw = data;
				this.card = this.buildCardModel(data);
				this.nextHours = this.buildNextHours(data, 8);
				this.loading = false;
			}
		});
	}

	toggleDetails(): void {
		this.showDetails = !this.showDetails;
	}

	private buildCardModel(data: OpenMeteoResponse): CardModel {
		const bestDayIndex = this.pickBestDayIndex(data);
		const dayISO = data.daily.time[bestDayIndex];

		const dayHourIdxs = this.indicesForDay(data.hourly.time, dayISO);

		const windAvg = this.avg(dayHourIdxs.map(i => data.hourly.wind_speed_10m[i]));
		const cloudAvg = this.avg(dayHourIdxs.map(i => data.hourly.cloud_cover[i]));
		const visAvgMeters = this.avg(dayHourIdxs.map(i => data.hourly.visibility[i]));
		const rainProbAvg = this.avg(dayHourIdxs.map(i => data.hourly.precipitation_probability[i]));

		const tMin = data.daily.temperature_2m_min[bestDayIndex];
		const tMax = data.daily.temperature_2m_max[bestDayIndex];

		const badgeDay = this.dayNameFromISO(dayISO);

		const windLabel = this.windLabel(windAvg);
		const cloudLabel = this.cloudLabel(cloudAvg);

		const tempRange = `Between ${Math.round(tMin)} and ${Math.round(tMax)}°C`;

		const rainTag = this.rainTag(rainProbAvg);
		const chillTag = (tMin <= 1 || tMax <= 4) ? 'summit chill' : null;
		const visibilityTag = `visibility: ${this.visibilityLabel(visAvgMeters)}`;

		return { badgeDay, windLabel, cloudLabel, tempRange, rainTag, chillTag, visibilityTag };
	}

	private buildNextHours(data: OpenMeteoResponse, count: number) {
		const now = new Date();
		const idx = data.hourly.time.findIndex(t => new Date(t) >= now);
		const start = idx >= 0 ? idx : 0;

		return data.hourly.time.slice(start, start + count).map((t, i) => {
			const j = start + i;
			return {
				time: this.hhmm(t),
				temp: data.hourly.temperature_2m[j],
				wind: data.hourly.wind_speed_10m[j],
				rainProb: data.hourly.precipitation_probability[j],
			};
		});
	}

	private pickBestDayIndex(data: OpenMeteoResponse): number {
		const days = data.daily.time.slice(0, 7);

		let bestIdx = 0;
		let bestScore = Number.POSITIVE_INFINITY;

		for (let d = 0; d < days.length; d++) {
			const dayISO = days[d];
			const idxs = this.indicesForDay(data.hourly.time, dayISO);
			if (!idxs.length) continue;

			const windAvg = this.avg(idxs.map(i => data.hourly.wind_speed_10m[i]));
			const rainProbAvg = this.avg(idxs.map(i => data.hourly.precipitation_probability[i]));

			const score = (windAvg * 1.0) + (rainProbAvg * 0.3);
			if (score < bestScore) {
				bestScore = score;
				bestIdx = d;
			}
		}

		return bestIdx;
	}
}

