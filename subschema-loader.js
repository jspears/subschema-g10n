var Schema2Msgs = require('./src/Schema2Msgs.js');

module.exports = function subschema$loader(source) {
    this.cacheable && this.cacheable();
    var schema = typeof source === "string" ? JSON.parse(source) : source;
    var path = this.resource && this.resource.replace(process.cwd(), '').replace(/\.subschema\.js(on)?/, '').split('/').pop() || '';

    var s2m = new Schema2Msgs(schema, path || '');
    try {
        var messages = s2m.messages();
    } catch (e) {
        console.log('error', e);
    }
    schema.g10n = {
        locales: "en-US",
        messages: messages,
        formats: {
            "date": {
                "short": {
                    "day": "numeric",
                    "month": "long",
                    "year": "numeric"
                }
            },
            "time": {
                "hhmm": {
                    "hour": "numeric",
                    "minute": "numeric"
                }
            },
            "number": {
                "USD": {
                    "style": "currency",
                    "currency": "USD",
                    "minimumFractionDigits": 2
                },
                "currency":{
                    "style": "currency",
                    "currency":"USD",
                    "minimumFractionDigits": 2
                }
            },
            "relative": {
                "hours": {
                    "units": "hour",
                    "style": "numeric"
                }
            }
        }
    };
    console.log('schema', JSON.stringify(schema, null, '\t'));

    this.value = [schema];
    return "module.exports = " + JSON.stringify(schema, null, "\t") + ";";

}