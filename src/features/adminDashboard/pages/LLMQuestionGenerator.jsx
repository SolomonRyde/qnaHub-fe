import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Activity,
  ListChecks,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Hooks & Services
import { useGenerateQuestions } from "../llm/hooks/useGenerateQuestions";
import { useAdminExams } from "../../exams/hooks/useExams";
import downloadQuestionsCsv from "../../../lib/downloadQuestionsCsv";
import {
  validateGenerationParams,
  getGeneratedFiles,
  deleteGeneratedFile,
  getAiStats,
} from "../../../services/apiLLM";

// UI Components
import { StatCard } from "../../../components/ui/StatCard";
import QuestionGeneratorForm from "../llm/components/QuestionGeneratorForm";
import QuestionPreview from "../llm/components/QuestionPreview";

// Extracted Local Modules
import { INITIAL_FORM, TABS } from "../llm/components/constants";
import UsageAnalyticsSummary from "../llm/components/UsageAnalyticsSummary";
import LiveConfigSummary from "../llm/components/LiveConfigSummary";
import EmptyQuestionsState from "../llm/components/EmptyQuestionsState";
import AIGenerationProgress, {
  useStageIndex,
} from "../llm/components/AIGenerationProgress";
import SuccessCard from "../llm/components/SuccessCard";
import { FilesTable, EmptyFilesState } from "../llm/components/FilesTable";

const AIQuestionGeneratorPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [questions, setQuestions] = useState([]);
  const [lastExamTitle, setLastExamTitle] = useState(null);
  const [examMetadata, setExamMetadata] = useState(null); // ✅ Store exam metadata
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generationTime, setGenerationTime] = useState(null);

  const [aiStats, setAiStats] = useState({
    total_requests: 0,
    successful_generations: 0,
    failed_generations: 0,
    total_questions_generated: 0,
    total_prompt_tokens: 0,
    total_output_tokens: 0,
    total_tokens_used: 0,
  });
  const [currentUsage, setCurrentUsage] = useState(null);

  const [activeTab, setActiveTab] = useState("generate");
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const { data: examsData } = useAdminExams({
    limit: 100,
    status: "published",
  });
  const exams = examsData?.exams || examsData?.data || [];

  const {
    mutate: generateQuestions,
    isPending: isLoading,
    isError,
    error,
  } = useGenerateQuestions();
  const stageIndex = useStageIndex(isLoading);

  useEffect(() => {
    const fetchInitialStats = async () => {
      try {
        const res = await getAiStats();
        if (res.success && res.stats) setAiStats(res.stats);
      } catch (err) {
        console.error("Failed to fetch initial AI stats:", err);
      }
    };
    fetchInitialStats();
  }, []);

  useEffect(() => {
    if (activeTab === "files") fetchGeneratedFiles();
  }, [activeTab]);

  const fetchGeneratedFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await getGeneratedFiles();
      setGeneratedFiles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch generated files", err);
      toast.error("Failed to load generated files");
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleTabSwitch = (tabId) => {
    if (tabId === activeTab) return;
    setIsTabSwitching(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTabSwitching(false);
    }, 300);
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this generated file?"))
      return;
    try {
      await deleteGeneratedFile(id);
      toast.success("File deleted successfully");
      fetchGeneratedFiles();
    } catch (err) {
      toast.error("Failed to delete file");
    }
  };

  const handleGenerate = () => {
    const validation = validateGenerationParams(formData);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setQuestions([]);
    setIsPreviewOpen(false);
    setGenerationTime(null);
    setCurrentUsage(null);
    setExamMetadata(null); // ✅ Reset exam metadata
    const startTime = Date.now();

    generateQuestions(formData, {
      onSuccess: (data) => {
        const elapsed = (Date.now() - startTime) / 1000;
        setGenerationTime(parseFloat(elapsed.toFixed(1)));
        if (data?.questions?.length) {
          setQuestions(data.questions);
          const selectedExam = exams.find(
            (exam) => +exam.id === +formData.exam_id,
          );
          setLastExamTitle(selectedExam?.exam_title || "Unknown Exam");
          setCurrentUsage(data.usage);
          setAiStats(data.stats);

          // ✅ Store exam metadata from response
          if (data.exam_metadata) {
            setExamMetadata(data.exam_metadata);
          }

          toast.success("Questions generated successfully!");
        }
      },
      onError: () => setGenerationTime(null),
    });
  };

  const handleDownload = () => {
    if (!questions.length) return;
    // ✅ Pass exam metadata to CSV download
    downloadQuestionsCsv(
      questions,
      formData.exam_id || "questions",
      null,
      examMetadata,
    );
  };

  const hasQuestions = questions.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto md:py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
        AI Question Generator
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Total Requests"
          value={aiStats.total_requests.toLocaleString()}
          icon={Activity}
          variant="neutral"
        />
        <StatCard
          title="Questions Generated"
          value={aiStats.total_questions_generated.toLocaleString()}
          icon={ListChecks}
          variant="success"
        />
        <StatCard
          title="Prompt Tokens"
          value={aiStats.total_prompt_tokens.toLocaleString()}
          icon={ArrowUpRight}
          variant="info"
        />
        <StatCard
          title="Output Tokens"
          value={aiStats.total_output_tokens.toLocaleString()}
          icon={ArrowDownLeft}
          variant="warning"
        />
        <StatCard
          title="Total Tokens Used"
          value={aiStats.total_tokens_used.toLocaleString()}
          icon={Zap}
          variant="primary"
        />
      </div>

      <div className="mb-8 inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabSwitch(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isTabSwitching ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : activeTab === "generate" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <QuestionGeneratorForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-6 self-start">
            <LiveConfigSummary formData={formData} exams={exams} />
            <UsageAnalyticsSummary stats={aiStats} />
            {isLoading && <AIGenerationProgress stageIndex={stageIndex} />}
            {!isLoading && hasQuestions && (
              <SuccessCard
                examTitle={lastExamTitle}
                difficulty={formData.difficulty}
                questionCount={questions.length}
                generationTime={generationTime}
                usage={currentUsage}
                onPreview={() => setIsPreviewOpen(true)}
                onDownload={handleDownload}
                onRegenerate={handleGenerate}
                isLoading={isLoading}
              />
            )}
            {!isLoading && !hasQuestions && <EmptyQuestionsState />}
            {isError && error && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-4 border-l-red-500">
                <div className="flex gap-3">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Generation failed: </span>
                    {error.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {isLoadingFiles ? (
            <div className="flex items-center justify-center gap-2 p-16 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading files...
            </div>
          ) : generatedFiles.length === 0 ? (
            <EmptyFilesState />
          ) : (
            <FilesTable files={generatedFiles} onDelete={handleDeleteFile} />
          )}
        </div>
      )}

      {hasQuestions && isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setIsPreviewOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview Questions ({questions.length})
              </h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close preview"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
              {questions.length > 0 ? (
                <QuestionPreview questions={questions} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No questions to display
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuestionGeneratorPage;
