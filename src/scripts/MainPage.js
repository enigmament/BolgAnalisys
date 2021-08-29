import React, { useState } from "react"

import {QueryUser} from './Queries.js'
import { Form } from 'react-bootstrap';

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
        }),
        type: "",
        maxTopicNumber: 3,
        authorFilter: "",
        authorList: []
    }


    //const [type, setType] = useState(''); 
    render() {

        const setAuthor =  (authorList) => {
            this.setState({
                authorList
            })
        };

        return (
            <ApolloProvider client={this.state.client}>
                <div className="row">
                    <div className="col-4">
                        <div className="row">
                            <div className="col-12">
                                <Form>
                                    <Form.Control as="select" aria-label="Select Type Analisys" 
                                        value={this.state.type}
                                        onChange={ (e) => {
                                            this.setState({
                                                type: e.target.value
                                            })
                                        }} >
                                        <option value=""> Select type</option>
                                        <option value="topics">By topics</option>
                                        <option value="author">By authors</option>
                                    </Form.Control>
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div  className="col-8">
                        <QueryUser  analisysType={this.state.type} setListUSer={setAuthor}/>
                    </div>
                </div>
            </ApolloProvider>
        )
    }
}

export default MainPage