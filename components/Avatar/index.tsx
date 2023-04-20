/** @format */

import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { updateReturnItems } from "../../redux/slices/returnItemsSlice";
import { useDispatch } from "react-redux";

interface Props {
  record: any;
}

const Avatar = ({ record }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState("");

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = ({ file }: any) => {
    if (file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (file.status === "done") {
      // Get this url from response in real world.
      getBase64(file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const handleUpload = ({ file }: any) => {
    let fd = new FormData();
    fd.append("photo", file);
    fd.append("id", record["_id"]);
    dispatch(updateReturnItems(fd));
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="photo"
      listType="picture-card"
      // customRequest={handleUpload}
      className="avatar-uploader"
      method={"PUT"}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{ width: "100%", height: "100px", objectFit: "contain" }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default Avatar;
