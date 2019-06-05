import React from "react";
import Header from "./Header";
import { shallow, mount, render } from "enzyme";

describe("<Header />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  it("should render Header", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should have to Props name Title", () => {
    const wrapper = shallow(<Header name="Trail" />);
    expect(wrapper.text()).toEqual("Trail");
  });

  it("should render childern", () => {
    const wrapper = render(
      <Header name="Trail">
        <span>Hello</span>
      </Header>
    );
    expect(wrapper.find('span')).toHaveLength(1);
  });
});
