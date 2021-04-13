// import { Item } from './stateMachine/Item';
import { ItemHeader } from './ItemHeader';
// activeBlockSequence = 0
// sort,
// check sequence zero-based and that it is sequential,
// on next, we maintain activeBlockSequence, which is the array index.
// [4,2,1] => sorted [1,2,4]

export interface Block {
  //readOnly is redundant in a store state subtree and so was removed. We are applying immutability at the entire store config level
  id: number;
  //  itemCount: number;
  //  code: string;
  time: number; //time in minutes allowed for the block after extendedTimeAccommodation has been applied to
  timeElapsed: number; //time consumed for assessment in seconds. NOTE: not used so far but may be used if DAR needs it.
  timeType: number; //discuss exact usage of this enum - not clear from currentGen code
  title: string;
  titleSp: string;
  typeId: number; //This enum may require some additions/deletions tbd during development
  //  typeName: string; //computed property to be derived from above enum
  // difficulty: string | null; //no current usage discovered in CurrentGen
  doesBlockUseTabs: boolean; //if set to true, allow non-linear navigation between items of this block
  sequence: number; //consecutively increasing whole number represnting order in which a block (all its items) would be rendered in a linear-navigation mode (i.e. next/previous button)
  // bonus: boolean; //no current usage discovered in CurrentGen
  // readingPassageStimulusCount: number; //no current usage discovered in CurrentGen
  itemHeaders: ItemHeader[]; //array of metadata object for each item contained in this block
  // items: Item[]; //array of contents - nested json representing DOM hierarchy- to be rendered. NOTE: depending on fetch ahead policy used, this may contain only a few items belonging to this block
}
//TODO: The following represents current block student is working on and  does not seem to be required unless we discover more significant block properties which are dynamic.
export interface BlockStatus {
  blockTimeElapsed: number;
  // isRouting: boolean;  //Not required
}
