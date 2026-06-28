import { qaAgent }
from "./agents/qaAgent.js";

async function run() {

  const result =
    await qaAgent(
      "Food Delivery Requirements",
      "React + Express + MySQL",
      "Controllers Routes Models"
    );

  console.log(result);
}

run();