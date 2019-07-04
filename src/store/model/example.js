import { observable, computed } from 'mobx';

class Example {
  @observable counter = 0;

  @computed
  get counterComputed() {
    return `[${this.counter}]`;
  }

  add = () => {
    this.counter += 1;
  }
}

export default Example;
