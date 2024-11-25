import  UnitScoresDashboard  from '@/components/dashboard/UnitScoresDashboard';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordian";

export default function App() {
  return (
    <main className="container mx-auto p-4">
      {/* Page Title */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Unit Scores Dashboard</h1>

        {/* Introductory Card */}
        <Card className="mb-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">What is this?</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              This is a data visualization app that summarizes SETU data for each unit and presents the data in a visually helpful manner.
              For reference, the 13 items correspond to various educational properties.
            </p>
          </CardContent>
        </Card>

        {/* Accordion for Detailed Information */}
        <Accordion type="single" collapsible className="shadow-md">
          <AccordionItem value="itemDetails">
            <AccordionTrigger className="font-semibold text-lg">Detailed Breakdown</AccordionTrigger>
            <AccordionContent>
              The 13 items correspond to different learning outcomes which are listed below:
              <ul className="list-disc list-inside pl-4">
                <li>Clarity of Learning Outcomes</li>
                <li>Clear Assessment</li>
                <li>Demonstrate Learning Outcomes</li>
                <li>Feedback and Learning Outcomes</li>
                <li>Resources and Learning Outcomes</li>
                <li>Activities and Learning Outcomes</li>
                <li>Engagement</li>
                <li>Satisfaction</li>
                <li>Relevant Assessment to Unit</li>
                <li>Links Between Content</li>
                <li>Good Mix of Theory and Application</li>
                <li>Active Participation</li>
                <li>Capacity for Critical Thinking</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="usageTips">
            <AccordionTrigger className="font-semibold text-lg">Usage Tips</AccordionTrigger>
            <AccordionContent>
              <p>The Basics:</p>
              <ul className="list-disc list-inside pl-4">
                <li>Initially blank data means no filters have been applied. Try >=1 in the Level category.</li>
                <li>Use inequalities to filter numeric columns (e.g., Items 1-13, mean score, Responses).</li>
                <li>Sort by highest/lowest using the header arrows in each category.</li>
                <li>Text rows (e.g., unit code, semester) can be filtered by keywords.</li>
                <li>Navigate between pages if results exceed 50.</li>
                <li>Add units to the comparison table by clicking their checkboxes.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="visualization">
            <AccordionTrigger className="font-semibold text-lg">Understanding the Visualization</AccordionTrigger>
            <AccordionContent>
              <p>
                Items are ranked out of 5 and color-coded: redder colors indicate lower scores (closer to 1), and greener colors indicate higher scores
                (closer to 5). Grayed-out items lack scores. Use the Toggle Columns button to show/hide specific categories.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </header>

      {/* Dashboard */}
      <UnitScoresDashboard />
    </main>
  );
}
