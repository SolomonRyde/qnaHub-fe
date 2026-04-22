import React from "react";
import ExamCard from "./ExamCard";

const ExamGrid = ({ exams }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
};

export default ExamGrid;
