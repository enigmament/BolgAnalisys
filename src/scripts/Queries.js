import React from "react"

import  {
    useQuery,
    gql
} from "@apollo/client";

import GroupBar from './BarStack'

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


const dataFiltered = (data, maxTopicNumber) =>  {
   
    const resultRed = data.allPosts.reduce( (acc, post)=> {
        let date = new Date(parseInt(post.createdAt, 10));
        date.setDate(1);
        let monthString = (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`;
        const dateStr = `${date.getFullYear()}-${monthString}`
        if(!acc[dateStr]) {
            acc[dateStr] = {
                dateMonth: date,
                count: 0,
                topics: {}
            }
        }
        acc[dateStr].count++;
        let monthTopicsList = acc[dateStr].topics;
        for (let i = 0; i < post.likelyTopics.length; i++) {
            const labelTopic = post.likelyTopics[i].label;
            const likeHood = post.likelyTopics[i].likelihood;
            if(!monthTopicsList[labelTopic] ) {
                monthTopicsList[labelTopic] = 0;
            }
            monthTopicsList[labelTopic] += likeHood;
       }
       
        return acc;
    }, {});
    
    //order topics 
    const resultsOrdered = Object.entries(resultRed).map( (value) => {
        const element = value;
        const orderElement =  Object.entries(value[1].topics).sort((a, b)=> {
            return  b[1] - a[1];
        }).filter( (el, id) => {
            if(maxTopicNumber < 0)
                return true;
            return id < maxTopicNumber
        })
        .reduce((acc,topic)=>{
                    acc[topic[0]] = ((topic[1]/element[1].count) *100);
                    return acc;
        }, {})

        return {
            month: element[0],
            numberPost: element[1].count,
            date: element[1].dateMonth,
            topics: orderElement,
        }
    } )

    return resultsOrdered;
}


function QueryUser ({
    analisysType,
    maxTopicNumber}) {

    const GET_ALL_POST = gql`
        query Post {
            allPosts(count:2000) {
                id,
                title,
                createdAt,
                likelyTopics {
                    label,
                    likelihood
                }
            }
        }
    `;

    const  { loading, error, data } = useQuery(GET_ALL_POST);

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error retriveing data...</div>


    const dataFitleredByTopics = dataFiltered(data, parseInt(maxTopicNumber, 10));

    const keysSet = new Set();
    dataFitleredByTopics.forEach(element => {
        Object.keys(element.topics).forEach((topicname)=> {
            keysSet.add(topicname)
        })
    });

    const dataList = dataFitleredByTopics.map((element) => {
        return {
            month: element.month,
            ...element.topics
        }
    }).sort((a, b)=> {
        return a.month < b.month ? 1 : a.month > b.month  ? -1 : 0;
    }) 

   const keys = [...keysSet];

   const color = keys.map( () => getRandomColor())

    return (<div className="row">
        <div className="col-12">
            <GroupBar width={800} height={800} dataList={dataList} keyset={keys} colorset={color} />
        </div>
    </div>)
}

export {QueryUser};