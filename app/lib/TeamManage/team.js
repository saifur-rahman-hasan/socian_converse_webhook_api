import prisma from "@/lib/prisma";
import collect from "collect.js";

export default class TeamManager {
    constructor(userId = null) {
        this.userId = userId
    }

    async myTeams() {
        const myteams = await prisma.TeamMember.findMany({
            where: { userId: this.userId },
            include: {team:true}
        })

        let teamData = [];
        myteams.map(item=>{

            let dataObj = item?.team;
            dataObj['role'] = item?.role;
            dataObj['userId'] = item?.userId;

            const hexCharacters = "0123456789ABCDEF"; // Create an array of all possible hex characters
            let color = "#"; // Initialize the color variable with a hash (#) symbol
            
            for (let i = 0; i < 6; i++) { // Generate a 6-digit hexadecimal color code
                const randomIndex = Math.floor(Math.random() * hexCharacters.length); // Get a random index to choose a character from hexCharacters
                color += hexCharacters[randomIndex]; // Append the randomly chosen character to the color string
            }

            dataObj['color_code'] = 'bg-gray-500';
            
            teamData.push(dataObj);
        })

        return teamData;
    }
}
