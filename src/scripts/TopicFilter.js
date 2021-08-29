import React, {useState} from "react"
import  StackBar from "./VISXComponents/StackBar" ;
import { Form } from 'react-bootstrap';
import {getRandomColor} from './Utility'

function TopicFilter ({
    data
    }) {

    const [maxTopicNumber, setMaxTopicNumber] = useState(3);
    
    
    const dataFiltered = (dataTP, maxTopicNumber) =>  {
        const exponential = 7;
        const powPercExp = Math.pow(10, exponential);
        const poeDivPercExp= Math.pow(10, (exponential-2))
        const resultRed = dataTP.allPosts.reduce( (acc, post)=> {
            let date = new Date(parseInt(post.createdAt, 10));
            date.setDate(1);
            let monthString = (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`;
            const dateStr = `${date.getFullYear()}-${monthString}`
            if(!acc[dateStr]) {
                acc[dateStr] = {
                    dateMonth: date,
                    count: 0,
                    topics: {},
                    exponential: exponential
                }
            }
            acc[dateStr].count++;
            let monthTopicsList = acc[dateStr].topics;
            for (let i = 0; i < post.likelyTopics.length; i++) {
                const labelTopic = post.likelyTopics[i].label;
                const likeHood = Math.round(post.likelyTopics[i].likelihood * powPercExp);
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
                return id < maxTopicNumber;
            })
            .reduce((acc,topic)=>{
                        acc[topic[0]] = ((topic[1]/element[1].count) / poeDivPercExp);
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
    
    const dataFitleredByTopics = dataFiltered(data, parseInt(maxTopicNumber, 10));

    const keysSet = new Set();
    dataFitleredByTopics.forEach(element => {
        Object.keys(element.topics).forEach((topicname)=> {
            keysSet.add(topicname)
        })
    });

    const dataList = dataFitleredByTopics.map((element) => {
        return {
            xValue: element.month,
            ...element.topics
        }
    }).sort((a, b)=> {
        return a.month < b.month ? 1 : a.month > b.month  ? -1 : 0;
    }) 

    const keys = [...keysSet];

    const color = keys.map( () => getRandomColor());

   
    return (
        <div className="row">
            <div className="col-12 col-md-4 pb-3">
                <Form.Label>Select the number of most prevalent topics for each month</Form.Label>
                <Form.Control as="select" aria-label="Max top topics to show" 
                    value={maxTopicNumber}
                    onChange={ (e) => {
                        setMaxTopicNumber( e.target.value)
                    }} >
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="-1">All</option>
                </Form.Control>
            </div>
            <div className="col-12 col-md-8">
                <StackBar width={800} height={800} dataList={dataList} keyset={keys} colorset={color} />
            </div>
           
        </div>
    )

}


export {TopicFilter}



