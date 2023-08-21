import {ActionResponseInterface} from "@/actions/interface/ActionResponseInterface";

export default abstract class BaseAction {
    protected error: any;
    protected success: boolean;
    protected result: any;
    protected virtualData: object | any = {}

    // Define execute as an abstract method
    abstract execute(data: any | null): any;

    constructor() {
        this.success = false;
        this.setResult(null)
        this.setError(null)
    }

    setError(error: ActionResponseInterface) {
        this.error = error;
    }

    getError(): ActionResponseInterface {
        return this.error;
    }

    isSuccess(): boolean {
        return !this.hasError();
    }

    hasError(): boolean {
        return this.error !== null && Object.keys(this.error).length > 0;
    }

    setResult(result: any, message: string = '') {
        const actionResult: ActionResponseInterface = {
            success: true,
            message: message,
            data: result
        }

        this.result = actionResult;
    }

    getResult(): ActionResponseInterface {
        return this.result;
    }

    // Getter method to get the full virtualData object or specific part by key
    getVirtualData(key = null): any {
        if (key) {
            if (key in this.virtualData) {
                return this.virtualData[key];
            } else {
                throw new Error(`Invalid key '${key}' for virtualData.`);
            }
        } else {
            return this.virtualData;
        }
    }

    // Setter method to set data by key
    setVirtualData(key, value: object) {
        if (key in this.virtualData) {
            this.virtualData[key] = value;
        } else {
            this.virtualData[key] = value;
        }
    }

    clearVirtualData() {
        this.virtualData = {}
    }



    setActionErrorReject(e: Error) {
        this.setResult(null)
        this.clearVirtualData()
        this.setError({
            success: false,
            message: e.message,
            data: null
        })
    }

    getActionResolvedData(): ActionResponseInterface {
        this.setError(null)
        this.setResult(this.getVirtualData())

        return this.getResult()
    }
}