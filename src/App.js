import logo from './logo.svg';
import React, {Component} from 'react';
import './App.css';

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
  
const DEFAULT_QUERY = 'redux';

const PATH_BASE =  'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);


class App extends Component{
  
  constructor(props){
    super(props); 
    this.state = {
      searchTerm: DEFAULT_QUERY,
      hasError: false,
      result: null,
    };  
   
    this.setSearchTopStories = this.setSearchTopStories.bind(this); 
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result){
    this.setState({ result });
  }
  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(Response => Response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }
  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
     .then(Response => Response.json())
     .then(result => this.setSearchTopStories(result))
     .catch(error => error);
  }
  componentDidCatch(error,info){
    // Display Fallback UI
    this.setState({hasError: true});
    
  }
  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }
  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }
 
  onDismiss(id)
  {
    console.log(this);
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result,hits: updatedHits}
    });
  }
  
  render(){
   
    if(this.state.hasError){
      return <h1>Something happend</h1>
    }
    const {searchTerm ,result} = this.state;
   
    
    return(
      <div className='page'>
       <div className='interaction'>
        <Search value={searchTerm} onChange={this.onSearchChange} onSubmit = {this.onSearchSubmit}>Search</Search>
        </div>{result ? <Table list={result.hits} onDismiss={this.onDismiss} /> : null }
        
      </div>
    );
  }
}
// Functional component
function Search(props){
  const {value, onChange, children,onSubmit} = props;

  return(
    <form onSubmit={onSubmit}>
      {children}<input type="text" value={value} onChange={onChange} />
      <button type='submit'>{children}</button>
    </form>
  )
}
// Class componenet
// class Search extends Component {
//   render(){
//     const {value, onChange, children } = this.props;
//     return(
//       <form>{children}
//         <input type="text" value={value} onChange={onChange} />
//       </form>
//     );
//   }
// }

function Table(props){
  const { list, onDismiss} = props;
  return(
    <div className='table'>
      {list.map(item => 
         <div key={item.objectID} className='table-row'>
         <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
         <span style={{width: '30%'}}>{item.author}</span>
         <span style={{width: '10%'}}>{item.num_comments}</span>
         <span style={{width: '10%'}}>{item.points}</span>
         <span>
           <button onClick={ ()=> onDismiss(item.objectId)} className='button-inline'>Dismiss</button>
         </span>
         </div>
         )}
    </div>
  )
}

// class table component
// class Table extends Component {
//   render(){
//     const {list,pattern,onDismiss} = this.props;
//     return(
//       <div>
//         {list.filter(isSearched(pattern)).map(item => 
//         <div key={item.objectID}>
//         <span><a href={item.url}>{item.title}</a></span>
//         <span>{item.author}</span>
//         <span>{item.num_comments}</span>
//         <span>{item.points}</span>
//         <span>
//           <button onClick={ ()=> onDismiss(item.objectId)} >Dismiss</button>
//         </span>
//         </div>
//         )}
//       </div>
//     );
//   }
// }
// function stateless component
function Button(props){
  const {onClick,className= '',children} = props;
  return(
    <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
  )
}
// BUTTON CLASS COMPONENT
// class Button extends Component{
//   render(){
//     const {onClick , className = '',children} = this.props;
//     return(
//       <div></div>
//     );
//   }
  
// }

export default App;

