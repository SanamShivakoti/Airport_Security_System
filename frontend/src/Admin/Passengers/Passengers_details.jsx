function PassengersRegistration() {
  return (
    <div>
      <div className="text-3xl flex justify-center font-bold">
        Passengers Details
      </div>
      <div className="mt-6 ">
        <form>
          <div className="grid w-auto grid-cols-3 gap-4 laptop:px-32 desktop:px-40  tablet:px-24">
            <div className="mt-1">
              <label
                htmlFor="first-name"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                First name
              </label>

              <input
                type="text"
                name="first-name"
                id="first-name"
                placeholder="First Name"
                autoComplete="given-name"
                className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="middle-name"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Middle name
              </label>

              <input
                type="text"
                name="middle-name"
                id="middle-name"
                placeholder="Middle Name"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="last-name"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Last name
              </label>

              <input
                type="text"
                name="last-name"
                id="last-name"
                placeholder="Last Name"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="email"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 w-[36rem]text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="mobile no."
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Mobile No.
              </label>

              <input
                type="number"
                name="mobile"
                id="mobile"
                placeholder="Mobile Number"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>



          <div className="mt-10 text-1xl flex justify-center font-bold">
            Flight Details
          </div>

          <div className="mt-2 grid w-auto grid-cols-3 gap-4 laptop:px-32 desktop:px-40  tablet:px-24">
            <div className="mt-1">
              <label
                htmlFor="flight-number"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Flight Number
              </label>

              <input
                type="text"
                name="flight-number"
                id="flight-number"
                placeholder="Flight Number"
                autoComplete="given-name"
                className="block  my-px w-full m-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="plane-number"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Plane Number
              </label>

              <input
                type="text"
                name="plane-number"
                id="plane-number"
                placeholder="Plane Number"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="date"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Date
              </label>

              <input
                type="date"
                name="date"
                id="date"
                placeholder="Date"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="time"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Time
              </label>

              <input
                type="time"
                name="time"
                id="time"
                placeholder="Time"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="mt-1">
              <label
                htmlFor="passport-number"
                className="block ml-1 text-sm text-left font-medium leading-6 text-gray-900"
              >
                Passport No.
              </label>

              <input
                type="text"
                name="passport-number"
                id="passport-number"
                placeholder="Passport Number"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="desktop:mt-6 text-sm flex justify-left  laptop:px-32 desktop:px-40  tablet:px-24">
            Flight Destination
          </div>

          <div className="mt-1 flex flex-row justify-left  laptop:px-32 desktop:px-40  tablet:px-24">

            <div className="pr-2 py-1.5">From</div>
            <div className="pr-2">
              <input
                type="text"
                name="from-destination"
                id="from-destination"
                placeholder="From"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="pr-2 py-1.5">To</div>
            <div className="pr-2">
              <input
                type="text"
                name="to-destination"
                id="to-destination"
                placeholder="To"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="pl-6 pr-2 py-1.5">Duration</div>
            <div className="pr-2">
              <input
                type="time"
                name="duration"
                id="duration"
                placeholder="Time"
                autoComplete="given-name"
                className="block  my-px w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="grid w-auto grid-cols-2 gap-4 laptop:px-32 desktop:px-40 desktop:mt-4 tablet:px-24">
          <div className="mt-4 text-left">
            Depature
            <div className="grid w-auto grid-cols-2 gap-2">
            <div className="pr-2">
              <input
                type="date"
                name="date"
                id="date"
                placeholder="Date"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="pr-2">
              <input
                type="time"
                name="time"
                id="time"
                placeholder="Time"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            </div>
          </div>

          <div className="mt-4 text-left">
            Arrival
            <div className="grid w-auto grid-cols-2 gap-2">
            <div className="pr-2">
              <input
                type="date"
                name="date"
                id="date"
                placeholder="Date"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="pr-2">
              <input
                type="time"
                name="time"
                id="time"
                placeholder="Time"
                autoComplete="given-name"
                className="block  my-px w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            </div>
          </div>

          </div>


          <p className="desktop:mt-10 laptop:mt-14 tablet:mt-14 flex text-base  laptop:px-32 desktop:px-40  tablet:px-24">
            Note: Passenger ID will be auto generate by system. It will be a
            alphanumeric value of six characters.
          </p>

          <div className="desktop:mt-7 laptop:mt-14 tablet:mt-14 flex items-center justify-end gap-x-6 laptop:px-32 desktop:px-40  tablet:px-24">
            <a href="View/details">
              <button
                type="button"
                className="rounded-md bg-indigo-600 w-[39rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Passengers
              </button>
            </a>
            <button
              type="submit"
              className="rounded-md bg-lime-700 w-[39rem] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              Register Passengers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PassengersRegistration;
