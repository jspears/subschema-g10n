import {IntlMixin} from 'react-intl';
var G10NContext = {
    mixins: [IntlMixin],
    g10n(g10Key){
        g10Key = g10Key.key || g10Key;
        var messages = this.props.messages || this.context.messages;
        var mesg = messages[g10Key] || this.getIntlMessage(g10Key);
        return mesg;
    }
}
module.exports = G10NContext;