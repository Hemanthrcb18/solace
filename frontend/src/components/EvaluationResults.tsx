import React from "react";
import { EvalResult } from "../services/api";
export default function EvaluationResults({ results }: { results: EvalResult }) {
  return <div>{results.reasoning}</div>;
}
