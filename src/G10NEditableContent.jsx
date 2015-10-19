var React = require('react');
var G10NMixin = require('./G10NMixin')
var G10NEditableContent = React.createClass({
    mixins: [G10NMixin],
    shouldComponentUpdate(nextProps) {
        return nextProps.html !== this.getDOMNode().innerHTML;
    },
    componentDidMount(){

    },
    emitChange() {
        var html = this.getDOMNode().innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {

            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    },

    handleClick(e) {
        e && e.preventDefault();
        this.setState({contentEditable: !this.state.contentEditable});
    },

    render() {
        var {contentEditable} = this.state;
        var p = contentEditable ? {
            contentEditable
        } : null;
        /* return <div
         onClick={this.handleClick}
         onInput={this.emitChange}
         onBlur={this.emitChange}
         {...p}
         dangerouslySetInnerHTML={{__html: this.props.html}}></div>;*/

        var {type, content, field, children, fieldAttrs, context, ...props} = this.props, Type
        var pf = field || props, g10key = pf.g10n && (pf.g10n.key || pf.g10n);
        if (g10key == null) {
            return null;
        }
        if (React.DOM[type]) {
            //          var key =
            return contentEditable ? <div key='edit-content'>{g10key}</div> :
                <FormattedMessage key='content' ref='fmt' message={this.g10n(g10key)} {...this.state}/>;
        } else if (this.props.loader) {
            Type = this.props.loader.loadType(type);
        }
        return <Type {...props}>
            <FormattedMessage key='content' ref='fmt' message={this.props.content} {...this.state}/>
            {children}
        </Type>
    }


});
module.exports = G10NEditableContent;