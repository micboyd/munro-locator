export class MountainRequest {
    name: string;
    category: string;
    country: string;
    meaning: string;
    height: number;
    latitude: number;
    longitude: number;
    region: string;
    imageUrl: string;

    constructor(
        name: string,
        category: string,
        country: string,
        meaning: string,
        height: number,
        latitude: number,
        longitude: number,
        region: string,
        imageUrl: string
    ) {
        this.name = name;
        this.category = category;
        this.country = country;
        this.meaning = meaning;
        this.height = height;
        this.latitude = latitude;
        this.longitude = longitude;
        this.region = region;
        this.imageUrl = imageUrl;
    }
}
