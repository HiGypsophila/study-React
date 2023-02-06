import React, { useEffect, useState } from 'react'
import { Table,Tag,Button,Modal,Popover, Switch} from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;
export default function RightList() {
    const [dataSource,setdataSource]=useState([])
    //请求后端数据
    useEffect(()=>{
        axios.get("/rights?_embed=children").then(res=>{
          const list=res.data

          list.forEach(item=>{
            if(item.children.length===0){
              item.children=""
            }
          }
            )
            setdataSource(list)
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
          title: '权限名称 ',
          dataIndex: 'title',
        //   key: 'title',
        },
        {
          title: '权限路径',
          dataIndex: 'key',
          render:(key)=>{
            return <Tag color="orange">{key}</Tag>
          }
        //   key: 'key',
        },
        {
            title: '操作',
            render:(item)=>{
              
              return <div>
                <Button type="danger" shape="circle" icon={<DeleteOutlined />} 
                onClick={()=>confirmMethod(item)}
                />
                 <Popover content={<div style={{textAlign:"center"}}>
                  <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
                 </div>} title="页面配置项" trigger={item.pagepermisson===undefined?'':'click'}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} 
                 disabled={item.pagepermisson===undefined} />
                </Popover>
                
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
        // console.log(item)
       if(item.grade===1){
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/rights/${item.id}`)
       }else{
        let list=dataSource.filter(data=>data.id===item.rightId)
        list[0].children=list[0].children.filter(data=>data.id!==item.id)
        // console.log(list,dataSource)
        setdataSource([...dataSource])
        axios.delete(`/children/${item.id}`)
       }
      }
      //开关配置
      const switchMethod=(item)=>{
        item.pagepermisson=item.pagepermisson===1?0:1
        //只能深复制一层
        setdataSource([...dataSource])
        if(item.grade===1){
          axios.patch(`/rights/${item.id}`,{
            pagepermisson:item.pagepermisson
          })
        }else{
          axios.patch(`/children/${item.id}`,{
            pagepermisson:item.pagepermisson
          })
        }

      }

    return (
        <div>
           <Table dataSource={dataSource} columns={columns} 
           pagination={
            {pageSize:5}
           }
           />
        </div>
    )
}
