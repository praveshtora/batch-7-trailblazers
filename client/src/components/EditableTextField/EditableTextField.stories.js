import React from 'react';

import { storiesOf } from '@storybook/react';

import EditableTextField from './EditableTextField';

storiesOf('EditableTextField', module).add('with text', () => (
  <EditableTextField />
));
