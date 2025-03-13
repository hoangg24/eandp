import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Invoice = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canCreateInvoice, setCanCreateInvoice] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const eventData = response.data;
      setEvent(eventData);

      const tempInvoice = {
        event: {
          name: eventData.name,
          date: eventData.date,
          location: eventData.location,
        },
        services: eventData.services.map((service) => ({
          name: service.service.name,
          price: service.service.price,
          quantity: service.quantity,
        })),
        totalAmount: eventData.services.reduce(
          (total, service) => total + service.service.price * service.quantity,
          0
        ),
      };

      setInvoice(tempInvoice);

      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('role');
      const hasPermission =
        userRole === 'admin' || eventData.isPublic || eventData.createdBy === userId;

      setCanCreateInvoice(hasPermission);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Failed to load event details!');
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/invoices/create',
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Invoice created successfully!');
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Temporary Invoice Preview
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
          </div>
        ) : event && invoice ? (
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform transition-all hover:shadow-2xl">
            {/* Event Info */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">{invoice.event.name}</h3>
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

            {/* Services List */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Services</h4>
              <div className="space-y-4">
                {invoice.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <span className="text-gray-700 font-medium">{service.name}</span>
                    <span className="text-gray-600">
                      {service.quantity} × {service.price.toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-indigo-600">
                {invoice.totalAmount.toLocaleString()} VND
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => navigate('/eventlist')}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold shadow-md hover:bg-gray-300 transition-all duration-200"
              >
                Back to Events
              </button>
              {canCreateInvoice ? (
                <button
                  onClick={handleCreateInvoice}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow-md hover:bg-indigo-700 transition-all duration-200"
                >
                  Create Official Invoice
                </button>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  You don’t have permission to create an invoice for this event.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center bg-red-50 text-red-600 p-6 rounded-lg shadow-md">
            <p>No invoice information found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;