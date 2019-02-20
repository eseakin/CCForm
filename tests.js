// written with Jasmine testing library

describe('Basic form validation', () => {
  beforeEach(() => {
    this.view = new View();
    this.model = new Model(this.view);
    this.controller = new Controller(this.model, this.view);
  });


  it('should not accept letters as input in the cc# field', () => {
    const input = { target: { 'cardNum', 'abc' }};

    this.controller.onChange(input);

    expect(this.model.state.cardNum).toBe('');
  });

  it('should not accept punctuation characters as input in the cc# field', () => {
    const input = { target: { 'cardNum', '$%/' }};

    this.controller.onChange(input);

    expect(this.model.state.cardNum).toBe('');
  });

  it('should accept number strings as input in the cc# field', () => {
    const input = { target: { 'cardNum', '123' }};

    this.controller.onChange(input);

    expect(this.model.state.cardNum).toBe('123');
  });

  // repeat these as needed for all fields
});


describe('Basic form function', () => {
  beforeEach(() => {
    this.view = new View();
    this.model = new Model(this.view);
    this.controller = new Controller(this.model, this.view);
  });


  it('Should display an error if fields are not filled out properly', () => {
    this.controller.onSubmit();

    expect(this.state.errorMessage.innerHTML).toBe('Error! Please check your inputs!');
  });

  it('Should clear form fields when the clear button is pressed', () => {
    const blankInputs = this.view.getAllInputs();
    const blankValues = blankInputs.map((input) => input.value);

    const input1 = { target: { 'cardNum', '123' }};
    this.controller.onChange(input1);

    const input2 = { target: { 'expirationMonth', '123' }};
    this.controller.onChange(input2);

    this.controller.clearForm();

    const clearedInputs = this.view.getAllInputs();
    const clearedValues = clearedInputs.map((input) => input.value);

    expect(blankValues).toEqual(clearedValues);
  });

  it('Should display a modal when the submit button is pressed', () => {
    const inputs = this.view.getAllInputs();

    for(let input of inputs) {
      const { name } = input;

      const e = { target: { name, '12' }};
      this.controller.onChange(e);
    }

    this.controller.onSubmit();

    const modals = document.getElementsByClassName('modal');

    // there is probably a better way to do this, but I haven't done this with regular HTML before
    expect(modals[0]).toExist();
  });
});


describe('HTTP requests', () => {
  let request; 
  const success = {
    status: 200,
    responseText: 'success'
  }

  beforeEach((done) => {
    this.view = new View();
    this.model = new Model(this.view);
    this.controller = new Controller(this.model, this.view);

    jasmine.Ajax.install();
    this.controller.postData();

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(success);
    done();
  });


  it('Should send the request to the right URL', (done) => {
    expect(request.url).toBe('http://jsonplaceholder.typicode.com/posts');
    done();
  });

  it('Should use the correct method', (done) => {
    expect(request.method).toBe('POST');
    done();
  });

  it('Should send the correct data', (done) => {
    const mockData = { 
      userId: 1, 
      id: 1,
      title: 'sunt aut facere repellat provident occaecatiexcepturi optio reprehenderit',
      body: 'quia et suscipit suscipit recusandaeconsequuntur expedita et cum reprehenderit'
    }

    expect(request.data()).toEqual(mockData);
    done();
  });
});
