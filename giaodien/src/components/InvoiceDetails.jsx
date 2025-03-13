import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(response.data);
      setStatus(response.data.status);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      alert('Failed to load invoice details!');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/invoices/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Invoice status updated successfully!');
      fetchInvoiceDetails();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update invoice status!');
    }
  };

  const canEditInvoice = localStorage.getItem('role') === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Invoice Details
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
          </div>
        ) : invoice ? (
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform transition-all hover:shadow-2xl">
            {/* Event Information */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Event: {invoice.event.name}
              </h3>
              <p className="text-gray-600 mt-1">
                Date: {new Date(invoice.event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-gray-600">Location: {invoice.event.location}</p>
            </div>

            {/* Service Details */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Service Details</h4>
              <div className="space-y-4">
                {invoice.services.map((service) => (
                  <div
                    key={service.service._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <span className="text-gray-700 font-medium">{service.service.name}</span>
                    <span className="text-gray-600">
                      {service.quantity} × {service.price.toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Status */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Invoice Status</h4>
              {canEditInvoice ? (
                <div className="space-y-4">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    className="w-full px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow-md hover:bg-indigo-700 transition-all duration-200"
                  >
                    Update Status
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  You don’t have permission to edit the status of this invoice.
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-indigo-600">
                {invoice.totalAmount.toLocaleString()} VND
              </span>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate('/eventlist')}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold shadow-md hover:bg-gray-300 transition-all duration-200"
              >
                Back to Event List
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
            <p>No invoice found!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;