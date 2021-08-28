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
        maxTopicNumber: 3
    }

   
    //const [type, setType] = useState(''); 
    render() {
        

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
                                    {this.state.type == "topics" &&
                                        <Form.Control as="select" aria-label="Max top topics to show" 
                                            value={this.state.maxTopicNumber}
                                            onChange={ (e) => {
                                                this.setState({
                                                    maxTopicNumber: e.target.value
                                                })
                                            }} >
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="-1">All</option>
                                        </Form.Control>
                                    }
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div  className="col-8">
                        <QueryUser  analisysType={this.state.type} maxTopicNumber={this.state.maxTopicNumber} />
                    </div>
                </div>
            </ApolloProvider>
        )
    }
}

export default MainPage