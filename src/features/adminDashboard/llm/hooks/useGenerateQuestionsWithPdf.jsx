import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { generateQuestionsWithPdf } from "../../../../services/apiLLM";

export const useGenerateQuestionsWithPdf = () => {
  return useMutation({
    mutationFn: generateQuestionsWithPdf,

    onSuccess: (data) => {
      toast.success(`✅ Generated ${data.count} questions successfully!`);
    },

    onError: (error) => {
      // Backend validation errors come through clearly now
      const message = error?.message || "Failed to generate questions";
      toast.error(message);
      console.error(error);
    },
  });
};

export default useGenerateQuestionsWithPdf;
