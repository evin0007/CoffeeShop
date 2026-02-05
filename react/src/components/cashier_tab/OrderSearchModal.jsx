import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);
const parseOrderString = (orderStr) => {
  return orderStr.split(',').map(item => {
    const parts = item.trim().split(' x');
    const name = parts[0];
    const rest = parts[1] ? parts[1].split(' ') : ['0', '0'];
    return {
      name: name,
      qty: rest[0],
      price: rest[1]
    };
  });
};

export const showOrderDetailsAlert = (order) => {
  const items = parseOrderString(order.all_order);

  return MySwal.fire({
    title: (
      <div className="pt-2 pb-1 border-b border-gray-100 w-full">
        <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Order Details</h2>
      </div>
    ),
    html: (
      <div className="text-left font-sans text-gray-800">
        <div className="flex justify-between items-center mb-4 mt-2 px-1">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Order Ref</p>
            <p className="text-sm font-bold text-gray-700">{order.code}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Server</p>
            <p className="text-sm font-bold text-gray-700">{order.staff}</p>
          </div>
        </div>
        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase bg-gray-50 px-2 py-1.5 rounded-t-lg border border-gray-100 border-b-0">
          <span>Items</span>
          <span>Price</span>
        </div>
        <div className="max-h-60 overflow-y-auto border border-gray-100 border-t-0 rounded-b-lg mb-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center px-2 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-gray-800 uppercase leading-tight">{item.name}</span>
                <span className="text-[11px] text-gray-500">Quantity: {item.qty}</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900">
                ₱{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
        <div className="px-1 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                order.status === 'completed' 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : 'bg-orange-50 text-orange-600 border-orange-200'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Total Amount</p>
              <p className="text-2xl font-black text-gray-900">
                ₱{parseFloat(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    confirmButtonColor: '#ffffff', 
    cancelButtonText: 'Go Back',
    cancelButtonColor: '#ffffff',
    reverseButtons: true,
    width: '500px',
    customClass: {
      popup: 'rounded-2xl shadow-2xl p-4',
      actions: 'flex gap-3 w-full mt-6',
      confirmButton: 'flex-1 py-2 text-sm w-30 bg-blue-500 font-bold rounded-xl border border-gray-200 text-white hover:bg-blue-700 order-1',
      cancelButton: 'flex-1 py-2 text-sm w-30 bg-green-500 font-bold rounded-xl border border-gray-200 text-white hover:bg-green-600 order-1'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      handlePaymentProcess(order);
    }
  });
};

const handlePaymentProcess = (order) => {
  MySwal.fire({
    title: 'Confirm Transaction',
    text: `Are you sure the payment is already done for this order?`,
    icon: 'question',
    width: '380px',
    showCancelButton: true,
    confirmButtonText: 'Yes, Done',
    confirmButtonColor: '#16a34a',
    cancelButtonText: 'No, Cancel',
    showLoaderOnConfirm: true,
    customClass: {
        popup: 'rounded-2xl p-6',
        confirmButton: 'px-6 py-2.5 text-sm font-bold rounded-xl',
        cancelButton: 'px-6 py-2.5 text-sm font-bold rounded-xl'
    },
    preConfirm: async () => {
      try {
        const response = await axios.post(window.location.origin + "/api/save-order", {
          code: order.code,
          staff: order.name,
          all_order: order.all_order,
          status: order.status,
          total_price: order.total_price
        });
        return response.data;
      } catch (error) {
        MySwal.showValidationMessage(`Error: ${error.response?.data?.message || 'Transaction Failed'}`);
      }
    },
    allowOutsideClick: () => !MySwal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      MySwal.fire({
        icon: 'success',
        title: 'Payment Successful',
        text: 'The order record has been updated.',
        width: '380px',
        confirmButtonColor: '#1f2937',
        customClass: { popup: 'rounded-2xl', confirmButton: 'px-8 py-2 rounded-lg' }
      });
    }
  });
};

export const showErrorAlert = (msg) => {
  MySwal.fire({ 
    icon: 'error', 
    title: 'Something went wrong', 
    text: msg,
    width: '380px',
    customClass: { popup: 'rounded-2xl' }
  });
};