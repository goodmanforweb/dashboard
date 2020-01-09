// var aaa = require.context('.', false, /\.\/\w*/)
import select from "./select";
import chartPie from "./chartPie";
import chartLine from "./chartLine";
import chartBar from "./chartBar";
import chartMix from "./chartMix";
import custom from "./custom";
import olap from "./olap";
import checkbox from "./checkbox";
import radio from "./radio";
import date from "./date";
import text from "./text";
import video from "./video";
import markerMap from "./markerMap";
import heatMap from "./heatMap";
import routeMap from "./routeMap";
import migrateMap from "./migrateMap";
import container from "./container";
import table from "./table";
import multiselect from "./multiselect";
import pictcomponent from "./pictcomponent";
import chartDot from "./chartDot";
import themeriver from "./themeriver";
import chartWordCloud from "./chartWordCloud";
import sankey from "./sankey";
import heatchart from "./heatchart";
import chartRose from "./chartRose";
import graph from "./graph";
import chartNestpie from "./chartNestpie";
import chartFunnel from "./chartFunnel";
import chartGauge from "./chartGauge";
import timeline from "./timeline";

function loader(name){
    return import('./'+name).then(e=>e.default);
}

export {
    select,
    chartPie,
    custom,
    olap,
    checkbox,
    radio,
    date,
    text,
    heatMap,
    markerMap,
    routeMap,
    migrateMap,
    video,
    chartLine,
    chartBar,
    chartMix,
    container,
    table,
    multiselect,
    pictcomponent,
    chartDot,
    themeriver,
    sankey,
    chartRose,
    heatchart,
    chartWordCloud,
    graph,
    chartNestpie,
    chartFunnel,
    chartGauge,
    timeline
};