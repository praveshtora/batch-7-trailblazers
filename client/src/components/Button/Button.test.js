import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MDButton from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';

const findCircularProgress = wrapper => expect(wrapper.find(CircularProgress));

const notHaveCircularProgress = wrapper =>
  findCircularProgress(wrapper).toHaveLength(0);
const haveOneCircularProgress = wrapper =>
  findCircularProgress(wrapper).toHaveLength(1);

describe('<Button />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Button>My Button</Button>);
  });

  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should not show CircularProgress when props not passed.', () => {
    notHaveCircularProgress(wrapper);
  });

  it('should show CircularProgress when prop: "loading" passed.', () => {
    wrapper.setProps({ loading: true });
    haveOneCircularProgress(wrapper);
  });

  it('should not show CircularProgress when prop: "success" passed.', () => {
    wrapper.setProps({ success: true, loading: false });
    notHaveCircularProgress(wrapper);
  });

  it('should not show CircularProgress when prop: "success" & "loading" passed.', () => {
    wrapper.setProps({ success: true, loading: true });
    notHaveCircularProgress(wrapper);
  });

  it('should show CheckIcon when prop: "success" passed.', () => {
    wrapper.setProps({ success: true });
    expect(wrapper.find(CheckIcon)).toHaveLength(1);
  });

  it('should not show "text" when props only "loading" passed.', () => {
    wrapper.setProps({ success: false, loading: true });
    expect(wrapper.text()).toEqual('');
  });

  it('should pass rest of the props to Button', () => {
    wrapper.setProps({ strProp: 'testing is cool!' });

    const { strProp } = wrapper.find(MDButton).props();
    expect(strProp).toEqual('testing is cool!');
  });
});
