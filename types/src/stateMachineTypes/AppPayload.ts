import { NavigationButton } from './UIAction';
// import { ToolSetting } from '../ToolSettingState';
import { AppState } from '../commonTypes/AppState';
import { Block } from '../commonTypes/Block';
import { NavigationTab, UIAction } from './UIAction';
// import { Element, SelectedResponse } from './SelectedResponse';
import { Widget, WidgetResponse } from './Widget';

export interface LaunchModeConfigPayload {
  sessionId: string;
}

// export interface NavigationPayload {
//   activeItemSequence: number;
// }
// export interface LinearNavigationPayload extends NavigationPayload {
//   activeBlockSequence: number;
// }
// export interface ItemNavData {
//   activeBlockSequence: number;
//   activeBlockItemsCount: number;
//   activeItemSequence: number;
//   activeItemId: string;
//   blocksCount: number;
// }
export interface WidgetResponseBasePayload {
  widget: Widget;
  activeItemId: string;
}

export interface WidgetResponsePayload extends WidgetResponseBasePayload {
  optionResponse: string;
}
export interface WidgetResponseEliminatedPayload extends WidgetResponseBasePayload {
  eliminatedResponse: string;
}

export type AppPayload2 =
  | LaunchModeConfigPayload
  // | ItemNavData
  | Partial<Block>
  // | ToolSetting
  // | ToolSetting[]
  | Partial<AppState>
  | NavigationButton
  | NavigationTab
  | WidgetResponse
  | WidgetResponsePayload
  | WidgetResponseEliminatedPayload

  // | SelectedResponse
  // | Element
  | number
  | string
  | number[]
  | string[]
  | UIAction
  | undefined;
