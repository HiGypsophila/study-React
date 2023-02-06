import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {PageHeader,Card,Row,Col,List} from 'antd'
import _ from 'lodash'

export default function News() {
  //存储列表数据
  const [list,setlist]=useState([])
  //发起请求获取数据
  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category").then(res=>{
      console.log("1",res.data)
      //将数据进行封装，变成二维数组
      setlist(Object.entries(_.groupBy(res.data,item=>item.category.title)))
      console.log(Object.entries(_.groupBy(res.data,item=>item.category.title)))
    })

  },[])
  return (
    <div style={{width:"95%",margin:"0 auto"}}>
      {/* 页面标题 */}
      <PageHeader
    className="site-page-header"
    title="全球大新闻"
    subTitle="查看新闻"
  />
{/* 页面卡片 */}
<div className="site-card-wrapper">
    <Row gutter={[16,16]}>
      {
        list.map(item=>
          <Col span={8} key={item[0]}>
        <Card title={item[0]} bordered={true}
        hoverable={true}>
          <List
      size="small"
      dataSource={item[1]}
      pagination={{
        pageSize:3
      }}
      renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
    />
        </Card>
      </Col>
     

        )
      }
    </Row>
  </div>
    </div>
  )
}
