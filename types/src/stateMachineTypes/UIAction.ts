//payloadT here denotes a  (discriminated) union of payloads for all the UIActions or a global payload object as shown
//in the AppPayloadT.ts.
//If this proves to be unwieldy, we will have to come up with some other way of providing this generic interface
//the Type field is also begging for more strongly typed.
import { Action } from 'redux';
import { AppPayload2 } from './AppPayload';
export enum Schedule {
  queue, //FIFO: processing like a queue (default)
  asap, //LIFO :as soon as possible, adds incoming entry to the top of queue (reverse of a queue) in enque method
}

export interface UIAction<payloadT = never> extends Action {
  // export interface UIAction<payloadT> extends Action {
  // type will come from Action
  payload?: Partial<payloadT>;
  handledIn?: TargetModule;
  schedule?: Schedule;
  // isDisabledInThisLaunchMode: boolean;
}

export interface UIActionCreator<Payload> {
  (...args: never[]): Payload;
}

export enum NavigationButton {
  'PREVIOUS',
  'NEXT',
}
export interface NavigationTab {
  itemSequence: number;
}

export enum TargetModule {
  'UI',
  'STORE',
  'EFFECT',
  'WIZARD',
  // 'STATE-MACHINE',
}

export interface ActionCreator<A> {
  (...args: never[]): A;
}
// Since this is used for all actions together, we must define a discriminated union: AppPayload2
export interface Broadcast {
  (uiAction: UIAction<AppPayload2>): void;
}
