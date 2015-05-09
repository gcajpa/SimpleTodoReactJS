var TodoForm = React.createClass({
  handleSubmit : function(e){
    e.preventDefault();
    var task = React.findDOMNode(this.refs.task).value.trim();
    if(!task) return false;
    this.props.onAddTask({ task:task, status:"false" });
    React.findDOMNode(this.refs.task).value = "";
    return;
  },
  render : function(){
    return(
      <div>
        <form className="todoForm" onSubmit={this.handleSubmit}>
          <p>
            New Task: <input type="text" ref="task" />
            <input type="submit" />
          </p>
        </form>
      </div>
    );
  }
});
var TodoItem = React.createClass({
  setStatus : function(e){
    e.preventDefault();
    $.ajax({
      url   : 'tasks.json/edit',
      data  : { task : this.props.taskId, status : (this.state.item.taskStatus) ? false : true},
      success : function(data){
        this.setState({item : {
          taskId      : this.props.taskId,
          taskStatus  : data.status,
          task        : this.props.task
        }})
      }.bind(this),
      error : function(err){
        console.error(err);
      }
    });
  },
  getInitialState : function(){
    console.log(this.props);
    return({item : this.props})
  },
  render : function(){
    return(
      <li className={this.state.item.taskStatus}>
        <a href="#" data-task-id={this.state.item.taskId} ref="item" onClick={this.setStatus}> 
          {this.state.item.task}
        </a>
      </li>
    );
  }
});
var TodoList = React.createClass({
  render : function(){
    var taskNode = this.props.data.map(function(t, index){
      if(t.status) status="done";
      return(<TodoItem taskId={index} task={t.task} taskStatus={t.status} />);
    });
    return(
      <ul>
        {taskNode}
      </ul>
    );
  }
});

var TodoApp = React.createClass({
  tasksFromServer : function(){
    $.ajax({
      url : this.props.url,
      success : function(data){
        this.setState({data : data})
      }.bind(this),
      error : function(){
        console.error('teste');
      }
    });
  },
  addTask : function(task){
    $.ajax({
      url : this.props.url,
      method : "post",
      data : task,
      success : function(data){
        this.setState({data : data})
      }.bind(this),
      error : function(){
        console.error('teste');
      }
    });
  },
  componentDidMount : function(){
    this.tasksFromServer();
  },
  getInitialState : function(){
    return {
      data:[]
    };
  },
  render : function(){
    return(
      <div>
        <h1>Todo App</h1>
        <TodoForm onAddTask={this.addTask} />
        <TodoList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <TodoApp url="tasks.json" />,
  document.getElementById('content')
)
