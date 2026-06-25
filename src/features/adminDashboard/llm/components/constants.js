export const STAGES = [
  { id: "context", label: "Selecting exam context" },
  { id: "prompt", label: "Building prompt" },
  { id: "generate", label: "Generating questions" },
  { id: "validate", label: "Validating answers" },
  { id: "preview", label: "Preparing preview" },
];

export const INITIAL_FORM = {
  exam_id: "",
  difficulty: "easy",
  count: 10,
  prompt_template: "General Knowledge",
  prompt: "",
  model: "gemini-2.5-flash",
};

export const TABS = [
  { id: "generate", label: "Generate Questions" },
  { id: "files", label: "Generated Files" },
];
