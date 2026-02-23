import { MountainResponse } from "./MountainResponse";

export class Mountain {
    _id: string;
    name: string;
    category: string[];
    country: string;
    meaning: string;
    height: number;
    latitude: number;
    longitude: number;
    region: string;
    imageUrl: string;

    constructor(response: MountainResponse) {
        this._id = response._id;
        this.name = response.name;
        this.category = response.category;
        this.country = response.country;
        this.meaning = response.meaning;
        this.height = response.height;
        this.latitude = response.latitude;
        this.longitude = response.longitude;
        this.region = response.region;
        this.imageUrl = response.imageUrl;
    }
}
