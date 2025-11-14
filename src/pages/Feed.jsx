import { useEffect, useState } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import InfographicCard from "../components/cards/InfographicCard";
import CarouselCard from "../components/cards/CarouselCard";
import { TeachersNotes } from "../data/TeachersNotes";

const DemoGrid = styled.div`
  min-height: 100vh;
  place-items: center;
  padding: 1px;
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
`;

const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
`;

const lc = (v) => (typeof v === "string" ? v.toLowerCase() : String(v ?? "").toLowerCase());

const getBookMeta = () => {
  try {
    const cookie = JSON.parse(Cookies.get("piLearnData") || "{}");
    const { teacherId, bookId } = cookie;

    if (!teacherId || !bookId) return null;

    const teacher = TeachersNotes.find(
      (t) => lc(t.teacherId) === lc(teacherId)
    );
    if (!teacher) return null;

    const book = teacher.teacherMetadata?.find(
      (b) => lc(b.bookId) === lc(bookId)
    );
    if (!book) return null;

    return Array.isArray(book.bookMetadata) ? book.bookMetadata : null;
  } catch (e) {
    console.warn("Error reading cookie:", e);
    return null;
  }
};

export default function Feed() {
  const [bookMeta, setBookMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // simulate async fetching (for loader)
    const fetchData = async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 400));
      const data = getBookMeta();
      setBookMeta(data);
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

      {/* Your cards section */}
      <DemoGrid>
        <div className="d-flex gap-3 flex-column align-items-center mt-3">
          {!loading && !bookMeta && (
            <div className="alert alert-warning w-100 text-center">
              No book data found.
            </div>
          )}

          {!loading &&
            bookMeta &&
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
