import React from 'react'
import Button from '../Button/Button';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Header from './Header'

storiesOf('Header', module).add('Simple Bar', () => (
  <Header name ='TrailBlazers Board'>
  </Header>
));

storiesOf('Header', module).add('Simple Bar with single children', () => (
  <Header name ='TrailBlazaers Board'>
  <span> Settings</span>
  </Header>
));

storiesOf('Header', module).add('Simple Bar with two children', () => (
  <Header name ='TrailBlazaers Board'>
  <span> Settings</span>
  <span> Log Out </span>
  </Header>
))