// import CapsuleProcessor from './getDbData.js';
import {getCapsuleData} from './getContractData.js'

 const handler = async (event) => {
    // const todayDate = new Date().toISOString();
    // const capsuleProcessor = new CapsuleProcessor();

    // try {
    //     const response = await capsuleProcessor.getPendingCapsulesForToday(todayDate);
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify(response)
    //     };
    // } catch (error) {
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({ error: 'Failed to fetch pending capsules' })
    //     };
    // }
    try {
        const response = await getCapsuleData("0x45b244301dd6F9A3d8A3EdB562573a2741b6e5b4")
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch pending capsules' })
        };
    }
};

export {handler}
