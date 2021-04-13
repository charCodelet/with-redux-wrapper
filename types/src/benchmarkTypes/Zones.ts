import { propNameType, propValueType } from '../stateMachineTypes/Widget';

export interface ZonesChildren {
  props: Record<propNameType, propValueType>;
  children: ZonesChildren[];
}

export interface ZonesProps {
  inputId: string;
  children: ZonesChildren[];
}
