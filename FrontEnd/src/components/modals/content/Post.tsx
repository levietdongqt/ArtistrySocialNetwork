import React, { useState } from "react";
import Badge from "react-bootstrap/Badge";
import { Button, Form, Input, Avatar, Select } from "antd";
import { Store } from 'rc-field-form/lib/interface';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

interface PostParams {
  User: User;
  CloseRequest: Function;
}
interface User {
  id: number;
  name: string;
  avatar: string;
}

export function Post({ User, CloseRequest }: PostParams) {
  const [form] = Form.useForm();
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleSubmit = (values: Store) => {
    console.log(values);
    if (values != null) {
      CloseRequest();
    }
  };
  return (
    <>
      <h2>
        <Badge bg="secondary">Tạo bài viết</Badge>
      </h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        {...formItemLayout}
        variant="filled"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
        >
        <Avatar
          style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
          size="large"
        ></Avatar>
        <Button>{User.name}</Button>
        
          <Select
            defaultValue="Công khai"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "ck", label: "Công khai" },
              { value: "a", label: "Ẩn" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="TextArea"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Tạo Bài Viết
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
