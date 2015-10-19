var chai = require('chai');
var expect = chai.expect;
//var should = chai.should();
var Schema2Msgs = require('./Schema2Msgs');
describe('schema2msgs', function () {
    it.only('should extract messages from a simple schema', function () {
        var schema = {
            schema: {
                "hello": "World",
                "test": {
                    title: "me",
                    help: "you"
                },
                "more": {
                    title: "me",
                    help: "you",
                    "validators": "required phone"
                },
                "more": {
                    title: "me",
                    help: "you",
                    validators: ["required", {type: "phone"}, {
                        "type": "required",
                        message: "This field is super required"
                    }]
                }
            }
        }

        var s2m = new Schema2Msgs(schema, 'schema2msgs');
        var result = s2m.messages();
        console.log(JSON.stringify((result), null, 3));
        console.log(JSON.stringify((schema), null, 3));
        expect(result).to.deep.equal({
            "schema2msgs.hello.title": "Hello",
            "schema2msgs.test.title": "me",
            "schema2msgs.test.help": "you",
            "schema2msgs.more.title": "me",
            "schema2msgs.more.help": "you",
            "validators.required.message": "required",
            "validators.phone.message": "phone",
            "schema2msgs.more.validators.required.message": "This field is super required"
        });

        expect(schema).to.deep.equal({
            "schema": {
                "hello": {
                    "type": "World",
                    "title": {
                        "content":"Hello",
                        "g10n": "schema2msgs.hello.title"
                    }
                },
                "test": {
                    "title": {
                        "content": "me",
                        "g10n": "schema2msgs.test.title"
                    },
                    "help": {
                        "content": "you",
                        "g10n": "schema2msgs.test.help"
                    }
                },
                "more": {
                    "title": {
                        "content": "me",
                        "g10n": "schema2msgs.more.title"
                    },
                    "help": {
                        "content": "you",
                        "g10n": "schema2msgs.more.help"
                    },
                    "validators": [
                        {
                            "type": "required",
                            "g10n": "validators.required.message"
                        },
                        {
                            "type": "phone",
                            "g10n": "validators.phone.message"
                        },
                        {
                            "type": "required",
                            "message": {
                                "content": "This field is super required",
                                "g10n": "schema2msgs.more.validators.required.message"
                            }
                        }
                    ]
                }
            }});
    });

    it('should extract messages from a  schema with content', function () {
        var schema = {
            "test": {
                "title": [
                    "{name} took {numPhotos, plural,\n  =0 {no photos}\n  =1 {one photo}\n  other {# photos}\n} on {takenDate, date, long}.\n",
                    {
                        content: false
                    },
                    {
                        content: [
                            {
                                content: "All good?"
                            },
                            "Is good {stuff}?"
                        ]
                    }
                ],
                "help": {
                    "content": "Do you like my help?"
                },
                "validators": [{
                    "type": "supd",
                    "message": {
                        content: "A very custom {..stuff.valid} message"
                    }
                }, "required"]
            }

        }

        var s2m = new Schema2Msgs(schema, 'schema2msgs');
        var result = s2m.messages();
        console.log(JSON.stringify((result), null, 3));
        console.log(JSON.stringify((schema), null, 3));
        expect(result).to.deep.equal({
            "schema2msgs.test.title[0]": "{name} took {numPhotos, plural,\n  =0 {no photos}\n  =1 {one photo}\n  other {# photos}\n} on {takenDate, date, long}.\n",
            "schema2msgs.test.title[2][0]": "All good?",
            "schema2msgs.test.title[2][1]": "Is good {stuff}?",
            "schema2msgs.test.help": "Do you like my help?",
            "schema2msgs.test.validators.supd.message": "A very custom {..stuff.valid} message",
            "validators.required.message": "required"
        });

        expect(schema).to.deep.equal({
            "test": {
                "title": [
                    {
                        "content": "{name} took {numPhotos, plural,\n  =0 {no photos}\n  =1 {one photo}\n  other {# photos}\n} on {takenDate, date, long}.\n",
                        "g10n": {
                            "key": "schema2msgs.test.title[0]",
                            "listen": [
                                "name",
                                "numPhotos",
                                "takenDate"
                            ]
                        }
                    },
                    {
                        "content": false
                    },
                    {
                        "content": [
                            {
                                "content": {
                                    "content": "All good?",
                                    "g10n": "schema2msgs.test.title[2][0]"
                                }
                            },
                            {
                                "content": "Is good {stuff}?",
                                "g10n": {
                                    "key": "schema2msgs.test.title[2][1]",
                                    "listen": [
                                        "stuff"
                                    ]
                                }
                            }
                        ]
                    }
                ],
                "help": {
                    "content": {
                        "content": "Do you like my help?",
                        "g10n": "schema2msgs.test.help"
                    }
                },
                "validators": [
                    {
                        "type": "supd",
                        "message": {
                            "content": {
                                "content": "A very custom {..stuff.valid} message",
                                "g10n": {
                                    "key": "schema2msgs.test.validators.supd.message",
                                    "listen": [
                                        "::stuff:valid"
                                    ]
                                }
                            }
                        }
                    },
                    {
                        "type": "required",
                        "g10n": "validators.required.message"
                    }
                ]
            }
        });
    });

    it('should extrac messages from subSchema', function () {
        var schema = {
            "top": {
                "type": "Object",
                "subSchema": {
                    "sub": {
                        "type": "Object",
                        "subSchema": {
                            "sub1": {
                                title: "Hello"
                            }
                        }
                    }
                }
            }
        }
        var s2m = new Schema2Msgs(schema, 'schema2msgs');
        var result = s2m.messages();
        console.log(JSON.stringify((result), null, 3));
        console.log(JSON.stringify((schema), null, 3));
        expect(result).to.deep.equal({
            "schema2msgs.top.title": "Top",
            "schema2msgs.top.sub.title": "Sub",
            "schema2msgs.top.sub.sub1.title": "Hello"
        });
        expect(schema).to.deep.equal({
            "top": {
                "type": "Object",
                "subSchema": {
                    "sub": {
                        "type": "Object",
                        "subSchema": {
                            "sub1": {
                                "title": {
                                    "content": "Hello",
                                    "g10n": "schema2msgs.top.sub.sub1.title"
                                }
                            }
                        },
                        "title": {
                            "content": "Sub",
                            "g10n": "schema2msgs.top.sub.title"
                        }
                    }
                },
                "title": {
                    "content": "Top",
                    "g10n": "schema2msgs.top.title"
                }
            }
        });

    })
});