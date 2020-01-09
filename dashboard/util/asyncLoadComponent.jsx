import React ,{ Component } from 'react';


class AsyncComponent  extends Component {
      constructor(props) {
        super(props);
        this.state = {
          AsyncComp: null,
        };
        this.id = props.id;
      }
      componentWillMount() {
        this.load(this.props);
      }
      componentDidMount() {
      }
      componentWillReceiveProps(nextProps) {
        //如果不同，就是加载新组件；相同，就是props更新
        if(nextProps.id != this.id) {
          this.load(nextProps);
        } 
      }
      shouldComponentUpdate(nextProps, nextState) {
        if(this.id != nextProps.id) {
          this.id = nextProps.id;
          return false;
        }
        return true;
       
      }
      componentWillUpdate() {
      }
      componentDidUpdate() {
      }
      load(props) {
        (async function(props) {
          return await props.file();
        })(props)
        .then(module => module.default)
        .then(AsyncComp => {
          this.setState({ AsyncComp });
        })
        .catch((err) => {
          throw err;
        });
      }
      render() {
        const { AsyncComp } = this.state;
        return AsyncComp ? <AsyncComp {...this.props.data} /> : null;
      }
}

export default AsyncComponent;