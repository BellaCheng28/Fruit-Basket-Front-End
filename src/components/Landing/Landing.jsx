import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center mt-4">
      <div className="bg-[#fafaf6] border border-gray-200 shadow-lg rounded-lg p-6 max-w-md ">
        <h1 className="text-2xl font-semibold text-center">
          <Link to="/signin" className="text-green-700">
            Go to sign in
          </Link>
        </h1>
        <br />
        <h3 className=" text-lime-600 text-lg ">
          You need to sign in first to view your account information
        </h3>
      </div>
    </main>
  );
};

export default Landing;
