import React from "react";
import { shallow } from "enzyme";
import SignUp from "./index";
import toJson from "enzyme-to-json";
import SnackBarProvider from '../../context/SnackBarProvider';

describe("<Signup />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <SnackBarProvider>
        <SignUp />
      </SnackBarProvider>);
  });

  it("should render", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should call API", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
