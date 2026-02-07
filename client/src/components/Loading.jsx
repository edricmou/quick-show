import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate('/' + nextUrl);
      }, 1000);
    }
  }, []);
  return (
    // 视口高度的 80%，垂直居中，水平居中
    <div className='flex justify-center items-center h-[80vh]'>
      {/* animate-spin：animation spin 1s linear infinite 1 秒一圈，匀速，无限循环*/}
      {/* border-t-primary: 上边框是primary色 */}
      {/* border-2：边框宽度2px */}
      {/* rounded-full：将方形元素变成「正圆形」 */}
      <div className='animate-spin rounded-full h-14 w-14 border-2 border-t-primary'></div>
    </div>
  );
};

export default Loading;
