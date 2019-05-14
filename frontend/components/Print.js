import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export const printLogin = gql`
  query {login (input: {email:"1", password:"123"}){
  jwt
}}`


export default function PrintLogin () {
  return (
    <Query query={printLogin} >
      {({ loading, error, data }) => {
        if (error) return <div>Error</div> 
        if (loading) return <div>Loading</div>
        return (
            <div>
                {console.log(data)}
            </div>
        )   
        }}
    </Query>
  )
}
