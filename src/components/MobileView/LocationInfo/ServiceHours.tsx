import React, { useEffect, useState } from 'react';
// import { useParams } from "react-router-dom";

const ServiceHours: React.FC = () => {

  const [restaurantTiming, setRestaurantTiming] = useState<any[]>([]);
  // const { restaurantName } = useParams<{ restaurantName: string }>();
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRestaurantInfo = async () => {
    const wpToken = localStorage.getItem("guest_wptoken");

    if (!wpToken) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/customer/restaurant/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wpToken}`,
        },
      });

      const data = await response.json();

      if (data.status === 1) {
        setRestaurantInfo(data.data.restaurantData);
      } else {
        setError("Failed to fetch restaurant info");
      }
    } catch (err: any) {
      setError("Something went wrong while fetching restaurant info");
    }
  };

  useEffect(() => {
    const wpToken = localStorage.getItem('guest_wptoken');
    const fetchRestaurantTiming = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/restaurant/timing/data`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${wpToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant timing data");
        }

        const data = await response.json();

        if (data.status === 1) {
          setRestaurantTiming(data?.data?.restaurantTimingData || []);
        } else {
          throw new Error(data.message || "Error fetching restaurant timings");
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantInfo();
    fetchRestaurantTiming();
  }, []);

  if (loading) {
    return (
      <div>
        <img
          src="/Content/MobileView/Images/mobileView_loader.gif"
          alt="Loader"
          className="w-2"
          style={{
            alignItems: "center",
            position: "fixed",
            top: "50%",
            width: "15%",
            left: "40%",
          }}
        />
      </div>
    );
  }
  
  if (error) return <div>Error: {error}</div>;

  return (
    <div id="LocationDetailsMobileView" className="">
      <div className="user-detail">
        <div className="container-fluid px-0">
          <div className="user-row">
            <div className="user-col1">
              <div className="inner-div">
                <div id="RestaurantImage" className="home-icon">
                  <img
                    src={restaurantInfo?.RestaurantIconImage_URL || ""} alt="Restaurant"
                  />
                </div>
              </div>
            </div>
            <div className="user-col2">
              <div className="user-div">
                <h5 className="name-div">{restaurantInfo?.TradingName || "--"}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="ServiceHoursMobileView" className="">
        {/* table=detail */}
        <div className="flex min-h-screen  justify-center bg-white">
          <div className="p-6 overflow-scroll px-0">
            <table className="w-full min-w-max table-auto text-left" style={{ border: "none !important" }}>
              <thead>
                <tr>
                  <th scope="col" className="!border-y !border-blue-gray-100 bg-slate-500  p-3" > Days</th>
                  <th scope="col" className="border-y border-blue-gray-100 bg-slate-500  p-3" >Timings</th>
                </tr>
              </thead>
              <tbody id="mobileServiceHoursBody">

                {restaurantTiming.map((item, index) => (
                  <tr key={item.Id}>
                    <td className={`!p-3 !border-b-2 border-blue-50 ${index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'} text-black`}><span className='text-lg font-semibold'>{item.DayName}</span></td>
                    {item.OpeningTime_12HoursFormat && (<td className={`!py-1 !px-2 border-b ${index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'} border-blue-gray-50`}><span className='font-bold '><span className='!relative  !items-center !font-sans !font-bold !uppercase !whitespace-nowrap !select-none !bg-green-500/20 !text-green-900 !py-1 !px-2 !text-xs !rounded-md'>{item.OpeningTime_12HoursFormat}</span> To <span className='!relative  !items-center !font-sans !font-bold !uppercase !whitespace-nowrap !select-none !bg-green-500/20 !text-green-900 !py-1 !px-2 !text-xs !rounded-md'>{item.ClosingTime_12HoursFormat}</span></span></td>)
                      || <td className={`!py-1 !px-2 !border-b-2 border-blue-50 !border-blue-gray-50 ${index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}`}><div className="w-max">
                        <div className="!relative !grid !items-center !font-sans !font-bold !uppercase !whitespace-nowrap !select-none !bg-red-500/20 !text-red-900 !py-1 !px-2 !text-xs !rounded-md" style={{ opacity: "1" }}>
                          <span className="">Closed</span>
                        </div>
                      </div></td>
                    }
                    {/* <td>{item.ClosingTime_12HoursFormat }</td> */}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ServiceHours