import React, { useState,useEffcet, useEffect } from 'react'
import TopBar from './TopBar'
import useLogout from '../../hooks/useLogout'
import AxiosService from '../../utils/AxiosService'
import ApiRoutes from '../../utils/ApiRoutes'
import toast from 'react-hot-toast'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  let [countData,setCountData] = useState({})
  let [data,setData] = useState([])
  let logout = useLogout()
  let navigate = useNavigate()
  let getDashboardCount = async()=>{
    try {
      let res = await AxiosService.get(ApiRoutes.DASHBOARD_COUNT.path,{
        authenticate:ApiRoutes.DASHBOARD_COUNT.authenticate
      })

      if(res.status===200)
      {
          setCountData(res.data.data)
      }
    } catch (error) {
      toast.error(error.response.data.message)
      if(error.response.status===401)
        logout()
    }
  }

  let loadData = async(status)=>{
    try {
      let res = await AxiosService.get(`${ApiRoutes.LIST.path}/${status}`,{
        authenticate:ApiRoutes.LIST.authenticate
      })

      if(res.status===200)
      {
          setData(res.data.data)
      }
    } catch (error) {
      toast.error(error.response.data.message)
      if(error.response.status===401)
        logout()
    }
  }

  useEffect(()=>{
    getDashboardCount()
  },[])
  return <>
  <TopBar/>
  <div className='cardWrapper'>
  <Card style={{ width: '18rem',cursor:"pointer" }} onClick={()=>loadData("Open")}>
      <Card.Body style={{display:"flex",justifyContent:"space-between"}}>
        <Card.Title>Open</Card.Title>
        <Card.Title>{countData["Open"]?countData["Open"]:0}</Card.Title>
      </Card.Body>
    </Card>
    <Card style={{ width: '18rem',cursor:"pointer" }} onClick={()=>loadData("Assigned")}>
      <Card.Body style={{display:"flex",justifyContent:"space-between"}}>
        <Card.Title>Assigned</Card.Title>
        <Card.Title>{countData["Assigned"]?countData["Assigned"]:0}</Card.Title>
      </Card.Body>
    </Card>
    <Card style={{ width: '18rem',cursor:"pointer" }} onClick={()=>loadData("Closed")}>
      <Card.Body style={{display:"flex",justifyContent:"space-between"}}>
        <Card.Title>Closed</Card.Title>
        <Card.Title>{countData["Closed"]?countData["Closed"]:0}</Card.Title>
      </Card.Body>
    </Card>
  </div>
  {
    data.length?<div className='details-wrapper'>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Category</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Created Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
          {
            data.map((e,i)=>{
              return <tr key={e._id}>
                <td>{i+1}</td>
                <td>{e.title}</td>
                <td>{e.category}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.status}</td>
                <td>{e.createdAt}</td>
                <td><Button variant='primary' onClick={()=>navigate(`/admin/service/${e.no}`)}>View</Button></td>
              </tr>
            })
          }
      </tbody>
    </Table>

    </div>:<h3 style={{textAlign:"center"}}>No Data Available</h3>
  }
  </>
}

export default Dashboard