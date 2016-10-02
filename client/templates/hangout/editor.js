import {_} from 'meteor/erasaur:meteor-lodash';
import Quill from 'Quill';
// Quill.import('formats/link');
var Link = Quill.import('formats/link');

const EDITOR_CONFIG_VARIATIONS = {
  DEFAULT: {
    modules: {
      toolbar: [
        [{
          header: [1, 2, false] 
        }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block', 'link']
      ]
    },
    placeholder: '',
    theme: 'snow' // or 'bubble'
  },
  PREVIEW: {
    modules: {
      toolbar: []
    },
    enable: false,
    placeholder: '',
    theme: 'snow'
  },
}

console.log('Template.editor', Template.editor);

Template.editor.onCreated(function onCreated() {
  console.log('editor onCreated', arguments, this);
  this.somevar = '"<p>this is some text <a href="http://google.com" target="_blank">google</a></p>"';
})

Template.editor.onRendered(function onRendered() {
  
  console.log('editor onRendered', arguments, this);
  
  const editorConfig = _.get(EDITOR_CONFIG_VARIATIONS, this.data, EDITOR_CONFIG_VARIATIONS.DEFAULT);
  console.log('starting editor with config', editorConfig);
  console.log(this.$('[data-editor-host]'));
  
  var quill = new Quill(this.$('[data-editor-host]').get(0), editorConfig);
  quill.setContents({"ops":[{"insert":"this is some text "},{"attributes":{"link":"http://google.com"},"insert":"google"},{"insert":"\n"}]})
  
  
  if (this.data === 'PREVIEW') {
    debugger;
    
    // quill.container.parentElement.parentElement.replaceChild(quill.container.firstChild, quill.container.parentElement);
    console.log(quill.container.parentElement)
  }
  
  console.log('quill', quill);
})

Template.editor.onDestroyed(function onDestroyed() {
  console.log('editor onDestroyed', arguments, this);
})