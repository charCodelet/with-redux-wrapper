// import { map } from 'rxjs/operators';
//***********************************  IMPORTANT : Read the following paragraph  *********************************************** */
/**
 * TLDR;
 * The state structures we find in current gen will not look the same as the data objects they receive from the API. But the data will be the same as what is finally given to the Toolbar itself.
 * Here, however, we expect consistency in the data received from the API and destined for the Toolbar.
 */

//The data passed to the interfaces in this file is the data passed to the toolbar component in current gen via selectors.
//The response data received from the API calls , however, provides minimal data (see toolbar.reducer in currentGen) and in a
//number of  different interfaces. And then, some of the data used in these interfaces are calculated in the code. All of these together would have the
//the data required in the final interfaces defined here.
// TODO: discuss with Satya and BE team to figure out a better strategy + new API calls to get all the required datata from a single call.
// import { ToolName } from './SharedEnums';
//******************************************************************************************************************************* */
//***************** Move the following block of enums to sharedEnums */
enum ToolName {
  Unknown = '',
  Help = 'help',
  Theme = 'theme',
  ZoomOut = 'zoomOut',
  ZoomIn = 'zoomIn',
  ReadAloud = 'readAloud',
  Scratchwork = 'scratchwork',
  // Pencil = 'pencil',
  // Highlighter = 'highlighter',
  // Eraser = 'eraser',
  Calculator = 'calculator',
  MathKeyboard = 'mathKeyboard',
  Bilingual = 'bilingual',
  Timer = 'timer',
  Progress = 'progress',
  Tabs = 'tabs',
  Toolbar = 'toolbar',
}
export enum ScratchworkToolName {
  Pencil = 'pencil',
  Highlighter = 'highlighter',
  Eraser = 'eraser',
  Clear = 'clear',
}
// export enum ToolStateType {
//   Item,
//   Block,
//   Global,
// }
// export enum ItemToolId {
//   // Help = 'help',
//   // Theme = 'theme',
//   // Zoom = 'zoom',
//   // ZoomOut = 'zoomOut',
//   // ZoomIn = 'zoomIn',
//   // Bilingual = 'bilingual',
//   ReadAloud = 3,
//   Scratchwork = 'scratchwork',
//   // MathKeyboard = 'mathKeyboard',
//   Calculator = 'calculator',
//   // Timer = 'timer',
//   // Progress = 'progress',
//   // Tabs = 'tabs', //added in NextGen for sake of completeness. May not need it
//   // Previous = 'previous',
//   // Next = 'next',
// }

// // The following enum, ToolNameKey, is known as ToolbarButtonName in CurrentGen.
// export enum ItemToolNameKey {
//   // Help = 'help',
//   // Theme = 'theme',
//   // Zoom = 'zoom',
//   // ZoomOut = 'zoomOut',
//   // ZoomIn = 'zoomIn',
//   // Bilingual = 'bilingual',
//   ReadAloud = 'readAloud',
//   Scratchwork = 'scratchwork',
//   ScratchworkPencil = 'scratchworkPencil',
//   ScratchworkHighlighter = 'scratchworkHighlighter',
//   ScratchworkEraser = 'scratchworkEraser',
//   ScratchworkClear = 'scratchworkClear',
//   // MathKeyboard = 'mathKeyboard',
//   Calculator = 'calculator',
//   // Timer = 'timer',
//   // Progress = 'progress',
//   // Tabs = 'tabs', //added in NextGen for sake of completeness. May not need it
//   // Previous = 'previous',
//   // Next = 'next',
// }
// export enum BlockToolNameKey {
//   Help = 'help',
//   // Theme = 'theme',
//   // Zoom = 'zoom',
//   // ZoomOut = 'zoomOut',
//   // ZoomIn = 'zoomIn',
//   // Bilingual = 'bilingual',
//   // ReadAloud = 'readAloud',
//   // Scratchwork = 'scratchwork',
//   // ScratchworkPencil = 'scratchworkPencil',
//   // ScratchworkHighlighter = 'scratchworkHighlighter',
//   // ScratchworkEraser = 'scratchworkEraser',
//   // ScratchworkClear = 'scratchworkClear',
//   MathKeyboard = 'mathKeyboard',
//   // Calculator = 'calculator',
//   // Timer = 'timer',
//   Progress = 'progress',
//   // Tabs = 'tabs', //added in NextGen for sake of completeness. May not need it
//   // Previous = 'previous',
//   // Next = 'next',
// }

