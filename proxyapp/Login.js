import { useAuthContext } from "";
import { updateAuthContext }
import {loginAction}




const Login = () => {
  const authState = useAuthContex() // { isAtuh , is Loading, }
  const dispath = updateAuthContext()
  const [data, isLoadin, Error, MakeApicAll] = useApiCall()
  onSUbmit = () => {
   const await = MakeApicAll('', {})
   loginUser(dispath, {data, isLoading, error})
  }
}
