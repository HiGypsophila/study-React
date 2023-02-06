import React, { useEffect, useState } from 'react'
import {PageHeader,Descriptions,} from 'antd'
import moment from "moment"
import axios from 'axios'

export default function NewsPreview(props) {
  //存储传来的数据
  const [newsInfo,setnewsInfo]=useState(null)
  //发起请求后端数据
useEffect(()=>{
    // console.log(props.match.params.id)
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(
      res=>{
        setnewsInfo(res.data)

      }
    )
},[props.match.params.id])
//设置数组下标对应的值
const auditList=["未审核","审核中","已通过","未通过"]
const publishList=["未发布","待发布","已上线","已下线"]
const colorList=["black","orange","green","red"]
  return (
    <div>
      {/* 表单头部信息 */}
        {
          // 一开始newsinfo数据为null，axios请求比较慢，需要判断条件
          newsInfo&&<div>
             <PageHeader
      onBack={()=>window.history.back()}
      
      title={newsInfo.title}
      subTitle={newsInfo.category.title}
      
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
        {/* 下载moment库,格式化时间 */}
        <Descriptions.Item label="创建时间">
          {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="发布时间">
          {newsInfo.publishTime?moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss"):"-"}
          </Descriptions.Item>
        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
        <Descriptions.Item label="审核状态" ><span style={{color:colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}
        </span></Descriptions.Item>
        <Descriptions.Item label="发布状态"  ><span style={{color:colorList[newsInfo.publishState]}}>{publishList[newsInfo.publishState]}
        </span></Descriptions.Item>
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
