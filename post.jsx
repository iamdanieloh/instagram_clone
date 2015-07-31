var React = require('react');
var Layout = require('./layout');

var AllPost = React.createClass({
  render: function(){
    return (
    <Layout>
        <em>Logged in as: {this.props.postView} </em>
    </Layout>
    )
  }
})

module.exports = AllPost;
