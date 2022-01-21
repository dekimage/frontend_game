import Token

const loginUser = (dispatch, {data, error, isLoading}) => {
  
  if (error) {
    //What should happen 
    Token.clear()
    dispatch(TYPE: 'LOGIN_ERROR')
  } else if(isloading) {
    dispatch(TYPE: 'REQUST LOGIN')
  } else if (data) {
    dispatch(TYPE: 'LOGIN SUCCES', payload: data)
  }

}