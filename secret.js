class Secret {
  constructor(executionFunction) {
    //instantiate secret chain, will hold all of the functions,
    // when .then is called secret will push function onto the secret chain
    this.secretsChain = [];

    //when user calls catch, the function called will be assigned to
    // handleError to process the error
    this.handleError = () => {};

    this.onResolve = this.onResolve.bind(this);
    this.onReject = this.onReject.bind(this);

    /* secret is called and given onResolve and onReject as inputs
      new Secret((resolve,reject)=> { if response is success {
        resolve(results);
      } else {
        reject(errors);
      }
    }})
  */
    executionFunction(this.onResolve, this.onReject);
  }

  // adds function to secrets chain
  then(onResolve) {
    this.secretsChain.push(onResolve);
    //returns this so that another then or catch may be called
    return this;
  }

  catch(handleError){
    this.handleError = handleError;

    return this;
  }

  onResolve(value){
    let storedValue = value;

    try {
      this.secretsChain.forEach((nextFunc) => {
        storedValue = nextFunc(storedValue);
      });
    } catch (error) {
      this.secretsChain = [];

      this.onReject(error);
    }
  }

  onReject(error) {
    this.handleError(error);
  }
}
