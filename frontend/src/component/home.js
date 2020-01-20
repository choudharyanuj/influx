import React, { Component } from 'react'
import Axios from 'axios'
import Navbar from './navbar'
import {Link} from 'react-router-dom'
import queryString from 'query-string'
export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            allData : [],
            per_page:0,
            change_page:{
                page:1
            },
            total_pages:0,
            filteredData:[],
            car_name:"",
            data_per_page:''
        }
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
        Axios.get("http://127.0.0.1:5000/search",{
            headers:{
                car_name:this.state.car_name
            }
        })
            .then((response) => {
                this.setState({
                    filteredData:response.data
                })
                console.log(this.state.filteredData)
            })
            .catch((err) => alert(err))
    }

    componentDidMount = (page = 1,e) => {
        console.log(page)
        Axios.post(`http://127.0.0.1:5000/home?page=${page}`)
        .then(response => {
            this.setState({
                allData:response.data.data,
                total_pages:response.data.total_pages
            })
            console.log(response.data.data)
        })
        .catch(err => {
            alert(err)
        })
    }
    pagination = (pageNo) => {
        let updatePage = this.state.change_page
        updatePage.page = pageNo
        this.setState({
            change_page : updatePage
        },
        () => {
            this.props.history.push(`?${queryString.stringify(updatePage)}`);
        })
        
        this.componentDidMount(this.page = pageNo);
    };
    render() {
        const pageNumber = [];
        for(var i = 1; i <= this.state.total_pages; i++) {
            pageNumber.push(i)
        }
        const showpageNumber = pageNumber.map(number => {
            return(
                <button className="btn m-2 btn-info" onClick={() => this.pagination(number)}>{number}</button>
            )
        })
        console.log(this.state.allData)
        return (
            <>
            <div>
                <Navbar/>
            </div>
            
            <form className = 'float-right my-3 d-flex mr-5' onSubmit={this.handleSubmit}>
                <input placeholder="Item Name" className="form-control ml-n5" name="car_name" onChange={this.handleChange}></input>
                <button>Search</button>
            </form>

            <div className="mt-5">
               {    
                this.state.filteredData.length !== 0 ?
                    this.state.filteredData.map((e) => {
                            return(
                                <div className="float-left ml-5 mt-5 card" style={{width:"18rem"}}> 
                                        <div className="text-center"> 
                                            <img src = {`http://127.0.0.1:5000/${e.car_image}`} className="img-fluid" ></img>
                                            <h1 className="card-title">{e.car_name}</h1>
                                            <h2 className="card-title">{e.car_type}</h2>
                                        </div>
                                    
                                    <div>
                                    <Link to={`/details/${e.car_id}}`}> <button className="btn btn-primary offset-4 mt-3 mb-3">Book Now</button></Link>
                                    </div>
                                </div>
                                 
                            )
                        }) : this.state.filteredData.length == 0 ?
                            this.state.allData.map((e) => {
                                return(
                                    <div className="float-left ml-5 mt-5 card" style={{width:"18rem"}}>
                                            <div className="text-center"> 
                                                <img src = {`http://127.0.0.1:5000/${e.car_image}`} className="img-fluid" ></img>
                                                <h3 className="card-title">{e.car_name}</h3>
                                                <h4 className="card-title">{e.car_type}</h4>
                                            </div>
                                        <div>
                                        <Link to={`/details/${e.car_id}}`}> <button className="btn btn-primary offset-4 mt-3 mb-3">Book Now</button> </Link>
                                        </div>
                                    </div>
                                )      
                            }):null
                }      
            </div>
            <div className="offset-5" style={{marginTop:"30%"}}>
                {showpageNumber}
            </div>
            </>
        )
    }
}


