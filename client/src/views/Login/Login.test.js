import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';
import SnackBarProvider from '../../context/SnackBarProvider';

describe('<Login />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <SnackBarProvider>
        <Login />
      </SnackBarProvider>
    );
  });

  test('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
