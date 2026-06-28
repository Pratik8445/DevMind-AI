import { runWorkflow }
    from "./workflows/projectWorkflow.js";

async function run() {

    const result =
        await runWorkflow(
            "Build a Food Delivery App"
        );

    console.log(result);
}

run();