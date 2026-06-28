import { pmAgent } from "./agents/pmAgent.js";

async function run() {

    const result =
        await pmAgent(
            "Build a Food Delivery Application"
        );

    console.log(result);
}

run();