import { _ } from 'meteor/erasaur:meteor-lodash';
import Quill from 'Quill';
import quillRender from 'quill-render';

const QUILL_DEFAULT_OPTIONS = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link']
    ]
  },
  placeholder: 'What do you hope to cover or master during this hangout?',
  theme: 'snow'
};

const isQuillDataFormat = (possibleQuillFormat) => {
  return (!_.isUndefined(possibleQuillFormat.ops) && 
          _.isArray(possibleQuillFormat.ops));
}

const normaliseToQuillFormat = (data) => {
  return [{
    insert: data
  }];
}

const createEditor = ({container, options}) => {
  var editor;
  if (_.isUndefined(container)) {
    throw new Error('container property missing');
  }
  
  editor = new Quill(container, _.defaults(options, QUILL_DEFAULT_OPTIONS));
  
  const getContents = () => editor.getContents();
  const setContents = (data) => {
    if (isQuillDataFormat(data)) {
      editor.setContents(data);
    } else {
      editor.setContents({
        ops: normaliseToQuillFormat(data)
      })
    }
  }

  return {
    getContents,
    setContents,
    editor
  }
};

const generatePreview = (content) => {
  if (isQuillDataFormat(content)) {
    return quillRender(content.ops);
  }
  
  return quillRender(normaliseToQuillFormat(content));
};

export default {
  createEditor,
  generatePreview
}