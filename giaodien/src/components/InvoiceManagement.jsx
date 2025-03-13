import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/invoices", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvoices(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load invoice list! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Invoice deleted successfully!");
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== invoiceId)
      );
    } catch (error) {
      alert("Unable to delete invoice! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (invoice) => {
    if (invoice.status === "Paid") {
      alert("This invoice has already been paid!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/payments/momo/create",
        { invoiceId: invoice._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Unable to create payment transaction. Please try again later.");
      }
    } catch (error) {
      alert("An error occurred during payment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Invoice Management
        </h2>

        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform transition-all hover:shadow-2xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
              <p>{error}</p>
            </div>
          ) : invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left text-sm">
                <thead>
                  <tr className="bg-indigo-50 text-indigo-700 font-semibold">
                    <th className="py-4 px-6 rounded-tl-lg">Invoice ID</th>
                    <th className="py-4 px-6">Event Name</th>
                    <th className="py-4 px-6">Total Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr
                      key={invoice._id}
                      className={`border-t hover:bg-gray-50 transition-all duration-200 ${
                        index === invoices.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-700">{invoice._id}</td>
                      <td className="py-4 px-6 text-gray-700">
                        {invoice.event?.name || "Not specified"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {invoice.totalAmount?.toLocaleString() || 0} VND
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.status === "Canceled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {invoice.status || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 flex gap-3">
                        <button
                          onClick={() => handleViewInvoice(invoice._id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-all duration-200"
                          aria-label="View invoice details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-200"
                          aria-label="Delete invoice"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handlePayment(invoice)}
                          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                            invoice.status === "Paid"
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-yellow-500 text-white hover:bg-yellow-600"
                          }`}
                          aria-label="Pay invoice"
                          disabled={invoice.status === "Paid"}
                        >
                          Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500 italic">
              No invoices found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;