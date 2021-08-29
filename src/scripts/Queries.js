import React from "react"

import { TopicFilter } from "./TopicFilter";
import AuthorFilter from "./AuthorFilter";
import {Spinner } from 'react-bootstrap'
import  {
    useQuery,
    gql
} from "@apollo/client";


function QueryUser ({
    maxTopicNumber,
    analisysType,
    setListUSer,
    }) {

    const GET_ALL_POST = gql`
        query Post {
            allPosts(count:2000) {
                id,
                title,
                createdAt,
                author {
                    id,
                    firstName,
                    lastName
                },
                likelyTopics {
                    label,
                    likelihood
                }
            }
        }
    `;

    const  { loading, error, data } = useQuery(GET_ALL_POST);

    if(loading)  {  
        return (
            <Spinner  animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)
        }
    if(error) return <div>Error retriveing data...</div>

    return (
        <div>
            {analisysType === "topics" &&
                 <TopicFilter data={data}/>
            }
             {analisysType === "author" && 
                 <AuthorFilter data={data}/>
            }
        </div>
    )
}

export {QueryUser};