import { _ } from 'meteor/erasaur:meteor-lodash';
import Quill from './quill.js';
import quillRender from 'quill-render';
import QuillEditorDefaultOptions from './QuillEditorDefaultOptions';
import { fromString } from 'html-to-text';

const isQuillDataFormat = (possibleQuillFormat) => {
  return (!_.isUndefined(possibleQuillFormat.ops) &&
          _.isArray(possibleQuillFormat.ops));
}

const normaliseToQuillFormat = (data) => {
  return [{
    insert: data
  }];
}

/**
 * Create an editor which attaches to a DOM container.
 *
 * @param  {String|Element} options.container (Not optional)
 *         CSS selector, or DOM element that will be used as Quill's container.
 * @param  {Object} options.options (Optional)
 *         Configuration options for Quill. If not specified default configuration
 *         will be used.
 */
const createEditor = ({container, options}) => {

  if (_.isUndefined(container)) {
    throw new Error('container property missing');
  }

  const editor = new Quill(container, _.defaults(options, QuillEditorDefaultOptions));

  /**
   * @return {Delta} the contents for the editor instance (Quill)
   */
  const getContents = () => editor.getContents();

  /**
   * Backward compatible function to set data inside the editor.
   *
   * @param  {String|Delta} data
   *         Sets the contents for this editor's instance. In the case where the
   *         data is in Quill format it will be used as is, otherwise the data
   *         will be converted to Quill format and assumes it is one continuous
   *         string.
   */
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
    setContents
  }
};

/**
 * @param  {String|Delta} data
 *         Deltas to render. In the case where the data is in Quill format it
 *         will be used as is, otherwise the data will be converted to Quill
 *         format and assumes it is one continuous string.
 */
const generateHTMLForDeltas = (data) => {
  if (isQuillDataFormat(data)) {
    return quillRender(data.ops);
  }

  return quillRender(normaliseToQuillFormat(data));
};

const generatePlainTextFromDeltas = (deltas) => {
  if (!isQuillDataFormat(deltas)) {
    throw new Error('expecting deltas as an argument');
  }
  return fromString(generateHTMLForDeltas(deltas), {
    hideLinkHrefIfSameAsText: true
  });
}

export default {
  createEditor,
  generateHTMLForDeltas,
  generatePlainTextFromDeltas
}
