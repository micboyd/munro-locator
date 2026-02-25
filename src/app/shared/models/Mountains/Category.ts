import { CategoryResponse } from "./CategoryResponse";

export class Category {
    name: string;
    count: number;

    constructor(response: CategoryResponse) {
        this.name = response.name;
        this.count = response.count;
    }
}
