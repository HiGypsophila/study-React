import React, { useEffect, useState } from 'react'
import {Table,Button,Modal, Tree} from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
const {confirm} ='Modal'
export default function RoleList() {
    const [dataSource,setdataSource]=useState([])
    const [rightList,setrightList]=useState([])
    const [currentRights,setcurrentRights]=useState([])
    const [currentId,setcurrentId]=useState(0)
    const [isModalVisible,setisModalVisible]=useState(false)
    useEffect(()=>{
        axios.get("/roles").then(res=>{
            setdataSource(res.data)
        })

    },[])
    useEffect(()=>{
        axios.get("/rights/?_embed=children").then(res=>{
            setrightList(res.data)
        })

    },[])
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render:(id)=>{
            return <b>{id}</b>
          }
        //   key: 'id',
        },
        {
          title: '角色名称 ',
          dataIndex: 'roleName',
        //   key: 'title',
        },
        {
            title: '操作',
            render:(item)=>{
              
              return <div>
                <Button type="danger" shape="circle" icon={<DeleteOutlined />} 
                onClick={()=>confirmMethod(item)}
                />
                <Button type="primary" shape="circle" icon={<EditOutlined />}
                onClick={()=>{setisModalVisible(true)
                setcurrentRights(item.rights)
                setcurrentId(item.id)
                
            }
                
               
            } 
                
                />
                
              </div>
            }
          
  
          },
      ];
    const  confirmMethod=(item)=>{
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
      const deleteMethod=(item)=>{
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/roles/${item.id}`)
    }
    //对话框确认按钮
    const handleOk=()=>{
        //关闭对话框
        setisModalVisible(false)
        //同步dataSource
        setdataSource(dataSource.map(item=>{
            if(item.id===currentId){
                return {
                    ...item,
                    rights:currentRights
                }
            }
            return item
        }))
        axios.patch(`/roles/${currentId}`,{
            rights:currentRights
        })

    }
    //对话框取消按钮
    const handleCancel=()=>{
        setisModalVisible(false)

    }
    //监听事件改变-勾选状态
    const onCheck=(checkKeys)=>{
        setcurrentRights(checkKeys.checked)


    }
    return (
        <div>
           <Table dataSource={dataSource} columns={columns} 
           rowKey={(item)=>item.id} pagination={
            {pageSize:5}
           }
           />
           <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
            checkable
            treeData={rightList}
            checkedKeys={currentRights}
            onCheck={onCheck}
            checkStrictly={true}
        />
      </Modal>
        </div>
    )
}
