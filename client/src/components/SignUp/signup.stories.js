import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Signup from './index';

storiesOf('Signup', module)
  .add('Demo', () => (
<Signup></Signup>
  ));