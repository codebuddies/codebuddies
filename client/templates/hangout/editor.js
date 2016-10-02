import {_} from 'meteor/erasaur:meteor-lodash';
import Quill from 'Quill';

const EDITOR_PREVIEW_STATE = 'PREVIEW';
const EDITOR_CONFIG_VARIATIONS = {
  DEFAULT: {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        ['link']
      ]
    },
    placeholder: 'What do you hope to cover or master during this hangout?',
    theme: 'snow'
  }
}

Template.editor.onCreated(function onCreated() {
  var instance = Template.instance();
  instance.previewContentsAsHTML = new ReactiveVar();
})

const extractEditorTypeFrom = _.partialRight(_.get, 'type');
const extractEditorContentFrom = _.partialRight(_.get, 'content');

Template.editor.onRendered(function onRendered() {
  var instance = Template.instance();
  
  const editorConfig = _.get(EDITOR_CONFIG_VARIATIONS, extractEditorTypeFrom(instance.data), EDITOR_CONFIG_VARIATIONS.DEFAULT);
  const quill = new Quill(instance.$('[data-editor-host]').get(0), editorConfig);
  
  quill.setContents(extractEditorContentFrom(instance.data))
  
  if (extractEditorTypeFrom(instance.data) === EDITOR_PREVIEW_STATE) {
    instance.previewContentsAsHTML.set(quill.container.firstChild.innerHTML);
    instance.$('[data-editor-host]').parent().remove()
  }
})

Template.editor.helpers({
  previewContents() {
    return Template.instance().previewContentsAsHTML.get();
  },
  isPreview() {
    return extractEditorTypeFrom(Template.instance().data) === EDITOR_PREVIEW_STATE;
  }
})