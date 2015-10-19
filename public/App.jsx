import React, { Component } from 'react';
import {form, loader } from 'subschema/index.jsx';
var Form = form;
var intlData = {
    "locales": "en-US",
    "messages": {
        "photos": "{name} took {numPhotos, plural,\n  =0 {no photos}\n  =1 {one photo}\n  other {# photos}\n} on {takenDate, date, long}.\n"
    }
};
loader.addType('ContentWrapper', require('../src/G10NContent.jsx'));
/*
 <FormattedMessage
 message={this.getIntlMessage('photos')}
 name="Annie"
 numPhotos={1000}
 takenDate={Date.now()} />
 */
var schema = {
    schema: {
        name: {
            type: "Text",
            title: "{name} took {numPhotos, plural,\n  =0 {no photos}\n  =1 {one photo}\n  other {# photos}\n} on {takenDate, date, long}.\n"
        },
        numPhotos: 'Number',
        takenDate: 'Date'
    },
    fields: [ 'name', 'numPhotos', 'takenDate']
}
var value = {
    name: 'Bob', numPhotos: 3, takenDate: new Date().toDateString()
};
export class App extends Component {

    render() {
        return (
            <div>
                Hello from this App
                <Form schema={schema} value={value}/>
            </div>
        );
    }
}