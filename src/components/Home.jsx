import React from "react";
import { Typography, Button, Card } from "antd";
import { Link } from "react-router-dom";
import { GrammarList, GrammarSearch } from "./GrammarComponents";
import { BookOpen, Type } from "lucide-react";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Title level={3} className="!mb-0 !text-blue-700">
          Japanese N4 Learning
        </Title>
        <nav className="flex gap-4">
          <Link to="/">
            <Button type="link" className="!text-gray-600 hover:!text-blue-600">
              Home
            </Button>
          </Link>
          <Link to="/kanji">
            <Button type="link" className="!text-gray-600 hover:!text-blue-600">
              Kanji
            </Button>
          </Link>
          <Link to="/">
            <Button type="link" className="!text-gray-600 hover:!text-blue-600">
              Grammar
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-4 bg-gradient-to-r from-blue-100 via-pink-50 to-purple-100 border-b">
        <Title
          level={1}
          className="!text-4xl md:!text-5xl !font-bold !text-gray-800"
        >
          Master Japanese N4
        </Title>
        <Paragraph className="!text-lg !text-gray-600 max-w-2xl mx-auto mt-4">
          Build a strong foundation in{" "}
          <span className="font-semibold text-blue-700">grammar</span>,{" "}
          <span className="font-semibold text-pink-600">kanji</span>, and
          vocabulary with structured lessons, examples, and practice exercises.
        </Paragraph>
      </section>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Search Section */}
        <Card className="shadow-md rounded-2xl p-6">
          <Title level={4} className="!mb-4 !text-gray-800">
            Quick Grammar Lookup
          </Title>
          <GrammarSearch />
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/kanji">
            <Button
              size="large"
              className="!rounded-xl !px-6 !py-5 shadow-md flex items-center gap-2 bg-blue-600 text-white hover:!bg-blue-700"
            >
              <BookOpen size={18} />
              Explore Kanji
            </Button>
          </Link>

          <Link to="/">
            <Button
              size="large"
              className="!rounded-xl !px-6 !py-5 shadow-md flex items-center gap-2 border border-gray-300 text-gray-700 hover:!border-blue-600 hover:!text-blue-600"
            >
              <Type size={18} />
              Grammar Lessons
            </Button>
          </Link>
        </div>

        {/* Grammar List */}
        <Card className="shadow-md rounded-2xl p-6">
          <Title level={4} className="!mb-4 !text-gray-800">
            Latest Grammar Lessons
          </Title>
          <GrammarList />
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Japanese N4 Learning. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
