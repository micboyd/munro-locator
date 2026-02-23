import { CategoryResponse } from "./CategoryResponse";

export class Category {
    name: string;

    constructor(response: CategoryResponse) {
        this.name = response.name;
    }  
}