// contains the actions for changing model and view

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // set view's delegate to the controller so it gets updated when view state changes
    view.delegate = this;

    this.state = this.getNewState(model, view);
  }

  getNewState(model, view) {
    const newState = {};

    // currently nothing to add to state, but this would exist in a bigger app

    return newState;
  }

  onViewUpdate(name, value) {
    // only allow numeric values in input fields
    if(isNaN(value) && value !== '')
      return this.model.updateState(name, this.model.state[name]);

    switch(name) {
      case 'cardNum':
        const cardType = this.getCardType(value);
        this.model.updateState('cardType', cardType);
        break;

      case 'expirationMonth':
        if(parseInt(value) < 1 || parseInt(value) > 12)
          return this.model.updateState(name, this.model.state[name]);

        break;
      
      default:
        break;

    } 

    this.model.updateState(name, value);
  }

  getCardType(cardNum) {
    const str = cardNum.toString();
    const cardTypes = this.model.cardTypes;
    let cardType = '';

    for(let cardCode in cardTypes) {
      if(str.startsWith(cardCode)) {
        cardType = cardTypes[cardCode];
        break;
      }
    }

    return cardType;
  }

  onSubmit() {
    const modalContent = {
      title: 'Submitting...',
      content: 'Please wait',
      showButton: false
    }

    const data = this.model.state;
    const valid = this.validateInput(data);

    if(!valid)
      return this.showError();

    this.hideError();
    this.postData(this.model.state);
    this.view.createModal(modalContent);
  }

  validateInput(data) {
    for(let name in data) {
      const value = data[name];

      // if any part of the form is not filled out, it should fail
      if(!value)
        return false;

      // if any part of the form is not a number, it should fail
      if(name !== 'cardType' && isNaN(value))
        return false;

    }

    // all tests passed
    return true;
  }

  postData(data) {
    const route = 'http://jsonplaceholder.typicode.com/posts';
    const mockData = { 
      userId: 1, 
      id: 1,
      title: 'sunt aut facere repellat provident occaecatiexcepturi optio reprehenderit',
      body: 'quia et suscipit suscipit recusandaeconsequuntur expedita et cum reprehenderit'
    }

    const xhttp = new XMLHttpRequest();

    xhttp.onload = this.onSubmitSuccess.bind(this);
    xhttp.onerror = this.onSubmitFailure.bind(this);
    xhttp.onabort = this.onSubmitFailure.bind(this);

    xhttp.open('POST', route, true);
    xhttp.send(mockData);
  }

  onSubmitSuccess(response) {
    // response is not used here, but it is passed back by xhttp

    const modalContent = {
      title: 'Success!',
      content: 'Card info submitted succesfully',
      showButton: true
    }

    this.updateModal(modalContent);
    this.onClearForm();
  }

  onSubmitFailure() {
    const modalContent = {
      title: 'Error!',
      content: 'Card info submission failed!',
      showButton: true
    }

    this.updateModal(modalContent);
  }

  showError() {
    // this.model.showError();

    // currently there is only one error, so it just goes straight to view instead of updating model
    this.view.showError();
  }

  hideError() {
    // this.model.hideError();

    // currently there is only one error, so it just goes straight to view instead of updating model
    this.view.hideError();
  }

  createModal(modalContent) {
    this.view.createModal(modalContent);
  }

  updateModal(modalContent) {
    this.view.setModalContent(modalContent);
  }

  onClearForm() {
    const data = this.model.state;

    for(let name in data) {
      this.model.updateState(name, '');
    }

    this.hideError();
  }
}
