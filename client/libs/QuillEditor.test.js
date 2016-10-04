import { $ }  from 'meteor/jquery';
import { chai } from 'meteor/practicalmeteor:chai';
import QuillFactory from './QuillEditor';

chai.should();

describe('QuillFactory', () => {
    
    it('should expose createEditor()', () => {
        QuillFactory.createEditor.should.not.be.undefined;
    });
    
    it('should expose generateHTMLForDeltas()', () => {
        QuillFactory.generateHTMLForDeltas.should.not.be.undefined;
    });
    
    describe('createEditor', () => {
        var hostElement,
            editor,
            container;
        
        beforeEach(() => {
            hostElement = $('<div>');
            $(document.body).append(hostElement);
            
            container = $('<div>').get(0);
            hostElement.append(container);
            editor = QuillFactory.createEditor({container});
        });
       
        afterEach(() => {
            hostElement.remove();
            editor = null;
            container = null;
        }); 
        
        it('should throw an Error if container is not specified', () => {
            chai.expect(() => {
                QuillFactory.createEditor();
            }).to.throw(Error);
        });
        
        it('should not return an undefined', () => {
            editor = QuillFactory.createEditor({container});
            editor.should.not.be.undefined;
        });
        
        it('should expose getContents()', () => {
            editor.getContents.should.not.be.undefined;
        });
        
        describe('getContents()', () => {
            it('should not return null', function() {
                editor.getContents().should.not.be.undefined;
            });
            
            it('should contain a key ops', function() {
               editor.getContents().ops.should.not.be.undefined;
            });
        });
        
        it('should expose setContents()', () => {
            editor.setContents.should.not.be.undefined;
        });
        
        describe('setContents()', () => {
            it('should reflect the contents when setting with string', function() {
                editor.setContents('hello 123');
                QuillFactory.generateHTMLForDeltas(editor.getContents()).should.be.equal('<p>hello 123</p><p></p>')
            });
            
            it('should reflect the contents when setting with deltas', function() {
                editor.setContents({
                    ops: [{
                        insert: 'hello 123'
                    }]
                });
                QuillFactory.generateHTMLForDeltas(editor.getContents()).should.be.equal('<p>hello 123</p><p></p>')
            });
        });
        
    });
    
    describe('generateHTMLForDeltas', () => {
        var delta = {
            "ops" : [
                {
                    "insert" : "this is some text "
                },
                {
                    "attributes" :
                    {
                        "link" : "http://google.com"
                    },
                    "insert" : "google"
                },
                {
                    "insert" : "\n"
                }
            ]
        },
        expectedHTML = '<p>this is some text <a href="http://google.com">google</a></p><p></p>';

        it('should return html for a sequence of delta', () => {
            var html = QuillFactory.generateHTMLForDeltas(delta);
            html.should.be.equal(expectedHTML);
        });
        
        it('should fallback if delta is a plain string', function() {
            var html = QuillFactory.generateHTMLForDeltas('this is a string');
            html.should.be.equal('<p>this is a string</p>'); 
        });
    });
   
});