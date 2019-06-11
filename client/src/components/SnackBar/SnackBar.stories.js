import React from 'react';
import { storiesOf } from '@storybook/react';
import SnackBar from './SnackBar';

storiesOf('Button', module).add('with text', () => (
  <SnackBar message="It's Cool!" type="Info" open="true" />
));
