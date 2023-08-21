interface ValidationRule {
    fieldName: string;
    rules: string;
}

type ValidationErrors = { [key: string]: string[] };

class Validator {
    private data: { [key: string]: any };
    private rules: ValidationRule[];
    private errors: ValidationErrors;

    constructor(data: { [key: string]: any }) {
        this.data = data;
        this.rules = [];
        this.errors = {};
    }

    public addRule(fieldName: string, rules: string): void {
        this.rules.push({ fieldName, rules });
    }

    public validate(): boolean {
        this.errors = {};

        for (const rule of this.rules) {
            const { fieldName, rules } = rule;
            const fieldValue = this.data[fieldName];
            const ruleList = rules.split("|");

            for (const ruleItem of ruleList) {
                const [ruleName, ruleParams] = ruleItem.split(":");
                const isValid = this.validateRule(ruleName, fieldValue, ruleParams);

                if (!isValid) {
                    this.addError(fieldName, ruleName, ruleParams);
                }
            }
        }

        return Object.keys(this.errors).length === 0;
    }

    public getErrors(): ValidationErrors {
        return this.errors;
    }

    private validateRule(
        ruleName: string,
        value: any,
        ruleParams: string | undefined
    ): boolean {
        // Implement your validation rules here
        // You can use switch-case or if-else to handle different rules
        switch (ruleName) {
            case "required":
                return this.validateRequired(value);
            case "min":
                return this.validateMin(value, parseInt(ruleParams || "0", 10));
            case "max":
                return this.validateMax(value, parseInt(ruleParams || "0", 10));
            // Add more rules as needed
            default:
                return true;
        }
    }

    private validateRequired(value: any): boolean {
        return value !== undefined && value !== null && value !== "";
    }

    private validateMin(value: any, minValue: number): boolean {
        return value >= minValue;
    }

    private validateMax(value: any, maxValue: number): boolean {
        return value <= maxValue;
    }

    private addError(
        fieldName: string,
        ruleName: string,
        ruleParams: string | undefined
    ): void {
        if (!this.errors[fieldName]) {
            this.errors[fieldName] = [];
        }

        const errorMessage = this.getErrorMessage(fieldName, ruleName, ruleParams);
        this.errors[fieldName].push(errorMessage);
    }

    private getErrorMessage(
        fieldName: string,
        ruleName: string,
        ruleParams: string | undefined
    ): string {
        // You can customize the error messages here based on the ruleName and ruleParams
        switch (ruleName) {
            case "required":
                return `${fieldName} is required.`;
            case "min":
                return `${fieldName} must be at least ${ruleParams} characters.`;
            case "max":
                return `${fieldName} must not exceed ${ruleParams} characters.`;
            // Add more error messages as needed
            default:
                return "Invalid value.";
        }
    }
}


export default Validator