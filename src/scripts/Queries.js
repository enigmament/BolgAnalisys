import React from "react"

import  {
    useQuery,
    gql
} from "@apollo/client";

//toremove3
import { letterFrequency } from '@visx/mock-data';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';

function QueryUser () {

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


    let lastday = new Date(parseInt(data.allPosts[0].createdAt)); //.valueOf()


    let lastdayMonthfrom = new Date().valueOf();
    let firstdayMonth = lastday.setDate(1).valueOf();

    let mostPopularTopic = []

    let tempval = {}
    mostPopularTopic[`${firstdayMonth.getFullYear()}-${firstdayMonth.getMonth()+1}`]
    data.allPosts.map( (post) => {
        if(lastdayMonthfrom.valueOf() <= post.createdAt || post.createdAt < firstdayMonth.valueOf()){
            mostPopularTopic[`${firstdayMonth.getFullYear()}-${firstdayMonth.getMonth()+1}`]
            tempval = {}
        }
       
        for (let i = 0; i < 3; i++) {
            if(tempval[post.likelyTopics[0].label] ) {
                tempval[post.likelyTopics[0]]++
            }
            else {
                tempval[post.likelyTopics[0]] = 0;
            }
        }
    })
   
    
   // console.log (listOfUser)

    // We'll use some mock data from `@visx/mock-data` for this.
    const data3 = letterFrequency;
    // Define the graph dimensions and margins
    const width = 500;
    const height = 500;
    const margin = { top: 20, bottom: 20, left: 20, right: 20 };

    // Then we'll create some bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // We'll make some helpers to get at the data we want
    const x = d => d.letter;
    const y = d => +d.frequency * 100;

    // And then scale the graph by our data
    const xScale = scaleBand({
        range: [0, xMax],
        round: true,
        domain: data3.map(x),
        padding: 0.4,
    });
    const yScale = scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data3.map(y))],
    });

    // Compose together the scale and accessor functions to get point functions
    const compose = (scale, accessor) => data => scale(accessor(data));
    const xPoint = compose(xScale, x);
    const yPoint = compose(yScale, y);

    return (<div>
         <svg width={width} height={height}>
            {data3.map((d, i) => {
                const barHeight = yMax - yPoint(d);
                return (
                <Group key={`bar-${i}`}>
                    <Bar
                        x={xPoint(d)}
                        y={yMax - barHeight}
                        height={barHeight}
                        width={xScale.bandwidth()}
                        fill="#fc2e1c"
                    />
                </Group>
                );
            })}
        </svg>
    </div>)
}

export {QueryUser};