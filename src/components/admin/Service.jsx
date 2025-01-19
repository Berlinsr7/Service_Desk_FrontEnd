import React, { useEffect,useState } from 'react'
import TopBar from './TopBar'
import Button from 'react-bootstrap/Button';
import AxiosService from '../../utils/AxiosService'
import toast from 'react-hot-toast';
import ApiRoutes from '../../utils/ApiRoutes';
import Table from 'react-bootstrap/Table';
import Helper from '../../utils/Helper'
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import useLogout from '../../hooks/useLogout';
function Service() {
  let [data,setData] = useState({})
  let params = useParams()
  let {id} = params
  let logout = useLogout()
  const getData = async()=>{
    try {
      let res = await AxiosService.get(`${ApiRoutes.SERVICE.path}/${id}`,{
        authenticate:ApiRoutes.SERVICE.authenticate
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

  const changeStatus = async(payload)=>{
    try {
      let res = await AxiosService.put(`${ApiRoutes.CHANGE_STATUS.path}/${payload.id}`,payload,{
        authenticate:ApiRoutes.CHANGE_STATUS.authenticate
      })

      if(res.status===200)
      {
        toast.success(res.data.message)
        getData()
      }

    } catch (error) {
       toast.error(error.response.data.message)
       if(error.response.status===401)
         logout()
       
    }
  }

  let handleSubmit = (e)=>{
    e.preventDefault()
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    formProps.id = data._id
    changeStatus(formProps)

  }

  useEffect(()=>{
    if(id)
      getData()
  },[])

  return <>
  <TopBar/>
  <div className="details-wrapper">
  <Table striped bordered hover>
      <thead>
        <tr>
          <th>Item</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
          {
            Object.keys(data).map((e,i)=>{
              return <tr>
                <td>{Helper.upperCase(e)}</td>
                <td>{data[e]!==null?data[e]:"-"}</td>
              </tr>
            })
          }
      </tbody>
    </Table>
  </div>
  <div>
        {
          data.status==="Open"?<Button variant='warning' onClick={()=>changeStatus({id:data._id})}>Assign To Me</Button>:
          data.status==="Assigned"?<>
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <FloatingLabel label="Resolution">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '100px' }}
                name="resolution"
              />
            </FloatingLabel>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          </Form>
          </>:<></>
        }
  </div>
  </>
}

export default Service