import React from 'react';

import { USER_CREATE_MUTATION } from '../lib/gql/mutation'
import { Mutation } from 'react-apollo'
import { Query } from 'react-apollo'
import { USERS_QUERY } from '../lib/gql/queries'
import { withApollo } from 'react-apollo';

class MyClass extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            client: props.client,
            data: null
        };
      }

      async componentDidMount(){
       // this.state.client.query({query: USERS_QUERY}).then(this.setState({data: }))
       const data2 = await this.state.client.query({
         query: USERS_QUERY
       }) 
      console.log(data2)
      }
      render(){

        return(
        <div>
          moi
          {console.log(this.state.data)}
          </div>)
      }
    }

    export default withApollo(MyClass)
      



