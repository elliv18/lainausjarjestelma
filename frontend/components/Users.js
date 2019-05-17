import React from 'react'
import Paper from '@material-ui/core/Paper';
import { Query } from 'react-apollo'
import { USERS_QUERY } from '../lib/gql/queries'



export default class Users extends React.Component{
      render(){         
      return(
        <Query query={USERS_QUERY} >
        {({ loading, error, data }) => {
          if (error) return <div>Error</div> 
          if (loading) return <div>Loading</div>
          return (
              <div>
                  {console.log(data)}
                  toimii            
              </div>
          )
          //
          }}
      </Query>

      );
      }
  }
  /*
  <Query query={EQUIPMENTS_QUERY} >
        {({ loading, error, data }) => {
          if (error) return <div>Error</div> 
          if (loading) return <div>Loading</div>
          return (
              <div>
                  TOIMII
                  {data}
              </div>
          )   
          }}
      </Query>
      */