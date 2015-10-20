var each = require('lodash/collection/each');
var isString = require('lodash/lang/isString');
var isArray = require('lodash/lang/isArray');
var isObject = require('lodash/lang/isObject');
var map = require('lodash/collection/map');
var tutils = require('subschema/src/tutils.js');
var defaults = require('lodash/object/defaults');
var titlelize = tutils.titlelize, toArray = tutils.toArray;
var parser = require('intl-messageformat-parser');

function empty(v) {
    return !(v == null);
}

var dre = /\./g, kre = /(\{[^},\s\r\n]*)(\.)([^},\s\r\n]*)/g;
function listenTo(str) {
    return map(parser.parse(dotKludge(str)).elements, 'id').filter(empty).map(function (v) {
        return v.replace(dre, '.');
    });
}

function join() {
    return Array.prototype.slice.call(arguments).join('.');
}
/**
 * SHould be able to walk up the tree, going to replace . with :
 * so we don't break the formatter.
 *
 * @param str
 * @returns {*}
 */
function dotKludge(str, repl) {
    repl = repl || ':';
    kre.index = 0;


    var ret = str.replace(kre, function (k, k1, k2, k3, k4) {
        return k1.replace(dre, repl) + k2.replace(dre, ':') + k3.replace(dre, repl);
    });
    return ret;
}
function Schema2Messages(schema, path, g10n) {
    this.schema = schema.schema ? schema : {schema: schema};
    this.path = path || '';
    this.g10n = g10n === false ? false : g10n || {file: path};
    this._messages = {}
}

Schema2Messages.prototype.update = function Schema2Messages$update(key, value) {
    this._messages[key] = value;
    return key;
}

Schema2Messages.prototype.resolve = function Schema2Messages$resolveListen(g10n) {
    //load file.
    //get prop.
    return this._messages[g10n.key || g10n];

}
/**
 * So if there is only 1 property and its a key,
 * then we try to resolve the key and see if there are any messages
 * to resolve, wich require listeners.
 *
 * If there are then we return an object.  If the only object is
 * key than we return it.
 *
 *
 * [TODO] - make g10n defaults move up the stack so we don't need context to.
 * @param g10n
 * @returns {*}
 */
Schema2Messages.prototype._resolveUpdate = function Schema2Messages$resolveUpdate(g10n) {
    if (isString(g10n)) {
        g10n = {
            key: g10n
        }
    }
    //load file.
    //get prop.
    var listen = listenTo(this.resolve(g10n));

    if (listen.length === 0) {
        delete g10n.listen;
    } else {
        g10n.listen = listen;
    }
    if (Object.keys(g10n).length === 1 && g10n.key) {
        return g10n.key;
    }
    return g10n;
}

Schema2Messages.prototype._handleContent = function Schema2Messages$_handleContent(path, content, key, obj) {
    if (content == null || content == false || content.content === false) {
        return;
    }
    if (isString(content)) {

        if (this.g10n) {
            //if it has a g10n, then make sure its listen is updated to the latest.
            if (obj[key].g10n) {
                obj[key].content = content;
                obj[key].g10n = this._resolveUpdate(obj[key].g10n);
            } else {
                this.update(path, content);
                //otherwise resolve it to the current
                obj[key] = {
                    content: content,
                    g10n: this._resolveUpdate(path)
                };
            }
        } else {
            this.update(path, content);
        }
        return;
    }
    if (isArray(content)) {
        each(content, function (v, i, arr) {
            this._handleContent(path + '[' + i + ']', v, i, content);
        }, this);
        return;
    }
    if (content.content) {
        this._handleContent(path, content.content, 'content', content);
        return;
    }

}

Schema2Messages.prototype._handleValidators = function Schema2Messages$_handleValidators(path, validator, key, arr) {
    if (isString(validator)) {
        var g10n = this.update(join('validators', validator, 'message'), validator);
        if (this.g10n) {
            arr[key] = {
                type: validator,
                g10n: this._resolveUpdate(g10n)
            }
        }
        return;
    }
    if (validator.message) {
        this._handleContent(join(path, 'validators', validator.type || key, 'message'), validator.message, 'message', validator);
    } else {
        if (this.g10n) {
            var g10n = this.update(join('validators', validator.type, 'message'), validator.type);
            if (!validator.g10n) {
                validator.g10n = this._resolveUpdate(g10n);
            }
        }
    }
}

Schema2Messages.prototype._handleSchema = function Schema2Messages$_handleSchema(path, schema, key, obj) {
    var currentPath = join(path, key);
    if (isString(schema)) {
        var title = titlelize(key);
        this.update(join(currentPath, 'title'), title);
        if (this.g10n && key) {
            obj[key] = {
                type: schema,
                title: {
                    content: title,
                    g10n: this._resolveUpdate(join(currentPath, 'title'))
                }
            }
        }
        return;
    }
    if (schema.title) {

        this._handleContent(join(currentPath, 'title'), schema.title, 'title', schema);
    } else if (!(schema.title === false)) {
        var title = titlelize(key);
        this.update(join(currentPath, 'title'), title);
        schema.title = {
            content: title,
            g10n: this._resolveUpdate(join(currentPath, 'title'))
        };
    }
    if (schema.help) {
        this._handleContent(join(currentPath, 'help'), schema.help, 'help', schema);
    }
    if (schema.content) {
        this._handleContent(join(currentPath, 'content'), schema.content, 'content', schema);
    }
    each(toArray(schema.validators), this._handleValidators.bind(this, currentPath));
    if (schema.subSchema && !isString(schema.subSchema)) {
        each(schema.subSchema, this._handleSchema.bind(this, currentPath));
    }
    if (schema.itemSchema && !isString(schema.itemSchema)) {
        each(schema.itemSchema, this._handleSchema.bind(this, join(currentPath, 'itemSchema')));
    }
    if (schema.valueSchema && !isString(schema.valueSchema)) {
        each(schema.valueSchema, this._handleSchema.bind(this, join(currentPath, 'valueSchema')));
    }
}

Schema2Messages.prototype.process = function Schema2Messages$messages() {
    if (isString(this.schema.schema)) {
        return this._messages;
    }
    each(this.schema.schema, this._handleSchema.bind(this, this.path));
    return this._messages;
}

Schema2Messages.prototype.toJSON = function Schema2Messages$toJSON() {
    this.process();
    var messages = {};
    each(this._messages, function (v, k) {
        messages[k] = dotKludge(v, '.');
    });

    this.schema.g10n = {
        locales: this.g10n.locales,
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
                "currency": {
                    "style": "currency",
                    "currency": "USD",
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
    return this.schema;
}


module.exports = Schema2Messages;