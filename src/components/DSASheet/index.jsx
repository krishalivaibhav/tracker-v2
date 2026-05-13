import StepGrid from './StepGrid.jsx';
import StepDetail from './StepDetail.jsx';
import SubstepDetail from './SubstepDetail.jsx';

export default function DSASheet({
  data, selectedStep, selectedSubstep,
  onStepClick, onSubstepClick, onBackToSteps, onBackToStep, onOpenSubstep,
  onToggleProblem, onToggleRevision, onSaveNote, onDailyNoteSave, onOpenCodeEditor,
}) {
  if (selectedStep !== null && selectedSubstep !== null) {
    return (
      <SubstepDetail
        data={data}
        stepIdx={selectedStep}
        substepIdx={selectedSubstep}
        onBackToSteps={onBackToSteps}
        onBackToStep={onBackToStep}
        onOpenSubstep={onOpenSubstep}
        onToggleProblem={onToggleProblem}
        onToggleRevision={onToggleRevision}
        onSaveNote={onSaveNote}
        onOpenCodeEditor={onOpenCodeEditor}
      />
    );
  }
  if (selectedStep !== null) {
    return (
      <StepDetail
        data={data}
        stepIdx={selectedStep}
        onBack={onBackToSteps}
        onSubstepClick={onSubstepClick}
      />
    );
  }
  return (
    <StepGrid
      data={data}
      onStepClick={onStepClick}
      onNoteSave={onDailyNoteSave}
    />
  );
}
