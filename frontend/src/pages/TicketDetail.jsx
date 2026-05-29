import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function TicketDetail() {

  const { ticketId } = useParams();

  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  const [status, setStatus] = useState("");

  const [notes, setNotes] = useState("");

  const fetchTicket = async () => {

    try {

      const response = await API.get(
        `/tickets/${ticketId}`
      );

      setTicket(response.data);

      setStatus(response.data.status);

      setNotes(response.data.notes || "");

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    fetchTicket();

  }, []);

  const handleUpdate = async () => {

    try {

      await API.put(
        `/tickets/${ticketId}`,
        {
          status,
          notes
        }
      );

      alert("Ticket Updated Successfully");

      navigate("/");

    } catch (error) {

      console.error(error);

      alert("Error updating ticket");

    }
  };

  if (!ticket) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Ticket Details
      </h1>

      <div className="
        bg-white
        shadow-lg
        rounded-lg
        p-8
      ">

        <div className="mb-4">

          <p className="text-gray-500">
            Ticket ID
          </p>

          <h2 className="text-2xl font-bold">
            {ticket.ticket_id}
          </h2>

        </div>

        <div className="mb-4">

          <p className="text-gray-500">
            Customer Name
          </p>

          <p className="text-lg">
            {ticket.customer_name}
          </p>

        </div>

        <div className="mb-4">

          <p className="text-gray-500">
            Customer Email
          </p>

          <p className="text-lg">
            {ticket.customer_email}
          </p>

        </div>

        <div className="mb-4">

          <p className="text-gray-500">
            Subject
          </p>

          <p className="text-lg">
            {ticket.subject}
          </p>

        </div>

        <div className="mb-6">

          <p className="text-gray-500">
            Description
          </p>

          <p className="text-lg">
            {ticket.description}
          </p>

        </div>

        {/* Status */}

        <div className="mb-6">

          <label className="
            block
            mb-2
            font-semibold
          ">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="
              border
              p-3
              rounded
              w-full
            "
          >

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

        {/* Notes */}

        <div className="mb-6">

          <label className="
            block
            mb-2
            font-semibold
          ">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="
              border
              p-3
              rounded
              w-full
              h-32
            "
          />

        </div>

        <div className="flex gap-4">

          <button
            onClick={handleUpdate}
            className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded
              hover:bg-blue-700
            "
          >
            Update Ticket
          </button>

          <button
            onClick={() => navigate("/")}
            className="
              bg-gray-300
              px-6
              py-3
              rounded
            "
          >
            Back
          </button>

        </div>

      </div>

      {/* History Table */}

<div className="
  bg-white
  shadow-lg
  rounded-lg
  p-8
  mt-8
">

  <h2 className="text-2xl font-bold mb-6">
    Ticket History
  </h2>

  <table className="w-full">

    <thead className="bg-gray-100">

      <tr>

        <th className="p-4 text-left">
          Status
        </th>

        <th className="p-4 text-left">
          Notes
        </th>

        <th className="p-4 text-left">
          Updated At
        </th>

      </tr>

    </thead>

    <tbody>

      {ticket.history?.map((item, index) => (

        <tr
          key={index}
          className="border-t"
        >

          <td className="p-4">
            {item.status}
          </td>

          <td className="p-4">
            {item.notes}
          </td>

          <td className="p-4">
            {new Date(item.updated_at)
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-")}

            {" "}

            {new Date(item.updated_at)
              .toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

    </div>
  );
}

export default TicketDetail;