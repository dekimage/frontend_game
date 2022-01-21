


const useApiCall = () => {
  const [data, isLoading, eror] = useState()
  //different state

  const makeApiCall = (url, {method, headers, body}) => {
    const response = fetch(url, {
      method: method ? method : 'GET',
      headers:  header: header ? method : {},
      body: body: JSON.stringfy(body): ""
    })
    setIsLoading(true);
    if(!reponse) {
      throw new Error
      setError(error.msg)
      setIsLoading(false);
    }
    setData(res.data)
    setIsLoading(false);
  }

  return {
    data,
    isLoading,
    error,
    makeApiCall
  }

}