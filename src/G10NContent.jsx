import React, { Component } from 'react';
import ContentWrapper from 'subschema/types/ContentWrapper.jsx';
import ValueManagerListenerMixin from 'subschema/ValueManagerListenerMixin';
import Compiler from 'intl-messageformat/src/compiler.js'
import {FormattedMessage, IntlMixin} from 'react-intl';
import map from 'lodash/collection/map';
import escape from 'lodash/string/escape';
import isString from 'lodash/lang/isString';

function empty(v) {
    return !(v == null)
}
var G10NContent = React.createClass({

    mixins: [ValueManagerListenerMixin, IntlMixin],
    register(key){
        console.log('register', key);
        this.registerHandler(key, this.updateState, this, true);
    },
    updateState(value, oldValue, key){
        console.log('value', value, key);
        var obj = {};
        obj[key] = escape(value);
        this.setState(obj);
    },
    getDefaultProps(){
        return {
            type: 'span',
            content: ''
        }
    },
    componentWillReceiveProps(props){
        if (props.content !== this.props.content) {
            this.rebuildValue(props.content);
        }
    },
    componentWillMount(){
        this.rebuildValue(this.props.content);
    },
    rebuildValue(content){
        this._componentListeners.forEach((v)=>v.remove());
        this.props.g10n && this.props.g10n.listen.forEach(this.register);
    },
    g10n(g10Key){
        var messages = this.props.messages || this.context.messages;
        var mesg = messages[g10Key] || this.getIntlMessage(g10Key);
        return mesg;
    },
    render() {
        var {type, content, field, children, fieldAttrs, context, ...props} = this.props, Type
        var pf = field || props, g10key = pf.g10n && (pf.g10n.key || pf.g10n);
        if (g10key == null) {
            return null;
        }
        if (React.DOM[type]) {
            //          var key =
            return <FormattedMessage key='content' ref='fmt' message={this.g10n(g10key)} {...this.state}/>;
//            return <div {...props}/>
        } else if (this.props.loader) {
            Type = this.props.loader.loadType(type);
        }
        return <Type {...props}>
            <FormattedMessage key='content' ref='fmt' message={this.props.content} {...this.state}/>
            {children}
        </Type>
    }

});

module.exports = G10NContent;