import Layout from "@/components/layout";
import RequireAuth from "@/components/RequireAuth";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const handleBookTickets = () => {
    router.push("/BookingForm"); // Redirect to booking page on button click
  };

  return (
    <RequireAuth>
      <Layout>
        <div className="home">
          <h1 className="heading">Welcome to Bus Booking</h1>
          <p className="description">
            Book your bus tickets with ease and comfort. Quick, reliable, and hassle-free.
          </p>

          <button className="book-button" onClick={handleBookTickets}>
            Book Tickets
          </button>
        </div>

        <style jsx>{`
          .home {
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .heading {
            font-size: 3rem;
            margin-bottom: 16px;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
          }

          .description {
            font-size: 1.25rem;
            max-width: 480px;
            margin-bottom: 40px;
            opacity: 0.85;
          }

          .book-button {
            background-color: #ff5f6d;
            background-image: linear-gradient(45deg, #ff5f6d 0%, #ffc371 100%);
            border: none;
            padding: 15px 50px;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 50px;
            color: white;
            cursor: pointer;
            box-shadow: 0 6px 12px rgba(255, 95, 109, 0.5);
            transition: all 0.3s ease;
          }

          .book-button:hover {
            background-image: linear-gradient(45deg, #ffc371 0%, #ff5f6d 100%);
            box-shadow: 0 8px 16px rgba(255, 195, 113, 0.7);
            transform: translateY(-3px);
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}
