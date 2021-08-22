import React from "react"

import  {
    useQuery,
    gql
  } from "@apollo/client";


function QueryUser () {
    const USER_LIST_REQ = gql`
        query User {
            allUsers(count:20) {
                id,
                firstName,
                lastName
            }
        }
    `;     

    const  { loading, error, data } = useQuery(USER_LIST_REQ);
    const listOfUser = data

    return <div><ul></ul></div>
}

export {QueryUser};