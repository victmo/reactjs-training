//var TODOS = ["buy food", "make food", "eat food"];

var Task = React.createClass({
	getInitialState: function(){
		return {
			editing: false,
			name: this.props.name
		};
	},

	onEdit: function(){
		this.setState({
			editing: true,
			name: this.props.name
		});
	},

	onUpdate: function(){
		this.props.onUpdate(this.props.index, this.state.name);
		this.setState({
			editing: false,
			name: this.props.name
		});
	},

	onNameChange: function(e) {
		this.setState({
			name: e.target.value
		});
	},

	onCancel: function(){
		this.setState({
			editing: false,
			name: this.state.name
		});
	},

	onDelete: function(){
		this.props.onRemove(this.props.index);
	},

	render: function(){
		if(this.state.editing){
			return (
				<li key={this.props.key} className="list-group-item">
					<input 
						type="text" 
						value={this.state.name} 
						onChange={this.onNameChange} 
					/>
					<div className="pull-right">
						<button 
							className="btn btn-xs btn-success glyphicon glyphicon-ok" 
							onClick={this.onUpdate}
						/>
						<button 
							className="btn btn-xs btn-danger glyphicon glyphicon-remove" 
							onClick={this.onCancel} 
						/>
					</div>
				</li>
			);
		} else {
			return (
				<li key={this.props.key} className="list-group-item">
					<span>{this.props.name}</span>
					<div className="pull-right">
						<button 
							className="btn btn-xs btn-default glyphicon glyphicon-pencil" 
							onClick={this.onEdit} 
						/>
						<button 
							className="btn btn-xs btn-danger glyphicon glyphicon-trash" 
							onClick={this.onDelete} 
						/>
					</div>
				</li>
			);
		}
	}
});

var TaskList = React.createClass({
	render: function(){
		var removeHandler = this.props.onRemove;
		var updateHandler = this.props.onUpdate;
		var tasks = this.props.tasks || [];
		tasks = tasks.map(function(taskName, index){
			return(
				<Task 
					key={index} 
					index={index} 
					name={taskName} 
					onRemove={removeHandler} 
					onUpdate={updateHandler}
				/>
			);
		});

		return(
			<ul className="list-group">
				{tasks}
			</ul>
		);
	}
});


var AddTaskForm = React.createClass({
	getInitialState: function() {
		return {
			text: ""
		};
	},

	onTextChanged: function(e) {
		this.setState({
			text: e.target.value
		});
	},

	onAdd: function(e) {
		e.preventDefault();
		this.props.onAdd(this.state.text);
		this.setState({
			text: ''
		});
	},

	render: function(){
		return(
			<form onSubmit={this.onAdd}>		
				<div className="input-group">
					<input 
						type="text" 
						className="form-control" 
						value={this.state.text} 
						onChange={this.onTextChanged} 
					/>

					<span className="input-group-btn">
						<button type="submit" className="btn btn-primary">
							Add tasks
						</button>
					</span>

				</div>
			</form>
		);
	}
});


var TodoGroup = React.createClass({
	getInitialState: function(){
		var todos = this.props.todos || [];
		window.todos = todos;
		return {
			tasks: todos
		};
	},

	onAddTask: function(text){
		this.state.tasks.push(text);
		this.setState({
			tasks: this.state.tasks
		});
	},

	onUpdateTask: function(index, newName){
		this.state.tasks[index] = newName;
		this.setState({
			tasks: this.state.tasks
		});
	},

	onRemoveTask: function(index){
		this.state.tasks.splice(index, 1);
		this.setState({
			tasks: this.state.tasks
		});
	},

	render: function(){
		return(
			<div className="col-xs-12 col-sm-6 col-md-4">
				<h2>{this.props.name}</h2>
				<AddTaskForm onAdd={this.onAddTask} />
				<TaskList 
					tasks={this.state.tasks} 
					onRemove={this.onRemoveTask} 
					onUpdate={this.onUpdateTask}
				/>
			</div>
		);
	}
});


var TodosAddForm = React.createClass({
	getInitialState: function() {
		return {
			name: ''
		};
	},

	onAdd: function(e){
		e.preventDefault();
		this.props.onAdd(this.state.name);
		this.setState({
			name: ''
		});
	},

	onNameChange: function(e){
		this.setState({
			name: e.target.value
		});
	},

	render: function(){
		return (
			<form onSubmit={this.onAdd} className="col">		
				<div className="input-group col-xs-12 col-sm-8">
					<input 
						type="text" 
						className="form-control input-lg" 
						value={this.state.name} 
						onChange={this.onNameChange} 
					/>

					<span className="input-group-btn">
						<button type="submit" className="btn btn-warning btn-lg">
							Create list
						</button>
					</span>

				</div>
			</form>
		);
	}
});



var TodosApp = React.createClass({
	getInitialState: function() {
		return {
			todoLists: []
		};
	},

	onRemoveList: function(index) {
		this.state.todoLists.splice(index, 1);
		this.setState({
			todoLists: this.state.todoLists
		});
	},

	onAddList: function(name) {
		this.state.todoLists.push({
			name: name, 
			todos: []
		});
		this.setState({
			todoLists: this.state.todoLists
		});
	},

	render: function(){
		var todoLists = this.state.todoLists.map(function(list){
			return (
				<TodoGroup 
					name={list.name} 
					todo={list.todos}
				/>
			);
		}, this);

		return (
			<div>
				<h1>Awesome Todo App</h1>
				<TodosAddForm onAdd={this.onAddList} />
				<hr/>
				<div className="row">
					{todoLists}
				</div>
			</div>
		);
	}
});



React.render(<TodosApp name="My awesome todo" />, document.getElementById('content'));
