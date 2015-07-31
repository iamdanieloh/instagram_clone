var React = require('react');
var Layout = require('./layout');

var ErrorMessage = React.createClass({
  render: function() {
    return <div className="alert alert-danger" role="alert">{this.props.message}</div>;
  }
});

var PostForm = React.createClass({
  render: function() {
    var errorMessage;

    if(this.props.error) {
      errorMessage = <ErrorMessage message={this.props.error} />;
    }

    return (
      <Layout>
        <div className="container">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">New Post</h3>
            </div>
            <div className="panel-body">
              <form method="post" action="/posts">
                {errorMessage}
                <div className="form-group">
                  <label for="image_url">Image Url</label>
                  <input className="form-control" id="imageUrl" placeholder="Image URL" name="imageUrl" />
                </div>
                <div className="form-group">
                  <label for="title">Title</label>
                  <input className="form-control" id="titlePost" placeholder="Title" name="titlePost" />
                </div>
                <button type="submit" className="btn btn-success">Submit Post</button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
});

module.exports = PostForm;
