// src/components/Landing.jsx

const Landing = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center mt-4">
      <div className="bg-[#fafaf6] border border-gray-200 shadow-lg rounded-lg p-6 max-w-md ">
        <h1 className=" text-lime-600  hover:text-lime-500  text-2xl font-semibold">
          Hello, you are on the landing page for visitors.
        </h1>
        <br />
        <h3 className=" text-gray-700 text-lg ">
          If you sign up for a new account, you will have the ability to sign in
          and see your super secret home.
        </h3>
      </div>
    </main>
  );
};

export default Landing;
