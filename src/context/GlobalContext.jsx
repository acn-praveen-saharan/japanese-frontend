import React, { createContext, useState, useEffect } from "react";
import { message } from "antd";

export const GlobalContext = createContext();

const BASE_URL =
  "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api";

export const GlobalProvider = ({ children }) => {
  // 🔹 Global States
  const [grammar, setGrammar] = useState([]);
  const [kanji, setKanji] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 On-demand States
  const [searchResult, setSearchResult] = useState(null);
  const [kanjiDetails, setKanjiDetails] = useState(null);

  // ----------- Fetch Grammar List -----------
  const fetchGrammar = async () => {
    try {
      const res = await fetch(`${BASE_URL}/grammar`);
      const data = await res.json();
      setGrammar(data.reverse());
    } catch (e) {
      console.error("Error fetching grammar:", e);
    }
  };

  // ----------- Fetch Kanji List -----------
  const fetchKanji = async () => {
    try {
      const res = await fetch(`${BASE_URL}/kanji`);
      const data = await res.json();
      setKanji(data);
    } catch (e) {
      console.error("Error fetching kanji:", e);
    }
  };

  // ----------- Fetch Grammar Search (Gemini) -----------
  const searchGrammar = async (concept) => {
    if (!concept) {
      message.warning("Please enter a concept to search.");
      return;
    }

    setLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch(`${BASE_URL}/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept }),
      });

      if (!res.ok) throw new Error("Failed to fetch grammar details");

      const data = await res.json();
      setSearchResult(data.geminiData || null);
    } catch (err) {
      console.error(err);
      message.error("Error fetching grammar details.");
    }

    setLoading(false);
  };

  // ----------- Fetch Kanji Details -----------
  const fetchKanjiDetails = async (kanjiId) => {
    if (!kanjiId) return;

    setLoading(true);
    setKanjiDetails(null);

    try {
      const res = await fetch(`${BASE_URL}/kanji/${kanjiId}`);
      const data = await res.json();
      setKanjiDetails(data);
    } catch (err) {
      console.error("Error fetching kanji details:", err);
    }

    setLoading(false);
  };

  // ----------- Initial Fetch (Grammar + Kanji) -----------
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchGrammar(), fetchKanji()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        grammar,
        kanji,
        loading,
        searchResult,
        kanjiDetails,
        fetchGrammar,
        fetchKanji,
        searchGrammar,
        fetchKanjiDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
