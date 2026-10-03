export const THRONE_PAYMENT_URL = "https://throne.com/athenagoddess13";

export const handleCheckout = async (itemName, amount) => {
  try {
    // Redirect directly to Goddess Athena's official Throne payment link
    window.open(THRONE_PAYMENT_URL, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Payment redirection error:', error);
    alert('Redirecting to Throne payment link...');
    window.location.href = THRONE_PAYMENT_URL;
  }
};