// export enum GlobalToolNameKey {
//   // Help = 'help',
//   Theme = 'theme',
//   // Zoom = 'zoom',
//   ZoomOut = 'zoomOut',
//   ZoomIn = 'zoomIn',
//   Bilingual = 'bilingual',
//   // ReadAloud = 'readAloud',
//   // Scratchwork = 'scratchwork',
//   // ScratchworkPencil = 'scratchworkPencil',
//   // ScratchworkHighlighter = 'scratchworkHighlighter',
//   // ScratchworkEraser = 'scratchworkEraser',
//   // ScratchworkClear = 'scratchworkClear',
//   // MathKeyboard = 'mathKeyboard',
//   // Calculator = 'calculator',
//   Timer = 'timer',
//   // Progress = 'progress',
//   // Tabs = 'tabs', //added in NextGen for sake of completeness. May not need it
//   // Previous = 'previous',
//   // Next = 'next',
// }

export enum ThemeName {
  Default = 'brushed',
  BlackOnBeige = 'blackBeige',
  WhiteOnBlack = 'whiteBlack',
}

export const ZoomLevelPercentageMap = {
  0: 1.0,
  1: 1.25,
  2: 1.5,
  3: 2,
};

export enum CalculatorModel {
  TI_30XS = 'TI30',
  TI_108 = 'TI108',
}

export enum MathKeyboardMode {
  Grade4 = 'Grade4',
  Grade8 = 'Grade8',
  Grade12 = 'Grade12',
}

export enum BilingualLanguage {
  enUS = 'en',
  esUS = 'es-US',
}

export enum BilingualMode {
  None = 'None',
  Bilingual = 'Bilingual',
  DirectionsOnly = 'Directions-Only',
}

//The following TTS related interfaces have been brought over from CurrentGen only so that
//ReadAloudToolState has the required types defined. Need to revisit these when I have understood TTS.
export interface TTSInfo {
  // accessionNumber: string;
  id: number;
  prompt: string;
  url: string;
  language: string;
  segments: TTSSegmentInfo[];
  recreateFile: boolean;
}

