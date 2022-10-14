import "./index.less";
import { ExceptionOutlined } from "@ant-design/icons";

export default function () {
  return (
    <div className="NotFoundContainer">
      <ExceptionOutlined className="icon" />
      <div>您访问的页面不存在</div>
    </div>
  );
}
