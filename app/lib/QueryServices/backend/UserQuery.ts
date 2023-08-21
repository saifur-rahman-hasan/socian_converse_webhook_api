import prisma from "@/lib/prisma";

export default class UserQuery {
    private prismaClient: any;

    constructor() {
    }

    async findUserById(userId: number) {
        try {
            const promiseData = await prisma.user.findFirst({where: {id: userId}})

            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.reject(e)
        }
    }
}

// , active_task_count: activeTaskCount
