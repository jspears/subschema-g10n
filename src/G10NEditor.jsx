var React = require('react');
var EditableContent = require('./EditableContent.jsx');
var G10NContent = require('./G10NContent.jsx');
var G10NEditorLess = require('./G10NEditor.less');
var G10NContext = require('./G10NContext.jsx');
var parser = require('intl-messageformat-parser');

var G10NEditor = React.createClass({
    mixins: [G10NContext],
    handleClick(e){

        if (e && (e.ctrlKey || e.altKey)) {
            e.preventDefault();
            e.stopPropagation();
            console.log('click with ctrl!');
            this.setState({
                editable: true,
                value: this.g10n(this.props.g10n)
            });
        }
    },
    getInitialState(){
        return {
            editable: false,
            value: ''
        }
    },
    handleChange(e){
        this.setState({value: e.target.value});
    },
    _message(value){
        if (!(value == null)) {
            this.context.messages[this.props.g10n.key || this.props.g10n] = value;
        }
        return this.context.messages[this.props.g10n.key || this.props.g10n]
    },
    handleSave(e){
        e.preventDefault();
        this._message(this.state.value)
        this.setState({editable: false});
    },
    handleCancel(e){
        e.preventDefault();
        this.setState({editable: false});
    },
    handleMeta(e){
        e && e.preventDefault();
        var msg = this._message();
        var parts = parser.parse(msg);
        console.log('parts', JSON.stringify(parts));
    },
    renderTools(){
        if (!this.state.editable) {
            return null;
        }
        return <div className='g10n-tools'>
            <button className='g10n-btn' value='save' onClick={this.handleSave}>Save</button>
            <button className='g10n-btn' value='cancel' onClick={this.handleCancel}>Cancel</button>
            <button className='g10n-btn' value='meta' onClick={this.handleMeta}>Meta</button>
        </div>
    },
    render(){
        return <span onClickCapture={this.handleClick} className={this.state.editable ? 'g10n-edit-mode':''}>
            {this.renderTools()}
            {this.state.editable ?
                <input type='textarea' className='g10n-edit-input' onBlur={this.handleBlur}
                       onChange={this.handleChange} value={this.state.value}/> :
                <G10NContent {...this.props}/>}
        </span>
    }

});
module.exports = G10NEditor;