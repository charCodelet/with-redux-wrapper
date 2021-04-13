export interface ItemHeader {
  id: string; // sams item.id or item.accession
  blockId: number;
  accessionNumber: string; //Not sure if we need this if the id property provides the accnum of this item.
  sequence: number;
  itemSequence: number;
  countOfWidgetsRequiringResponse?: number; //number of widgets in this item which equire a response from user. For example a Paragrpah or Clean Answer Button widget would not be included in this count
  language: string;
  //TODO: we may need to revise the setLeader/Member implementation from the viewpoint of the Renderer code
  setLeaderItem: string | null; //This may not be required if we go ahead with the proposed esotericItemIds array property.
  // ADE assumes that the item Ids found in this array are embedded somewhere in the JSON structure of this Complex item.
  // array of ids of simple items which are pre-assembled items from primitive Benchmark components.
  // By definition, if this array is empty or undefined, it makes this item a Simple Item.
  simpleItemIdsInComplexItem?: string[];
  //TODO: we may need to revise the bilingualItem implementation
  bilingualItem: {
    id: string; // same item.id or item.accession
    blockId: number;
    // accessionNumber: string;
    language: string;
    setLeaderItem: string;
    bilingualItem: string;
    typeId: number;
    // isAnswered: string;
    sqCategory: number;
    sqSubType: number;
  };
  typeId: number; //This may be deleted down the road or changed to an enum if required. For example, if ADE code needs to differentiate between a Simple vs a Complex item.
  // isAnswered: boolean; //computed property - to be uncommented later if needed
  sqCategory: number;
  sqSubType: number;
}
