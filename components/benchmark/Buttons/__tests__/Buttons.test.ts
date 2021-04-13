import { TargetModule } from '@enaep-ng/types';

describe('Buttons Component', () => {
  it('should test', () => {
    const payload = 'url=localhost:3000';
    const expectedAction = {
      type: 'start',
      handledIn: TargetModule.STORE,
      payload,
    };
    console.log('BUTTON ', payload, expectedAction);
  });
});
