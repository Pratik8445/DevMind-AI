import { pmAgent }
from "../agents/pmAgent.js";

import { architectAgent }
from "../agents/architectAgent.js";

import { backendAgent }
from "../agents/backendAgent.js";

import { qaAgent }
from "../agents/qaAgent.js";

export async function runWorkflow(
  idea
) {

  console.log(
    "Running PM Agent..."
  );

  const requirements =
  await pmAgent(idea);

const architecture =
  await architectAgent(
    requirements
  );

const backend =
  await backendAgent(
    requirements,
    architecture
  );

const qa =
  await qaAgent(
    requirements,
    architecture,
    backend
  );

return {
  requirements,
  architecture,
  backend,
  qa
};
}