import React from "react";
import { shallow } from "enzyme";
import SignUp from "./index";
import axios from "axios";
import  toJson  from "enzyme-to-json";

describe("<Signup />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SignUp />);
  });

  it("should render", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should call API", () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
