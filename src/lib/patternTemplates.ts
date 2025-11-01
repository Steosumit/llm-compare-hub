export const patternTemplates = {
  cot: "Think step by step to solve this problem:\n\n",
  meta: "Please generate a prompt that would help me:\n\n",
  persona: "You are a [ROLE]. Your task is to:\n\n",
  template: "Given [INPUT], please [ACTION] and provide [OUTPUT]:\n\n",
  refinement: "Help me refine this question to get better results:\n\n",
  alternatives: "Provide 3 different approaches to:\n\n",

  // Requirements Elicitation
  requirementsSimulator: "I want you to act as the system. Use the requirements to guide your behavior. I will ask you to do X, and you will tell me if X is possible given the requirements. If X is possible, explain why using the requirements. If I can't do X based on the requirements, write the missing requirements needed in format Y.",
  specificationDisambiguation: "Within this scope. Consider these requirements or specifications. Point out any areas of ambiguity or potentially unintended outcomes",

  // System Design and Simulation
  apiGenerator: "Using system description X. Generate an API specification for the system. The API specification should be in format Y",
  apiSimulator: "Act as the described system using specification X. I will type in requests to the API in format Y. You will respond with the appropriate response in format Z based on specification X",
  fewShotCodeExampleGeneration: "I am going to provide you system X. Create a set of N examples that demonstrate usage of system X. Make the examples as complete as possible in their coverage. (Optionally) The examples should be based on the public interfaces of system X. (Optionally) The examples should focus on X",
  dslCreation: "I want you to create a domain-specific language for X. The syntax of the language must adhere to the following constraints. Explain the language to me and provide some examples",
  architecturalPossibilities: "I am developing a software system with X for Y. The system must adhere to these constraints. Describe N possible architectures for this system. Describe the architecture in terms of Q",
  changeRequestSimulation: "My software system architecture is X. The system must adhere to these constraints. I want you to simulate a change to the system that I will describe. Describe the impact of that change in terms of Q. This is the change to my system",

  // Code Quality
  codeClustering: "Within scope X. I want you to write or refactor code in a way that separates code with property Y from code that has property Z. if bad. These are examples of code with property Y. These are examples of code with property Z.",
  intermediateAbstraction: "If you write or refactor code with property X. that uses other code with property Y. (Optionally) Define property X. (Optionally) Define property Y. Insert an intermediate abstraction Z between X and Y. (Optionally) Abstraction Z should have these properties",
  principledCode: "Within this scope. Generate, refactor, or create code to adhere to named Principle X",
  hiddenAssumptions: "Within this scope. List the assumptions that this code makes. (Optionally) Estimate how hard it would be to change these assumptions or their likelyhood of changing",

  // Refactoring
  pseudoCodeRefactoring: "Refactor the code. So that it matches this pseudo-code. Match the structure of the pseudo-code as closely as possible",
  dataGuidedRefactoring: "Refactor the code. So that its input, output, or stored data format is X. Provide one or more examples of X"
} as const;

export type PatternType = keyof typeof patternTemplates;

// Human-readable names for UI display
export const patternNames: Record<PatternType, string> = {
  cot: "Chain of Thought",
  meta: "Meta Language Generation",
  persona: "Persona Pattern",
  template: "Template Pattern",
  refinement: "Question Refinement",
  alternatives: "Alternative Approaches",

  requirementsSimulator: "Requirements Simulator",
  specificationDisambiguation: "Specification Disambiguation",

  apiGenerator: "API Generator",
  apiSimulator: "API Simulator",
  fewShotCodeExampleGeneration: "Few-Shot Code Examples",
  dslCreation: "DSL Creation",
  architecturalPossibilities: "Architectural Possibilities",
  changeRequestSimulation: "Change Request Simulation",

  codeClustering: "Code Clustering",
  intermediateAbstraction: "Intermediate Abstraction",
  principledCode: "Principled Code",
  hiddenAssumptions: "Hidden Assumptions",

  pseudoCodeRefactoring: "Pseudo-Code Refactoring",
  dataGuidedRefactoring: "Data-Guided Refactoring"
};

