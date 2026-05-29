import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Home() {

  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [aiCommand, setAiCommand] = useState("");

const [aiResponse, setAiResponse] = useState("");

const [loadingAI, setLoadingAI] = useState(false);

const startVoiceCommand = () => {

  const recognition =
    new window.webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = async (event) => {

    const transcript =
      event.results[0][0].transcript;

    setAiCommand(transcript);

    try {

      setLoadingAI(true);

      const response = await API.post(
        "/ai/ai-command",
        {
          message: transcript
        }
      );

      if (response.data.message) {

  setAiResponse(response.data.message);

} else if (response.data.tickets) {

  if (response.data.tickets.length === 0) {

    setAiResponse("No tickets found");

  } else {

    const formattedTickets =
      response.data.tickets
        .map(
          (ticket) =>
            `${ticket.ticket_id} | ${ticket.customer_name} | ${ticket.customer_email} | ${ticket.subject} | ${ticket.status}`
        )
        .join("\n");

    setAiResponse(formattedTickets);
  }
}

      fetchTickets();

    } catch (error) {

      console.error(error);

      setAiResponse("Voice AI command failed");

    } finally {

      setLoadingAI(false);

    }
  };
};

const handleAICommand = async () => {

  if (!aiCommand) return;

  try {

    setLoadingAI(true);

    const response = await API.post(
      "/ai/ai-command",
      {
        message: aiCommand
      }
    );

    if (response.data.message) {

  if (response.data.message) {

  if (response.data.message) {

  setAiResponse(response.data.message);

} else if (response.data.tickets) {

  if (response.data.tickets.length === 0) {

    setAiResponse("No tickets found");

  } else {

    const formattedTickets =
      response.data.tickets
        .map(
          (ticket) =>
            `${ticket.ticket_id} | ${ticket.customer_name} | ${ticket.customer_email} | ${ticket.subject} | ${ticket.status}`
        )
        .join("\n");

    setAiResponse(formattedTickets);
  }
}

} else if (response.data.tickets) {

  if (response.data.tickets.length === 0) {

    setAiResponse("No tickets found");

  } else {

    const formattedTickets =
      response.data.tickets
        .map(
          (ticket) =>
            `${ticket.ticket_id} | ${ticket.customer_name} | ${ticket.customer_email} | ${ticket.subject} | ${ticket.status}`
        )
        .join("\n");

    setAiResponse(formattedTickets);
  }
}

} else if (response.data.tickets) {

  if (response.data.tickets.length === 0) {

    setAiResponse("No tickets found");

  } else {

    const formattedTickets =
      response.data.tickets
        .map(
          (ticket) =>
            `${ticket.ticket_id} | ${ticket.customer_name}| ${ticket.customer_email} | ${ticket.subject} | ${ticket.status}`
        )
        .join("\n");

    setAiResponse(formattedTickets);
  }
}

    setAiCommand("");

    fetchTickets();

  } catch (error) {

    console.error(error);

    setAiResponse("AI command failed");

  } finally {

    setLoadingAI(false);

  }
};



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

{/* AI Assistant */}

<div className="
  bg-white
  p-6
  rounded-xl
  shadow
  mb-6
">

  <h2 className="
    text-2xl
    font-bold
    mb-4
  ">
    AI CRM Assistant
  </h2>

  <div className="flex gap-3">

    <input
      type="text"
      placeholder="Type AI command..."
      value={aiCommand}
      onChange={(e) =>
        setAiCommand(e.target.value)
      }
      className="
        border
        p-3
        rounded-lg
        w-full
      "
    />
<button
  onClick={startVoiceCommand}
  className="
    bg-green-600
    text-white
    px-5
    rounded-lg
    hover:bg-green-700
  "
>
  🎤
</button>
    <button
      onClick={handleAICommand}
      className="
        bg-purple-600
        text-white
        px-6
        rounded-lg
        hover:bg-purple-700
      "
    >
      {loadingAI ? "Thinking..." : "Ask AI"}
    </button>

  </div>

  {aiResponse && (

    <div className="
      mt-4
      bg-gray-100
      p-4
      rounded-lg
    ">

     <pre className="
      whitespace-pre-wrap
      font-medium
    ">
      {aiResponse}
    </pre>

    </div>

  )}

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