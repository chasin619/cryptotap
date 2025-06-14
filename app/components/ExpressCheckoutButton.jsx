export default function ExpressCheckoutButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center space-x-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24">
          <path d="M19.667 13.385c-.026-2.612 2.137-3.87 2.24-3.938-1.22-1.78-3.11-2.024-3.78-2.05-1.61-.162-3.14.95-3.95.95-.82 0-2.07-.926-3.42-.9-1.75.025-3.37 1.022-4.27 2.6-1.83 3.165-.47 7.835 1.3 10.4.86 1.23 1.88 2.61 3.22 2.56 1.29-.05 1.78-.83 3.34-.83 1.56 0 1.99.83 3.35.8 1.39-.03 2.27-1.25 3.11-2.48.99-1.43 1.39-2.82 1.41-2.89-.03-.01-2.69-1.03-2.72-4.27z" />
        </svg>
        <span className="text-base font-medium">Express Checkout</span>
      </button>
    );
  }
  