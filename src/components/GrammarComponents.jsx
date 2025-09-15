import React, { useState, useEffect, useRef } from "react";
import { Card, Typography, List, Spin, Input, Button, message } from "antd";

const { Title, Paragraph } = Typography;

// ============ GrammarCard =============
const GrammarCard = ({ grammar }) => {
  if (!grammar) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 transition hover:shadow-xl">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        {grammar.concept}
      </h3>
      <p className="mb-2">
        <span className="font-bold text-gray-800">Meaning:</span>{" "}
        {grammar.meaning}
      </p>
      <p className="text-gray-700 mb-4">{grammar.details}</p>

      {grammar.examples && (
        <div>
          <h4 className="text-lg font-medium text-pink-600 mb-2">Examples:</h4>
          <ul className="list-disc list-inside space-y-4">
            {grammar.examples.map((ex, idx) => (
              <li key={idx} className="leading-relaxed">
                <p>
                  <span className="font-bold">{ex.japanese}</span>{" "}
                  <span className="italic text-gray-600">({ex.romaji})</span>
                  <br /> <span className="text-green-700">→ {ex.english}</span>
                </p>

                {ex.vocab && ex.vocab.length > 0 && (
                  <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                    {ex.vocab.map((v, vIdx) => (
                      <li key={vIdx}>
                        <em>{v.word}</em> ({v.romaji}) - {v.meaning}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ============ GrammarList (infinite scroll) ============
const GrammarList = () => {
  const [allGrammars, setAllGrammars] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api/grammar"
        );
        const data = await res.json();
        const reversed = data.reverse();
        setAllGrammars(reversed);
        setDisplayed(reversed.slice(0, pageSize));
      } catch (e) {
        console.error("Error fetching grammars:", e);
      }
      setLoading(false);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (page > 1 && allGrammars.length > 0) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setDisplayed((prev) => [...prev, ...allGrammars.slice(start, end)]);
    }
  }, [page, allGrammars]);

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

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, displayed, allGrammars]);

  return (
    <div className="mt-6">
      <List
        dataSource={displayed}
        renderItem={(grammar) => (
          <List.Item>
            <GrammarCard grammar={grammar} />
          </List.Item>
        )}
      />
      <div
        ref={loaderRef}
        className="text-center py-6 text-gray-600 font-medium"
      >
        {loading ? (
          <Spin />
        ) : displayed.length < allGrammars.length ? (
          "⬇ Scroll down to load more..."
        ) : (
          "🎉 You’ve reached the end!"
        )}
      </div>
    </div>
  );
};

// ============ GrammarSearch ============
const GrammarSearch = () => {
  const [concept, setConcept] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!concept.trim()) {
      message.warning("Please enter a concept to search.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api/gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concept }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch grammar details");

      const data = await res.json();
      setResult(data.geminiData || null);
    } catch (err) {
      console.error(err);
      message.error("Error fetching grammar details.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto text-center my-8">
      <div className="flex gap-2">
        <Input
          placeholder="Enter a grammar concept (e.g., Verb て-form)"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onPressEnter={handleSearch}
          className="rounded-lg"
        />
        <Button
          type="primary"
          onClick={handleSearch}
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Search
        </Button>
      </div>

      {loading && <Spin className="mt-6" />}

      {result && !loading && (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 text-left hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            {result.concept}
          </h3>
          <p className="mb-2">
            <span className="font-bold text-gray-800">Meaning:</span>{" "}
            {result.meaning}
          </p>
          <p className="text-gray-700 mb-4">{result.details}</p>

          {result.examples && result.examples.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-pink-600 mb-2">
                Examples:
              </h4>
              <ul className="list-disc list-inside space-y-4">
                {result.examples.map((ex, idx) => (
                  <li key={idx}>
                    <span className="font-bold">{ex.japanese}</span>{" "}
                    <span className="italic text-gray-600">({ex.romaji})</span>
                    <br />
                    <span className="text-green-700">{ex.english}</span>
                    {ex.vocab && ex.vocab.length > 0 && (
                      <ul className="list-disc list-inside ml-6 mt-2 text-gray-700">
                        {ex.vocab.map((v, vIdx) => (
                          <li key={vIdx}>
                            {v.word} ({v.romaji}) - {v.meaning}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { GrammarList, GrammarSearch };
