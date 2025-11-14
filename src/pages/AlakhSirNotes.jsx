import { useEffect, useState } from "react";
import styled from "styled-components";
import { RotatingLines } from "react-loader-spinner";
import InfographicCard from "../components/cards/InfographicCard";
import CarouselCard from "../components/cards/CarouselCard";
import { Alakhsirnotes } from "../data/TeachersNotes";

const DemoGrid = styled.div`
  min-height: 100vh;
  padding: 1rem;
  background: radial-gradient(
      40% 60% at 20% 10%,
      rgba(99, 102, 241, 0.18) 0%,
      transparent 60%
    ),
    radial-gradient(
      40% 60% at 80% 0%,
      rgba(56, 189, 248, 0.18) 0%,
      transparent 60%
    ),
    #f8fafc;

  display: block; /* so content starts from top */
`;

const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
`;

export default function AlakhSirNotes() {
  const [bookMeta, setBookMeta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const fetchData = async () => {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 400));

      const meta = Array.isArray(Alakhsirnotes) ? Alakhsirnotes : [];
      setBookMeta(meta);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && (
        <LoaderOverlay>
          <div className="d-flex flex-column align-items-center gap-3">
            <RotatingLines
              visible={true}
              height="80"
              width="80"
              color="#393939"
              strokeWidth="4"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
            <div className="text-muted">Loading content...</div>
          </div>
        </LoaderOverlay>
      )}

      <DemoGrid>
        <div className="d-flex gap-3 flex-column align-items-center mt-3 w-100">
          {!loading && bookMeta.length === 0 && (
            <div className="alert alert-warning w-100 text-center">
              No book data found.
            </div>
          )}

          {!loading &&
            bookMeta.map((item) => (
              <div key={item.id} style={{ width: "100%" }}>
                {item.type === "infografic" || item.type === "videoClip" ? (
                  <InfographicCard icon={item.icon} data={item} />
                ) : item.type === "carousel" ? (
                  <CarouselCard icon={item.icon} data={item} />
                ) : null}
              </div>
            ))}
        </div>
      </DemoGrid>
    </>
  );
}
