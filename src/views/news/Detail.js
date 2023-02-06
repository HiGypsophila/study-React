import React, { useEffect, useState } from 'react'
import {PageHeader,Descriptions,} from 'antd'
import {HeartTwoTone} from '@ant-design/icons'
import moment from "moment"
import axios from 'axios'

export default function Detail(props) {
  //存储传来的数据
  const [newsInfo,setnewsInfo]=useState(null)
  //发起请求后端数据,更新浏览人数
useEffect(()=>{
    // console.log(props.match.params.id)
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(
      res=>{
        //本地数据更新
        setnewsInfo({
          ...res.data,
          view:res.data.view+1
        })
        //同步后端
        return res.data

      }
    ).then(res=>{
      //继续发起请求
        axios.patch(`/news/${props.match.params.id}`,{
          view:res.view+1
        })
    })
},[props.match.params.id])

//更新点赞人数
const handleStar=()=>{
  setnewsInfo({
    ...newsInfo,
    star:newsInfo.star+1
  })
  axios.patch(`/news/${props.match.params.id}`,{
    star:newsInfo.star+1
  })

}

  return (
    <div>
      {/* 表单头部信息 */}
        {
          // 一开始newsinfo数据为null，axios请求比较慢，需要判断条件
          newsInfo&&<div>
             <PageHeader
      onBack={()=>window.history.back()}
      
      title={newsInfo.title}
      subTitle={
        <div>
          {newsInfo.category.title}
          <HeartTwoTone twoToneColor="#eb2f96" 
          onClick={()=>handleStar()}/>
        </div>
      }
      
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
        {/* 下载moment库,格式化时间 */}
       
        <Descriptions.Item label="发布时间">
          {newsInfo.publishTime?moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss"):"-"}
          </Descriptions.Item>
        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
       
        <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
        <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
        <Descriptions.Item label="评论数量">0</Descriptions.Item>
     
      </Descriptions>
    </PageHeader>
    {/* html格式转化为普通文字 */}
    <div dangerouslySetInnerHTML={{__html:newsInfo.content}}
     style={{margin:'0 24px', border:'1px solid gray'}} >
      
    </div>
          </div>
        }
    </div>
  )
}

