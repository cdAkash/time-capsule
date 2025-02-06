import { processCapsules } from "./processCapsules.js";
import { scheduleCapsule } from "./eventBridge.js";

export const handler = async (event) => {
    try {
        console.log("Handler invoked with event:", event);

        // 1. Fetch capsules
        const results = await processCapsules();
        console.log("Process Capsules Results:", results);

        if (!results || results.length === 0) {
            throw new Error("No capsules processed");
        }
        const printResponse=[];
        for(const capsuleMessageString of results){
            const scheduleResponse = await scheduleCapsule(capsuleMessageString)
            console.log(scheduleResponse)
            printResponse.push(scheduleResponse)
        }
        // const scheduleResponse = scheduleCapsule(results)
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Capsules processed and queued successfully",
                printResponse
            })
        };

    } catch (error) {
        console.error("Error processing capsules:", error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to process and queue capsules',
                details: error.message 
            })
        };
    }
};