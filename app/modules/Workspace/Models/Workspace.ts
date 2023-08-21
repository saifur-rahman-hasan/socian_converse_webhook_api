import BaseModel from "@/modules/Workspace/Models/BaseModel";

export default class Workspace extends BaseModel{
    fillable: string[];
    table: string;

    constructor() {
        super();
        this.fillable = ['name', 'description']; // Define the fillable fields
        this.table = 'workspaces'; // Specify the table name
    }


    create() {
        // Implementation for create()
        console.log("Creating workspace");
    }

    update() {
        // Implementation for update()
        console.log("Updating workspace");
    }

    delete() {
        // Implementation for delete()
        console.log("Deleting workspace");
    }

    find() {
        // Implementation for find()
        console.log("Finding workspace");
    }

    findMany() {
        // Implementation for findMany()
        console.log("Finding multiple workspaces");
    }
}