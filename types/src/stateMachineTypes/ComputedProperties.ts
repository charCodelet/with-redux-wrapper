export interface IsDataForActiveItemInStore {
  activeItemId: string;
  itemContent: boolean;
  widgetResponses: boolean;
  toolbarAndTools: boolean;
}
export interface ItemNavData {
  activeBlockSequence: number;
  activeBlockItemsCount: number;
  activeItemSequence: number;
  activeItemId: string;
  blocksCount: number;
}
