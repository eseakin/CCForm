// stores data and app state

class Model {
  constructor() {
    this.cardTypes = {
      4: 'Visa',
      5: 'MasterCard',
      34: 'AmEx',
      37: 'AmEx',
      6011: 'Discover'
    }

    this.state = this.getNewState();
  }

  getNewState() {
    const newState = {
      cardNum: '',
      cardType: '',
      amount: '',
      expirationMonth: '',
      expirationYear: ''
    };

    return newState;
  }

  updateState(name, value) {
    this.state[name] = value;

    if(this.delegate)
      this.delegate.onModelUpdate(name, value);

  }

  showError() {
    // use this if adding more than 1 type of error
  }

  hideError() {
    // use this if adding more than 1 type of error
  }
}
