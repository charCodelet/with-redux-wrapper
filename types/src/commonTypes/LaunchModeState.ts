import { SchoolSession, Student } from './SchoolSessionStudent';
// import { UIAction } from '../stateMachineTypes/UIAction';
//TODO: discuss if the launch modes are mutually exclusive
export enum LaunchMode {
  AssessmentAtSchool,
  AssessmentAtHome,
  AutomationTesting,
  BookletReset,
  COTW,
  ERPPreview,
  ItemViewer,
  RAel,
  ScoringSystem,
  TaskPlayer,
  TOTW,
}
//TODO: Rewrite this because UnSupportedAppFeatures array is replaced by an object mainky having boolean property for each configurability feature :
//      1. Configurability is supported in ADE ONLY at the level of a Launch mode - without any additional conditionality.
//      2. Configurability is proposed to be implemented as follows:
//        a. The core NextGen Delivery Engine (ADE) consists of a set of smaller code units (macro or micro functions) in this code base.
//        b. Each of the macro or micro function is tokenized in the form of generic UIAction object.
//        c. This configuarability interface provides a structure to define which of the UIActions are NOT supported in each Launch mode.
//        d. The event bus WOULD NOT RELAY any uiActions which exist in the UnSupportedAppFeatures to handlers, if it is defined for a launch mode.
//        e. If the UnsupportedAppFeatures is not defined for a launch mode or is empty, All the app features (UIActions) would be considered as supported for that launch mode.
//*************************************************  TODO: discuss:
//      3. Not sure which of the 2 interfaces, SupportedAppFeatures OR UnSupportedAppFeatures, would work better for each launch mode.
export interface LaunchModeState {
  sessionId?: string;
  launchMode?: LaunchMode;
  grade?: string;
  subject?: string;
  school?: SchoolSession; //TODO: this is not needed. should we delete this? tbd.
  student?: Student;
  //TODO: we need to strongly type the UnSupportedActionType to represent all action types in the app. So far, it seems that this may not work in all cases.
  //      So commenting out for now.
  // unSupportedUIActionTypes?: string[];

  configurations?: {
    // uiActionsSupported: [],
    //TODO: we need to strongly type the UnSupportedActionType to represent all action types in the app. tbd
    // UnSupportedUIActionTypes: string[],
    //TODO: All the configurability features need to be converted to appropriate action types, returned as unSupportedActionTypes array above  and then deleted from this interface. tbd.
    toolbar: boolean;
    sessionInActiveTimeout: number; //this is number of minutes a session is allowed to go on before it times out
    ODCaptureAndPersist: boolean;
    widgetResponseCapture: boolean;
    autoSaveAndRestore: boolean;
    //TODO: discuss what Tutorial means; commenting out for now
    // tutorial: true;
  };
}

// launchMode: LaunchMode;
//each UIAction in these arrays may be a Micro or a Macro UIAction.
//We need ONLY ONE of the following properties to be populated for a given Launch Mode.
//TODO: Decide which of the following is suitable for each launch mode:
// SupportedUIActions?: UIAction[]; //the uiActions in this array are supported in this launch mode
// UnSupportedUIActions?: UIAction[]; //the uiActions in this array are NOT supported in this launch mode
// }

//We need ONLY ONE of the following derived objects to be populated for a given Launch Mode.
//TODO: Decide which of the following is suitable for each launch mode:
// export interface SupportedAppFeatures extends AppFeaturesConfigState {
//   //each UIAction in these arrays may be a Micro or a Macro UIAction.
//   supportedUIActions: UIAction[]; //the uiActions in this array are supported in this launch mode
// }
// export interface UnSupportedAppFeatures extends AppFeaturesConfigState {
//   //each UIAction in these arrays may be a Micro or a Macro UIAction.
//   UnSupportedUIActions: UIAction[]; //the uiActions in this array are NOT supported in this launch mode
// }
