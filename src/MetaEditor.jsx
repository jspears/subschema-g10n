var React = require('react');
var MetaSchema = {

    schema: {
        "elements": {
            "type": "List",
            "itemValue": {
                "type": {
                    "type": "Select",
                    "options": "argumentElement, messageTextElement"
                },
                "argumentElement": {
                    "type": "Object",
                    "subSchema": {
                        "id": "Text",
                        "format": {
                            "type": "Select",
                            "options": "pluralFormat, dateFormat, numberFormat"
                        },
                        "pluralFormat": {
                            "toggleKey": "format",
                            "toggleValue": "pluralFormat",
                            "template": "ToggleTemplate",
                            "type": "Object",
                            "schema": "PluralSchema"
                        },
                        "dateFormat": {
                            "toggleKey": "format",
                            "toggleValue": "dateFormat",
                            "template": "ToggleTemplate",
                            "type": "Object",
                            "schema": "DateSchema"

                        },
                        "numberFormat": {
                            "toggleKey": "format",
                            "toggleValue": "toggleValue",
                            "template": "ToggleTemplate",
                            "type": "Object",
                            "schema": "NumberSchema"
                        }
                    }
                },
                "messageTextElement": {
                    "type": "Object",
                    "subSchema": {
                        id: "Text",
                        value: "Text"
                    }
                }
            }
        }
    }

}

var meta = {
    "type": "messageFormatPattern",
    "elements": [
        {"type": "argumentElement", "id": "name", "format": null},
        {"type": "messageTextElement", "value": " took "},
        {
            "type": "argumentElement", "id": "numPhotos", "format": {
            "type": "pluralFormat",
            "ordinal": false,
            "offset": 0,
            "options": [{
                "type": "optionalFormatPattern",
                "selector": "=0",
                "value": {
                    "type": "messageFormatPattern",
                    "elements": [{"type": "messageTextElement", "value": "no photos"}]
                }
            }, {
                "type": "optionalFormatPattern",
                "selector": "=1",
                "value": {
                    "type": "messageFormatPattern",
                    "elements": [{"type": "messageTextElement", "value": "one photo"}]
                }
            }, {
                "type": "optionalFormatPattern",
                "selector": "other",
                "value": {
                    "type": "messageFormatPattern",
                    "elements": [{"type": "messageTextElement", "value": "# photos"}]
                }
            }]
        }
        },
        {"type": "messageTextElement", "value": " on "},
        {"type": "argumentElement", "id": "takenDate", "format": {"type": "dateFormat", "style": "long"}},
        {"type": "messageTextElement", "value": ". They cost "},
        {"type": "argumentElement", "id": "amount", "format": {"type": "numberFormat", "style": "currency"}},
        {"type": "messageTextElement", "value": "\n"}
    ]
};
