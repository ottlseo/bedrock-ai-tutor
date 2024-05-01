import './App.css';
import { useRef } from 'react';
import sampleVideo1 from './assets/sample-video.mp4';
import sampleVideo2 from './assets/sample-video-2.mp4';

import sampleImage1 from './assets/sample1.jpeg';
import sampleImage2 from './assets/sample2.jpeg';
import sampleImage3 from './assets/sample3.jpeg';
import sampleImage4 from './assets/sample4.png';
import sampleImage5 from './assets/sample5.jpeg';

const App = () => {
  const videoRef = useRef();
  const setPlayBackRate = () => {
    videoRef.current.playbackRate = 1.0;
  };

  return (
    <div className="App">
      <div className='header-section'>
        <h1>AnyCompany main page Sample</h1>
        <h2>2024.05.02 AWS PoC Session</h2>
      </div>
      <div id="sample-assets-container">
        <div className='sample-video-section'>
          <h2>수강생 후기 Video sample</h2>
          <video
            muted // 무음
            autoPlay // 자동 재생
            loop // 반복 재생
            ref={videoRef}
            onCanPlay={() => setPlayBackRate()}
          >
            <source src={sampleVideo1} type="video/mp4" width='100%'/>
          </video>
        </div>
        <div className='sample-image-section'>
          <h2>Main Image Sample</h2>
          <img src={sampleImage5} width='550px'/><br/>
        </div>
      </div>

      <div className='sample-images-section'>
        <img src={sampleImage4} width='100%'/>
      </div>
      <div className='sample-images-section'>
        <img src={sampleImage1} width='50%'/><br/>
      </div>
      <div className='sample-images-section'>
        <img src={sampleImage2} width='50%'/><br/>
      </div>
      <div className='sample-images-section'>
        <img src={sampleImage3} width='50%'/>
      </div>
      <div className='videoSection'>
        <video
          muted // 무음
          autoPlay // 자동 재생
          loop // 반복 재생
          ref={videoRef}
          onCanPlay={() => setPlayBackRate()}
        >
          <source src={sampleVideo2} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default App;
