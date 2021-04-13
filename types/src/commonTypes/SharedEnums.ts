export enum SQSettings {
  None = 0,
  SkipCoreSQ = 1 << 0,
  SkipSubjectSQ = 1 << 1,
  SkipCAFSSQ = 1 << 2,
  InsertRaceEthnicityInstructions = 1 << 3,
  SkipNIESSQ = 1 << 4,
  SkipESQ = 1 << 5,
  SkipCovid = 1 << 6,
}
export enum SQItemCategory {
  NA = 0,
  Core = 1,
  // tslint:disable-next-line:no-bitwise
  Subject = 1 << 1,
  // tslint:disable-next-line:no-bitwise
  CAFS = 1 << 2,
}

export enum SQItemSubType {
  NA = 0,
  Race = 1,
  Ethnicity = 2,
  Debriefing = 3,
}
export enum ToolName {
  Unknown = '',
  Help = 'help',
  Theme = 'theme',
  Zoom = 'zoom',
  ReadAloud = 'readAloud',
  Scratchwork = 'scratchwork',
  Pencil = 'pencil',
  Highlighter = 'highlighter',
  Eraser = 'eraser',
  Calculator = 'calculator',
  MathKeyboard = 'mathKeyboard',
  Bilingual = 'bilingual',
  Timer = 'timer',
  Progress = 'progress',
  Tabs = 'tabs',
  Toolbar = 'toolbar',
}
export enum Theme {
  Default,
  Beige,
  Dark,
}
export enum DialogName {
  None = 'None',
  TimeLeft = 'TimeLeftDialog',
  NoTimeLeft = 'NoTimeLeftDialog',
}
export enum TimerFor {
  Block = 'Block',
  AutoSave = 'AutoSave',
}
export enum ButtonClickAction {
  None = 'None',
  OpenTimeLeftDialog = 'OpenTimeLeftDialog',
  OpenNoTimeLeftDialog = 'OpenNoTimeLeftDialog',
  CloseDialog = 'CloseDialog',
  GoToNextBlock = 'GoToNextBlock',
}
