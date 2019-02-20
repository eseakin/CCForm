class App {
  constructor(props) {
    const model = new Model();
    const view = new View(model);
    const controller = new Controller(model, view);

    this.state = {
      view,
      model,
      controller
    };
  }
}

const app = new App();
