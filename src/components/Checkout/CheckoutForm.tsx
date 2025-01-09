import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Create a Payment Method
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    // if (error) {
    //   setError(error.message || 'Payment failed');
    // } else {
    //   const response = await fetch('/create-payment-intent', { 
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    //   });

    //   const data = await response.json();
    //   if (data.clientSecret) {
    //     const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret);
    //     if (confirmError) setError(confirmError.message);
    //     else alert('Payment successful!');
    //   }
    // }
    if (error) {
      setError(error.message || 'Payment failed');
    } else {
      const clientSecret = `${import.meta.env.VITE_STRIPE_SECRET_KEY}`; 
      const staticPaymentMethodId = 'pm_1F7OQz2eZvKYlo2C6XXeFMXX'; 
      const paymentMethod = {
        id: staticPaymentMethodId,
      };
      // const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        alert('Payment successful!');
      }
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header text-center" style={{ backgroundColor: '#1b5703', color: 'white' }}>
              <h5>Complete Your Payment</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="card-element" className="form-label">
                    Credit or Debit Card
                  </label>
                  <CardElement id="card-element" className="form-control" />
                </div>
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn" 
                    style={{ backgroundColor: '#1b5703', color: 'white' }} 
                    disabled={loading || !stripe}
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </form>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
