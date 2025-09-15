import React, { useRef, useEffect, useState, useContext } from "react";
import { List, Spin, Input, Button, message } from "antd";
import { GlobalContext } from "../context/GlobalContext";

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
  const { grammar, loading } = useContext(GlobalContext);

  const [displayed, setDisplayed] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const pageSize = 10;

  useEffect(() => {
    if (grammar.length > 0) {
      setDisplayed(grammar.slice(0, pageSize));
    }
  }, [grammar]);

  useEffect(() => {
    if (page > 1 && grammar.length > 0) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setDisplayed((prev) => [...prev, ...grammar.slice(start, end)]);
    }
  }, [page, grammar]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          displayed.length < grammar.length
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
  }, [loading, displayed, grammar]);

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
        ) : displayed.length < grammar.length ? (
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
  const { searchGrammar, searchResult, loading } = useContext(GlobalContext);
  const [concept, setConcept] = useState("");

  const handleSearch = async () => {
    if (!concept.trim()) {
      message.warning("Please enter a concept to search.");
      return;
    }
    await searchGrammar(concept);
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

      {searchResult && !loading && (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 text-left hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            {searchResult.concept}
          </h3>
          <p className="mb-2">
            <span className="font-bold text-gray-800">Meaning:</span>{" "}
            {searchResult.meaning}
          </p>
          <p className="text-gray-700 mb-4">{searchResult.details}</p>

          {searchResult.examples && searchResult.examples.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-pink-600 mb-2">
                Examples:
              </h4>
              <ul className="list-disc list-inside space-y-4">
                {searchResult.examples.map((ex, idx) => (
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
