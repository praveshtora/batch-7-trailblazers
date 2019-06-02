import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './Button';

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>
      Hello Button
    </Button>
  ))
  .add('with some emoji', () => (
    <Button>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ))
  .add('On with prop loading', () => (
    <Button loading>Invite</Button>
  ))
  .add('On with prop success', () => (
    <Button success>Invite</Button>
  ))
  .add('On  with prop loading & success ', () => (
    <Button loading success>
      Invite
    </Button>
  ));
