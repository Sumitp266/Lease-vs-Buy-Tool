import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const parameters = [
  { name: "Capital Availability", options: ["Low", "Medium", "High"] },
  { name: "Tech Refresh Cycle", options: ["Rare", "Moderate", "Frequent"] },
  { name: "Tax Preference", options: ["Not Important", "Somewhat", "Very Important"] },
  { name: "Maintenance & Support", options: ["Low", "Medium", "High"] },
  { name: "Scalability Needs", options: ["Low", "Medium", "High"] },
  { name: "Asset Longevity", options: ["Short", "Medium", "Long"] },
  { name: "Disposal Complexity", options: ["Easy", "Moderate", "Complex"] }
];

const inputMapping = {
  Low: 1,
  Medium: 3,
  High: 5,
  Rare: 1,
  Moderate: 3,
  Frequent: 5,
  "Not Important": 1,
  Somewhat: 3,
  "Very Important": 5,
  Short: 1,
  Long: 5,
  Easy: 1,
  Complex: 5
};

const scenarioWeights = {
  Recession: [25, 20, 15, 15, 10, 10, 5],
  "High Growth": [15, 25, 10, 10, 20, 10, 10],
  "Low Interest": [10, 15, 25, 10, 10, 20, 10],
  "Uncertain Tariffs": [20, 15, 10, 20, 10, 10, 15],
  Neutral: [15, 15, 15, 15, 15, 15, 10]
};

export default function LeaseVsBuyTool() {
  const [scenario, setScenario] = useState("Neutral");
  const [inputs, setInputs] = useState(Array(parameters.length).fill(""));
  const [result, setResult] = useState(null);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const calculateDecision = () => {
    const weights = scenarioWeights[scenario];
    let score = 0;
    let valid = true;

    inputs.forEach((input, i) => {
      const mappedScore = inputMapping[input] || 0;
      if (!mappedScore) valid = false;
      score += mappedScore * weights[i];
    });

    if (!valid) {
      setResult("Please fill all parameters.");
      return;
    }

    const finalScore = Math.round((score / 100) * 100) / 100;
    let decision = "Neutral / Evaluate further";
    if (finalScore > 3.5) decision = "Lease";
    else if (finalScore < 2.5) decision = "Buy";

    setResult(`Final Score: ${finalScore} → Decision: ${decision}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lease vs Buy Decision Tool</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Scenario</label>
        <Select onValueChange={setScenario} defaultValue="Neutral">
          <SelectTrigger>
            <SelectValue placeholder="Select a scenario" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(scenarioWeights).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="space-y-4 py-6">
          {parameters.map((param, index) => (
            <div key={index}>
              <label className="block font-semibold mb-1">{param.name}</label>
              <Select onValueChange={(val) => handleInputChange(index, val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {param.options.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button onClick={calculateDecision}>Calculate</Button>

          {result && (
            <div className="mt-4 font-semibold text-lg text-blue-600">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
