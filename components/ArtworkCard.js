// components/ArtworkCard.js
import React from 'react';
import useSWR from 'swr';
import Error from 'next/error';
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';

// Fetcher function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const ArtworkCard = ({ objectID }) => {
  // SWR hook for data fetching
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
    fetcher
  );

  // Handle errors
  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  // Destructure with defaults
  const {
    primaryImageSmall,
    title = 'N/A',
    objectDate = 'N/A',
    medium = 'N/A',
  } = data;

  const classification = data.classification || 'N/A';

  return (
    <Card className="mb-3">
      <Card.Img
        variant="top"
        src={primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=Image+Not+Available'}
        alt={primaryImageSmall ? title : 'Image not available'}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate} <br />
          <strong>Classification:</strong> {classification} <br />
          <strong>Medium:</strong> {medium}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref legacyBehavior>
          <Button variant="primary">View {objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;
