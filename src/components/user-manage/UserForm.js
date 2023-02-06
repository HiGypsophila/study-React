import React, { forwardRef, useEffect, useState } from 'react'
import { Form,Input,Select} from 'antd'
const {Option}=Select
const UserForm=forwardRef((props,ref)=> {
  const [isDisable,setisDisable]=useState(false)

  useEffect(()=>{
    setisDisable(props.isUpdateDisable)

  },[props.isUpdateDisable])

  const {roleId,region}=JSON.parse(localStorage.getItem("token"))
  const roleObj={
    "1":"superadmin",
    "2":"admin",
    "3":"editor"
   }

  const checkRegionDisable=(item)=>{
    //创建
    if(props.isUpdate){
      if(roleObj[roleId]==="superadmin"){
        return false

      }else{
        return true
      }
    }else{
      if(roleObj[roleId]==="superadmin"){
        return false

      }else{
        return item.value!==region
      }
    }
  }
  const checkRoleDisable=(item)=>{
    //创建
    if(props.isUpdate){
      if(roleObj[roleId]==="superadmin"){
        return false

      }else{
        return true
      }
    }else{
      if(roleObj[roleId]==="superadmin"){
        return false

      }else{
        return roleObj[item.id]!=="editor"
      }
    }
  }

  return (
    <Form
    ref={ref}
    layout="vertical"
  >
    <Form.Item
      name="username"
      label="用户名"
      rules={[
        { required: true,
         message: '用户名不能为空！' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="password"
      label="密码"
      rules={[
        { required: true,
         message: '密码不能为空！' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="region"
      label="区域"
      rules={isDisable?[]:[
        { required: true,
         message: '区域选择不能为空！' }]}
    >
      <Select disabled={isDisable}>
        {
            props.regionList.map(item=>
              <Option value={item.value} key={item.id}
              disabled={checkRegionDisable(item)}>
                {item.title}
              </Option>
            )}
      </Select>
    </Form.Item>
    <Form.Item
      name="roleId"
      label="角色"
      rules={[{ required: true,
        message: '角色选择不能为空！' }]} >
      <Select onChange={(value)=>{
        if(value===1){
          setisDisable(true)
          ref.current.setFieldsValue({
            region:""
          })
        }else{
          setisDisable(false)
        }

      }}  >
        {
            props.roleList.map(item=>
                <Option value={item.id} 
                key={item.id}
                disabled={checkRoleDisable(item)} >{item.roleName}</Option>
                )
        }
      </Select>
    </Form.Item>
    
  </Form>
  )
})
export default UserForm