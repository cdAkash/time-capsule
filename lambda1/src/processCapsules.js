import CapsuleProcessor from './getDbData.js';
import {getCapsuleData} from './getContractData.js'
import { downloadAndHashFile } from './fileDownload.js';
const processCapsules = async()=>{
    const todayDate = new Date().toISOString();
    const capsuleProcessor = new CapsuleProcessor();
    try {
        const DbResponse = await capsuleProcessor.getPendingCapsulesForToday(todayDate);
        if (!DbResponse || DbResponse.length === 0) {
            console.log("No pending capsules found for today.");
            return [];
        }
        const results = [];
        for(const capsule of DbResponse){
            const contractAddress = capsule.contractAddress
            const ContractResponse = await getCapsuleData(contractAddress)
            const fileHashFromContract = ContractResponse.data.hash
            const fileLink = capsule.fileURL
            const fileHashCurr = await downloadAndHashFile(fileLink)
            console.log("Current Hash",fileHashCurr)
            console.log("Contract Hash",fileHashFromContract)
            if (fileHashFromContract !== fileHashCurr) {
                console.error(`Hash mismatch for capsule: ${capsule.SK}`);
                const errorMessage = "Your data has been tampered. Sorry!";
                results.push(errorMessage);
                continue; 
            }

            const  email  = ContractResponse.data.email;
            console.log(email)
            const { emails, deliveryDate } = capsule;
            const deliveryTime = deliveryDate.split('T')[1].split('Z')[0];
            const stringToDeliver =`${email},${emails.join(',')},${deliveryTime},${fileLink}`;
            
            results.push(stringToDeliver)
            
        }
        return results;
    } catch (error) {
        console.error('Error processing capsules:', error);
        return error;
    }
}

export {processCapsules};