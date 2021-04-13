import { WidgetMap } from '../rendererTypes/WidgetMap';
// import { WidgetMap } from ;
//ItemType would eventually determine which of the renderer components to use for a given item
export enum ItemType {
  MultipleChoice = 'MultipleChoice',
  InlineChoices = 'InlineChoices',
  FillInBlank = 'FillInBlank',
  Essay = 'Essay',
  Composite = 'Composite',
  Zones = 'Zones',
  BlockRev = 'BlockRev',
  Complex = 'Complex',
}
export type propNameType =
  | 'type'
  | 'value'
  | 'mb'
  | 'flexDirection'
  | 'justifyContent'
  | 'x'
  | 'y'
  | 'width'
  | 'height'
  | 'inputId'
  | 'fontWeight'
  | 'fontStyle'
  | 'text'
  | 'label'
  | 'minResponsesRequired' //min number of responses required for a widget to be considered answered
  | 'maxResponsesAllowed' //responses beyond this number are ignored
  | 'actions' //array of tokens for broadcasting uiActions when a button is clicked
  | 'isOpen'; //boolean flag that opens or closes a dialog
//   | symbol;
export type widgetType = keyof typeof WidgetMap;
export type type2 = Partial<Record<widgetType, string>>;
export const WidgetNamesMap: type2 = {};
Object.keys(WidgetMap).forEach((t) => (WidgetNamesMap[t as widgetType] = t));
export type propValueType = string | number | boolean | string[];
//TODO: may need to add item.id here
export enum ResponseType {
  StringAndEliminated,
  ArrayAndEliminated,
  StringOnly,
  ArrayOnly,
}
export interface WidgetResponse {
  // TODO: None of the keys in this interface should be optional.
  widgetId?: string;
  itemId?: string; //same as item.accession or item.id
  discriminator: ResponseType;
  maxResponsesAllowed: number;
  minResponsesRequired: number;
}
export interface WidgetResponseStringAndEliminated extends WidgetResponse {
  response?: string;
  eliminated?: string[];
}
export interface WidgetResponseArrayAndEliminated extends WidgetResponse {
  responses?: string[];
  eliminated?: string[];
}
export interface WidgetResponseStringOnly extends WidgetResponse {
  response?: string;
}

export interface WidgetResponseArrayOnly extends WidgetResponse {
  responses?: string[];
}

// export interface WidgetResponsePayload {
//   widgetId?: string;
//   itemId?: string; //same as item.accession
// }
export interface PayloadSelectedOrInput extends WidgetResponse {
  selectedOrInput?: string;
}
export interface PayloadEliminated extends WidgetResponse {
  eliminated?: string;
}
// export type WidgetResponsePayload = PayloadSelectedOrInput | PayloadEliminated;
// use WidgetMap:
// SingleSelectResponse {
//  selected: string;
// }
// MultipleSelectResponse {}
// TextInputResponse {}

export interface Widget {
  id?: string; //itemId (accnum) + '_'  + serial number of the widget which is unique in the item
  // type?: widgetType;
  element?: widgetType;
  props?: Partial<Record<propNameType, propValueType>>;
  // widgetResponse?: WidgetResponse;
  // eliminatedResponse?: string[];
  children?: Widget[];
}

//TODO: WidgetWithResponses which extends Widget may create issues for BE. Discuss. For now this is not used.
export interface WidgetWithResponses extends Widget {
  widgetResponses?: WidgetResponse[];
}

export interface Item {
  type: ItemType;
  element: string;
  props?: Partial<Record<propNameType, propValueType>>;
  id?: string;
  accession: string;
  sequence: number; ////consecutively increasing whole number representing order in which items of a block would be rendered in a linear-navigation mode (i.e. next/previous button)
  usesTextSubstitution?: boolean; //if true, it signals that one or more widgets in the content have placeholders in children of Text element which need to be replaced by ADE with run time values before rendering
  content: Widget;
}
