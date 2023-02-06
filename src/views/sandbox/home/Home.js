import React, { useEffect, useRef, useState } from 'react'
import { Card,Col,Row,List,Avatar,Drawer} from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card

export default function Home() {
  //存储用户最常浏览的数据
    const [viewList,setviewList]=useState([])
    //存储用户点赞数最多的数据
    const [starList,setstarList]=useState([])
    //控制drawer抽屉是否显示
    const [visible,setvisible]=useState(false)
    //存储饼状数据
    const [pieChart,setpieChart]=useState(null)
    //存储
    const [allList,setallList]=useState([])
    //定义柱状图容器的ref
    const barRef=useRef()
    //定义饼状图容器的ref
    const pieRef=useRef()
    //发起请求获取用户最常浏览的数据并进行本地存储
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(
            res=>{
                setviewList(res.data)
                
            }
        )
    },[])
 //发起请求获取用户点赞最多的数据并进行本地存储
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(
            res=>{
                setstarList(res.data)

            }
        )
    },[])
 //发起请求获取用户饼状和柱状图的数据并进行本地存储
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category").then(
            res=>{
               // console.log(res.data)
               // console.log("nnn",_.groupBy(res.data,item=>item.category.title))
                renderBarView(_.groupBy(res.data,item=>item.category.title))
                //饼状图和柱状图都需要用到
                setallList(res.data)
            }
        )
        //由于axios只发起一次，所以得进行销毁
        return ()=>{
            window.onresize=null
        }
        
    },[])
    //柱状图
    const renderBarView=(obj)=>{
         // 基于准备好的dom，初始化echarts实例
      var myChart = Echarts.init(barRef.current);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '新闻分类图示'
        },
        tooltip: {},
        legend: {
          data: ['数量']
        },
        xAxis: {
          data: Object.keys(obj),
          axisLabel:{
            rotate:"45",
            interval:0
          }
        },
        yAxis: {minInterval:1},
        series: [
          {
            name: '数量',
            type: 'bar',
            data: Object.values(obj).map(item=>item.length)
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.onresize=()=>{
        console.log("resize")
        myChart.resize()
      }
    }
    //饼状图
    const renderPieView=(obj)=>{
        //数据处理工作
        var currentList=allList.filter(item=>item.author===username)
       var groupObj=_.groupBy(currentList,item=>item.category.title)
       var list=[]

       for(var i in groupObj){
        list.push({
            name:i,
            value:groupObj[i].length
        })
       }
        //防止初始化多次
        var myChart ;
        if(!pieChart){
            myChart=Echarts.init(pieRef.current)
            setpieChart(myChart)
        }
        else{
            myChart=pieChart
        }
var option;

option = {
  title: {
    text: '当前用户新闻分类图示',
    // subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '发布数量',
      type: 'pie',
      radius: '50%',
      data: list,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

option && myChart.setOption(option);


    }








    const {username,region,role:{roleName}}=JSON.parse(localStorage.getItem("token"))
    return (
      //定义卡片组件，每列总为24
        <div className="site-card-wrapper">
            <Row gutter={16}>
              {/* 用户最常浏览模块 */}
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                    <List
                    size="smalll"
                    dataSource={viewList}
                    renderItem={item => (
                                    <List.Item>
                         <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                    </List.Item>
      )}
    />
        </Card>
      </Col>
      {/* 用户点赞数模块 */}
      <Col span={8}>
        <Card title="用户点赞最多" bordered={true}>
        <List
                    size="smalll"
                    dataSource={starList}
                    renderItem={item => (
                        <List.Item>
                        <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                   </List.Item>
      )}
    />
        </Card>
      </Col>
      {/* 图形卡片 */}
      <Col span={8}>
      <Card
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" onClick={()=>{
        //防止dom容器为准备好而影响页面的渲染
       setTimeout(()=>{
        //异步操作
        setvisible(true)
        //init初始化
        renderPieView()
       },0)
    }}/>,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
      title={username}
      description={
        <div>
            <b>{region?region:"全球"}</b>
            <span style={{paddingLeft:'30px'}}>{roleName}</span>
        </div>
      }
    />
  </Card>
      </Col>
    </Row>
    {/* 右边抽屉模块 */}
    <Drawer 
    width="500px"
        title="全球新闻分类"
        placement="right"
        closable={false}
        onClose={()=>{
            setvisible(false)
        }}
        visible={visible}
    >
      {/* 定义饼状图容器，方便之后进行数据渲染 */}
       <div ref={pieRef} style={{
        width:"100%",
        height:"400px",
        marginTop:"30px"
      }}></div>

    </Drawer>
{/* 定义柱状图容器 */}
      <div ref={barRef} style={{
        width:"100%",
        height:"400px",
        marginTop:"30px"
      }}></div>


  </div>
    )
}
