import React, { Component } from 'react'
import Axios from 'axios'
import Navbar from './navbar'
export default class Showbooking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allData: [],
            tokenId:localStorage.getItem("tokenuser")
            
        }
    }
    componentDidMount = () => {            
            Axios.get("http://127.0.0.1:5000/gettoken", {
                headers: {
                    Authorization: "Bearer " + this.state.tokenId,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                this.setState({
                    user_id:response.data.user_id.toString(10)
                })
                let data = {
                    user_id:this.state.user_id
                }
                Axios.post("http://127.0.0.1:5000/showbooking",data, {
                    headers:{
                        user_id:this.state.user_id
                    }
                })
                .then(response => {
                    this.setState({
                        allData:response.data
                    })
                })
                .catch((err) => alert(err))
            })
            .catch((err) => alert(err))
    }
    render() {
        console.log(this.state.allData.length)
        return (
            <>
            <Navbar/>
            <div className="p-5">
               {
                    this.state.allData.length !== 0  ?
                    this.state.allData.map((e) => {
                        return(
                            <div className="container">
                                <div className="card m-5 text-center">
                                    <div className = "card-header">
                                        <h1>{e.car_name}</h1>
                                    </div>
                                    <div className="cart-body">
                                        <h4 className="card-title">{e.car_type}</h4>
                                        <p className="cart-text">{e.car_color}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }): <h1 className="text-center">No Item Available in your Cart</h1> 
               }
            </div>  
            </>
        )
    }
}
