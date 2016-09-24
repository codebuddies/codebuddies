import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';


export default class layout extends Component{
  render(){
    return <main>{this.props.content}</main>;
  }

}