export interface TTSSegmentInfo {
  segment: string;
  url: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TTSEventHandler = () => any | Promise<any>;

// export interface TTSPrompt implements TTSInfo {
//   accessionNumber: string = null;
//   id: number = null;
//   url: string = null;
//   language: string = null;
//   prompt: string = null;
//   segments: TTSPromptSegment[] = null;
//   recreateFile = true;
//   skipBlanks = false;
//   blanksCheck = /^[ ]*$/;
//   changed = false;
//   onBegin: TTSEventHandler[] = [];
//   onEnd: TTSEventHandler[] = [];

//****************************************************************   End of Shared Enums ******************************************** */
//****************************************************************   Toolbar and Tools State subtree ********************************** */

//******************************************************************* General Notes for State Subtree design *************************  */
//The final state subtree for Toolbar and Tools is divided into 3 categories listed below:
//1. Item Level : this will be fetched from BE API call every time an Item's content is fetched.
//                Store may have an array of tool states, as user navigates to items in block
//                When content of a current item exists in the Store, NextGen would use the item level state from the Store
//                This array is reset to empty when user navigates to a new Block
//2. Block Level : this will be fetched from BE API call every time an user navigates to a new Block
//                 Store keeps only a single instance of this for a current block.
//3. Global Level : this will be fetched only ONCE from BE API call every time an assessment starts
//                 Store keeps only a single instance of this for app as a whole and is applicable through entire app life cycle.
//*************************************************************End of General Notes for State Subtree design *************************  */

//NOTE: The following interface, ToolState, is known as IToolState in currentGen
//      And individual tool's state  interfaces in CurrentGen are known as IHelpToolState, IThemeToolState etc. each of which is derived from IToolState.
//      The names of these individual tool's state interfaces in NextGen just drop the leading I (HelpToolState, ThemeToolState)
//      The actual tool state object that each tool is given via selectors is actually computed (and not stored in Store) in selecors in CurrentGen
//       see https://npd-tools.naep.ed.gov/confluence/pages/viewpage.action?pageId=11337796 for details.
export interface ToolState {
  // type: ToolStateType;
  name: ToolName;
  // position in toolbar
  sequence: number;
  visible: boolean;
  enabled: boolean;
  tooltip: string;
}

// export interface ItemToolState extends ToolState {
//   name: ItemToolNameKey;
// }
// export interface BlockToolState extends ToolState {
//   name: BlockToolNameKey;
// }
// export interface GlobalToolState extends ToolState {
//   name: GlobalToolNameKey;
// }

// export interface HelpToolState extends ToolState {
//   name: BlockToolNameKey.Help;
//   activated: boolean;
// }
// export interface ThemeToolState extends ToolState {
//   name: ToolNameKey.Theme;
//   currentTheme: ThemeName;
// }
// export interface ZoomOutToolState extends ToolState {
//   name: GlobalToolNameKey.ZoomOut;
//   minZoomLevel: number;
//   maxZoomLevel: number;
//   currentZoomLevel: number;
//   activated: boolean;
// }
// export interface ZoomInToolState extends ToolState {
//   name: GlobalToolNameKey.ZoomIn;
//   minZoomLevel: number;
//   maxZoomLevel: number;
//   currentZoomLevel: number;
//   activated: boolean;
// }
// export interface ReadAloudToolState extends ToolState {
//   name: ItemToolNameKey.ReadAloud;
//   activated: boolean;
//   prompts: { [id: string]: TTSInfo };
//   activePrompt: TTSInfo;
// }
// export interface ScratchworkToolState extends ToolState {
//   name: ItemToolNameKey.Scratchwork;
//   activated: boolean;
//   activeTool:
//     | ItemToolNameKey.ScratchworkPencil
//     | ItemToolNameKey.ScratchworkHighlighter
//     | ItemToolNameKey.ScratchworkEraser
//     | ItemToolNameKey.ScratchworkClear;
// }
// export interface CalculatorToolState extends ToolState {
//   name: ItemToolNameKey.Calculator;
//   model: CalculatorModel;
//   displayMode?: 'Classic' | 'Mathprint';
//   activated: boolean;
// }
// export interface MathKeyboardToolState extends ToolState {
//   name: BlockToolNameKey.MathKeyboard;
//   mode: MathKeyboardMode;
//   activated: boolean;
//   activatedEquationAreaId: string;
// }
// export interface BilingualToolState extends ToolState {
//   name: GlobalToolNameKey.Bilingual;
//   mode: BilingualMode;
//   language: BilingualLanguage;
//   activated: boolean;
// }
// export interface TimerToolState extends ToolState {
//   name: GlobalToolNameKey.Timer;
//   expanded: boolean;
//   timeRemaining: number;
//   doNotRecordShowTimerObservable?: boolean;
// }
// export interface ProgressToolState extends ToolState {
//   name: BlockToolNameKey.Progress;
//   progress: number;
// }
// export interface HelpToolState extends ToolState {
//   name: BlockToolNameKey.Help;
//   activated: boolean;
// }
// export interface ThemeToolState extends ToolState {
//   name: ToolNameKey.Theme;
//   currentTheme: ThemeName;
// }
// export interface ZoomOutToolState extends ToolState {
//   name: GlobalToolNameKey.ZoomOut;
//   minZoomLevel: number;
//   maxZoomLevel: number;
//   currentZoomLevel: number;
//   activated: boolean;
// }
// export interface ZoomInToolState extends ToolState {
//   name: GlobalToolNameKey.ZoomIn;
//   minZoomLevel: number;
//   maxZoomLevel: number;
//   currentZoomLevel: number;
//   activated: boolean;
// }
// export interface ReadAloudToolState extends ToolState {
//   name: ItemToolNameKey.ReadAloud;
//   activated: boolean;
//   prompts: { [id: string]: TTSInfo };
//   activePrompt: TTSInfo;
// }
// export interface ScratchworkToolState extends ToolState {
//   name: ItemToolNameKey.Scratchwork;
//   activated: boolean;
//   activeTool:
//     | ItemToolNameKey.ScratchworkPencil
//     | ItemToolNameKey.ScratchworkHighlighter
//     | ItemToolNameKey.ScratchworkEraser
//     | ItemToolNameKey.ScratchworkClear;
// }
export interface HelpToolState extends ToolState {
  name: ToolName.Help;
  activated: boolean;
}
export interface ThemeToolState extends ToolState {
  name: ToolName.Theme;
  currentTheme: ThemeName;
}
export interface ZoomOutToolState extends ToolState {
  name: ToolName.ZoomOut;
  minZoomLevel: number;
  maxZoomLevel: number;
  currentZoomLevel: number;
  activated: boolean;
}
export interface ZoomInToolState extends ToolState {
  name: ToolName.ZoomIn;
  minZoomLevel: number;
  maxZoomLevel: number;
  currentZoomLevel: number;
  activated: boolean;
}
export interface ReadAloudToolState extends ToolState {
  name: ToolName.ReadAloud;
  activated: boolean;
  prompts: { [id: string]: TTSInfo };
  activePrompt: TTSInfo;
}
export interface ScratchworkToolState extends ToolState {
  name: ToolName.Scratchwork;
  activated: boolean;
  activeTool:
    | ScratchworkToolName.Pencil
    | ScratchworkToolName.Highlighter
    | ScratchworkToolName.Eraser
    | ScratchworkToolName.Clear;
}

export interface CalculatorToolState extends ToolState {
  name: ToolName.Calculator;
  model: CalculatorModel;
  displayMode?: 'Classic' | 'Mathprint';
  activated: boolean;
}
export interface MathKeyboardToolState extends ToolState {
  name: ToolName.MathKeyboard;
  mode: MathKeyboardMode;
  activated: boolean;
  activatedEquationAreaId: string;
}
export interface BilingualToolState extends ToolState {
  name: ToolName.Bilingual;
  mode: BilingualMode;
  language: BilingualLanguage;
  activated: boolean;
}
export interface TimerToolState extends ToolState {
  name: ToolName.Timer;
  expanded: boolean;
  timeRemaining: number;
  doNotRecordShowTimerObservable?: boolean;
}
export interface ProgressToolState extends ToolState {
  name: ToolName.Progress;
  progress: number;
}

export interface TabItem<T> {
  label: string;
  selected: boolean;
  answered: boolean;
  data: T;
}
// export interface TabsToolState extends ToolState {
//   name: BlockToolNameKey.Tabs;
//   disabled: boolean;
// }

//called ToolbarButtonSettingCollection in CurrentGen, this is the state subtreein the store for the Toolbar container + all the tools inthe Toolbar
// export type ToolsStateMap = {
//   [toolnameKey in ItemToolNameKey]: ItemToolState;
// };
// // export interface ItemToolsStateMap {
// //   [itemId: number]: ToolsStateMap;
// // }

// export type BlockToolsStateMap = {
//   [toolnameKey in BlockToolNameKey]: BlockToolState;
// };
// export type GlobalToolsStateMap = {
//   [toolnameKey in GlobalToolNameKey]: GlobalToolState;
// };
export type ToolsStateMap = {
  [toolnameKey in ToolName]: ToolState;
};
//called ToolbarDisplay in CurrentGen, this part of state encapsulates all the properties of the Toolbar container as a whole
export interface ToolbarState {
  enabled: true;
  title: string;
  //TODO : accnum of item is tentatively removed from our store. Hans states that we need confirmation.
  // accessionNumber: string;
  sceneName?: string;
  type: 'sbt' | 'readingDI' | 'thankyou' | '';
  //TODO: dicuss the following : don't know what they represent
  // bookletTransferStatus: ToolbarBookletTransferStatus;
  // adminDeviceId?: string;
}

//this is the state subtreein the NextGen store for the Toolbar container + all the tools in the Toolbar
export interface ToolbarAndToolsSettings {
  // id is really itemId (which is accnum) because json-mock-server can only handle "id"
  id?: string;
  toolbar?: ToolbarState;
  tools?: ToolsStateMap;
  // itemtools: ItemToolsStateMap; // embedded object: For example {VH112233: ReadAloud: { name: 'xxx', available: true ...etc.},
  //**********                                                   VH112234: ReadAloud: { name: 'xxx', available: true ...etc.}, etc. for each item}
  // blocktools: BlockToolsStateMap;
  // globalTools: GlobalToolsStateMap;
  //TODO: dicuss the following : don't know what they represent
  // bookletTransferStatus: ToolbarBookletTransferStatus;
  // adminDeviceId?: string;
}
//The key id is itemId. It is named this way for mock server to work correctly with a url like tools/1 which returns tool setting for itemId=1.
export interface ToolbarAndToolsState {
  [id: string]: ToolbarAndToolsSettings;
}
