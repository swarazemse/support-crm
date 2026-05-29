import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateTicket() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/tickets", formData);

      alert("Ticket Created Successfully");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Error creating ticket");
    }
  };

  return (

    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Create Support Ticket
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8"
      >

        <div className="mb-4">

          <label className="block mb-2 font-semibold">
            Customer Name
          </label>

          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

        </div>

        <div className="mb-4">

          <label className="block mb-2 font-semibold">
            Customer Email
          </label>

          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

        </div>

        <div className="mb-4">

          <label className="block mb-2 font-semibold">
            Subject
          </label>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

        </div>

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded h-32"
            required
          />

        </div>

        <button
          type="submit"
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
            hover:bg-blue-700
          "
        >
          Create Ticket
        </button>

      </form>

    </div>
  );
}

export default CreateTicket;