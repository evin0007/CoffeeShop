import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const API_URL = window.location.origin + "/api/ratings";

export const showOrderSuccess = (orderCode) => {
  return MySwal.fire({
    html: (
      <div className="p-4 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce">✓</div>
        <h2 className="text-2xl font-black text-stone-800 mb-2 uppercase tracking-tight">Order Placed!</h2>
        <p className="text-stone-500 text-sm mb-6">Your order has been sent to the kitchen.</p>
        <div className="bg-stone-100 rounded-3xl p-6 border-2 border-dashed border-stone-300">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Your Order Code</p>
          <span className="text-5xl font-black text-stone-900 tracking-tighter">{orderCode}</span>
        </div>
        <p className="mt-6 text-[11px] font-bold text-amber-700 bg-amber-50 py-2 rounded-xl">
          📸 Please screenshot this screen for the cashier.
        </p>
      </div>
    ),
    showConfirmButton: true,
    confirmButtonText: 'CONTINUE',
    confirmButtonColor: '#1c1917',
    customClass: {
      popup: 'rounded-[32px] border-none shadow-2xl',
      confirmButton: 'rounded-2xl px-12 py-3 font-black text-xs tracking-widest'
    }
  });
};

export const showRatingModal = () => {
  let selectedRating = 0;

  return MySwal.fire({
    title: <p className="text-xl font-black text-stone-800 uppercase tracking-tight">Rate Your Experience</p>,
    html: (
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex justify-center gap-2 text-4xl" id="star-container">
          {[1, 2, 3, 4, 5].map((num) => (
            <button 
              key={num} 
              type="button"
              className="star-btn text-stone-200 transition-all duration-200 hover:scale-110 focus:outline-none"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={(e) => {
                selectedRating = num;
                const stars = e.currentTarget.parentElement.querySelectorAll('.star-btn');
                const label = document.getElementById('rating-label');
                const labels = ['Needs Improvement', 'Fair', 'Good', 'Very Good', 'Excellent!'];
                
                stars.forEach((s, i) => {
                  s.style.color = i < num ? '#f59e0b' : '#e7e5e4'; 
                });

                if (label) {
                  label.innerText = labels[num - 1];
                  label.style.color = '#b45309'; 
                }
              }}
            >★</button>
          ))}
        </div>
        <p id="rating-label" className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Tap stars to rate</p>
        <textarea
          id="swal-comment"
          className="w-full h-28 p-4 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 focus:outline-none placeholder:text-stone-300 transition-all"
          placeholder="Optional: How was your drink/meal?"
        ></textarea>
      </div>
    ),
    showCancelButton: true,
    confirmButtonText: 'SUBMIT FEEDBACK',
    confirmButtonColor: '#1c1917',
    cancelButtonColor: '#f5f4f1',
    customClass: {
      popup: 'rounded-[32px] border-none shadow-2xl',
      confirmButton: 'rounded-xl px-6 py-3 font-black text-xs tracking-widest',
      cancelButton: 'rounded-xl px-6 py-3 font-black text-xs tracking-widest text-stone-400'
    },
    preConfirm: () => {
      const comment = document.getElementById('swal-comment')?.value;
      if (selectedRating === 0) {
        Swal.showValidationMessage('Please select a star rating');
        return false;
      }
      return { rate: selectedRating, comment: comment };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      return fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.value)
      })
      .catch(() => {
        Swal.fire({ icon: 'error', title: 'Connection failed', text: 'Check if Laravel is running or CORS is blocked.' });
      });
    }
  });
};