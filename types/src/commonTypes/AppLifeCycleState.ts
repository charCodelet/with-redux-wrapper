import { ItemHeader } from './ItemHeader';
// import { ToolbarAndToolsState, ToolbarAndToolsSettings } from './ToolState';
import { ToolbarAndToolsSettings } from './ToolState';
import { Block, BlockStatus } from './Block';
// import { Block } from './Block';
import { Item, WidgetResponse } from '../stateMachineTypes/Widget';
import { Theme, DialogName } from './SharedEnums';
// import { ToolbarAndToolsState } from '../commonTypes/ToolState';
/**
 * TO DO:
 * 1. Decide whether sequence field is required in each object.
 * 2. Ask questions about setLeaderitem, language, and bilingualItem in ItemHeader.
 * 3. Ask questions about sqCategory, sqSubtype in ItemHeader.
 */
// selector to see if all Item widgets are answered
// get Item.widgetResponses.every((response) => !!response)

export interface AppLifeCycleState {
  sessionId?: number;
  blockTimeElapsed?: number; //time in seconds since the student entered the active block
  isPaused?: boolean; //Not used so far
  activeBlockSequence: number; //value of sequence property of a block that a student is in (i.e. is active) at a point in time. NOTE: this is not the value of the Id field.
  activeItemSequence: number; //value of sequence property of an Item that a student is on (i.e. is active) at a point in time. NOTE: this is not the value of the Id field.
  activeDialogName: DialogName; // Name of the dialog, an enum, that is rendered at a point in time. A special value of None implies that no dialog is presently rendered.
  activeTheme: Theme; //value of the Theme enum in ADE (not the same a s in Benchmark) that is currently rendered
  //This is an ES6 Map of a simple Item's id (key) that is embedded in the content of a complex Item.
  //Note that the value is an array of ALL complex Items that have the same key simple Item in their contents.
  //This is a property computed once on load of blocks which provides a 'reverse-aggregate' of the simpleItemIdsInComplexItem at each ItemHeader level.
  //This is a general purpose property that may potentailly have many uses in cases where we need to traverse each complex Item that embeds a given simple Item.
  //For example, for dynamic text substitution in a Set Leader, we need to know the sequnce number of each Set Member item that uses a given Set Leader in its content.
  //I am pretty sure this structure would have many more uses down the road.
  complexItemsByembeddedSimpleItems?: Map<string, ItemHeader[]>;
  // nextSectionDialogIsOpen: boolean;
  blocks: Block[];
  //TODO: add here time/pause related properties e.g. time Consumed for active block, if block is currently paused etc.
  activeBlockStatus?: BlockStatus; //Not used so far
  widgetResponses: WidgetResponse[]; //array of all responses of all widgets for each item in an active Block. NOTE that a widget that is not answered at all does not have a response record in this array
  items: Item[]; //array of contents - nested json representing DOM hierarchy- to be rendered. NOTE: depending on fetch ahead policy used, this may contain only a few items belonging to this block
  toolbarAndTools: ToolbarAndToolsSettings[]; // setting properties for the Toolbar container and each of the Tools FOR EACH Item - Resolve this with BE
  dialogItems: Item[]; //array of contents - nested json, like an Item, representing DOM hierarchy- for each dialog to be rendered.
}
