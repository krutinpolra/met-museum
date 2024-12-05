import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Error from 'next/error';
import { Card, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData'; // Import new functions

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const ArtworkCardDetail = ({ objectID }) => {
  const { data, error } = useSWR(
    objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null,
    fetcher
  );

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  // Sync the showAdded state when favouritesList changes
  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  const favouritesClicked = async () => {
    try {
      if (showAdded) {
        // Remove from favourites
        const updatedList = await removeFromFavourites(objectID);
        setFavouritesList(updatedList);
      } else {
        // Add to favourites
        const updatedList = await addToFavourites(objectID);
        setFavouritesList(updatedList);
      }
    } catch (error) {
      console.error('Error updating favourites:', error.message);
    }
  };

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  const {
    primaryImage,
    title = 'N/A',
    objectDate = 'N/A',
    medium = 'N/A',
    artistDisplayName = 'N/A',
    artistWikidata_URL,
    creditLine = 'N/A',
    dimensions = 'N/A',
  } = data;

  const classification = data.classification || 'N/A';

  return (
    <Card className="mb-3">
      {primaryImage && <Card.Img variant="top" src={primaryImage} alt={title} />}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate} <br />
          <strong>Classification:</strong> {classification} <br />
          <strong>Medium:</strong> {medium}
          <br />
          <br />
          <strong>Artist:</strong> {artistDisplayName}
          {artistWikidata_URL && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
              &nbsp;(wiki)
            </a>
          )}
          <br />
          <strong>Credit Line:</strong> {creditLine} <br />
          <strong>Dimensions:</strong> {dimensions}
        </Card.Text>
        {/* Favourite Button */}
        <Button
          variant={showAdded ? 'primary' : 'outline-primary'}
          onClick={favouritesClicked}
        >
          {showAdded ? '+ Favourite (added)' : '+ Favourite'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCardDetail;
