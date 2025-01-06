import { useContext, useEffect } from "react";
import { AuthedUserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useContext(AuthedUserContext);

  return (
    <main>
      <div className="relative">
        <div className="bg-black bg-opacity-30 absolute h-full w-full flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <p className="font-bold text-white text-5xl">
              We bring the store to your door
            </p>

            <Link
              to="/products"
              className="flex items-center justify-center bg-lime-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50 w-32 cursor-pointer mt-2.5"
            >
              Buy Now
            </Link>
          </div>
        </div>
        <video
          playsInline="playsinline"
          webkit-playsinline="webkit-playsinline"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          tabIndex="-1"
          preload="auto"
          loop
          autoPlay
          muted="muted"
          src="/public/video/fruit.mp4"
        ></video>
      </div>
    </main>
  );
};

export default Home;
