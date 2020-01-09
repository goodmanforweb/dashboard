import React, { Component } from "react";
import PanelDrill from "../panelComponents/chartEvent.jsx";

class drillHandle extends Component {
    constructor(props) {
        super(props);
    }

    styleDispatcher(router) {
        let type = router.name;
        return (
            {
                table: null,
                chartBar: <PanelDrill {...router} />,
                chartLine: <PanelDrill {...router} />,
                chartPie: <PanelDrill {...router} />,
                chartMix: <PanelDrill {...router} />,
                chartFunnel: <PanelDrill {...router} />,
                heatchart: <PanelDrill {...router} noDrill={true} />,
                chartWordCloud: <PanelDrill {...router} noDrill={true} />,
                chartRose: <PanelDrill {...router} />,
                graph: <PanelDrill {...router} noDrill={true} />,
                chartNestpie: <PanelDrill {...router} noDrill={true} />,
                themeriver: <PanelDrill {...router} noDrill={true} />,
                sankey: <PanelDrill {...router} noDrill={true} />,
                chartDot: <PanelDrill {...router} noDrill={true} />,
                chartGauge: <PanelDrill {...router} noDrill={true} />,
                migrateMap: null,
                routeMap: null,
                markerMap: null,
                heatMap: null,
                radio: null,
                text: null,
                checkbox: null,
                date: null,
                select: null
            }[type] || null
        );
    }
    render() {
        let { router } = this.props;
        return router ? this.styleDispatcher(router) : null;
    }
}

export default drillHandle;
