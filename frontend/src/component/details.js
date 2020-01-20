import React, { Component } from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'
export default class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allData: [],  
            user_id:'',
            car_id:'',
            car_name:'',
            car_no:'',
            car_type:'',
            car_color:'',
            tokenId:localStorage.getItem("tokenuser")          
        }
    }
    componentDidMount = () => {
        Axios.get("http://127.0.0.1:5000/details",{
            headers:{
                car_id:this.props.match.params.car_id
            }
        })
            .then((response) => {
                this.setState({
                    allData:response.data[0],
                })
                console.log(this.state.allData)
            })
            .catch((err) => alert(err))

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
                console.log("This is user id: " + this.state.user_id)
            })
    }
    book = (e) =>{
        e.preventDefault()
        let data = {
            user_id:this.state.user_id,
            car_id:this.state.allData.car_id,
            car_name:this.state.allData.car_name,
            car_no:this.state.allData.car_no,
            car_type:this.state.allData.car_type,
            car_color:this.state.allData.car_color
        }
        Axios.post("http://127.0.0.1:5000/booking",data,{
            headers:{
                user_id:this.state.user_id,
                car_id:this.state.allData.car_id,
                car_name:this.state.allData.car_name,
                car_no:this.state.allData.car_no,
                car_type:this.state.allData.car_type,
                car_color:this.state.allData.car_color
            }
        })
        .then((response) => {alert("Booked")})
        .catch((err) => alert(err))
    }
    render() {
        console.log(this.state.user_id)
        return (
            <div className="p-5">
                <div className="row">
                    <div className="col-6"> 
                        <img src = {`http://127.0.0.1:5000/${this.state.allData.car_image}`} className="w-100"></img>
                    </div>
                    <div className="col-6">
                        <div className="mt-5 text-center">
                            <h1> Name: {this.state.allData.car_name}</h1>
                            <h1> Vehicle No {this.state.allData.car_no}</h1>
                            <h3> Vehicle Type: {this.state.allData.car_type}</h3>
                            <h3> Total Seats {this.state.allData.no_of_seats}</h3>
                            <h3> Color: {this.state.allData.car_color}</h3>
                            {/* <Link to={`/buy/${this.state.allData.car_id}`}><button className="btn btn-primary m-3">Buy Now</button></Link> */}
                            <button className="btn btn-warning m-3" onClick={this.book}>Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
