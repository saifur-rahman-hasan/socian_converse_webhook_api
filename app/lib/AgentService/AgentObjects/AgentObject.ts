export default class AgentObject {
    id: number;
    name: string;
    email: string;
    image: string | null;
    online: boolean;
    status: 'available' | 'busy' | 'break' | 'offline';

    constructor(id: number, name: string, email: string, image: string | null, online: boolean, status: 'available' | 'busy' | 'break' | 'offline') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.image = image;
        this.online = online;
        this.status = status;
    }
}