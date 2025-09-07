import React, { useState, useEffect, useRef } from "react";
import { List, Spin } from "antd";
import GrammarCard from "./GrammarCard";

const GrammarList = () => {
  const [allGrammars, setAllGrammars] = useState([]); // full dataset
  const [displayed, setDisplayed] = useState([]);     // currently shown
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const pageSize = 10;

  // fetch all grammars once
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api/grammar"
        );
        const data = await res.json();

        // ✅ reverse order so newest/last ID comes first
        const reversed = data.reverse();

        setAllGrammars(reversed);
        setDisplayed(reversed.slice(0, pageSize)); // first 10
      } catch (e) {
        console.error("Error fetching grammars:", e);
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

  // load next batch when page changes
  useEffect(() => {
    if (page > 1 && allGrammars.length > 0) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setDisplayed((prev) => [...prev, ...allGrammars.slice(start, end)]);
    }
  }, [page, allGrammars]);

  // intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          displayed.length < allGrammars.length
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, displayed, allGrammars]);

  return (
    <div>
      <List
        dataSource={displayed}
        renderItem={(grammar) => (
          <List.Item>
            <GrammarCard grammar={grammar} />
          </List.Item>
        )}
      />

      {/* loader sentinel */}
      <div ref={loaderRef} style={{ textAlign: "center", padding: 20 }}>
        {loading ? <Spin /> : displayed.length < allGrammars.length ? "Scroll down to load more..." : "No more items"}
      </div>
    </div>
  );
};

export default GrammarList;
