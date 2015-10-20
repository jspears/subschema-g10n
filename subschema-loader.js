var Schema2Msgs = require('./schema2msgs');
var loaderUtils = require("loader-utils");

module.exports = function subschema$loader(source) {
    this.cacheable && this.cacheable();
    var query = loaderUtils.parseQuery(this.query);
    var path = loaderUtils.interpolateName(this, query.name || '[name].properties', {
        content: false,
        regExp: "(.*)\\.subschema\\.js(on)?",
    });
    var schema = typeof source === "string" ? JSON.parse(source) : source;

    var s2m = new Schema2Msgs(schema, path || '', {locales: query.locales || 'US-en', 'localeDir':query.localeDir || 'locales'});
    schema = s2m.toJSON();
    this.value = [schema];
    return "module.exports = " + JSON.stringify(schema, null, "\t") + ";";

}