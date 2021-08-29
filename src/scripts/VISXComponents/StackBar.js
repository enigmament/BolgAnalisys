import React from 'react';
import { Group } from '@visx/group';
import { BarStack } from '@visx/shape';
import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { LegendOrdinal } from "@visx/legend";

const background = '#eaedff';
const gray = "#d3d3d3";
const darkGray = "#282828";



export default function StackBar({
    width,
    height,
    dataList = {}, 
    keyset,
    colorset = [],
    margin = { top: 40, right: 0, bottom: 40, left: 0 },
}) {

    const legendStyles = {
        display: "flex",
        minWidth: 230,
        backgroundColor: "white",
        color: "#282828",
        fontSize: 12,
        position: "absolute",
        top: 10,
        left: 5,
        boxShadow: "2px 2px 5px #ccd3de"
      };
    
    const {
        tooltipOpen,
        tooltipTop,
        tooltipLeft,
        hideTooltip,
        showTooltip,
        tooltipData
      } = useTooltip();
    
    const { containerRef, TooltipInPortal } = useTooltipInPortal();

    dataList = dataList.map((element) => {
        const allKey = {};
        keyset.forEach(element => {
            allKey[element] = 0;
        });

        return {
            ...allKey,
            ...element
        }

    })

    //
    //const parseDate = timeParse('%Y-%m');
    //const format = timeFormat('%b %d');
    //const formatDate = (date) => format(parseDate(date));

    const getXValue = (data) => data.xValue;
    // new scale 
    const xValueScale =  scaleBand({
        domain: dataList.map(getXValue),
        padding: 0.4,
    });

    const colorScale = scaleOrdinal({
        domain: keyset,
        range: colorset,
    });
    
    const percScale = scaleLinear({
        domain:[0, 100]
    });

    // bounds
    const xMin = 0;
    const xMax = width - margin.left - margin.right;
    const yMin = 0;
    const yMax = height - margin.top - margin.bottom;

    const tooltipStyles = {
        ...defaultStyles,
        minWidth: 160,
        minHeight: 100,
        backgroundColor: "#4e5271",
        color: "white"
      };

    percScale.range([yMax, yMin]);
    xValueScale.range([xMin, xMax]);

    let tooltipTimeout;

    return width >= 10 && (
        <div ref={containerRef} style={{ position: "relative" }}>
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill={background} rx={2} />
                <Group top={margin.top} left={margin.left}>
                    <BarStack data={dataList}
                        keys={keyset}
                        x={getXValue}
                        xScale={xValueScale}
                        yScale={percScale}
                        color={colorScale}>
                        
                        {(barStacks) =>
                            barStacks.map((barStack) =>
                                barStack.bars.map((bar) => (
                                <rect key={`bar-stack-${barStack.index}-${bar.index}`}
                                    x={bar.x} y={bar.y}
                                    height={bar.height} width={bar.width}
                                    fill={bar.color}
                                    stroke="white" 
                                    onClick={() => {
                                        alert(`Clicked: ${JSON.stringify(bar)}`);
                                    }}
                                    onMouseLeave={() => {
                                        tooltipTimeout = window.setTimeout(() => {
                                            hideTooltip();
                                        }, 300);
                                    }}
                                    onMouseMove={(event) => {
                                        if (tooltipTimeout) 
                                            clearTimeout(tooltipTimeout);
                                        const top = event.clientY;
                                        const left = bar.x + bar.width + 260;
                                        showTooltip({
                                          tooltipData: bar,
                                          tooltipTop: top,
                                          tooltipLeft: left
                                        });
                                      }}
                                    />
                                ))
                            )
                            }
                    </BarStack>
                </Group>
                <AxisBottom
                    top={yMax + margin.top}
                    left={margin.left}
                    scale={xValueScale}
                    hideTicks
                    stroke={gray}
                    strokeWidth={1}
                    tickLabelProps={() => ({
                        fill: darkGray,
                        fontSize: 11,
                        textAnchor: "middle"
                    })} />
                <AxisLeft
                    top={margin.top}
                    left={xMax + margin.left}
                    scale={percScale}
                    hideTicks
                    numTicks={5}
                    tickFormat={(percent) => percent + "%"}
                    stroke={gray}
                    strokeWidth={3} />
                  <GridRows
                    top={margin.top}
                    left={margin.left}
                    scale={percScale}
                    width={xMax}
                    height={yMax - margin.top - margin.bottom}
                    stroke="white"
                    strokeOpacity={0.4}
                    numTicks={5} />
            </svg>
            <div style={{
                position: "absolute",
                top: margin.top / 2 - 18,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                fontSize: 14
                }} >
                <LegendOrdinal scale={colorScale} style={legendStyles}
                    direction="column-reverse"
                    shape="circle"
                    shapeMargin="10px 6px 10px 16px" />
            </div>
            {tooltipOpen && tooltipData && (
                <TooltipInPortal key={Math.random()}
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={tooltipStyles} >

                    <div className="tooltip-title">
                        <strong>{tooltipData.key}</strong>
                    </div>
                    <div className="tooltip-value">
                        {`${tooltipData.bar.data[tooltipData.key].toFixed(3)}% on month ${getXValue(tooltipData.bar.data)}`}
                    </div>
                    <div className="tooltip-date">
                        <small>{ getXValue(tooltipData.bar.data)}</small>
                    </div>
                </TooltipInPortal>
            )}
        </div>
    );
}