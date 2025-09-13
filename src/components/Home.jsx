import React from "react";
import { Typography } from "antd";
import GrammarList from "./GrammarList";
import GrammarSearch from "./GrammarSearch";
import { Link } from 'react-router-dom';
import { Button } from "antd";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 py-10 px-4 flex flex-col items-center">
      <Title className="!text-blue-700 !mb-2 !text-center" level={2}>Japanese N4 Learning App</Title>
      <Paragraph className="!text-lg !text-gray-700 !mb-8 !max-w-xl !text-center">
        Welcome! Start your journey to mastering Japanese N4. Practice vocabulary, grammar, kanji, and more with interactive lessons and quizzes.
      </Paragraph>
      <div className="w-full max-w-2xl">
        <GrammarSearch />
        <Button type="primary">
          <Link to="/kanji">Go to Kanji Page</Link>
      </Button>
        <GrammarList />
      </div>
    </div>
  );
};

export default Home;
