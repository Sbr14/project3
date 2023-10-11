import React, { Component } from "react";
import { AddTodo, DeleteTodo} from "../Services/Todoservice";
export default class TodoApplication extends Component {
    constructor() {
        super()
        this.state = {
            formdata: {
                name: "",
                title: "",
                description: "",
                status:""
            },
            TodoList: [],
            isEdit:true
        }
    }

    handleToggle=()=>{
        this.setState({isEdit:false})
    }
    componentDidMount = () => {
        this.getTodoList()
    }
    getTodoList =async() => {
        let resp = await fetch("http://localhost:5000/todo/getTodo")
        let result = await resp.json()
        this.setState({ TodoList: result})
        console.log("result-->",result);

    }
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            formdata: { ...this.state.formdata, [name]: value }
        })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.state.isEdit ? this.addContact():this.editContact()
    }
    addContact = async () => {
        AddTodo(this.state.formdata)
        this.formEmpty()
        this.getTodoList()
    }
    handleDelete =async(id) => {
        DeleteTodo(id)
        this.getTodoList()
    }
    handleEdit = (contact) => {
        this.setState({
            formdata: contact
        }, () => console.log(this.state.formdata))
        this.handleToggle()
    }
    // editContact = async () => {
    //     let id=this.state.formdata._id
    //     console.log(id)
    //     let header = {
    //         method: "PUT",
    //         body: JSON.stringify(this.state.formdata),
    //         header: {
    //             'content-type': 'application/json'
    //         }
    //     }
    //     let resp = await fetch(`http://localhost:5000/todo/update/${id}`, header)
    //     let result = await resp.json()
    //     // console.log("Update-->",result)
    //     this.getTodoList()
    //     this.formEmpty()
    // }
    editContact =async()=>
    {
        let headers={
            method:"PUT",
            body:JSON.stringify(this.state.formdata),
            headers:{
                'content-type':'application/json'
            }
        }
        let id=this.state.formdata._id
        let response=await fetch(`http://localhost:5000/todo/update/${id}`,headers)
        let result=await response.json()
        this.getTodoList()
        this.formEmpty()
    }
    formEmpty = () => {
        this.setState({
            formdata: { name: "", description: "", title: "" }
        })
    }
    render() {
        return (
            <>
                <h1 id="title">Todo App</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div id="inputfirst">
                                <label>Name</label>
                                <input type="text"
                                    name="name"
                                    value={this.state.formdata.name}
                                    onChange={this.handleChange} />
                            </div>
                            <div id="inputthird">
                                <label>Title</label>
                                <input type="text"
                                    name="title"
                                    value={this.state.formdata.title}
                                    onChange={this.handleChange} />
                            </div>
                            <div id="inputsecond">
                                <label>Description</label>
                                <input type="text"
                                    name="description"
                                    value={this.state.formdata.description}
                                    onChange={this.handleChange} />
                            </div>
                        </div>
                        <button type="submit" onSubmit={this.handleSubmit} id="addtodo">{this.state.isEdit ? 'Add Todo':'ReEdit'}</button>
                    </div>
                </form>
                <div id="list-container">
                    {
                        this.state.TodoList.map((contact, index) => {
                            return (
                                <>
                                    <li key={index.id}> 
                                        <div>
                                            <h3>{contact.name}</h3><h5>{contact.title}</h5><p>{contact.description}</p>

                                        </div>
                                        <div>
                                            <button id="complete" onClick={()=>{this.handleComplete()}}>Complete</button>
                                            <button id="edit" onClick={() => this.handleEdit(contact)}>Edit</button>
                                            <button id="delete" onClick={() => this.handleDelete(contact._id)}>Delete</button>
                                        </div>
                                    </li>
                                </>
                            )
                        })
                    }
                </div>
            </>
        )
    }
}