
var SavedItem = React.createClass({
	onRemove: function(){
		this.props.onRemove(this.props.index);
	},

	render: function(){
		return (
			<li className="list-group-item">
				{this.props.name}
				<button onClick={this.onRemove} className="btn btn-danger btn-xs glyphicon glyphicon-trash pull-right" />
			</li>
		);
	}
});


var SavedList = React.createClass({
	render: function(){
		if(this.props.items.length === 0){
			return (
				<p className="text-muted">Nothing saved</p>
			);
		}
		
		list = this.props.items.map(function(result, index){
			return (
				<SavedItem key={index} index={index} name={result} onRemove={this.props.onRemove} />
			);
		}, this);

		return (
			<ul className="list-group">{list}</ul>
		);
	}
});


var ResultItem = React.createClass({
	onSave: function(){
		this.props.onSave(this.props.name);
	},

	render: function(){
		return (
			<li className="list-group-item">
				{this.props.name}
				<button onClick={this.onSave} className="btn btn-success btn-xs glyphicon glyphicon-plus pull-right" />
			</li>
		);
	}
});


var ResultsList = React.createClass({
	render: function(){
		if(this.props.loading){
			return (
				<h1>
					<i className="glyphicon glyphicon-refresh glyphicon-spin"></i>
				</h1>
			);
		}

		if(this.props.results.length === 0){
			return (
				<p className="text-muted">No results</p>
			);
		}

		list = this.props.results.map(function(result){
			return (
				<ResultItem name={result.trackName} onSave={this.props.onSave} />
			);
		}, this);

		return (
			<ul className="list-group">{list}</ul>
		);
	}
});


var SearchForm = React.createClass({
	getInitialState: function(){
		return {
			query: ''
		};
	},

	onQueryChanged: function(e){
		this.setState({
			query: e.target.value
		});
	},

	onSearch: function(e){
		var self = this;
		console.log('Searching for: ' + self.state.query);
		e.preventDefault();
		self.props.onApiLoading();
		jQuery
			.ajax({
				url: 'http://itunes.apple.com/search',
				data: {
					term: self.state.query,
					entity: self.refs.category.getDOMNode().value,
					country: 'us'
				},
				dataType: 'jsonp'
			})
			.done(self.props.onApiResponse)
		;
	},

	render: function(){
		var categories = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFilm', 'tvShow', 'software', 'ebook', 'all'];
		var options = categories.map(function(category){
			var name = category.charAt(0).toUpperCase() + category.substr(1).toLowerCase();
			return (
				<option value={category}>{name}</option>
			);
		});
		return (
			<div className="row">
				<form onSubmit={this.onSearch}>
					<div className="col-xs-6">
						<input className="form-control" type="text" value={this.state.query} onChange={this.onQueryChanged} />
					</div>
					<div className="col-xs-3">
						<select className="form-control" ref="category">{options}</select>
					</div>
					<div className="col-xs-3">
						<button className="btn btn-primary" type="submit">Search</button>
					</div>
				</form>
			</div>
		);
	}
});


var ItunesSearchApp = React.createClass({
	getInitialState: function(){
		return {
			results: [],
			saved: [],
			loading: false
		};
	},

	onApiResponse: function(response){
		this.setState({
			results: response.results,
			loading: false
		});
	},

	onApiLoading: function(){
		this.setState({
			results: [],
			loading: true
		});
	},

	onItemSaved: function(item){
		this.state.saved.push(item);
		this.setState({
			saved: this.state.saved
		});
	},

	onRemoveItem: function(index){
		this.state.saved.splice(index, 1);
		this.setState({
			saved: this.state.saved
		});
	},

	render: function(){
		window.appData = this.state;
		return (
			<div>
				<h1>iTunes API Search</h1>
				<SearchForm onApiLoading={this.onApiLoading} onApiResponse={this.onApiResponse} />
				<hr/>
				<div className="row">
					<div className="col-sm-6">
						<h3>Results</h3>
						<ResultsList loading={this.state.loading} results={this.state.results} onSave={this.onItemSaved} />
					</div>
					
					<div className="col-sm-6">
						<h3>Saved Items</h3>
						<SavedList items={this.state.saved} onRemove={this.onRemoveItem} />
					</div>
				</div>
			</div>
		);
	}
});


React.render(<ItunesSearchApp />,  document.getElementById("content"));
