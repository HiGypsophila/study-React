import React,{ useEffect, useRef, useState} from 'react'
import { Table,Button,Modal, Switch} from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal


export default function UserList() {
    const [dataSource,setdataSource]=useState([])
    const [isAddVisible,setisAddVisible]=useState(false)
    const [roleList,setroleList]=useState([])
    const [regionList,setregionList]=useState([])
    const [isUpdateVisible,setisUpdateVisible]=useState(false)
    const addForm=useRef(null)
    const updateForm=useRef(null)
    const [isUpdateDisable,setisUpdateDisable]=useState(false)
    const [current,setcurrent]=useState(null)
    const {roleId,region,username}=JSON.parse(localStorage.getItem("token"))
   
   
    //请求后端数据
    useEffect(()=>{
      const roleObj={
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
       }
        axios.get("/users?_expand=role").then(res=>{
          const list=res.data
            setdataSource(roleObj[roleId]==="superadmin"?list:
            [...list.filter(item=>item.username===username),
              ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
            ]
            )
        })
    },[roleId,region,username])
    useEffect(()=>{
        axios.get("/regions").then(res=>{
          const list=res.data
            setregionList(list)
        })
    },[])
    useEffect(()=>{
        axios.get("/roles").then(res=>{
          const list=res.data
            setroleList(list)
        })
    },[])
    const columns = [
        {
          title: '区域',
          dataIndex: 'region',
          filters:[
            ...regionList.map(item=>({
                text:item.title,
                value:item.value
            })),
            {
                text:"全球",
                value:"全球"
            }
          ],
          onFilter:(value,item)=>{
            if(value==="全球"){
                return item.region===""
            }
            return item.region===value
          },
          render:(region)=>{
            return <b>{region===''?'全球':region}</b>
          }
        //   key: 'id',
        },
        {
          title: '角色名称 ',
          dataIndex: 'role',
          render:(role)=>{
            return role.roleName
          }
        //   key: 'title',
        },
        {
          title: '用户名',
          dataIndex: 'username',   
        //   key: 'key',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState', 
            render:(roleState,item)=>{
                return <Switch checked={roleState} disabled={item.default} onChange={()=>{handleChange(item)}}></Switch>
            }
          //   key: 'key',
          },
        {
            title: '操作',
            render:(item)=>{
              
              return <div>
                <Button type="danger" shape="circle" icon={<DeleteOutlined />} 
                onClick={()=>confirmMethod(item)}
                disabled={item.default}
                />
                
                <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default}
                onClick={()=>handleUpdate(item)} />
               
              </div>
            }
          
  
          },
      ];
      //删除确认对话框
      const confirmMethod=(item)=>{
        confirm({
          title: '你确定要删除吗?',
          icon: <ExclamationCircleOutlined />,
          // content: 'Some descriptions',
          onOk() {
            deleteMethod(item)
          },
          onCancel() {
            
          },
        });
      }
      //删除
      const deleteMethod=(item)=>{
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/users/${item.id}`)

      }
   const addFormOK=()=>{
         // console.log('add')
         addForm.current.validateFields().then(value=>{
            // console.log(value)
            setisAddVisible(false)
            addForm.current.resetFields()
            //post到后端，生成id,再设置dataSource，方便后面的删除和更新
            axios.post(`/users`,{
                ...value,
                "roleState":true,
                "default":false
            }).then(res=>{
                console.log(res.data)
                setdataSource([...dataSource,{
                    ...res.data,
                    role:roleList.filter(item=>item.id===value.roleId)[0]
                }])
            }).catch(err=>{
                console.log(err)
            })
           

            })
        
      }

      const handleChange=(item)=>{
        item.roleState=!item.roleState
        setdataSource([...dataSource])
        axios.patch(`/users/${item.id}`,{
            roleState:item.roleState
        })

      }
      const handleUpdate=(item)=>{
        //同步
       setTimeout(()=>{
        setisUpdateVisible(true)
        if(item.roleId===1){
            //禁用
            setisUpdateDisable(true)
        }else{
            //取消禁用
            setisUpdateDisable(false)
        }
        updateForm.current.setFieldsValue(item)
       },0)
       setcurrent(item)


      }
      const updateFormOK=()=>{
        updateForm.current.validateFields().then(value=>{
            setisUpdateVisible(false)
            setdataSource(dataSource.map(item=>{
                if(item.id===current.id){
                    return {
                        ...item,
                        ...value,
                        role:roleList.filter(data=>data.id===value.roleId)[0]
               

                    }
                }
                return item
            }))
            setisUpdateDisable(!isUpdateDisable)
            axios.patch(`/users/${current.id}`,value)
        })

      }

    return (
        <div>
            <Button type="primary" onClick={()=>{
                setisAddVisible(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} 
            rowKey={(item)=>item.id}
           pagination={
            {pageSize:5}
           
           }
           />
<Modal
      visible={isAddVisible}
      title="添加用户"
      okText="确定"
      cancelText="取消"
      onCancel={()=>{
        setisAddVisible(false)
      }}
      onOk={() => {
       addFormOK()
      }}
    >
     <UserForm regionList={regionList} roleList={roleList}
     ref={addForm} />
    </Modal>

    <Modal
      visible={isUpdateVisible}
      title="更新用户"
      okText="更新"
      cancelText="取消"
      onCancel={()=>{
        setisUpdateVisible(false)
        setisUpdateDisable(!isUpdateDisable)
      }}
      onOk={() => {
       updateFormOK()
      }}
    >
     <UserForm regionList={regionList} roleList={roleList}
     ref={updateForm} 
     isUpdateDisable={isUpdateDisable}
     isUpdate={true} />
    </Modal>

        </div>
    )
}
