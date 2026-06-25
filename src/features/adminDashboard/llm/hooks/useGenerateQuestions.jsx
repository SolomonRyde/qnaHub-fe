import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { generateQuestions } from "../../../../services/apiLLM";

export const useGenerateQuestions = () => {
  return useMutation({
    mutationFn: generateQuestions,

    onSuccess: (data) => {
      toast.success(`✅ Generated ${data.count} questions successfully!`);
    },

    onError: (error) => {
      // Backend validation errors come through clearly now
      const message = error?.message || "Failed to generate questions";
      toast.error(`❌ ${message}`);
      console.error("Question generation error:", error);
    },
  });
};

export default useGenerateQuestions;
