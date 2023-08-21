import BaseAction from "@/actions/BaseAction";
import { ActionResponseInterface } from "@/actions/interface/ActionResponseInterface";
import UserInsertActionFunction from "@/actions/UserManager/UserInsertActionFunction";
import { UserInsertActionDataInterface, UserInsertActionParamsInterface } from "@/actions/interface/UserManagerInterface";

class UserInsertAction extends BaseAction {
    private params: UserInsertActionParamsInterface;
    private data: UserInsertActionDataInterface;
    private userActionFunction: UserInsertActionFunction; // Instance of UserInsertActionFunction

    constructor(
        params: UserInsertActionParamsInterface,
        data: UserInsertActionDataInterface
    ) {
        super();
        this.params = params;
        this.data = data;

        // Create an instance of UserInsertActionFunction
        this.userActionFunction = new UserInsertActionFunction();
    }

    /**
     * Execute a function dynamically and handle its result or error.
     * @param funcName - The name of the function to be executed.
     * @returns The result of the executed function.
     * @throws An error if the function fails.
     */
    private async executeFunction(funcName: string): Promise<any> {
        try {
            // Execute the function dynamically using the UserInsertActionFunction instance
            const func = this.userActionFunction[funcName];
            if (!func || typeof func !== 'function') {
                throw new Error(`Function '${funcName}' does not exist or is not executable.`);
            }

            const result = await func.call(this.userActionFunction, this.data, this.params);
            this.setVirtualData(funcName, { success: true, result });
            return result;
        } catch (error) {
            this.setVirtualData(funcName, { success: false, error: error.message });
            throw error;
        }
    }

    /**
     * Execute the UserInsertAction by running a series of functions dynamically.
     * @returns A Promise that resolves with the user data if successful, or rejects with an error if any function fails.
     */
    async execute(): Promise<ActionResponseInterface> {
        try {
            // Define the array of functions to be executed dynamically
            const executableFunctions = [
                "validateAndCollectData",
                "verifyUserPermission",
                "findUniqueUser",
                "createUser",
                "fireSocketEmit",
            ];

            // Execute the functions dynamically and stop if any of them fails
            for (const funcName of executableFunctions) {
                await this.executeFunction(funcName);
            }

            const userData = this.getVirtualData('userData');

            // If everything is successful, resolve with the user data
            this.setResult(userData, 'User inserted successfully');
            return this.getActionResolvedData();
        } catch (error) {
            // If there's an error, reject with the error details
            this.setActionErrorReject(error);
            return Promise.reject(this.getError());
        }
    }
}

export default UserInsertAction;
