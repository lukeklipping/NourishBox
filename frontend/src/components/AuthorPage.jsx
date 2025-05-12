import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);

  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/authors`);
      setAuthors(res.data);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authors.length) {
      fetchAuthors();
    }
  }, []);

  return (
    <div className="bg-white min-h-screen p-12">
      <h1 className="text-5xl font-extrabold text-center text-green-700 mb-12">
        Meet Our Authors
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {authors.map((author, index) => (
          <div
            key={index}
            className="bg-green-50 shadow-xl rounded-xl overflow-hidden text-center p-6"
          >
            <img
              src={author.imageUrl}
              alt={author.name}
              className="w-32 h-32 mx-auto object-cover rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold text-green-800">
              {author.name}
            </h2>
            <p className="text-base text-gray-600">{author.netId}</p>
            <p className="text-base text-gray-600">
              <strong>Class:</strong> {author.class}
            </p>
            <p className="text-base text-gray-600">
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorPage;
