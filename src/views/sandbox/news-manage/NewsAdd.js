import React, { useEffect, useState,useRef } from 'react'
import { notification,PageHeader,Steps,Button,Form,Input, Select, message } from 'antd'
import axios from 'axios'

import style from './News.module.css'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const { Step } = Steps
const {Option} =Select
export default function NewsAdd(props) {
  //存储进度条对应下标
  const [current,setCurrent]=useState(0)
  //存储请求回来的新闻分类数据
  const [categoryList,setCategoryList]=useState([])
  //存储表单数据
  const [formInfo,setformInfo]=useState({})
  //存储向富文本编辑器输入的内容
  const [content,setContent]=useState("")


//下一步
  const handleNext=()=>{
   if(current===0){
    NewsForm.current.validateFields().then(res=>{
      // console.log(res)
      setformInfo(res)
      setCurrent(current+1)
    }).catch(error=>{
      console.log(error)
    })
   }else{
    if(content===""||content.trim()==="<p></p>"){
      message.error("新闻内容不能为空！")
    }
    else{
      setCurrent(current+1)
    }
    // console.log(formInfo,content)
    
   }
  }
  //上一步
  const handlePrevious=()=>{
    setCurrent(current-1)
  }
  //Form表单规格设置
const layout={
  labelCol:{span:4},
  wrapperCol:{span:20}
}
//为整个表单设置ref获取其输入的值
const NewsForm=useRef(null)
//发起请求获取新闻分类数据
useEffect(()=>{
  axios.get("/categories").then(res=>{
    // console.log(res.data)
    //存入本地数组中
    setCategoryList(res.data)
  })
},[])
//获取登录时本地存储的数据
const User=JSON.parse(localStorage.getItem("token"))
//点击保存草稿箱或者提交审核向后端发数据然后进行对应的跳转
const handleSave=(auditState)=>{
  // console.log(formInfo)
  axios.post("/news",{
    ...formInfo,
    "content":content,
    "region":User.region?User.region:"全球",
    "author":User.username,
    "roleId":User.roleId,
    "auditState":auditState,
    "publishState":0,
    "createTime":Date.now(),
    "star":0,
    "view":0,
    // "publishTime":0
  }).then(res=>{
    props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
      
      //右下角弹出信息框
      notification.info({
        message: "通知",
        description:
        `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:"bottomRight",
      })
  }).catch(error=>{
    console.log(error)
  })
}


  return (
    <div>
      {/* 头部信息 */}
       <PageHeader
    className="site-page-header"  
    title="撰写新闻"
    // subTitle="This is a subtitle"
  />

  {/* 进度条信息 */}
  <Steps current={current}>
    <Step title="基本信息" description="新闻标题，新闻分类" />
    <Step title="新闻内容" description="新闻主体内容"  />
    <Step title="新闻提交" description="保存草稿或者提交审核" />
  </Steps>
 <div style={{marginTop:'50px'}}>
  {/* 表单信息 */}
 <div className={current===0?'':style.active}>
  <Form
     {...layout}
     name="basic"
     ref={NewsForm}
    >
      <Form.Item
        label="新闻标题"
        name="title"
        rules={[{ required: true,
           message: '请输入新闻标题!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="新闻分类"
        name="categoryId"
        rules={[{ required: true, 
          message: '请选择新闻分类!' }]}
      >
        <Select>
          {
            categoryList.map(item=>
              <Option value={item.id} key={item.id}>{item.title}</Option>
              )
          }
        </Select>
      </Form.Item>
      </Form>
  </div>
  <div className={current===1?'':style.active}>
    <NewsEditor getContent={(value)=>{
      // console.log(value)
      setContent(value)

    }} />
  </div>
  <div className={current===2?'':style.active}>
    
  </div>
 </div>
 {/* 按钮 */}
  <div style={{marginTop:'50px'}}>
    {
      current===2&&<span>
        <Button type='primary' onClick={()=>{
          handleSave(0)
        }}>保存草稿箱</Button>
        <Button danger onClick={()=>{
          handleSave(1)}}>提交审核</Button>
      </span>
    }
    {current<2&&<Button type='primary' onClick={handleNext}>下一步</Button>}
    {current>0&&<Button onClick={handlePrevious}>上一步</Button>}

  </div>

    </div>
  )
}
