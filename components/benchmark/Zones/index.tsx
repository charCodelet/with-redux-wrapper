/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState } from 'react';
import { Zones } from '@coreym/benchmark';
import {
  getAllResponsesOfActiveItem$,
  stateMachineActions,
  getActiveItemId$,
} from '@enaep-ng/student-assessment-store';
import { useBroadcast, useRxJsSelector } from '../../../hooks/stateMachineHooks';
import { Widget, WidgetResponse, WidgetResponseArrayOnly } from '@enaep-ng/types';

export const ZonesConnector = (widget: Widget): ReactElement | null => {
  // selectors
  const [widgetResponses, setWidgetResponses] = useState<WidgetResponse[]>([]);
  const [activeItemId, setActiveItemId] = useState<string>();
  useRxJsSelector<string>(getActiveItemId$, setActiveItemId);
  //  useRxJsSelector<WidgetResponse[]>(getAllResponsesOfActiveItem$, setWidgetResponses);
  useRxJsSelector<WidgetResponse[]>(getAllResponsesOfActiveItem$, setWidgetResponses);
  const widgetResponseArrayOnly: WidgetResponseArrayOnly = widgetResponses.find(
    (wr) => wr.widgetId === widget.id && wr.itemId === activeItemId,
  );
  // ) || {
  //   widgetId: widget.id,
  //   itemId: activeItemId,
  //   discriminator: ResponseType.ArrayOnly,
  //   responses: [],
  // };
  const broadcast = useBroadcast();
  const handleSelect = (optionId: string | number) => {
    broadcast(
      stateMachineActions.createUpdateWidgetResponseAction({
        widget: widget,
        activeItemId: activeItemId,
        optionResponse: optionId.toString(),
      }),
    );
  };

  const handleClear = () => {
    broadcast(
      stateMachineActions.createClearWidgetResponseAction({
        widget: widget,
        activeItemId: activeItemId,
      }),
    );
  };
  return (
    <Zones
      onClear={handleClear}
      onChange={handleSelect}
      selected={widgetResponseArrayOnly?.responses}
      {...widget.props}
    >
      {widget.children}
    </Zones>
  );
};

export default ZonesConnector;
