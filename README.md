Subschema g10n
===
Provide G10n to subschema, via format.js and friends.


##Installation
Basic node dependency installation


```sh
   
   $ npm install subschema-g10n --save-dev
   
```


###Usage

```js

  var loader = require('subschema/loader');
  loader.addType('ContentWrapper', require('subschema-g10n'));

```

