import { AppLoadingState } from './AppLoadingState';
// import { WidgetResponse } from './renderer/UIElement';
// import { Block } from './Block';
// import { ItemHeader } from './ItemHeader';
import { ErrorState } from './ErrorState';
import { AppLifeCycleState } from './AppLifeCycleState';
import { LaunchModeState } from './LaunchModeState';
// import { ToolbarAndToolsState } from './ToolState';

export interface AppState {
  appLoadingState: AppLoadingState;
  // assessmentState: Assessment;
  // bookletState: Block[];
  // itemState: Item;
  // itemHeadersState: ItemHeader[];
  // responseState: WidgetResponse;
  appLifeCycleState: AppLifeCycleState;
  launchModeState: LaunchModeState;
  errorState: ErrorState[];
  // toolSettingState?: ToolSettingState[];
  //added 11/11/2020 onward. TODO: discuss if the following property should be moved to AppConfigState
  // schoolSessionStudentState?: SchoolSessionStudentState;
  // toolbarAndToolsState: ToolbarAndToolsState;
}
