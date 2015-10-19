var each = require('lodash/collection/each');
var isString = require('lodash/lang/isString');
var isArray = require('lodash/lang/isArray');
var isObject = require('lodash/lang/isObject');
var {titlelize, toArray} = require('subschema/tutils');

function join() {
    return Array.prototype.join.apply(arguments, '.');
}
function Schema2Messages(schema, path) {
    this.schema = schema.schema || schema;
    this.path = path || '';
    this._messages = {}

}
Schema2Messages.prototype.update = function (key, value) {
    this._messages[key] = value;
}


Schema2Messages.prototype._handleContent = function (path, content) {
    if (content == null || content == false || content.content === false) {
        return;
    }
    if (isString(content)) {
        this.update(path, content);
        return;
    }
    if (isArray(content)) {
        each(content, function (v, i) {
            this._handleContent(path + '[' + i + ']', v);
        });
        return;
    }
    if (content.content) {
        this._handleContent(path, content.content);
        return;
    }

}

Schema2Messages.prototype._handleValidators = function (path, validator, key) {
    if (isString(validator)) {
        this.update(join('validators', validator, 'message'), validator);
        return;
    }
    if (validator.message) {
        this._handleContent(join(path, 'validators', validator.type || key, 'message'), validator.message);
    }
}

Schema2Messages.prototype._handleSchema = function (path, schema, key) {
    if (isString(schema)) {
        this.update(join(path, key, 'title'), titlelize(key));
        return;
    }
    if (schema.title) {
        this._handleContent(join(path, key, 'title'), schema.title);
    }
    if (schema.help) {
        this._handleContent(join(path, key, 'help'), schema.help);
    }
    var validators = toArray(schema.validators)
    if (validators.length) {
        each(this._handleValidators.bind(path), this);
    }
    if (schema.subSchema) {
        each(schema.subSchema, this._handleSchema.bind(this, path));
    }
    if (schema.itemSchema) {
        each(schema.itemSchema, this._handleSchema.bind(this, join(path, 'itemSchema')));
    }
    if (schema.valueSchema) {
        each(schema.valueSchema, this._handleSchema.bind(this, join(path, 'valueSchema')));
    }
}

Schema2Messages.prototype.messages = function () {
    if (isString(this.schema)) {
        return this._messages;
    }
    each(this.schema, this._handleSchema.bind(this, this.path));
    return this._messages;
}

function schema2msgs$export(schema, path) {
    schema = schema.schema || schema;
    var messages = {};
    return schema2msgs(messages, schema, path);
}


module.exports = schema2msgs$export;