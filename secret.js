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

  // sets this.handleError. handleError is called in the onReject function
  catch(handleError){
    this.handleError = handleError;
    //returns this so that another then or catch may be called
    return this;
  }

  //called in the secret on success
  onResolve(value){
    //initiates value with given response from result
    let storedValue = value;

    try {
      //runs through secrets that have been chained after
      //are these all added to original instance synchronously?
      this.secretsChain.forEach((nextFunc) => {
        //set next value equal to the result of calling current then func
        //with the current value
        storedValue = nextFunc(storedValue);
      });
    } catch (error) {
      //on failure, reset secrets chain because all downstream secrets will fail
      this.secretsChain = [];
      //use error handler defined in constructor
      this.onReject(error);
    }
  }

  // onReject only calls handle error as defined in the catch function chained
  //on the original secret
  onReject(error) {
    this.handleError(error);
  }
}
