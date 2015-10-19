var React = require('react');
var EditableContent = React.createClass({
    propTypes: {
        html: React.PropTypes.string
    },
    shouldComponentUpdate: function (nextProps) {
        return nextProps.editable !== this.props.editable;
    },
    componentDidUpdate: function () {
        if (this.props.html !== this.getDOMNode().innerHTML) {
            this.getDOMNode().innerHTML = this.props.html;
        }
    },
    handleChange: function (e) {
        var html = this.getDOMNode().innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange(e, html);
        }
        this.lastHtml = html;
    },
    render: function () {
        return React.createElement('div', {
            onInput: this.handleChange,
            onBlur: this.handleChange,
            contentEditable: undefined === this.props.editable ? true: this.props.editable,
            dangerouslySetInnerHTML: {__html: this.props.html}});
    }
});
module.exports = EditableContent;
/* return <div
 onClick={this.handleClick}
 onInput={this.emitChange}
 onBlur={this.emitChange}
 {...p}
 dangerouslySetInnerHTML={{__html: this.props.html}}></div>;*/