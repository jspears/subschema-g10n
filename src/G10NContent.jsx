import React, { Component } from 'react';

var G10NMixin = require('./G10NMixin');
var G10NContent = React.createClass({
    mixins:[G10NMixin],
    render() {
        return this.renderContent();
    }
});

module.exports = G10NContent;