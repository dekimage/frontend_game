import { redirect } from "next/dist/next-server/server/api-utils"



const procetedPage = (path, children) => {
  const authContext = useAuthCOntext()
  return (atuthCOntext.isAuthectade ? <Route path = 'createPost'>{children}</Route> : <REdicret to = 'login'></REdicret>
}


const App - () => {
  return 
  <ProctedPAge path = '/createPost'><PostAD></PostAD></ProctedPAge>
}