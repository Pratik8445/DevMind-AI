import { architectAgent }
    from "./agents/architectAgent.js";

async function run() {

    const result =
        await architectAgent(
            "Food Delivery Application with user registration, restaurant management, ordering, payments and order tracking."
        );

    console.log(result);
}

run();