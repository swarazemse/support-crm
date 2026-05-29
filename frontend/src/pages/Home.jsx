import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Home() {

  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const fetchTickets = async () => {

    try {

      let url = "/tickets?";

      if (search) {
        url += `search=${search}&`;
      }

      if (status) {
        url += `status=${status}`;
      }

      const response = await API.get(url);

      setTickets(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    fetchTickets();

  }, [search, status]);

  const getStatusColor = (ticketStatus) => {

    if (ticketStatus === "Open") {
      return "bg-red-100 text-red-700";
    }

    if (ticketStatus === "In Progress") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (

    <div className="p-10 bg-gray-50 min-h-screen">

     <div className="flex items-center justify-between mb-6 w-full">

        <h1 className="text-4xl font-bold">
          Support CRM Dashboard
        </h1>
        <div className="flex items-center gap-2 ml-auto">
        <Link
          to="/create"
          className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-lg
            hover:bg-blue-700
          "
        >
          + Create Ticket
        </Link>

         <button
             onClick={() => {

            localStorage.clear();

            window.location.href = "/login";
            }}
              className="
              bg-red-600
              text-white
              px-5
              py-3
              rounded-lg
              hover:bg-red-700
            "
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search + Filter */}

      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            border
            p-3
            rounded-lg
            w-full
            bg-white
          "
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            border
            p-3
            rounded-lg
            bg-white
          "
        >

          <option value="">
            All Status
          </option>

          <option value="Open">
            Open
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Closed">
            Closed
          </option>

        </select>

      </div>

      {/* Ticket Table */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Ticket ID
              </th>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Subject
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>
            {tickets.length === 0 && (
            <tr>
                <td
                    colSpan="4"
                    className="p-10 text-center text-gray-500"
                >
                No tickets found
                </td>
             </tr>
            )}

            {tickets.map((ticket) => (

                <tr
                key={ticket.ticket_id}
                className="
                    border-t
                    hover:bg-gray-50
                    cursor-pointer
                "
                onClick={() =>
                    window.location.href =
                    `/ticket/${ticket.ticket_id}`
                }
                >   

                <td className="p-4 font-medium">
                  {ticket.ticket_id}
                </td>

                <td className="p-4">
                  {ticket.customer_name}
                </td>

                <td className="p-4">
                  {ticket.subject}
                </td>

                <td className="p-4">

                  <span className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ${getStatusColor(ticket.status)}
                  `}>
                    {ticket.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Home;