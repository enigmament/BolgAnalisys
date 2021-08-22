import React from "react"

import {QueryUser} from './Queries.js'

import  {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
  } from "@apollo/client"


class MainPage extends React.Component {
    state = {
        client: new ApolloClient({
            uri: 'https://fakerql.nplan.io/graphql',
            cache: new InMemoryCache()
        })
    }

    render() {
        return (
            <ApolloProvider client={this.state.client}>
                <QueryUser/>
            </ApolloProvider>
        )
    }
}


export default MainPage