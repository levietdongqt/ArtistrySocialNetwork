import { PlusOutlined } from "@ant-design/icons";
import { Upload ,Image} from "antd";
import { useUpload } from "context/uploadfile-context";
import { useEffect, useState } from "react";

interface UploadDataParams {
  urlMedia?: any[]
}

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export default function UploadFile ({urlMedia} : UploadDataParams)  {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const {setFiles,setUrlUpload} = useUpload();
  const [fileList, setFileList] = useState<any>([]);
  useEffect(()=>{
    if(urlMedia !== undefined){
      const newArray = urlMedia.map((str: string) => ({ url: str }));
      setUrlUpload(newArray as any);
      console.log("urlMedia",newArray)
      setFileList(urlMedia.map((data)=>({url:data})))
    }
  },[urlMedia])

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }:any) => {
    const files = newFileList.map((file:any) => file.originFileObj).filter((file:any) => file !== undefined);
    setFileList(newFileList)
    setFiles(files);
    if (urlMedia !== undefined) {
      const filesUpload = newFileList.filter((file:any) => file.url != undefined)
      setUrlUpload(filesUpload)
    }
};

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={true}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
          
        />
      )}
    </>
  );
};

