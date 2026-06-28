import {
  backendAgent
}
from "./agents/backendAgent.js";

async function run() {

  const result =
    await backendAgent(
      "Food Delivery App",
      "React + Express + MySQL"
    );

  console.log(result);
}

run();