import React, { Component } from 'react'
import Axios from 'axios'
import './signup.css'
export default class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name:"",
            email_id:"",
            password:"",
            mobile:"",
            user_image:""
        }
    }
    addimage = (e) => {
        this.setState({
            user_image:e.target.files[0]
        })
    }
    handleChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.name]:e.target.value
        })
        console.log(this.state)
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('user_image', this.state.user_image)
        Axios.post("http://127.0.0.1:5000/signup", formData, {
            headers:{
                user_name:this.state.user_name,
                email_id:this.state.email_id,
                user_mobile:this.state.user_mobile,
                password:this.state.password
            }
        })
        .then((response) => {
            alert(response.data)
            window.location.href="/"
        })
        .catch((err) => {
            alert(err)
        })
    }
    render() {
        return (
            <div id="body">
                <div style={{paddingTop:"15%"}}></div>
                <div className="container bg-light shadow-lg w-50 py-5 " style={{borderRadius:"1%"}}>
                    <h1 className="text-dark text-center">Signup</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="user_name" placeholder="Full Name" className="form-control w-50 mt-2 offset-3" onChange={this.handleChange}></input>                 
                        <input type="email" name="email_id" placeholder="Email Id" className="form-control w-50 mt-2 offset-3" onChange={this.handleChange}></input>                    
                        <input type="number" name="user_mobile" placeholder="Enter Mobile" className="form-control w-50 mt-2 offset-3" onChange={this.handleChange}></input>
                        <input type="password" name="password" placeholder="Choose Password" className="form-control w-50 mt-2 offset-3" onChange={this.handleChange}></input>
                        <input type="file" name="user_image" placeholder="Select Image" className="form-control-file w-50 mt-2 offset-3" onChange={this.addimage}></input>
                        <button type="submit" className="btn btn-primary rounded-pill w-25 sm-w-50 mt-3 offset-5">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}
