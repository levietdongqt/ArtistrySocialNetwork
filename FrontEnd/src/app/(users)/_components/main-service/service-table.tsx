import { DashOutlined } from "@ant-design/icons";
import { Button } from "@components/ui/button";
import { Popover, Table, Tag } from "antd";

type DataTable = {
  data: any[];
};


export default function ServiceMainTable({ data }: DataTable) {
    const handleTest = (value: any) =>{
        console.log("data ne",value);
    }


    const content =(record:any) => (
        <div className="flex flex-col">
          <Button
            className="dark-bg-tab min-w-[120px] self-start border border-light-line-reply px-4 py-1.5 
                           font-bold hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
                            onClick={()=> handleTest(record.id)}
          >
            Chỉnh sửa
          </Button>
        </div>
      );
    const columns : any = [
        {
            title: 'Số thứ tự',
            dataIndex: 'rowNumber',
        },
        {
            title: 'Tên Dịch Vụ',
            dataIndex: 'name',     
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a:any, b:any) => a.price - b.price, 
        } ,
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            sorter: (a:any, b:any) => a.duration - b.duration, 
           
        },
        {
            title: 'Thời gian nghỉ',
            dataIndex: 'restTime',
            sorter: (a:any, b:any) => a.restTime - b.restTime,    
        },
        {
            title: 'Kiểu Giá',
            dataIndex: 'priceType',
            filters: [
                {
                  text: 'Concept',
                  value: 'Concept',
                },
                {
                  text: 'Khác',
                  value: 'Khác',
                },
                {
                    text: 'Ngày',
                    value: 'Ngày',
                }
              ],
              onFilter: (value :any, record:any) => record.priceType.indexOf(value) === 0,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
           
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createDate',
            render: (createDate: string) => {
                return createDate
            },
            sorter: (a:any, b:any) => new Date(b.createDate).getTime() - new Date (a.createDate).getTime(),  
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'promotion',
            showSorterTooltip: {
                target: 'full-header',
              },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: boolean) => {
                const tagColor = status ? 'green' : 'red';
                const tagContent = status ? 'Hoạt động' : 'Không hoạt động';
        
                // Trả về một thẻ Tag với màu và nội dung tương ứng
                return (
                    <Tag color={tagColor}>
                        {tagContent}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record:any) =>  <Popover
            placement="bottomLeft"
            trigger="click"
            content={content(record)}
          >
            <Button className="ml-3" ><DashOutlined /></Button>
          </Popover>,
          },
    ]
    
  return <Table columns={columns} dataSource={data}/>;
}
