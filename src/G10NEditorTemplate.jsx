var React = require('react');
var css = require('subschema/css');
var Content = require('subschema/types/Content.jsx');
var EditorTemplate = React.createClass({
    displayName: 'EditorTemplate',
    componentWillMount(){
        this.props.valueManager.addErrorListener(this.props.path, this.setError, this, true);
    },
    componentWillUnmount(){
        this.props.valueManager.removeErrorListener(this.props.path, this.setError);
    },
    setError(errors){
        this.setState({
            error: errors && errors[0].message
        });
    },
    render(){
        var {name, title, help, errorClassName, message, fieldClass, children} = this.props;
        var error = this.state.error;
        return (<div
            className={"form-group field-name " + (error != null ? errorClassName || '' : '') + ' ' +  css.forEditor(this)}>
            {title ? <label className="col-sm-2 control-label" htmlFor={name}><Content content={title} loader={this.props.loader} valueManager={this.props.valueManager}/></label> : null}

            <div className="col-sm-10">
                {children}
                <p className="help-block" ref="help"><Content content={error || help} loader={this.props.loader} valueManager={this.props.valueManager}/></p>
            </div>
        </div>);
    }
});
module.exports = EditorTemplate;