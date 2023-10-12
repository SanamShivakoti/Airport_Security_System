function Content() {
  return (
    <div className="flex h-screen">
      {/* for Dashboard-contents */}
      <div className="flex-auto laptop:w-9/12 ml-1 mr-1 bg-zinc-100 tablet:w-8/12">
        <div className="text-3xl font-bold text-left mt-1 mb-1 ml-1">
          Dashboard
        </div>
        <hr className="border-t-2 border-solid border-black my-1" />
        <div className="flex desktop:mx-48 desktop:w-6/12 laptop:mx-32 laptop:w-3/5 tablet:mx-10 tablet:w-4/5">
          {/* for total passengers */}
          <div className="flex-1  mx-20 my-10 h-auto border-2 border-black rounded bg-zinc-300 shadow-lg tablet:mx-10">
            <div className="text-3xl font-bold mx-4 my-4 px-4 py-4 ">
              Total Passengers
              <div className="text-2xl font-bold mx-4 my-4 px-4 ">3</div>
            </div>
          </div>
        </div>
        {/* for Activities */}
        <div className="text-2xl text-left font-bold mt-1 mb-1 ml-5">
          Activities
        </div>
        <div className="font-bold-none bg-slate-300 rounded w-11/12 h-96 border-2 border-black mt-1 mb-1 ml-4 shadow-lg">
          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 pt-2 pb-1">
            This is the First line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Second line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Third line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Fourth line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Fifth line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Sixth line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Seventh line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Eight line
          </p>
          <hr className="border-solid border-black mx-6" />

          <p className="text-left mt-1 mb-1 ml-2 mr-2 px-4 py-1">
            This is the Ninth line
          </p>
        </div>
      </div>
      {/* For Notifications */}
      <div className="flex-auto w-3/12 mr-1 bg-zinc-100">
        <div className="text-3xl font-bold text-center mt-1 mb-1 ml-2">
          Notifications
        </div>
        <hr className="border-t-2 border-black my-1" />
        <div className="laptop:text-sm desktop:text-base tablet:text-sm  ">
          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left  tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p className="text-red-700">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
          {/* Second */}
          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p className="text-red-700">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          {/* Third */}
          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          {/* fourth */}
          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          {/* fifth */}

          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          {/* sixth */}

          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          {/* seventh */}
          <div className="desktop:mx-1 my-1 desktop:py-2 laptop:mx-2 my-2 laptop:py-4 text-left tablet:py-1 tablet:mx-1">
            <a
              href="https://seinfeldquotes.com"
              className="text-blue-600 visited:text-purple-600 font-bold"
            >
              Passenger try to enter before time
            </a>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
