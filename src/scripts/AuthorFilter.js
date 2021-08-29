import React, { useState } from "react"

import { Form } from 'react-bootstrap';
import AuthorBar from './VISXComponents/AuthorBar'
import StackBar from "./VISXComponents/StackBar" ;

import { letterFrequency } from '@visx/mock-data';

import {getRandomColor} from './Utility'

export default function AuthorFilter ( {   
    data
 } ) {

    const keyset = [];
    const dataletter = letterFrequency
    const authorList = [];
    const exponential = 7;
    const powPercExp = Math.pow(10, exponential);
    const powDivPercExp= Math.pow(10, (exponential-2))
  
    const aggreagateByAuthor = (dataTP) =>  {
        //const userList = [];
       

        const resultRed = dataTP.allPosts.reduce((acc, post) => {
            const authId = post.author.id;
            if(!acc[authId]) {
                acc[authId] = {
                    ...post.author,
                    publishedPost: 0,
                    topics: {},
                    topicsByMonth: {}
                }
                authorList.push(post.author);
            }
            const authorInfo = acc[authId];
            const totTopics = authorInfo.topics;
            authorInfo.publishedPost ++;

            let date = new Date(parseInt(post.createdAt, 10));
            date.setDate(1);
            let monthString = (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`;
            const dateStr = `${date.getFullYear()}-${monthString}`;
            if(!acc[authId].topicsByMonth[dateStr]) {
                acc[authId].topicsByMonth[dateStr] = {
                    dateMonth: date,
                    count: 0,
                    topics: {}
                };
            }
            acc[authId].topicsByMonth[dateStr].count++;

            const topicsBySingleMonth = acc[authId].topicsByMonth[dateStr].topics;
            for (let i = 0; i < post.likelyTopics.length; i++) {
                const labelTopic = post.likelyTopics[i].label;
                //const likeHood = post.likelyTopics[i].likelihood;
                const likeHood = Math.round(post.likelyTopics[i].likelihood * powPercExp);

                if(!topicsBySingleMonth[labelTopic] ) {
                    topicsBySingleMonth[labelTopic] = 0;
                }
                if(!totTopics[labelTopic] ) {
                    totTopics[labelTopic] = 0;
                }
                topicsBySingleMonth[labelTopic] += likeHood;
                totTopics[labelTopic] += likeHood;
           }
            return acc
        },{});
       
        //setListUSer(userList);
        return resultRed;
    }

    const autorXLabaleBar = {
        "postpermonth" : " Period (Month)",
        "maintopics" : "Topics name"
    }
    
    const authorBarFilter = (selectdAuthorFilter, filterAuthorOption) => {
        const listPostByAuthor = dataAgg[selectdAuthorFilter];
        let barList = [];
        let listKeys = [];
        let color =[];
        if(filterAuthorOption === "postpermonth") {
            barList = Object.entries(listPostByAuthor.topicsByMonth).map((value)=>{
                return {
                    xValue: value[0],
                    yValue: value[1].count
                }
            }).sort( (a, b) => {
                return a.xValue < b.xValue ? 1 : a.xValue > b.xValue  ? -1 : 0;
            })
            color.push(getRandomColor());
        }
        else if (filterAuthorOption === "maintopics")  {
            barList = Object.entries(listPostByAuthor.topics).map((value)=>{
                const percentageTopics = Math.round(value[1]/(listPostByAuthor.publishedPost))/powDivPercExp; 
                return {
                    xValue: value[0],
                    yValue: percentageTopics
                }
            }).sort( (a, b) => {
                return a.yValue < b.yValue ? 1 : a.yValue > b.yValue  ? -1 : 0;
            })
            color.push(getRandomColor());
        }
        else if (filterAuthorOption === "trendtopic" ) {
            const keysSet = new Set();
            barList = Object.entries(listPostByAuthor.topicsByMonth).map((value)=>{

                const topicByMonthList  =  Object.entries(value[1].topics).sort((a, b)=>{
                    return  b[1] - a[1];
                }).filter( (el, id) => {
                    return id < 1;
                })
                .reduce((acc, topic)=>{
                    keysSet.add(topic[0]);

                    acc[topic[0]] = ((topic[1]/value[1].count) / powDivPercExp);
                    return acc;
                }, {})

                return {
                    xValue: value[0],
                    ...topicByMonthList
                }
            }).sort( (a, b) => {
                return a.xValue < b.xValue ? 1 : a.xValue > b.xValue  ? -1 : 0;
            })
            listKeys = [...keysSet];
            color = listKeys.map( () => getRandomColor());
        }

        return {
            dataforGraphics : barList, 
            keyList: listKeys, 
            colorList: color
        }
    }

    const dataAgg = aggreagateByAuthor(data);

    const [selectdAuthorFilter, setAuthorFilter] = useState(authorList[0].id);
    const [filterAuthorOption, setFilterAuthorOption] = useState( "postpermonth");
    const [{dataforGraphics, keyList, colorList}, setDataForGraphics]  = useState(authorBarFilter(selectdAuthorFilter, filterAuthorOption))

    return (<div className="row">
                <div className="col-12">
                    <Form.Control as="select" aria-label="Max top topics to show" 
                        value={selectdAuthorFilter}
                        onChange={ (e) => {
                            setAuthorFilter(e.target.value)
                            const barInfo = authorBarFilter(e.target.value, filterAuthorOption)
                            setDataForGraphics(barInfo);
                        }} >
                        {authorList.map((author)=>{
                            return <option key={author.id} value={author.id}>{`${author.firstName} ${author.lastName}`}</option>
                        })}
                    </Form.Control>

                    <Form.Control  as="select" value={filterAuthorOption}
                        onChange={ (e) => {
                            setFilterAuthorOption( e.target.value);
                            const barInfo = authorBarFilter(selectdAuthorFilter, e.target.value)
                            setDataForGraphics(barInfo);
                        }} >
                        <option value="postpermonth">Post per month</option>
                        <option value="maintopics">Main topics of author</option>
                        <option value="trendtopic">Trend topics by months</option>
                    </Form.Control>
                </div>
                <div  className="col-12">
                    {(filterAuthorOption === "postpermonth" || filterAuthorOption === "maintopics" ) &&
                        <AuthorBar width={800} height={800} dataList={dataforGraphics} xLabel={autorXLabaleBar[filterAuthorOption]} colorList={colorList}/>
                    }
                    {filterAuthorOption === "trendtopic" && 
                        <StackBar width={800} height={800} dataList={dataforGraphics} keyset={keyList} colorset={colorList} />
                    }
                </div>
            </div>)
}