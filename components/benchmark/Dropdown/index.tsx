import React, { ReactElement, useState } from 'react';
// import {
//   dropdownClickAction,
//   dropdownSelectAction,
//   dropdownClickOutsideAction,
// } from '../../../store/actions/appLifeCycleActions/widgetResponse/dropdownActions';
import { Dropdown } from '@coreym/benchmark';
// import { useBroadcast, useRxJsSelector } from '../../../stateMachine/customHooks';
// import { Widget, WidgetResponse, WidgetResponseStringOnly } from '../../../interfaces/stateMachine/Widget';
// import { getAllResponsesOfActiveItem$ } from '../../../store/selectors/appLifeCycleSelectors';
// import { updateResponseStringAction } from '../../../stateMachineActions/actions/appLifeCycleActions/widgetResponse/simpleResponseActions';

import {
  getAllResponsesOfActiveItem$,
  getActiveItemId$,
  stateMachineActions,
} from '@enaep-ng/student-assessment-store';
import { useBroadcast, useRxJsSelector } from '../../../hooks/stateMachineHooks';
// import { ResponseType, Widget, WidgetResponse, WidgetResponseStringOnly } from '@enaep-ng/types';
import { Widget, WidgetResponse, WidgetResponseStringOnly } from '@enaep-ng/types';

// export const DropdownConnector = ({ inputId, children }: { inputId: string; children: unknown }): ReactElement => {
export const DropdownConnector = (widget: Widget): ReactElement | null => {
  console.log('DropdownConnector');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [widgetResponses, setWidgetResponses] = useState<WidgetResponse[]>([]);
  const [activeItemId, setActiveItemId] = useState<string>();

  // selectors
  useRxJsSelector(getActiveItemId$, setActiveItemId);
  //  useRxJsSelector<WidgetResponse[]>(getAllResponsesOfActiveItem$, setWidgetResponses);

  useRxJsSelector(getAllResponsesOfActiveItem$, setWidgetResponses);
  const widgetResponseStringOnly: WidgetResponseStringOnly = widgetResponses.find(
    (wr) => wr.widgetId === widget.id && wr.itemId === activeItemId,
  );
  // ) || {
  //   widgetId: widget.id,
  //   itemId: activeItemId,
  //   discriminator: ResponseType.StringOnly,
  //   response: '',
  // };
  const broadcast = useBroadcast();
  // handlers
  //TODO: discuss with team: does it need to broadcast: not for NextGen but maybe for replay
  const handleClick = () => {
    setIsOpen(true);
  };
  const handleSelect = (optionId: string | number) => {
    if (optionId) {
      broadcast(
        stateMachineActions.createUpdateWidgetResponseAction({
          widget: widget,
          activeItemId: activeItemId,
          optionResponse: optionId.toString(),
        }),
      );
    } else {
      handleClear();
    }
  };

  const handleClear = () => {
    broadcast(
      stateMachineActions.createClearWidgetResponseAction({
        widget: widget,
        activeItemId: activeItemId,
      }),
    );
  };

  // const handleClickOutside = () => broadcast(dropdownClickOutsideAction({ id: inputId }));
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      onClick={handleClick}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      selected={widgetResponseStringOnly?.response}
      isOpen={isOpen}
      {...widget.props}
    >
      {widget.children}
    </Dropdown>
  );
};

export default DropdownConnector;
