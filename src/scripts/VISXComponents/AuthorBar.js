import React,{ useMemo } from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";



export default function AuthorBar({
    width,
    height,
    dataList = {}, 
    colorList= ["#d3d3d3"],
    xLabel = "X axsis",
    margin = { top: 40, right: 0, bottom: 40, left: 0 },
}) {

    const background = '#eaedff';
    const gray = "#d3d3d3";
    const bar = "#282828";

    const getXValue = (d) => d.xValue;
    const getYValue = (d) => d.yValue;

    const xMin = 0;
    const xMax = width - margin.left - margin.right;
    const yMin = 0;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleBand({
            range: [0, xMax],
            // round: true,
            domain: dataList.map(getXValue),
            padding: 0.4,
          });

    const yScale = scaleLinear({
            range: [yMax, 0],
            // round: true,
            domain: [0, Math.max(...dataList.map(getYValue))],
          });


    return <div>
                <svg width={width} height={height}>
                    <rect x={0} y={0} width={width} height={height} fill={background} rx={2} />
                    {<Group left={margin.left} top={margin.top}>
                    {dataList.map((d) => {
                        const xVal = getXValue(d);
                        const yVal = getYValue(d);

                        const barWidth = xScale.bandwidth();
                        const barHeight = yMax - (yScale(yVal) ? yScale(yVal) : 0);

                        const barX = xScale(xVal);
                        const barY = yMax - barHeight;

                        return (
                            <React.Fragment key={`labeled-bar-${xVal}`}>
                            <Bar
                                key={`bar-${xVal}`}
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={barHeight}
                                fill={colorList[0]}
                            />
                            <text
                                key={`text-label-${xVal}`}
                                x={barX}
                                y={barY}
                                dx={barWidth / 2}
                                dy="-.25em"
                                fontSize={8}
                                textAnchor="middle"
                            >
                                {/* Breakpoint: https://tailwindcss.com/docs/breakpoints */}
                                {yVal}
                            </text>
                            </React.Fragment>
                        );
                        })}
                        {/* Default values: https://github.com/airbnb/visx/blob/master/packages/visx-axis/src/axis/AxisBottom.tsx */}
                        <AxisBottom
                            scale={xScale}
                            label={xLabel}
                            top={yMax}
                            numTicks={dataList.length}
                        />
                    </Group>}
                </svg>
            </div>
}