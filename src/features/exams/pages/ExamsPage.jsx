import { Navbar } from "../../landingPage/components/Navbar";
import ExamsLayout from "../../exams/components/ExamsPage";

export default function ExamsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 ">
        <ExamsLayout />
      </main>
      {/* <Footer /> */}
    </>
  );
}
