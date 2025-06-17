import Layout from "@/components/layout";
import RequireAuth from "@/components/RequireAuth";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

 
  return (
    <RequireAuth>
      <Layout>
        <div className="home-bg">
          <div className="home-card">
            <span className="bus-emoji" role="img" aria-label="bus"></span>
            <h1 className="heading">Welcome to Quick Bus </h1>
            <p className="description">
              Book your bus tickets with ease and comfort.<br />
              <span className="highlight">Quick, reliable, and hassle-free.</span>
            </p>
           
          </div>
        </div>

        <style jsx>{`
          .home-bg {
            min-height: 85vh;
            background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
          }
          .home-card {
            background: rgba(255,255,255,0.92);
            box-shadow: 0 8px 32px 0 rgba(37,99,235,0.13);
            border-radius: 28px;
            padding: 54px 38px 44px;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 500px;
            width: 100%;
            position: relative;
            animation: fadeIn 1.2s cubic-bezier(.23,1.02,.64,.97);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: none;}
          }
          .bus-emoji {
            font-size: 3.5rem;
            margin-bottom: 12px;
            animation: bounce 2.5s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-12px);}
          }
          .heading {
            font-size: 2.6rem;
            margin-bottom: 18px;
            color: #2563eb;
            font-weight: 800;
            text-shadow: 1px 1px 8px #e0e7ff99;
            letter-spacing: 0.5px;
            text-align: center;
          }
          .description {
            font-size: 1.2rem;
            max-width: 400px;
            margin-bottom: 38px;
            opacity: 0.92;
            color: #334155;
            text-align: center;
            line-height: 1.6;
          }
          .highlight {
            color: #ff5f6d;
            font-weight: 600;
          }
          .book-button {
            background: linear-gradient(45deg, #ff5f6d 0%, #ffc371 100%);
            border: none;
            padding: 15px 50px;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 50px;
            color: white;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(255, 95, 109, 0.18);
            transition: all 0.3s cubic-bezier(.4,2,.6,1);
            letter-spacing: 1px;
          }
          .book-button:hover {
            background: linear-gradient(45deg, #ffc371 0%, #ff5f6d 100%);
            box-shadow: 0 8px 24px rgba(255, 195, 113, 0.22);
            transform: translateY(-3px) scale(1.04);
          }
          @media (max-width: 600px) {
            .home-card {
              padding: 24px 8vw 18px;
            }
            .heading {
              font-size: 1.6rem;
            }
            .description {
              font-size: 1rem;
            }
            .book-button {
              padding: 12px 30px;
              font-size: 1rem;
            }
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}
