class Secret {
  constructor(executionFunction) {
    this.secretsChain = [];
    this.handleError = () => {};

    this.onResolve = this.onResolve.bind(this);
    this.onReject = this.onReject.bind(this);

    executionFunction(this.onResolve, this.onReject);
  }

  then(onResolve) {
    this.secretsChain.push(onResolve);

    return this;
  }

  catch(handleError){
    this.handleError = handleError;

    return this;
  }

  onResolve(value){
    this.storedValue = value;

    try {
      this.secretsChain.forEach((nextFunc) => {
        this.storedValue = nextFunc(storedValue);
      });
    } catch (error) {
      this.secretsChain = [];

      this.onReject(error);
    }

  }
}
