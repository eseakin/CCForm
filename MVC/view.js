// renders any changes made to model state

class View {
  constructor(model) {
    this.model = model;

    // set model's delegate to view so that updates from model are passed to view
    model.delegate = this;
  
    this.state = this.getNewState(model);
    this.addEventListeners();
  }


  // INITIALIZATION


  getNewState(model) {
    const newState = {
      submitButton: document.getElementById('submit'),
      clearButton: document.getElementById('clearForm'),
      errorMessage: document.getElementById('errorMessage'),
      cardType: document.getElementById('cardType')
    };

    for(let name in model.state) {
      newState[name] = document.getElementById(name);
    }

    return newState;
  }

  getAllInputs() {
    return document.getElementsByTagName('input');
  }

  addEventListeners() {
    const inputs = this.getAllInputs();

    for(let input of inputs) {
      this.addEventListener(input, 'input', this.onChange.bind(this));
    }
    
    this.addEventListener(this.state.submitButton, 'click', this.onSubmit.bind(this));
    this.addEventListener(this.state.clearButton, 'click', this.onClearForm.bind(this));
  }

  addEventListener(element, type, cb) {
    element.addEventListener(type, cb);
  }

  removeEventListener(element, type, cb) {
    element.removeEventListener(type, cb);
  }


  // UPDATING STATE


  onModelUpdate(name, value) {
    this.updateState(name, value);
  }

  // used to set model data on input fields
  updateState(name, value) {
    if(name === 'cardType')
      this.state.cardType.innerHTML = value;
    else
      this.state[name].value = value;

  }

  // used to set modal and modal content
  setState(name, value) {
    this.state[name] = value;
  }

  onChange(e) {
    const { target: { name, value } } = e;

    if(this.delegate)
      this.delegate.onViewUpdate(name, value);

  }

  onSubmit() {
    if(this.delegate)
      this.delegate.onSubmit();

  }

  onClearForm() {
    if(this.delegate)
      this.delegate.onClearForm();

  }  


  // CREATING DOM ELEMENTS


  createModal(modalContent) {
    const modalBackground = document.createElement('div');
    const modal = document.createElement('div');
    
    this.setState('modalBackground', modalBackground);
    this.setState('modal', modal);

    modalBackground.classList.add('modalBackground');
    document.body.prepend(modalBackground);
    modalBackground.addEventListener('click', this.closeModal.bind(this));

    modal.classList.add('modal');
    this.setModalContent(modalContent);
    modalBackground.append(modal);
  }

  setModalContent({ title, content, showButton }) {
    this.state.modal.innerHTML = `<h3>${title}</h3><p>${content}</p>${showButton ? '<button id="closeButton" type="button" onclick="this.closeModal">Ok</button>' : ''}`;
  }

  closeModal() {
    const { modalBackground, modal } = this.state;

    this.removeEventListener(modalBackground, 'click', this.closeModal.bind(this));
    
    const button = modal.querySelector('#closeButton');
    
    if(button)
      this.removeEventListener(button, 'click', this.closeModal.bind(this));
    
    document.body.removeChild(modalBackground);
    this.setState('modalBackground', null);
    this.setState('modal', null);
  }

  showError() {
    this.state.errorMessage.innerHTML = ('Error! Please check your inputs!');
  }

  hideError() {
    this.state.errorMessage.innerHTML = ('');
  }
}
