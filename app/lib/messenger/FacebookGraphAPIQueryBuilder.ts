export default class FacebookGraphAPIQueryBuilder {
    private baseEndpoint: string;
    private accessToken: string;
    private fields: string[] = [];
    private parameters: Record<string, string | number> = {};

    constructor(baseEndpoint: string, accessToken: string) {
        this.baseEndpoint = baseEndpoint;
        this.accessToken = accessToken;
    }

    select(...fields: string[]): FacebookGraphAPIQueryBuilder {
        this.fields = fields;
        return this;
    }

    setParameter(key: string, value: string | number): FacebookGraphAPIQueryBuilder {
        this.parameters[key] = value;
        return this;
    }

    build(): string {
        const endpoint = `${this.baseEndpoint}?access_token=${this.accessToken}`;

        if (this.fields.length > 0) {
            const fieldsQueryParam = this.fields.join(',');
            this.parameters['fields'] = fieldsQueryParam;
        }

        const queryParams = Object.entries(this.parameters)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join('&');

        return `${endpoint}&${queryParams}`;
    }
}
