import React, { Component } from "react";
import ReactDOM from "react-dom";
import CssAndJsPopup from "./panelComponents/cssAndJsPopup";
class CssAndJsPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showObj: null
        };
    }
    componentDidMount() {
        Dashboard.event.subscribe("CssAndJsPop", props => {
            this.setState({
                showObj: props
            });
        });
    }
    render() {
        return this.state.showObj ? (
            <CssAndJsPopup {...this.state.showObj} />
        ) : null;
    }
}
export default CssAndJsPop;
