# TODO

- [x] Extend `src/services/aiService.ts` with `fillCVFromJobDescription(jobDescription, currentCV)` using OpenRouter chat completions and strict JSON output.

- [x] Update `src/components/cv/CVForm.tsx` UI to add a “Job Description” textarea and “Match & Fill CV” button.

- [x] Wire button to call the new AI service function and update the form state.

- [x] Ensure safe JSON parsing + error handling (toast messages) and keep existing CV values when AI output is incomplete.

- [ ] Run lint/tests and verify manual behavior.

