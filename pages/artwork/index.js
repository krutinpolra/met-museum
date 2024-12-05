/*********************************************************************************
* WEB422 – Assignment 4
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: KRUTIN BHARATBHAI POLRA Student ID: 135416220 Date: November 11th 2024
*
********************************************************************************/
// pages/artwork/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import { Row, Col, Card, Pagination } from 'react-bootstrap';
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12; // Items per page

export default function Artwork() {
  const router = useRouter();
  const [artworkList, setArtworkList] = useState(null); // Stores paginated data
  const [page, setPage] = useState(1); // Tracks the current page

  // Extract query string from URL
  const finalQuery = router.asPath.split('?')[1];

  // Fetch data using SWR with the query string
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  // Handles previous page navigation
  function previousPage() {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  }

  // Handles next page navigation
  function nextPage() {
    if (page < artworkList.length) setPage((prevPage) => prevPage + 1);
  }

  // Handle data when fetched
  useEffect(() => {
    if (data?.objectIDs) {
      // Filter out invalid objectIDs
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs.includes(x));
      
      // Calculate paginated results based on the filtered object IDs
      let results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
    }
  }, [data]);
  

  // Render error if the request fails
  if (error) return <Error statusCode={404} />;

  // Render loading state if data is not loaded
  if (!artworkList) return null;

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 && artworkList[page - 1]?.length > 0 ? (
          artworkList[page - 1].map((objectID) => (
            <Col lg={3} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <h4>Nothing Here</h4>
                <p>Try searching for something else.</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {artworkList.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} disabled={page === 1} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} disabled={page === artworkList.length} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
