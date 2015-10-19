import React, {Component} from 'react';


export class G10NEditableContent extends Component {

    shouldComponentUpdate(nextProps) {
        return nextProps.html !== this.getDOMNode().innerHTML;
    }

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
    }

    handleClick(e) {
        e && e.preventDefault();
        this.setState({contentEditable: !this.state.contentEditable});
    }

    render() {
        var {contentEditable} = this.state;
        var p = contentEditable ? {
            contentEditable
        } : null;
        return <div
            onClick={this.handleClick}
            onInput={this.emitChange}
            onBlur={this.emitChange}
            {...p}
            dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    }


}